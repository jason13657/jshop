import { TRPCError, initTRPC } from "@trpc/server";
import { Context } from "./context";
import { userRouter } from "../router/user";

export const t = initTRPC.context<Context>().create();

export const router = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(function isAuthed(opts) {
  if (!opts.ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }
  return opts.next({
    ctx: {
      uesr: opts.ctx.user,
    },
  });
});

export const appRouter = router({
  user: userRouter, // put procedures under "user" namespace
});

export type AppRouter = typeof appRouter;
