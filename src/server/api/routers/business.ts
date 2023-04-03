import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const businessRouter = createTRPCRouter({
    getAll: publicProcedure.query(({ctx})=>{
        return ctx.prisma.business.findMany();
    })
})
