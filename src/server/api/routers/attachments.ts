import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { uploadToR2 } from "~/server/r2/upload";

export const attachmentsRouter = createTRPCRouter({
  upload: protectedProcedure
    .input(
      z.object({
        filename: z.string().min(1),
        fileData: z.string().min(1), // base64
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

      // 2. save to DB
      return ctx.db.attachment.create({
        data: {
          filename,
          url,
          mimeType: input.mimeType,
          size: Buffer.from(input.fileData, "base64").length,
          uploadedById: ctx.session.user.id,
          projectId: input.projectId,
          taskId: input.taskId,
        },
      });
    }),
});