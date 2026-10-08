import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodObject } from 'zod';
import { errorResponse } from '../utils/apiResponse';

export const validate = (schema: ZodObject<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return errorResponse(res, 'Validation failed', 400, (error as any).errors || (error as any).issues);
      }
      return errorResponse(res, 'Validation failed', 400);
    }
  };
};