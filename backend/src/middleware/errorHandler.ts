import { NextFunction, Request, Response } from 'express';
import { errorResponse } from '../utils/apiResponse';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.stack);
  return errorResponse(res, 'Internal server error', 500, err.message);
};