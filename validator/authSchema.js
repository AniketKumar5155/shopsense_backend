const { z } = require("zod");

const signupSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(1, { message: "Name is required" })
    .max(150, { message: "Name must not be greater than 150 characters" }),

  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email format" }),

  username: z
    .string({ required_error: "Username is required" })
    .min(3, { message: "Username must be at least 3 characters" })
    .max(50, { message: "Username must not exceed 50 characters" }),

  phone: z
    .string({ required_error: "Phone number is required" })
    .length(10, { message: "Phone number must be exactly 10 digits" })
    .regex(/^\d{10}$/, { message: "Phone number must contain only numbers" }),

  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/, { message: "Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 symbol" }),

  otp: z
    .string({ required_error: "OTP is required" })
    .length(6, { message: "OTP must be exactly 6 digits" })
    .regex(/^\d{6}$/, { message: "OTP must contain only numbers" }),
});

const loginSchema = z.object({
    identifier: z
        .string()
        .min(3, { error: "Username/Email must atleast be 3 characters" }),


    password: z
        .string({ error: "Password is required" })
        .min(8, { error: "Password must be at least 8 characters long" }),
});

module.exports = {
  signupSchema,
  loginSchema,
};