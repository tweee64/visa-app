'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ApplicationForm } from '~/components/features/visa-form/ApplicationForm';
import { api } from '~/trpc/react';
import { uploadFile } from '~/lib/utils/file-upload';
import { useToast } from '~/components/ui/Toast';

// Type guard for valid visa types
const isValidVisaType = (visaType: string): visaType is 'tourist' | 'business' | 'transit' | 'diplomatic' => {
  return ['tourist', 'business', 'transit', 'diplomatic'].includes(visaType);
};

// Define the complete data structure for the form
interface ServiceTypeData {
  numberOfApplicants: number;
  visaType: '' | 'tourist' | 'business' | 'transit' | 'diplomatic';
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

export default function ApplyPage() {
  const router = useRouter();
  const [currentApplicationId, setCurrentApplicationId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<string[]>([]);
  const { showToast: toastFn, ToastContainer } = useToast();
  
  // Stable toast function using useCallback
  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    toastFn(message, type);
  }, [toastFn]);

  // tRPC hooks
  const utils = api.useUtils();
  const createDraftMutation = api.application.createDraft.useMutation();
  const updateApplicationMutation = api.application.update.useMutation();
  const submitApplicationMutation = api.application.submit.useMutation();

  // Load existing draft on page load
  const { data: existingApplication } = api.application.getById.useQuery(
    { id: currentApplicationId! },
    { enabled: !!currentApplicationId }
  );

  // Load existing draft on mount if available
  useEffect(() => {
    const savedAppId = localStorage.getItem('current-application-id');
    if (savedAppId) {
      setCurrentApplicationId(savedAppId);
    }
  }, []); // Empty dependency array for one-time initialization

