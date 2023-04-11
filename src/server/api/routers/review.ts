import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const reviewRouter = createTRPCRouter({
  createOne: publicProcedure
    .input(
      z.object({
        title: z.string(),
        details: z.string(),
        businessNme: z.string(),
        voteCount: z.number(),
        userId: z.string(),
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
          voteCount: input.voteCount,
          userId: input.userId,
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
          voteCount: input.voteCount,
          userId: input.userId,
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
      include: { business: true, images: true },
    });
  }),
  searchByBusiness: publicProcedure
    .input(
      z.object({
        businessName: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const business = await ctx.prisma.business.findFirst({
        where: { name: input.businessName },
        include: { reviews: { include: { images: true } } },
      });
      let totalVotes = 0;
      business?.reviews.forEach((r) => {
        totalVotes += r.voteCount;
      });

      if (business?.reviews) {
        const ratedBusines = {
          ...business,
          rating: totalVotes / business?.reviews.length,
        };
        return ratedBusines;
      } else {
        const ratedBusines = {
          ...business,
          rating: 0,
        };
        return ratedBusines;
      }
    }),

  getUserReviews: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.review.findMany({
        where: {
          userId: input.userId,
        },
        include: {
          images: true,
          business: true,
        },
      });
    }),
});
