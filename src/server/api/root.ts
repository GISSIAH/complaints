import { createTRPCRouter } from "~/server/api/trpc";
import { businessRouter } from "./routers/business";
import { imageRouter } from "./routers/images";
import { reviewRouter } from "./routers/review";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  review: reviewRouter,
  business: businessRouter,
  image: imageRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
