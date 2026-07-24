import { createServerFn } from "@tanstack/react-start/server";
import { z } from "zod";
import { supabase } from "./lib/supabase";

const submitLeadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  budget: z.string().min(1, "Budget is required"),
  message: z.string().min(1, "Message is required"),
});

export const submitLeadFn = createServerFn("POST", async (payload) => {
  // Validate the payload
  const validated = submitLeadSchema.parse(payload);

  // Insert into Supabase
  const { data, error } = await supabase.from("leads").insert([
    {
      name: validated.name,
      email: validated.email,
      budget: validated.budget,
      message: validated.message,
      status: "New",
    },
  ]);

  if (error) {
    throw new Error(`Failed to submit lead: ${error.message}`);
  }

  return { success: true, data };
});
