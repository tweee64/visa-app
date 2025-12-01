import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const applicationRouter = createTRPCRouter({
  /**
   * Create a new draft application
   */
  createDraft: publicProcedure
    .input(z.object({
      numberOfApplicants: z.number().min(1).max(10).optional(),
      visaType: z.string().optional(),
      fullName: z.string().optional(),
      emailAddress: z.string().optional(),
      phoneNumber: z.string().optional(),
      nationality: z.string().optional(),
      passportNumber: z.string().optional(),
      processingTime: z.string().optional(),
      entryDate: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const application = await ctx.db.application.create({
          data: {
            status: "DRAFT",
            numberOfApplicants: input.numberOfApplicants ?? 1,
            visaType: input.visaType ?? "tourist",
            fullName: input.fullName ?? "",
            emailAddress: input.emailAddress ?? "",
            phoneNumber: input.phoneNumber ?? "",
            nationality: input.nationality ?? "",
            passportNumber: input.passportNumber ?? "",
            processingTime: input.processingTime ?? "",
            entryDate: input.entryDate ? new Date(input.entryDate) : null,
          },
        });

        return application;
      } catch (error) {
        console.error("Failed to create draft application:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create draft application",
        });
      }
    }),

  /**
   * Get application by ID
   */
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const application = await ctx.db.application.findUnique({
          where: { id: input.id },
        });

        if (!application) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Application not found",
          });
        }

        return application;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("Failed to get application:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to retrieve application",
        });
      }
    }),

  /**
   * Update application (for draft saves)
   */
  update: publicProcedure
    .input(z.object({
      id: z.string(),
      fullName: z.string().optional(),
      emailAddress: z.string().email().optional(),
      phoneNumber: z.string().optional(),
      nationality: z.string().optional(),
      passportNumber: z.string().optional(),
      visaType: z.enum(['tourist', 'business', 'transit', 'diplomatic']).optional(),
      processingTime: z.string().optional(),
      entryDate: z.string().optional(),
      passportScanUrl: z.string().optional(),
      portraitPhotoUrl: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, ...updateData } = input;
        
        const application = await ctx.db.application.update({
          where: { id },
          data: updateData,
        });

        return application;
      } catch (error) {
        console.error("Failed to update application:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update application",
        });
      }
    }),

  /**
   * Submit application (final submission)
   */
  submit: publicProcedure
    .input(z.object({
      id: z.string(),
      fullName: z.string().min(1),
      emailAddress: z.string().email(),
      phoneNumber: z.string().min(1),
      nationality: z.string().min(1),
      passportNumber: z.string().min(1),
      visaType: z.enum(['tourist', 'business', 'transit', 'diplomatic']),
      processingTime: z.string().min(1),
      entryDate: z.string().min(1),
      passportScanUrl: z.string().optional(),
      portraitPhotoUrl: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, ...updateData } = input;
        
        // Check if application exists and is in draft status
        const existingApp = await ctx.db.application.findUnique({
          where: { id },
        });

        if (!existingApp) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Application not found",
          });
        }

        if (existingApp.status !== 'DRAFT') {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Application has already been submitted",
          });
        }

        const application = await ctx.db.application.update({
          where: { id },
          data: {
            ...updateData,
            status: 'SUBMITTED',
            submittedAt: new Date(),
          },
        });

        return application;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("Failed to submit application:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to submit application",
        });
      }
    }),
});