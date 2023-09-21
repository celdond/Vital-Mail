import { Request } from "express";

export interface CheckRequest extends Request {
  usermail?: string;
  name?: string;
}

export interface newmailType {
  to: string;
  subject: string;
  content: string;
}

export interface fromType {
  name: string;
  email: string;
}

export interface mailType {
  to: fromType;
  from: fromType;
  subject: string;
  content: string;
  timestamp: string;
  seen: number;
  id?: string;
}

export interface changeAccountType {
  name?: string;
  email?: string;
  password?: string;
}

export interface returnType {
  content?: any;
  status: number;
};
