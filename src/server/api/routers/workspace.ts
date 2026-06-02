import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { WorkspaceRole } from "@prisma/client";
import { deleteFromR2 } from "~/server/r2/upload";

export const workspaceRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        logoUrl: z.string().min(1),
        logoKey: z.string().optional(),
        slug: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.workspace.create({
        data: {
          name: input.name,
          logoUrl: input.logoUrl,
          logoKey: input.logoKey,
          slug: input.slug,
          createdById: ctx.session.user.id,
          members: {
            create: {
              userId: ctx.session.user.id,
              role: WorkspaceRole.OWNER,
            },
          },
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.workspace.update({
        where: { id: input.id },
        data: {
          name: input.name,
          updatedById: ctx.session.user.id,
        },
      });
    }),

  // src/server/api/routers/workspace.ts
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // 1. get workspace for logo deletion
      const workspace = await ctx.db.workspace.findUnique({
        where: { id: input.id },
      });

      // 2. get all project attachments under this workspace
      const attachments = await ctx.db.attachment.findMany({
        where: {
          project: { workspaceId: input.id },
        },
      });

      // 3. delete workspace logo from R2
      if (workspace?.logoKey) {
        await deleteFromR2(workspace.logoKey);
      }

      // 4. delete all project attachments from R2
      for (const attachment of attachments) {
        if (attachment.storageKey) {
          await deleteFromR2(attachment.storageKey);
        }
      }

      // 5. delete workspace from DB
      return ctx.db.workspace.delete({
        where: { id: input.id },
      });
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.workspace.findMany({
      where: {
        members: {
          some: { userId: ctx.session.user.id },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.workspace.findUnique({
        where: { id: input.id },
        include: { members: true },
      });
    }),

  getMembers: protectedProcedure
    .input(z.object({ workspaceId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.workspaceMember.findMany({
        where: { workspaceId: input.workspaceId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              email: true,
            },
          },
        },
      });
    }),
});
