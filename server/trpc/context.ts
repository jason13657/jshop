import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { getAuth } from "../middleware/auth";

export async function createContext(opts: CreateExpressContextOptions) {
  const user = await getAuth(opts);

  return {
    user,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
