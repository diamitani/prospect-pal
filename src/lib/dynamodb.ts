/**
 * DynamoDB Client & Operations
 * Tables: ProspectPALProjects, ProspectPALSessions, ProspectPALArtifacts
 */
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const dynamo = DynamoDBDocumentClient.from(client);

const TABLES = {
  PROJECTS:  process.env.DYNAMODB_TABLE_PROJECTS  || "ProspectPALProjects",
  SESSIONS:  process.env.DYNAMODB_TABLE_SESSIONS  || "ProspectPALSessions",
  ARTIFACTS: process.env.DYNAMODB_TABLE_ARTIFACTS || "ProspectPALArtifacts",
};

// ===========================================================================
// PROJECT OPERATIONS
// ===========================================================================

export interface Project {
  id: string;
  userId: string;
  name: string;
  description?: string;
  icpConfig: Record<string, unknown>;
  toolStack: Record<string, unknown>;
  palOutput?: Record<string, unknown>;
  status: "draft" | "configured" | "deployed";
  createdAt: string;
  updatedAt: string;
}

export async function createProject(
  userId: string,
  name: string,
  description?: string
): Promise<Project> {
  const project: Project = {
    id: uuidv4(),
    userId,
    name,
    description,
    icpConfig: {},
    toolStack: {},
    status: "draft",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await dynamo.send(new PutCommand({
    TableName: TABLES.PROJECTS,
    Item: project,
  }));

  return project;
}

export async function getProjectsByUser(userId: string): Promise<Project[]> {
  const result = await dynamo.send(new QueryCommand({
    TableName: TABLES.PROJECTS,
    IndexName: "userId-index",
    KeyConditionExpression: "userId = :uid",
    ExpressionAttributeValues: { ":uid": userId },
    ScanIndexForward: false,
  }));
  return (result.Items as Project[]) || [];
}

export async function getProject(id: string): Promise<Project | null> {
  const result = await dynamo.send(new GetCommand({
    TableName: TABLES.PROJECTS,
    Key: { id },
  }));
  return (result.Item as Project) || null;
}

export async function updateProject(
  id: string,
  updates: Partial<Project>
): Promise<void> {
  const updateExpression = Object.keys(updates)
    .map((k, i) => `#k${i} = :v${i}`)
    .join(", ");
  const expressionNames: Record<string, string> = {};
  const expressionValues: Record<string, unknown> = {};

  Object.keys(updates).forEach((k, i) => {
    expressionNames[`#k${i}`] = k;
    expressionValues[`:v${i}`] = (updates as Record<string, unknown>)[k];
  });
  expressionValues[":updatedAt"] = new Date().toISOString();

  await dynamo.send(new UpdateCommand({
    TableName: TABLES.PROJECTS,
    Key: { id },
    UpdateExpression: `SET ${updateExpression}, updatedAt = :updatedAt`,
    ExpressionAttributeNames: expressionNames,
    ExpressionAttributeValues: expressionValues,
  }));
}

// ===========================================================================
// CHAT SESSION OPERATIONS
// ===========================================================================

export interface ChatMessage {
  id: string;
  projectId: string;
  sessionId: string;
  role: "user" | "assistant" | "system";
  content: string;
  palStage?: string;
  artifacts?: string[];
  createdAt: string;
}

export async function saveChatMessage(
  projectId: string,
  sessionId: string,
  role: "user" | "assistant",
  content: string,
  palStage?: string
): Promise<ChatMessage> {
  const msg: ChatMessage = {
    id: uuidv4(),
    projectId,
    sessionId,
    role,
    content,
    palStage,
    artifacts: [],
    createdAt: new Date().toISOString(),
  };

  await dynamo.send(new PutCommand({
    TableName: TABLES.SESSIONS,
    Item: msg,
  }));

  return msg;
}

export async function getChatHistory(
  projectId: string,
  sessionId: string
): Promise<ChatMessage[]> {
  const result = await dynamo.send(new QueryCommand({
    TableName: TABLES.SESSIONS,
    IndexName: "sessionId-index",
    KeyConditionExpression: "sessionId = :sid",
    FilterExpression: "projectId = :pid",
    ExpressionAttributeValues: {
      ":sid": sessionId,
      ":pid": projectId,
    },
    ScanIndexForward: true,
  }));
  return (result.Items as ChatMessage[]) || [];
}

// ===========================================================================
// ARTIFACT OPERATIONS
// ===========================================================================

export interface Artifact {
  id: string;
  projectId: string;
  type: "n8n_json" | "skill_md" | "deploy_guide" | "build_prompt" | "pal_config";
  name: string;
  s3Key?: string;
  content?: string; // Stored inline for small artifacts
  version: number;
  createdAt: string;
}

export async function saveArtifact(
  projectId: string,
  type: Artifact["type"],
  name: string,
  content: string,
  s3Key?: string
): Promise<Artifact> {
  const artifact: Artifact = {
    id: uuidv4(),
    projectId,
    type,
    name,
    content: content.length < 350000 ? content : undefined, // DynamoDB 400KB limit
    s3Key,
    version: 1,
    createdAt: new Date().toISOString(),
  };

  await dynamo.send(new PutCommand({
    TableName: TABLES.ARTIFACTS,
    Item: artifact,
  }));

  return artifact;
}

export async function getArtifactsByProject(projectId: string): Promise<Artifact[]> {
  const result = await dynamo.send(new QueryCommand({
    TableName: TABLES.ARTIFACTS,
    IndexName: "projectId-index",
    KeyConditionExpression: "projectId = :pid",
    ExpressionAttributeValues: { ":pid": projectId },
    ScanIndexForward: false,
  }));
  return (result.Items as Artifact[]) || [];
}

// end of dynamodb.ts
