import { NextFunction, Request, Response } from "express";
import { z, ZodError, ZodRawShape } from "zod";

export function validate(schema: z.ZodObject<ZodRawShape>, where: keyof Request) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req[where]);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage = error.errors.map((issue: any) => issue.message)[0];
        res.status(400).json({ message: errorMessage });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  };
}
