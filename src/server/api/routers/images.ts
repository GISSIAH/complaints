import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const imageRouter = createTRPCRouter({
    addOne: publicProcedure.input(z.object({
        name: z.string(),
        url: z.string(),
        reviewId: z.string(),
    })).mutation(({input, ctx})=>{ 
        return ctx.prisma.image.create({data:input})
    })
})
