'use client';

import { DatePicker } from '~/components/ui/DatePicker';
import { CountrySelector } from '~/components/ui/CountrySelector';
import { FileUpload } from '~/components/ui/FileUpload';

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
  serviceType: unknown;
  personalInfo: PersonalInfoData;
}

interface PersonalInfoStepProps {
  data: VisaApplicationData;
  onUpdate: (data: Partial<VisaApplicationData>) => void;
  errors?: Record<string, string>;
}

export function PersonalInfoStep({ data, onUpdate, errors = {} }: PersonalInfoStepProps) {
  const { personalInfo } = data;

  const handleFieldChange = (field: keyof PersonalInfoData, value: unknown) => {
    onUpdate({
      personalInfo: {
        ...personalInfo,
        [field]: value,
      },
    });
  };

  const handleContactInfoChange = (field: keyof ContactInfoData, value: string) => {
    onUpdate({
      personalInfo: {
        ...personalInfo,
        contactInfo: {
          ...personalInfo.contactInfo,
          [field]: value,
        },
      },
    });
  };

  const handleEmergencyContactChange = (field: keyof EmergencyContactData, value: string) => {
    onUpdate({
      personalInfo: {
        ...personalInfo,
        emergencyContact: {
          ...personalInfo.emergencyContact,
          [field]: value,
        },
      },
    });
  };

  const handleFileUploadChange = (field: keyof FileUploadsData, value: File | null) => {
    onUpdate({
      personalInfo: {
        ...personalInfo,
        fileUploads: {
          ...personalInfo.fileUploads,
          [field]: value,
        },
      },
    });
  };

  const handleAgreementChange = (field: keyof AgreementsData, value: boolean) => {
    onUpdate({
      personalInfo: {
        ...personalInfo,
        agreements: {
          ...personalInfo.agreements,
          [field]: value,
        },
      },
    });
  };

  return (
    <div className="space-y-8" data-testid="personal-info-step">
      {/* Step Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
        <p className="text-base text-gray-600 mt-2">
          Please provide your personal details and upload required documents
        </p>
      </div>

      <div className="space-y-8">
        {/* Personal Details Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                value={personalInfo.fullName}
                onChange={(e) => handleFieldChange('fullName', e.target.value)}
                placeholder="Enter your full name as shown on passport"
                className={`
                  block w-full rounded-lg border px-4 py-3 text-base transition-colors
                  placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0
                  ${errors.fullName
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }
                `}
                aria-invalid={!!errors.fullName}
                aria-describedby={errors.fullName ? 'fullName-error' : undefined}
              />
              {errors.fullName && (
                <p id="fullName-error" className="text-sm text-red-600">
                  {errors.fullName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <DatePicker
                id="dateOfBirth"
                value={personalInfo.dateOfBirth}
                onChange={(date) => handleFieldChange('dateOfBirth', date)}
                placeholder="Select date of birth"
                error={errors.dateOfBirth}
                required
                maxDate={new Date()}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Nationality <span className="text-red-500">*</span>
              </label>
              <CountrySelector
                id="nationality"
                value={personalInfo.nationality}
                onChange={(value) => handleFieldChange('nationality', value)}
                placeholder="Select your nationality"
                error={errors.nationality}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="passportNumber" className="block text-sm font-medium text-gray-700">
                Passport Number <span className="text-red-500">*</span>
              </label>
              <input
                id="passportNumber"
                type="text"
                value={personalInfo.passportNumber}
                onChange={(e) => handleFieldChange('passportNumber', e.target.value.toUpperCase())}
                placeholder="Enter passport number"
                className={`
                  block w-full rounded-lg border px-4 py-3 text-base transition-colors uppercase
                  placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0
                  ${errors.passportNumber
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }
                `}
                aria-invalid={!!errors.passportNumber}
                aria-describedby={errors.passportNumber ? 'passportNumber-error' : undefined}
              />
              {errors.passportNumber && (
                <p id="passportNumber-error" className="text-sm text-red-600">
                  {errors.passportNumber}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Passport Issue Date <span className="text-red-500">*</span>
              </label>
              <DatePicker
                id="passportIssueDate"
                value={personalInfo.passportIssueDate}
                onChange={(date) => handleFieldChange('passportIssueDate', date)}
                placeholder="Select issue date"
                error={errors.passportIssueDate}
                required
                maxDate={new Date()}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Passport Expiry Date <span className="text-red-500">*</span>
              </label>
              <DatePicker
                id="passportExpiryDate"
                value={personalInfo.passportExpiryDate}
                onChange={(date) => handleFieldChange('passportExpiryDate', date)}
                placeholder="Select expiry date"
                error={errors.passportExpiryDate}
                required
                minDate={new Date()}
              />
            </div>

            <div className="md:col-span-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Passport Issuing Country <span className="text-red-500">*</span>
                </label>
                <CountrySelector
                  id="passportIssuingCountry"
                  value={personalInfo.passportIssuingCountry}
                  onChange={(value) => handleFieldChange('passportIssuingCountry', value)}
                  placeholder="Select issuing country"
                  error={errors.passportIssuingCountry}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="contactFullName" className="block text-sm font-medium text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="contactFullName"
                type="text"
                value={personalInfo.contactInfo.fullName}
                onChange={(e) => handleContactInfoChange('fullName', e.target.value)}
                placeholder="Enter your full name"
                className={`
                  block w-full rounded-lg border px-4 py-3 text-base transition-colors
                  placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0
                  ${errors['contactInfo.fullName']
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }
                `}
              />
              {errors['contactInfo.fullName'] && (
                <p className="text-sm text-red-600">{errors['contactInfo.fullName']}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                id="phoneNumber"
                type="tel"
                value={personalInfo.contactInfo.phoneNumber}
                onChange={(e) => handleContactInfoChange('phoneNumber', e.target.value)}
                placeholder="+1 (555) 123-4567"
                className={`
                  block w-full rounded-lg border px-4 py-3 text-base transition-colors
                  placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0
                  ${errors['contactInfo.phoneNumber']
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }
                `}
              />
              {errors['contactInfo.phoneNumber'] && (
                <p className="text-sm text-red-600">{errors['contactInfo.phoneNumber']}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <div className="space-y-2">
                <label htmlFor="emailAddress" className="block text-sm font-medium text-gray-700">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="emailAddress"
                  type="email"
                  value={personalInfo.contactInfo.emailAddress}
                  onChange={(e) => handleContactInfoChange('emailAddress', e.target.value)}
                  placeholder="your.email@example.com"
                  className={`
                    block w-full rounded-lg border px-4 py-3 text-base transition-colors
                    placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0
                    ${errors['contactInfo.emailAddress']
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }
                  `}
                />
                {errors['contactInfo.emailAddress'] && (
                  <p className="text-sm text-red-600">{errors['contactInfo.emailAddress']}</p>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="space-y-2">
                <label htmlFor="currentAddress" className="block text-sm font-medium text-gray-700">
                  Current Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="currentAddress"
                  value={personalInfo.contactInfo.currentAddress}
                  onChange={(e) => handleContactInfoChange('currentAddress', e.target.value)}
                  rows={3}
                  placeholder="Enter your current residential address"
                  className={`
                    block w-full rounded-lg border px-4 py-3 text-base transition-colors resize-none
                    placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0
                    ${errors['contactInfo.currentAddress']
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }
                  `}
                />
                {errors['contactInfo.currentAddress'] && (
                  <p className="text-sm text-red-600">{errors['contactInfo.currentAddress']}</p>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="space-y-2">
                <label htmlFor="vietnamAddress" className="block text-sm font-medium text-gray-700">
                  Address in Vietnam <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="vietnamAddress"
                  value={personalInfo.contactInfo.vietnamAddress}
                  onChange={(e) => handleContactInfoChange('vietnamAddress', e.target.value)}
                  rows={3}
                  placeholder="Enter your address/hotel in Vietnam"
                  className={`
                    block w-full rounded-lg border px-4 py-3 text-base transition-colors resize-none
                    placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0
                    ${errors['contactInfo.vietnamAddress']
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }
                  `}
                />
                {errors['contactInfo.vietnamAddress'] && (
                  <p className="text-sm text-red-600">{errors['contactInfo.vietnamAddress']}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="emergencyFullName" className="block text-sm font-medium text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="emergencyFullName"
                type="text"
                value={personalInfo.emergencyContact.fullName}
                onChange={(e) => handleEmergencyContactChange('fullName', e.target.value)}
                placeholder="Enter emergency contact name"
                className={`
                  block w-full rounded-lg border px-4 py-3 text-base transition-colors
                  placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0
                  ${errors['emergencyContact.fullName']
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }
                `}
              />
              {errors['emergencyContact.fullName'] && (
                <p className="text-sm text-red-600">{errors['emergencyContact.fullName']}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-700">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                id="emergencyPhone"
                type="tel"
                value={personalInfo.emergencyContact.phoneNumber}
                onChange={(e) => handleEmergencyContactChange('phoneNumber', e.target.value)}
                placeholder="+1 (555) 123-4567"
                className={`
                  block w-full rounded-lg border px-4 py-3 text-base transition-colors
                  placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0
                  ${errors['emergencyContact.phoneNumber']
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }
                `}
              />
              {errors['emergencyContact.phoneNumber'] && (
                <p className="text-sm text-red-600">{errors['emergencyContact.phoneNumber']}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="emergencyEmail" className="block text-sm font-medium text-gray-700">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="emergencyEmail"
                type="email"
                value={personalInfo.emergencyContact.emailAddress}
                onChange={(e) => handleEmergencyContactChange('emailAddress', e.target.value)}
                placeholder="emergency@example.com"
                className={`
                  block w-full rounded-lg border px-4 py-3 text-base transition-colors
                  placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0
                  ${errors['emergencyContact.emailAddress']
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }
                `}
              />
              {errors['emergencyContact.emailAddress'] && (
                <p className="text-sm text-red-600">{errors['emergencyContact.emailAddress']}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="relationship" className="block text-sm font-medium text-gray-700">
                Relationship <span className="text-red-500">*</span>
              </label>
              <select
                id="relationship"
                value={personalInfo.emergencyContact.relationship}
                onChange={(e) => handleEmergencyContactChange('relationship', e.target.value)}
                className={`
                  block w-full rounded-lg border px-4 py-3 text-base transition-colors
                  focus:outline-none focus:ring-2 focus:ring-offset-0
                  ${errors['emergencyContact.relationship']
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }
                `}
              >
                <option value="">Select relationship</option>
                <option value="spouse">Spouse</option>
                <option value="parent">Parent</option>
                <option value="child">Child</option>
                <option value="sibling">Sibling</option>
                <option value="friend">Friend</option>
                <option value="colleague">Colleague</option>
                <option value="other">Other</option>
              </select>
              {errors['emergencyContact.relationship'] && (
                <p className="text-sm text-red-600">{errors['emergencyContact.relationship']}</p>
              )}
            </div>
          </div>
        </div>

        {/* Document Upload Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Documents</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FileUpload
                id="passportScan"
                label="Passport Scan"
                accept=".jpg,.jpeg,.png"
                maxSize={5 * 1024 * 1024}
                onFileSelect={(file) => handleFileUploadChange('passportScan', file)}
                currentFile={personalInfo.fileUploads.passportScan}
                error={errors['fileUploads.passportScan']}
                required
                data-testid="file-upload-passport"
              />
              <p className="text-xs text-gray-500 mt-2">
                Upload a clear scan of your passport&apos;s information page including MRZ (machine readable zone)
              </p>
            </div>

            <div>
              <FileUpload
                id="portraitPhoto"
                label="Portrait Photo"
                accept=".jpg,.jpeg,.png"
                maxSize={5 * 1024 * 1024}
                onFileSelect={(file) => handleFileUploadChange('portraitPhoto', file)}
                currentFile={personalInfo.fileUploads.portraitPhoto}
                error={errors['fileUploads.portraitPhoto']}
                required
                isPhotoValidation
                data-testid="file-upload-portrait"
              />
              <p className="text-xs text-gray-500 mt-2">
                Upload a passport-style photo: white background, face centered, no hat/glasses. Minimum 200x200px, maximum 4000x4000px. Square or portrait format preferred.
              </p>
            </div>
          </div>
        </div>

        {/* Agreements Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Agreements</h3>
          
          <div className="space-y-4">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={personalInfo.agreements.informationConfirmation}
                onChange={(e) => handleAgreementChange('informationConfirmation', e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="text-sm">
                <span className="font-medium text-gray-900">
                  Information Accuracy Confirmation <span className="text-red-500">*</span>
                </span>
                <p className="text-gray-600 mt-1">
                  I confirm that all information provided is true and accurate to the best of my knowledge.
                  I understand that providing false information may result in visa rejection or legal consequences.
                </p>
              </div>
            </label>
            {errors['agreements.informationConfirmation'] && (
              <p className="text-sm text-red-600 ml-7">{errors['agreements.informationConfirmation']}</p>
            )}

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={personalInfo.agreements.termsAndConditions}
                onChange={(e) => handleAgreementChange('termsAndConditions', e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="text-sm">
                <span className="font-medium text-gray-900">
                  Terms and Conditions <span className="text-red-500">*</span>
                </span>
                <p className="text-gray-600 mt-1">
                  I agree to the{' '}
                  <a href="/terms" target="_blank" className="text-blue-600 hover:underline">
                    Terms and Conditions
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" target="_blank" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>{' '}
                  of the visa application service.
                </p>
              </div>
            </label>
            {errors['agreements.termsAndConditions'] && (
              <p className="text-sm text-red-600 ml-7">{errors['agreements.termsAndConditions']}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}