import { z } from 'zod';

// Base validation schemas
export const serviceTypeSchema = z.object({
  numberOfApplicants: z.number().min(1, 'At least 1 applicant required').max(10, 'Maximum 10 applicants allowed'),
  visaType: z.enum(['tourist', 'business', 'transit', 'diplomatic'], {
    required_error: 'Please select a visa type',
  }),
  visaDuration: z.enum([
    'single',
    'multiple-1month',
    'multiple-3months', 
    'multiple-6months',
    'multiple-1year',
    'multiple-2years',
    'multiple-3years'
  ], {
    required_error: 'Please select visa duration',
  }),
  purposeOfVisit: z.string().min(1, 'Purpose of visit is required').max(500, 'Purpose too long'),
  entryDate: z.date({
    required_error: 'Entry date is required',
  }).refine((date) => date > new Date(), {
    message: 'Entry date must be in the future',
  }),
  exitDate: z.date({
    required_error: 'Exit date is required',
  }),
  processingTime: z.enum([
    'normal',
    'urgent', 
    'super-urgent',
    'express',
    'emergency',
    'weekend-holiday'
  ], {
    required_error: 'Please select processing time',
  }),
}).refine((data) => data.exitDate > data.entryDate, {
  message: 'Exit date must be after entry date',
  path: ['exitDate'],
});

export const contactInfoSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(100, 'Name too long'),
  phoneNumber: z.string()
    .min(1, 'Phone number is required')
    .regex(/^[+]?[(]?[\d\s\-\(\)]{10,20}$/, 'Invalid phone number format'),
  emailAddress: z.string()
    .min(1, 'Email address is required')
    .email('Invalid email format'),
  currentAddress: z.string().min(1, 'Current address is required').max(500, 'Address too long'),
  vietnamAddress: z.string().min(1, 'Vietnam address is required').max(500, 'Address too long'),
});

export const emergencyContactSchema = z.object({
  fullName: z.string().min(1, 'Emergency contact name is required').max(100, 'Name too long'),
  phoneNumber: z.string()
    .min(1, 'Emergency contact phone is required')
    .regex(/^[+]?[(]?[\d\s\-\(\)]{10,20}$/, 'Invalid phone number format'),
  emailAddress: z.string()
    .min(1, 'Emergency contact email is required')
    .email('Invalid email format'),
  relationship: z.string().min(1, 'Relationship is required').max(50, 'Relationship too long'),
});

export const agreementsSchema = z.object({
  informationConfirmation: z.boolean().refine((val) => val === true, {
    message: 'You must confirm the accuracy of information',
  }),
  termsAndConditions: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
});

export const personalInfoSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(100, 'Name too long'),
  dateOfBirth: z.date({
    required_error: 'Date of birth is required',
  }).refine((date) => {
    const age = new Date().getFullYear() - date.getFullYear();
    return age >= 18;
  }, {
    message: 'Applicant must be at least 18 years old',
  }),
  nationality: z.string().min(1, 'Nationality is required'),
  passportNumber: z.string()
    .min(1, 'Passport number is required')
    .max(20, 'Passport number too long')
    .regex(/^[A-Z0-9]+$/, 'Passport number must contain only letters and numbers'),
  passportIssueDate: z.date({
    required_error: 'Passport issue date is required',
  }),
  passportExpiryDate: z.date({
    required_error: 'Passport expiry date is required',
  }),
  passportIssuingCountry: z.string().min(1, 'Passport issuing country is required'),
  contactInfo: contactInfoSchema,
  emergencyContact: emergencyContactSchema,
  agreements: agreementsSchema,
}).refine((data) => data.passportExpiryDate > data.passportIssueDate, {
  message: 'Passport expiry date must be after issue date',
  path: ['passportExpiryDate'],
}).refine((data) => {
  // Passport must be valid for at least 6 months from entry date
  const sixMonthsFromNow = new Date();
  sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
  return data.passportExpiryDate > sixMonthsFromNow;
}, {
  message: 'Passport must be valid for at least 6 months',
  path: ['passportExpiryDate'],
});

// Complete application validation schema
export const visaApplicationSchema = z.object({
  serviceType: serviceTypeSchema,
  personalInfo: personalInfoSchema,
}).refine((data) => {
  // Additional cross-field validation: passport must be valid for 6 months from entry date
  if (data.serviceType.entryDate && data.personalInfo.passportExpiryDate) {
    const entryDate = new Date(data.serviceType.entryDate);
    const sixMonthsFromEntry = new Date(entryDate);
    sixMonthsFromEntry.setMonth(sixMonthsFromEntry.getMonth() + 6);
    return data.personalInfo.passportExpiryDate > sixMonthsFromEntry;
  }
  return true;
}, {
  message: 'Passport must be valid for at least 6 months from entry date',
  path: ['personalInfo', 'passportExpiryDate'],
});

