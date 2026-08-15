export type ModeType = "general" | "copywriting" | "analysis" | "creative";

export interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string;
  base64Data?: string;
  mimeType?: string;
}

export interface ChatMessageData {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date | string;
  mode?: ModeType;
  attachments?: Attachment[];
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessageData[];
}

