const { z } = require("zod");

const createProductSchema = z.object({
  name: z
    .string({ required_error: "Product name is required" })
    .min(1, { message: "Product name is required" })
    .max(255, { message: "Product name must not exceed 255 characters" }),

  description: z
    .string()
    .max(5000, { message: "Description is too long" })
    .optional(),

  price: z
    .number({ required_error: "Price is required" })
    .positive({ message: "Price must be greater than 0" }),

  discounted_price: z
    .number()
    .positive({ message: "Discounted price must be greater than 0" })
    .optional()
    .refine((data) => {
      if (
        data.discounted_price &&
        data.price &&
        data.discounted_price > data.price
      ) {
        return false;
      }
      return true;
    }, {
      message: "Discounted price cannot be greater than original price",
      path: ["discounted_price"],
    }),

  brand: z
    .string()
    .max(100, { message: "Brand name too long" })
    .optional(),

  weight: z
    .number()
    .positive({ message: "Weight must be positive" })
    .optional(),

  stock: z
    .number()
    .int({ message: "Stock must be an integer" })
    .min(0, { message: "Stock cannot be negative" })
    .optional(),

  image_url: z
    .string()
    .url({ message: "Invalid image URL" })
    .max(500, { message: "Image URL too long" })
    .optional(),

  categories: z
    .array(
      z.coerce.number().int().positive("Invalid issue id")
    )
    .min(1, "Please select at least one issue"),
});

const updateProductSchema = z.object({
  name: z
    .string({ required_error: "Product name is required" })
    .min(1, { message: "Product name is required" })
    .max(255, { message: "Product name must not exceed 255 characters" })
    .optional(),


  description: z
    .string()
    .max(5000, { message: "Description is too long" })
    .optional(),


  price: z
    .number({ required_error: "Price is required" })
    .positive({ message: "Price must be greater than 0" })
    .optional(),


  discounted_price: z
    .number()
    .positive({ message: "Discounted price must be greater than 0" })
    .optional()
    .refine((data) => {
      if (
        data.discounted_price &&
        data.price &&
        data.discounted_price > data.price
      ) {
        return false;
      }
      return true;
    }, {
      message: "Discounted price cannot be greater than original price",
      path: ["discounted_price"],
    }),

  brand: z
    .string()
    .max(100, { message: "Brand name too long" })
    .optional(),

  weight: z
    .number()
    .positive({ message: "Weight must be positive" })
    .optional(),

  stock: z
    .number()
    .int({ message: "Stock must be an integer" })
    .min(0, { message: "Stock cannot be negative" })
    .optional(),

  image_url: z
    .string()
    .url({ message: "Invalid image URL" })
    .max(500, { message: "Image URL too long" })
    .optional(),

  categories: z
    .array(
      z.coerce.number().int().positive("Invalid issue id")
    )
    .min(1, "Please select at least one issue"),

  is_active: z
    .boolean()
    .optional(),

  is_hidden: z
    .boolean()
    .optional(),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
}