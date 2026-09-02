import { z } from "zod";

export const registerCustomerSchema = z.object({
  name: z.string().trim().min(2, "Name must contain at least 2 letters"),
  phone: z.string().trim().regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
  email: z.string().trim().email("Please enter a valid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  address: z.string().trim().min(3, "Address is required"),
  pincode: z.string().trim().regex(/^\d{6}$/, "Pincode must be exactly 6 digits"),
});

export const loginCustomerSchema = z
  .object({
    phone: z.string().trim().optional(),
    email: z.string().trim().optional(),
    password: z.string().min(1, "Password is required"),
  })
  .refine((data) => Boolean(data.phone || data.email), {
    message: "Phone number or email is required",
    path: ["phone"],
  });

export const sendOtpSchema = z
  .object({
    contact: z.string().trim().optional(),
    phone: z.string().trim().optional(),
    email: z.string().trim().optional(),
    type: z.enum(["sms", "email"]).optional().default("sms"),
  })
  .refine((data) => Boolean(data.contact || data.phone || data.email), {
    message: "Contact, phone, or email is required",
  });

export const verifyOtpSchema = z
  .object({
    contact: z.string().trim().optional(),
    phone: z.string().trim().optional(),
    email: z.string().trim().optional(),
    otp: z.string().trim().min(4, "A valid numeric OTP is required"),
  })
  .refine((data) => Boolean(data.contact || data.phone || data.email), {
    message: "Contact, phone, or email is required",
  });

export const vendorRegisterSchema = z.object({
  storeName: z.string().trim().min(2, "Store name is required"),
  category: z.string().trim().min(2, "Business category is required"),
  address: z.string().trim().min(3, "Store address is required"),
  city: z.string().trim().min(2, "City is required"),
  pincode: z.string().trim().regex(/^\d{6}$/, "A valid 6-digit pincode is required"),
  ownerName: z.string().trim().min(2, "Owner full name is required"),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "A valid 10-digit Indian mobile number is required"),
  email: z.string().trim().email("Invalid email").optional().or(z.literal("")),
  gstNumber: z.string().trim().optional().default(""),
  panNumber: z.string().trim().optional().default(""),
});

export const riderRegisterSchema = z.object({
  name: z.string().trim().min(2, "Full name is required"),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "A valid 10-digit Indian mobile number is required"),
  city: z.string().trim().min(2, "City/location is required"),
  vehicle: z.string().trim().optional().default("Motorbike / Scooter"),
});

export const productValidationSchema = z.object({
  name: z.string().trim().min(2, "Product name is required"),
  categoryKey: z.string().trim().min(1, "Category key is required"),
  categoryName: z.string().trim().min(1, "Category name is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  mrp: z.coerce.number().min(0, "MRP must be a positive number"),
  rating: z.coerce.number().min(0).max(5).optional(),
  store: z.string().trim().optional(),
  tags: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
  img: z.string().optional(),
  image: z.string().optional(),
  unit: z.string().optional(),
  inStock: z.boolean().optional(),
  countInStock: z.coerce.number().optional(),
  description: z.string().optional(),
});
