import { S3Client } from '@aws-sdk/client-s3';

// AWS S3 Bucket Setup Instructions:
// Bucket policy required (Block all public access: ON):
// - CORS configuration:
//   [
//     {
//       "AllowedHeaders": ["*"],
//       "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
//       "AllowedOrigins": ["http://localhost:5173", "https://your-production-domain.com"],
//       "ExposeHeaders": ["ETag"]
//     }
//   ]
// - IAM user permissions required:
//   s3:PutObject, s3:GetObject, s3:DeleteObject, s3:HeadObject, s3:ListBucket

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_BUCKET_NAME) {
  console.warn('WARNING: AWS S3 credentials not configured. File uploads will fail.');
}

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  requestTimeout: 30000 // 30-second timeout
});

export const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
export default s3Client;
