import { router, publicProcedure } from "../trpc/trpc";
import { z } from "zod";

export const userRouter = router({
  login: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      })
    )
    .query((opts) => {
      return {
        token: "token",
        username: "username",
      };
    }),
});
