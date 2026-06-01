import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { uploadToR2, deleteFromR2 } from "~/server/r2/upload";
import { TRPCError } from "@trpc/server";

export const attachmentsRouter = createTRPCRouter({
  upload: protectedProcedure
    .input(
      z.object({
        filename: z.string().min(1),
        fileData: z.string().min(1), // base64s
        mimeType: z.string().min(1),
        folder: z.string().default("attachments"),
        projectId: z.string().optional(),
        taskId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      
      // 1. upload to R2
      const { url, key, filename } = await uploadToR2({
        fileData: input.fileData,
        filename: input.filename,
        mimeType: input.mimeType,
        folder: input.folder,
      });

      // 2. save to attachment DB
      return ctx.db.attachment.create({
        data: {
          filename,
          url,
          storageKey: key,
          mimeType: input.mimeType,
          size: Buffer.from(input.fileData, "base64").length,
          uploadedById: ctx.session.user.id,
          projectId: input.projectId,
          taskId: input.taskId,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // 1. get attachment to find R2 key
      const attachment = await ctx.db.attachment.findUnique({
        where: { id: input.id },
      });

      if (!attachment) throw new TRPCError({ code: "NOT_FOUND" });

      // 2. delete from R2 using key
      if (attachment.storageKey) {
        await deleteFromR2(attachment.storageKey);
      }

      // 3. delete from DB
      return ctx.db.attachment.delete({
        where: { id: input.id },
      });
    }),
});
