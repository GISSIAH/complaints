import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const reviewRouter = createTRPCRouter({
  createOne: publicProcedure
    .input(
      z.object({
        title: z.string(),
        details: z.string(),
        businessNme: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const business = await ctx.prisma.business.findFirst({
        where: {
          name: input.businessNme,
        },
      });

      if (business != null) {
        const r = {
          title: input.title,
          details: input.details,
          businessId: business.id,
        };
        return ctx.prisma.review.create({ data: r });
      } else {
        const newBusiness = await ctx.prisma.business.create({
          data: {
            name: input.businessNme,
            location: "Malawi",
          },
        });

        const r = {
          title: input.title,
          details: input.details,
          businessId: newBusiness.id,
        };
        return ctx.prisma.review.create({ data: r });
      }
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.review.findMany({ include: { images: true } });
  }),
  getRecent: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      take: 15,
      include: { business: true ,images: true},
    });
  }),
  searchByBusiness : publicProcedure.input(z.object({
    businessName: z.string()
  })).query(({ input,ctx }) => {
    return ctx.prisma.business.findFirst({where:{name:input.businessName},include:{reviews:true}})
  })
});
