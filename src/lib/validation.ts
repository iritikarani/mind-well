import { z } from "zod";

const usernamePattern = /^[a-zA-Z0-9_]{3,20}$/;

export const signupSchema = z
  .object({
    email: z.string().trim().toLowerCase().email("Enter a valid email"),
    name: z.string().trim().min(1, "Name is required").max(80),
    username: z
      .string()
      .trim()
      .regex(usernamePattern, "Username must be 3-20 letters, numbers, or underscores"),
    password: z.string().min(8, "At least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const signupVerifySchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  code: z.string().trim().regex(/^\d{6}$/, "Enter the 6-digit code"),
});

export const loginSchema = z.object({
  identifier: z.string().trim().min(1, "Enter your username or email"),
  password: z.string().min(1, "Enter your password"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
});

export const journalSaveSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  slot: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  text: z.string().max(500),
});

export const colorTheoryPlaySchema = z
  .object({
    color: z.enum([
      "red",
      "orange",
      "yellow",
      "green",
      "blue",
      "purple",
      "pink",
      "brown",
      "black",
      "white",
    ]),
    questions: z.array(z.string()).min(1),
    answers: z.array(z.string()),
  })
  .refine((data) => data.answers.length === data.questions.length, {
    message: "Answers must match the number of questions",
    path: ["answers"],
  });

export const worldPuzzlePlaySchema = z.object({
  monumentId: z.string().min(1),
});

export const findTheWordQuestionSchema = z.object({
  word: z.string().min(1),
});

export const findTheWordPlaySchema = z.object({
  wordsFound: z
    .array(
      z.object({
        word: z.string().min(1),
        variantIndex: z.number().int().min(0),
        outcome: z.enum(["yes", "no", "answered", "skipped"]),
      }),
    )
    .length(3),
});

export const anagramsPlaySchema = z.object({
  totalTimeMs: z.number().int().min(0),
  usedUncommonWord: z.boolean(),
  sources: z
    .object({
      level1: z.string(),
      level2: z.string(),
      level3: z.string(),
    })
    .optional(),
});

export const spinAndConnectPlaySchema = z.object({
  rounds: z
    .array(
      z.object({
        letter: z.string().length(1),
        category: z.string().min(1),
        tier: z.enum(["rare", "medium", "common"]),
        correctCount: z.number().int().min(0),
        hintsUsed: z.number().int().min(0),
      }),
    )
    .min(5),
});

export const resetPasswordSchema = z
  .object({
    resetToken: z.string().trim().min(1),
    password: z.string().min(8, "At least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
