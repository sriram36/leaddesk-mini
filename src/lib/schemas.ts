import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  budget: z.string().min(1, "Select a budget range"),
  message: z.string().min(1, "Message is required").min(10, "Message must be at least 10 characters"),
});

export type LeadFormData = z.infer<typeof leadSchema>;
