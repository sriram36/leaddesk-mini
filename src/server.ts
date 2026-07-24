import { createServerFn } from "@tanstack/react-start";
import { supabase } from "./lib/supabase";
import { leadSchema, type LeadFormData } from "./lib/schemas";

export const submitLeadFn = createServerFn({ method: "POST" })
  .validator((data: LeadFormData) => data)
  .handler(async ({ data: payload }) => {
    // Defensive error handling: validate input
    let validated: LeadFormData;
    try {
      validated = leadSchema.parse(payload);
    } catch (validationError) {
      throw new Error(
        `Validation failed: ${validationError instanceof Error ? validationError.message : "Invalid input"}`
      );
    }

    // Defensive error handling: check database connectivity with retry logic
    let retries = 3;
    let lastError: Error | null = null;

    while (retries > 0) {
      try {
        const { data, error } = await supabase.from("leads").insert([
          {
            name: validated.name,
            email: validated.email,
            budget: validated.budget,
            message: validated.message,
            status: "New",
            created_at: new Date().toISOString(),
          },
        ]);

        if (error) {
          throw new Error(error.message);
        }

        return { success: true, data };
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        retries--;
        if (retries > 0) {
          // Wait before retry with exponential backoff
          await new Promise((resolve) => setTimeout(resolve, Math.pow(2, 4 - retries) * 100));
        }
      }
    }

    throw new Error(
      `Failed to submit lead after retries: ${lastError?.message || "Database error"}`
    );
  }
);
