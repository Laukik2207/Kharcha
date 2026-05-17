export const uploadToS3 = async (filePath, fileName) => {
  // TODO: Implement AWS S3 upload logic
  console.log('Uploading file to S3...');
  return `https://s3.amazonaws.com/${process.env.AWS_BUCKET_NAME}/${fileName}`;
};
