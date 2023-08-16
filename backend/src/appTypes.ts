import { Request } from "express";

export interface CheckRequest extends Request {
    usermail?: string;
}
