import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export const bookingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(7, 'Phone number must be at least 7 characters'),
  city: z.string().optional().default('Riyadh'),
  homeType: z.string().min(1, 'Home type is required'),
  service: z.string().min(1, 'Service is required'),
  date: z.date(),
  time: z.string().optional(),
  notes: z.string().optional(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string(),
  }).optional(),
});