  const handleFileUpload = async (file: File, applicationId: string): Promise<string | null> => {
    try {
      const result = await uploadFile(file, applicationId, (progress) => {
        setUploadProgress(prev => ({ ...prev, [file.name]: progress }));
      });
      
      if (result.success && result.url) {
        return result.url;
      } else {
        throw new Error(result.error ?? 'Upload failed');
      }
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  };

  const handleSubmit = async (data: VisaApplicationData) => {
    setErrors([]);
    
    let applicationId = currentApplicationId;
    
    // Create draft if no application exists yet
    if (!applicationId) {
      try {
        const newDraft = await createDraftMutation.mutateAsync({
          fullName: data.personalInfo.fullName,
          emailAddress: data.personalInfo.contactInfo.emailAddress,
          phoneNumber: data.personalInfo.contactInfo.phoneNumber,
          nationality: data.personalInfo.nationality,
          passportNumber: data.personalInfo.passportNumber,
          visaType: data.serviceType.visaType,
          processingTime: data.serviceType.processingTime,
          entryDate: data.serviceType.entryDate?.toISOString() ?? '',
        });
        
        applicationId = newDraft.id;
        setCurrentApplicationId(applicationId);
        localStorage.setItem('current-application-id', applicationId);
      } catch (error) {
        console.error('Failed to create application:', error);
        setErrors(['Failed to create application. Please try again.']);
        showToast('Failed to create application', 'error');
        return;
      }
    }

    try {
      // Upload files first if they exist
      let passportScanUrl = '';
      let portraitPhotoUrl = '';

      if (data.personalInfo.fileUploads.passportScan) {
        passportScanUrl = await handleFileUpload(
          data.personalInfo.fileUploads.passportScan,
          applicationId
        ) ?? '';
      }

      if (data.personalInfo.fileUploads.portraitPhoto) {
        portraitPhotoUrl = await handleFileUpload(
          data.personalInfo.fileUploads.portraitPhoto,
          applicationId
        ) ?? '';
      }

      // Helper function to safely convert dates to ISO string
      const safeToISOString = (date: Date | string | null): string => {
        if (!date) return '';
        if (typeof date === 'string') return new Date(date).toISOString();
        if (date instanceof Date) return date.toISOString();
        return '';
      };

      // Validate that visaType is selected
      if (!data.serviceType.visaType) {
        throw new Error('Please select a visa type');
      }

      // Submit the application with file URLs
      await submitApplicationMutation.mutateAsync({
        id: applicationId,
        fullName: data.personalInfo.fullName,
        emailAddress: data.personalInfo.contactInfo.emailAddress,
        phoneNumber: data.personalInfo.contactInfo.phoneNumber,
        nationality: data.personalInfo.nationality,
        passportNumber: data.personalInfo.passportNumber,
        visaType: data.serviceType.visaType,
        processingTime: data.serviceType.processingTime,
        entryDate: safeToISOString(data.serviceType.entryDate),
        passportScanUrl,
        portraitPhotoUrl,
      });

      // Clear local storage on successful submission
      localStorage.removeItem('current-application-id');
      localStorage.removeItem('visa-application-draft');
      
      showToast('Application submitted successfully! You will receive a confirmation email shortly.', 'success');
      
      // Redirect to home page after a brief delay to show success message
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error) {
      console.error('Submission error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit application';
      setErrors([errorMessage]);
      showToast(errorMessage, 'error');
    }
  };

  const handleSaveAsDraft = async (data: Partial<VisaApplicationData>) => {
    setErrors([]);

    try {
      if (!currentApplicationId) {
        // Create new draft for the first time
        const newDraft = await createDraftMutation.mutateAsync({
          fullName: data.personalInfo?.fullName ?? '',
          emailAddress: data.personalInfo?.contactInfo?.emailAddress ?? '',
          phoneNumber: data.personalInfo?.contactInfo?.phoneNumber ?? '',
          nationality: data.personalInfo?.nationality ?? '',
          passportNumber: data.personalInfo?.passportNumber ?? '',
          visaType: (data.serviceType?.visaType && isValidVisaType(data.serviceType.visaType)) ? data.serviceType.visaType : 'tourist',
          processingTime: data.serviceType?.processingTime ?? '',
          entryDate: data.serviceType?.entryDate?.toISOString() ?? '',
        });
        
        setCurrentApplicationId(newDraft.id);
        localStorage.setItem('current-application-id', newDraft.id);
      } else {
        // Update existing draft
        await updateApplicationMutation.mutateAsync({
          id: currentApplicationId,
          fullName: data.personalInfo?.fullName ?? '',
          emailAddress: data.personalInfo?.contactInfo?.emailAddress ?? '',
          phoneNumber: data.personalInfo?.contactInfo?.phoneNumber ?? '',
          nationality: data.personalInfo?.nationality ?? '',
          passportNumber: data.personalInfo?.passportNumber ?? '',
          visaType: (data.serviceType?.visaType && isValidVisaType(data.serviceType.visaType)) ? data.serviceType.visaType : 'tourist',
          processingTime: data.serviceType?.processingTime ?? '',
          entryDate: data.serviceType?.entryDate?.toISOString() ?? '',
        });

        // Invalidate queries to refresh data
        await utils.application.getById.invalidate({ id: currentApplicationId });
      }
      
      showToast('Draft saved successfully', 'success');
    } catch (error) {
      console.error('Draft save error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save draft';
      setErrors([errorMessage]);
      showToast(errorMessage, 'error');
    }
  };

  // Convert database data to form data format
  const getInitialFormData = (): Partial<VisaApplicationData> | undefined => {
    if (!existingApplication) return undefined;

    return {
      serviceType: {
        visaType: (existingApplication.visaType as '' | 'tourist' | 'business' | 'transit' | 'diplomatic') || '',
        processingTime: existingApplication.processingTime ?? '',
        entryDate: existingApplication.entryDate ? new Date(existingApplication.entryDate) : null,
        numberOfApplicants: 1,
        visaDuration: '',
        purposeOfVisit: '',
        exitDate: null,
      },
      personalInfo: {
        fullName: existingApplication.fullName ?? '',
        nationality: existingApplication.nationality ?? '',
        passportNumber: existingApplication.passportNumber ?? '',
        dateOfBirth: null,
        passportIssueDate: null,
        passportExpiryDate: null,
        passportIssuingCountry: '',
        contactInfo: {
          fullName: existingApplication.fullName ?? '',
          emailAddress: existingApplication.emailAddress ?? '',
          phoneNumber: existingApplication.phoneNumber ?? '',
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
    };
  };

  // No loading state needed since we don't create drafts on page load

  return (
    <div>
      {/* Error Display */}
      {errors.length > 0 && (
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="rounded-lg bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {errors.length === 1 ? 'Error' : 'Errors'}
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <ul className="list-disc pl-5 space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Progress Display */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="rounded-lg bg-blue-50 p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">File Upload Progress</h3>
            {Object.entries(uploadProgress).map(([fileName, progress]) => (
              <div key={fileName} className="mb-2">
                <div className="flex justify-between text-sm text-blue-700">
                  <span>{fileName}</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ApplicationForm
        initialData={getInitialFormData()}
        onSubmit={handleSubmit}
        onSaveAsDraft={handleSaveAsDraft}
        isSubmitting={submitApplicationMutation.isPending}
        isDraftSaving={updateApplicationMutation.isPending}
      />
      
      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
}
