import { Response } from 'express';

export const successResponse = <T>(res: Response, data: T, message?: string, statusCode = 200) => {
  const response: any = {
    success: true,
    message,
  };
  if (data !== undefined && data !== null) {
    Object.assign(response, data as any);
  }
  return res.status(statusCode).json(response);
};

export const errorResponse = (res: Response, error: string, statusCode = 400, details?: unknown) => {
  const response: any = {
    success: false,
    error,
  };
  if (details !== undefined) {
    response.details = details;
  }
  return res.status(statusCode).json(response);
};