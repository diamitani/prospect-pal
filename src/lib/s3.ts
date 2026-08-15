/**
 * S3 Client & Operations
 * Stores large artifacts (n8n JSON, skill files, deploy guides)
 */
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

const s3Client = new S3Client({
  region: process.env.S3_BUCKET_REGION || process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.S3_BUCKET_NAME || "prospect-pal-artifacts";

export async function uploadArtifact(
  projectId: string,
  artifactType: string,
  filename: string,
  content: string,
  contentType = "application/json"
): Promise<string> {
  const key = `projects/${projectId}/${artifactType}/${filename}`;

  await s3Client.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: content,
    ContentType: contentType,
    Metadata: {
      projectId,
      artifactType,
      uploadedAt: new Date().toISOString(),
    },
  }));

  return key;
}

export async function getArtifactUrl(key: string, expiresIn = 3600): Promise<string> {
  const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  return getSignedUrl(s3Client, command, { expiresIn });
}

export async function getArtifactContent(key: string): Promise<string> {
  const response = await s3Client.send(new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  }));
  const chunks: Uint8Array[] = [];
  if (!response.Body) return "";
  for await (const chunk of response.Body as AsyncIterable<Uint8Array>) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf-8");
}

export async function listProjectArtifacts(projectId: string): Promise<string[]> {
  const result = await s3Client.send(new ListObjectsV2Command({
    Bucket: BUCKET,
    Prefix: `projects/${projectId}/`,
  }));
  return (result.Contents || []).map((obj) => obj.Key!);
}
