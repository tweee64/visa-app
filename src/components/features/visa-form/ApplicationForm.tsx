'use client';

import { useState, useEffect, useCallback } from 'react';
import { ProgressIndicator } from './ProgressIndicator';
import { ServiceTypeStep } from './ServiceTypeStep';
import { PersonalInfoStep } from './PersonalInfoStep';
import { FormNavigation } from './FormNavigation';

interface ServiceTypeData {
  numberOfApplicants: number;
  visaType: 'tourist' | 'business' | 'transit' | 'diplomatic';
  visaDuration: string;
  purposeOfVisit: string;
  entryDate: Date | null;
  exitDate: Date | null;
  processingTime: string;
}

interface ContactInfoData {
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  currentAddress: string;
  vietnamAddress: string;
}

interface EmergencyContactData {
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  relationship: string;
}

interface FileUploadsData {
  passportScan: File | null;
  portraitPhoto: File | null;
}

interface AgreementsData {
  informationConfirmation: boolean;
  termsAndConditions: boolean;
}

interface PersonalInfoData {
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

interface VisaApplicationData {
  serviceType: ServiceTypeData;
  personalInfo: PersonalInfoData;
}

interface ApplicationFormProps {
  initialData?: Partial<VisaApplicationData>;
  onSubmit: (data: VisaApplicationData) => Promise<void>;
  onSaveAsDraft?: (data: Partial<VisaApplicationData>) => Promise<void>;
  isSubmitting?: boolean;
  isDraftSaving?: boolean;
}

const TOTAL_STEPS = 2;

const STEP_CONFIG = [
  { id: 1, title: 'Service Type', description: 'Select visa type and processing options' },
  { id: 2, title: 'Personal Information', description: 'Provide your details and documents' },
];

// Default form data
const getDefaultFormData = (): VisaApplicationData => ({
  serviceType: {
    numberOfApplicants: 1,
    visaType: 'tourist',
    visaDuration: '',
    purposeOfVisit: '',
    entryDate: null,
    exitDate: null,
    processingTime: '',
  },
  personalInfo: {
    fullName: '',
    dateOfBirth: null,
    nationality: '',
    passportNumber: '',
    passportIssueDate: null,
    passportExpiryDate: null,
    passportIssuingCountry: '',
    contactInfo: {
      fullName: '',
      phoneNumber: '',
      emailAddress: '',
      currentAddress: '',
      vietnamAddress: '',
    },
    emergencyContact: {
      fullName: '',
      phoneNumber: '',
      emailAddress: '',
      relationship: '',
    },
    fileUploads: {
      passportScan: null,
      portraitPhoto: null,
    },
    agreements: {
      informationConfirmation: false,
      termsAndConditions: false,
    },
  },
});

export function ApplicationForm({
  initialData,
  onSubmit,
  onSaveAsDraft,
  isSubmitting = false,
  isDraftSaving = false,
}: ApplicationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<VisaApplicationData>(() => {
    const defaultData = getDefaultFormData();
    
    // Merge initial data if provided
    if (initialData) {
      return {
        ...defaultData,
        ...initialData,
        serviceType: { ...defaultData.serviceType, ...initialData.serviceType },
        personalInfo: {
          ...defaultData.personalInfo,
          ...initialData.personalInfo,
          contactInfo: { ...defaultData.personalInfo.contactInfo, ...initialData.personalInfo?.contactInfo },
          emergencyContact: { ...defaultData.personalInfo.emergencyContact, ...initialData.personalInfo?.emergencyContact },
          fileUploads: { ...defaultData.personalInfo.fileUploads, ...initialData.personalInfo?.fileUploads },
          agreements: { ...defaultData.personalInfo.agreements, ...initialData.personalInfo?.agreements },
        },
      };
    }
    
    return defaultData;
  });

  // Auto-save to localStorage
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('visa-application-draft', JSON.stringify(formData));
    }, 1000); // Debounce saves

    return () => clearTimeout(timeoutId);
  }, [formData]);

  // Helper function to convert date strings back to Date objects
  const convertDatesToObjects = (data: Partial<VisaApplicationData>): Partial<VisaApplicationData> => {
    const converted = { ...data };
    
    // Convert serviceType dates
    if (converted.serviceType) {
      if (converted.serviceType.entryDate && typeof converted.serviceType.entryDate === 'string') {
        converted.serviceType.entryDate = new Date(converted.serviceType.entryDate);
      }
      if (converted.serviceType.exitDate && typeof converted.serviceType.exitDate === 'string') {
        converted.serviceType.exitDate = new Date(converted.serviceType.exitDate);
      }
    }
    
    // Convert personalInfo dates
    if (converted.personalInfo) {
      if (converted.personalInfo.dateOfBirth && typeof converted.personalInfo.dateOfBirth === 'string') {
        converted.personalInfo.dateOfBirth = new Date(converted.personalInfo.dateOfBirth);
      }
      if (converted.personalInfo.passportIssueDate && typeof converted.personalInfo.passportIssueDate === 'string') {
        converted.personalInfo.passportIssueDate = new Date(converted.personalInfo.passportIssueDate);
      }
      if (converted.personalInfo.passportExpiryDate && typeof converted.personalInfo.passportExpiryDate === 'string') {
        converted.personalInfo.passportExpiryDate = new Date(converted.personalInfo.passportExpiryDate);
      }
    }
    
    return converted;
  };

  // Load draft from localStorage on mount
  useEffect(() => {
    if (!initialData) {
      const savedDraft = localStorage.getItem('visa-application-draft');
      if (savedDraft) {
        try {
          const parsedDraft = JSON.parse(savedDraft) as Partial<VisaApplicationData>;
          const convertedDraft = convertDatesToObjects(parsedDraft);
          setFormData(prevData => ({
            ...prevData,
            ...convertedDraft,
            serviceType: { ...prevData.serviceType, ...convertedDraft.serviceType },
            personalInfo: {
              ...prevData.personalInfo,
              ...convertedDraft.personalInfo,
              contactInfo: { ...prevData.personalInfo.contactInfo, ...convertedDraft.personalInfo?.contactInfo },
              emergencyContact: { ...prevData.personalInfo.emergencyContact, ...convertedDraft.personalInfo?.emergencyContact },
              fileUploads: { ...prevData.personalInfo.fileUploads, ...convertedDraft.personalInfo?.fileUploads },
              agreements: { ...prevData.personalInfo.agreements, ...convertedDraft.personalInfo?.agreements },
            },
          }));
        } catch (error) {
          console.error('Failed to load draft from localStorage:', error);
        }
      }
    }
  }, [initialData]);



  // Validation functions
  const validateServiceType = useCallback(() => {
    const { visaType, visaDuration, processingTime, entryDate } = formData.serviceType;
    return !!(visaType && visaDuration && processingTime && entryDate);
  }, [formData.serviceType]);

  const validatePersonalInfo = useCallback(() => {
    const { personalInfo } = formData;
    
    // Helper function to check if file field is valid (handles both File objects and URL strings)
    const isFileFieldValid = (field: File | string | null) => {
      return field !== null && field !== undefined && field !== '';
    };
    
    const requiredFields = [
      personalInfo.fullName,
      personalInfo.dateOfBirth,
      personalInfo.nationality,
      personalInfo.passportNumber,
      personalInfo.passportIssueDate,
      personalInfo.passportExpiryDate,
      personalInfo.passportIssuingCountry, // Add missing field validation
      personalInfo.contactInfo.fullName,
      personalInfo.contactInfo.phoneNumber,
      personalInfo.contactInfo.emailAddress,
      personalInfo.contactInfo.currentAddress,
      personalInfo.emergencyContact.fullName,
      personalInfo.emergencyContact.phoneNumber,
      personalInfo.emergencyContact.relationship,
    ];

    // Separate validation for file uploads to handle both File objects and URL strings
    const fileUploadsValid = 
      isFileFieldValid(personalInfo.fileUploads.passportScan) &&
      isFileFieldValid(personalInfo.fileUploads.portraitPhoto);

    const requiredAgreements = [
      personalInfo.agreements.informationConfirmation,
      personalInfo.agreements.termsAndConditions,
    ];

    const allFieldsComplete = requiredFields.every(field => field !== null && field !== '' && field !== undefined);
    const allAgreementsAccepted = requiredAgreements.every(agreement => agreement === true);

    return allFieldsComplete && fileUploadsValid && allAgreementsAccepted;
  }, [formData]);

  // Step validation
  const canProceedFromCurrentStep = useCallback(() => {
    switch (currentStep) {
      case 1:
        return validateServiceType();
      case 2:
        return validatePersonalInfo();
      default:
        return false;
    }
  }, [currentStep, validateServiceType, validatePersonalInfo]);

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (canProceedFromCurrentStep() && currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    }
  }, [canProceedFromCurrentStep, currentStep]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const handleSubmit = useCallback(async () => {
    if (validatePersonalInfo()) {
      await onSubmit(formData);
      // Clear localStorage draft after successful submission
      localStorage.removeItem('visa-application-draft');
    }
  }, [formData, onSubmit, validatePersonalInfo]);

  const handleSaveAsDraft = useCallback(async () => {
    if (onSaveAsDraft) {
      await onSaveAsDraft(formData);
    }
  }, [formData, onSaveAsDraft]);

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ServiceTypeStep
            data={formData}
            onUpdate={(data) => setFormData(prev => ({ 
              ...prev, 
              serviceType: { ...prev.serviceType, ...data.serviceType } 
            }))}
          />
        );
      case 2:
        return (
          <PersonalInfoStep
            data={formData}
            onUpdate={(data) => setFormData(prev => ({ 
              ...prev, 
              personalInfo: { ...prev.personalInfo, ...data.personalInfo } 
            }))}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Indicator */}
      <div className="sticky top-0 z-20 bg-white shadow-sm">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <ProgressIndicator
            steps={STEP_CONFIG}
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
          />
        </div>
      </div>

      {/* Form Content */}
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {STEP_CONFIG[currentStep - 1]?.title}
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            {STEP_CONFIG[currentStep - 1]?.description}
          </p>
        </div>

        {renderCurrentStep()}

        {/* Spacer for fixed navigation */}
        <div className="h-32" />
      </div>

      {/* Form Navigation */}
      <FormNavigation
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        isFirstStep={currentStep === 1}
        isLastStep={currentStep === TOTAL_STEPS}
        canProceed={canProceedFromCurrentStep()}
        isSubmitting={isSubmitting}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSubmit={handleSubmit}
        onSaveAsDraft={onSaveAsDraft ? handleSaveAsDraft : undefined}
        isDraftSaving={isDraftSaving}
      />
    </div>
  );
}