import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import s3Client, { BUCKET_NAME } from '../config/cloudStorage.js';

export const uploadFileToS3 = async (fileBuffer, originalFileName, userId, mimeType) => {
  try {
    const s3Key = `statements/${userId}/${Date.now()}_${originalFileName.replace(/\\s+/g, '_')}`;
    
    const params = {
      Bucket: BUCKET_NAME,
      Key: s3Key,
      Body: fileBuffer,
      ContentType: mimeType || 'text/csv',
      Metadata: {
        userId: userId.toString(),
        originalFileName,
        uploadedAt: new Date().toISOString(),
      },
    };

    await s3Client.send(new PutObjectCommand(params));
    
    return {
      key: s3Key,
      bucket: BUCKET_NAME,
      location: `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`
    };
  } catch (err) {
    throw new Error(`S3 upload failed: ${err.message}`);
  }
};

export const getSignedDownloadUrl = async (s3Key, expiresInSeconds = 3600) => {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
    });
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
    return signedUrl;
  } catch (err) {
    throw new Error('Failed to generate download URL');
  }
};

export const deleteFileFromS3 = async (s3Key) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
    });
    await s3Client.send(command);
  } catch (err) {
    if (err.name === 'NoSuchKey') {
      console.warn(`File not found in S3 (NoSuchKey), skipping delete for key: ${s3Key}`);
      return;
    }
    throw new Error(`S3 delete failed: ${err.message}`);
  }
};

export const getFileMetadata = async (s3Key) => {
  try {
    const command = new HeadObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
    });
    const response = await s3Client.send(command);
    return {
      contentType: response.ContentType,
      contentLength: response.ContentLength,
      lastModified: response.LastModified,
      metadata: response.Metadata,
    };
  } catch (err) {
    if (err.name === 'NotFound') {
      throw new Error('File not found in S3');
    }
    throw err;
  }
};

export const generateUploadPresignedUrl = async (userId, fileName, mimeType) => {
  try {
    const s3Key = `statements/${userId}/${Date.now()}_${fileName.replace(/\\s+/g, '_')}`;
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
      ContentType: mimeType || 'text/csv',
    });
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
    return { uploadUrl, key: s3Key };
  } catch (err) {
    throw new Error(`Failed to generate upload URL: ${err.message}`);
  }
};

export const listUserFiles = async (userId) => {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: `statements/${userId}/`,
    });
    const response = await s3Client.send(command);
    
    if (!response.Contents) return [];
    
    return response.Contents.map(item => ({
      key: item.Key,
      size: item.Size,
      lastModified: item.LastModified,
    }));
  } catch (err) {
    throw new Error(`Failed to list files: ${err.message}`);
  }
};