// Base schemas for partial validation (without refine)
const baseServiceTypeSchema = z.object({
  numberOfApplicants: z.number().min(1, 'At least 1 applicant required').max(10, 'Maximum 10 applicants allowed'),
  visaType: z.enum(['tourist', 'business', 'transit', 'diplomatic'], {
    required_error: 'Please select a visa type',
  }),
  visaDuration: z.enum([
    'single',
    'multiple-1month',
    'multiple-3months', 
    'multiple-6months',
    'multiple-1year',
    'multiple-2years',
    'multiple-3years'
  ], {
    required_error: 'Please select visa duration',
  }),
  purposeOfVisit: z.string().min(1, 'Purpose of visit is required').max(500, 'Purpose too long'),
  entryDate: z.date({
    required_error: 'Entry date is required',
  }).refine((date) => date > new Date(), {
    message: 'Entry date must be in the future',
  }),
  exitDate: z.date({
    required_error: 'Exit date is required',
  }),
  processingTime: z.enum([
    'normal',
    'urgent', 
    'super-urgent',
    'express',
    'emergency',
    'weekend-holiday'
  ], {
    required_error: 'Please select processing time',
  }),
});

const basePersonalInfoSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(100, 'Name too long'),
  dateOfBirth: z.date({
    required_error: 'Date of birth is required',
  }).refine((date) => {
    const age = new Date().getFullYear() - date.getFullYear();
    return age >= 18;
  }, {
    message: 'Applicant must be at least 18 years old',
  }),
  nationality: z.string().min(1, 'Nationality is required'),
  passportNumber: z.string()
    .min(1, 'Passport number is required')
    .max(20, 'Passport number too long')
    .regex(/^[A-Z0-9]+$/, 'Passport number must contain only letters and numbers'),
  passportIssueDate: z.date({
    required_error: 'Passport issue date is required',
  }),
  passportExpiryDate: z.date({
    required_error: 'Passport expiry date is required',
  }),
  passportIssuingCountry: z.string().min(1, 'Passport issuing country is required'),
  contactInfo: contactInfoSchema,
  emergencyContact: emergencyContactSchema,
  agreements: agreementsSchema,
});

// Draft application schema (all fields optional for saving drafts)
export const draftApplicationSchema = z.object({
  serviceType: baseServiceTypeSchema.partial(),
  personalInfo: basePersonalInfoSchema.partial(),
});

// File validation schemas
export const fileValidationSchema = z.object({
  size: z.number().max(5 * 1024 * 1024, 'File size must be less than 5MB'),
  type: z.string().refine((type) => {
    return ['image/jpeg', 'image/jpg', 'image/png'].includes(type);
  }, {
    message: 'Only JPG, JPEG, and PNG files are allowed',
  }),
});

// tRPC input schemas for API procedures
export const createApplicationInputSchema = z.object({
  serviceType: baseServiceTypeSchema.partial(),
  personalInfo: basePersonalInfoSchema.partial(),
});

export const updateApplicationInputSchema = z.object({
  id: z.string().uuid(),
  serviceType: baseServiceTypeSchema.partial().optional(),
  personalInfo: basePersonalInfoSchema.partial().optional(),
});

export const submitApplicationInputSchema = z.object({
  id: z.string().uuid(),
  serviceType: serviceTypeSchema,
  personalInfo: personalInfoSchema,
});

export const getApplicationInputSchema = z.object({
  id: z.string().uuid(),
});

// Export types inferred from schemas
export type ServiceTypeInput = z.infer<typeof serviceTypeSchema>;
export type PersonalInfoInput = z.infer<typeof personalInfoSchema>;
export type VisaApplicationInput = z.infer<typeof visaApplicationSchema>;
export type DraftApplicationInput = z.infer<typeof draftApplicationSchema>;
export type FileValidationInput = z.infer<typeof fileValidationSchema>;
export type CreateApplicationInput = z.infer<typeof createApplicationInputSchema>;
export type UpdateApplicationInput = z.infer<typeof updateApplicationInputSchema>;
export type SubmitApplicationInput = z.infer<typeof submitApplicationInputSchema>;
export type GetApplicationInput = z.infer<typeof getApplicationInputSchema>;