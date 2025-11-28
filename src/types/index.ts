export interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

// Visa Application Types
export interface VisaApplicationData {
  serviceType: ServiceTypeData;
  personalInfo: PersonalInfoData;
  id?: string;
  status?: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ServiceTypeData {
  numberOfApplicants: number;
  visaType: 'tourist' | 'business' | 'transit' | 'diplomatic';
  visaDuration: 'single' | 'multiple-1month' | 'multiple-3months' | 'multiple-6months' | 'multiple-1year' | 'multiple-2years' | 'multiple-3years';
  purposeOfVisit: string;
  entryDate: Date | null;
  exitDate: Date | null;
  processingTime: 'normal' | 'urgent' | 'super-urgent' | 'express' | 'emergency' | 'weekend-holiday';
}

export interface PersonalInfoData {
  fullName: string;
  dateOfBirth: Date | null;
  nationality: string;
  passportNumber: string;
  passportIssueDate: Date | null;
  passportExpiryDate: Date | null;
  passportIssuingCountry: string;
  contactInfo: ContactInfoData;
  emergencyContact: EmergencyContactData;
  fileUploads: FileUploadsData;
  agreements: AgreementsData;
}

export interface ContactInfoData {
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  currentAddress: string;
  vietnamAddress: string;
}

export interface EmergencyContactData {
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  relationship: string;
}

export interface FileUploadsData {
  passportScan: File | null;
  portraitPhoto: File | null;
}

export interface AgreementsData {
  informationConfirmation: boolean;
  termsAndConditions: boolean;
}

// UI Component Props
export interface FormStepProps {
  data: VisaApplicationData;
  onUpdate: (data: Partial<VisaApplicationData>) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  errors?: Record<string, string>;
}

export interface FileUploadProps {
  label: string;
  accept: string;
  maxSize: number;
  onFileSelect: (file: File | null) => void;
  currentFile?: File | null;
  error?: string;
  required?: boolean;
}

export interface CountrySelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
}

export interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

// Country and Visa Option Types
export interface Country {
  code: string;
  name: string;
  flag: string;
}

export interface VisaOption {
  type: string;
  label: string;
  description: string;
  durations: VisaDurationOption[];
}

export interface VisaDurationOption {
  value: string;
  label: string;
  description: string;
  price: number;
}

export interface ProcessingTimeOption {
  value: string;
  label: string;
  description: string;
  additionalFee: number;
  businessDays: number;
}
