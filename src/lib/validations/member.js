import { z } from "zod";

export const createMemberSchema = z.object({
  name: z.string().min(2, "At least 2 characters").max(80),
});
