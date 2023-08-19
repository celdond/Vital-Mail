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
    usermail: string;
}
