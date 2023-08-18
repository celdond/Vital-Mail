import { Request } from "express";

export interface CheckRequest extends Request {
    usermail?: string;
}

export interface newmailType {
    to: string;
    subject: string;
    content: string;
}
