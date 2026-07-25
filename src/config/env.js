import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.coerce
    .number()
    .int()
    .positive()
    .default(3000),

  MONGODB_URI: z
    .string()
    .min(1, "MONGODB_URI is required"),

  SESSION_SECRET: z
    .string()
    .min(
      32,
      "SESSION_SECRET must contain at least 32 characters"
    )
});

const parsedEnvironment =
  envSchema.safeParse(process.env);

if (!parsedEnvironment.success) {
  console.error("Invalid environment variables:");

  parsedEnvironment.error.issues.forEach((issue) => {
    console.error(
      `- ${issue.path.join(".")}: ${issue.message}`
    );
  });

  process.exit(1);
}

export const env = parsedEnvironment.data;