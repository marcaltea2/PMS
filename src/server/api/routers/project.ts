import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { ProjectStatus, ProjectRole, Priority } from "@prisma/client";
import { deleteFromR2 } from "~/server/r2/upload";

export const projectRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        name: z.string().min(1),
        slug: z.string().min(1),
        description: z.string().optional(),
        status: z.nativeEnum(ProjectStatus).default(ProjectStatus.ACTIVE),
        priority: z.nativeEnum(Priority).default(Priority.MEDIUM),
        dueDate: z.date().optional(),
        coverColor: z.string().optional(),
        members: z.array(z.string()).default([]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.project.create({
        data: {
          workspaceId: input.workspaceId,
          name: input.name,
          slug: input.slug,
          description: input.description,
          status: input.status,
          priority: input.priority,
          dueDate: input.dueDate,
          coverColor: input.coverColor,
          createdById: ctx.session.user.id,

          members: {
            create: [
              {
                userId: ctx.session.user.id,
                role: ProjectRole.OWNER,
              },

              ...input.members
                .filter((id) => id !== ctx.session.user.id) // avoid duplicate owner
                .map((userId) => ({
                  userId,
                  role: ProjectRole.MEMBER,
                  invitedById: ctx.session.user.id,
                })),
            ],
          },
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
        slug: z.string().min(1),
        description: z.string().optional(),
        status: z.nativeEnum(ProjectStatus).default(ProjectStatus.ACTIVE),
        priority: z.nativeEnum(Priority).default(Priority.MEDIUM),
        dueDate: z.date().optional(),
        coverColor: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.project.update({
        where: { id: input.id },
        data: {
          name: input.name,
          slug: input.slug,
          description: input.description,
          status: input.status,
          priority: input.priority,
          dueDate: input.dueDate,
          coverColor: input.coverColor,
          updatedById: ctx.session.user.id,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // 1. get all attachments for this project
      const attachments = await ctx.db.attachment.findMany({
        where: { projectId: input.id },
      });

      // 2. delete each from R2
      for (const attachment of attachments) {
        if (attachment.storageKey) {
          await deleteFromR2(attachment.storageKey);
        }
      }

      // 3. delete project (DB cascades members, tasks, comments)
      return ctx.db.project.delete({
        where: { id: input.id },
      });
    }),
    
  getAll: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.project.findMany({
        where: {
          workspaceId: input.workspaceId,
          members: {
            some: { userId: ctx.session.user.id },
          },
        },
        include: {
          members: {
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
          },
          attachments: {
            include: {
              uploadedBy: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.project.findUnique({
        where: { id: input.id },
        include: { members: true },
      });
    }),
});
