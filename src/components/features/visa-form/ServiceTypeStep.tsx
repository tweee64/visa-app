'use client';

import { useCallback } from 'react';
import { DatePicker } from '~/components/ui/DatePicker';
import { Select } from '~/components/ui/Select';
import { 
  visaTypes, 
  processingTimes, 
  calculateTotalPrice, 
  formatPrice,
  getEstimatedDeliveryDate,
  type VisaOption,
  type ProcessingTimeOption 
} from '~/lib/constants/visa-options';

interface ServiceTypeData {
  numberOfApplicants: number;
  visaType: '' | 'tourist' | 'business' | 'transit' | 'diplomatic';
  visaDuration: string;
  purposeOfVisit: string;
  entryDate: Date | null;
  exitDate: Date | null;
  processingTime: string;
}

interface VisaApplicationData {
  serviceType: ServiceTypeData;
  personalInfo: unknown;
}

interface ServiceTypeStepProps {
  data: VisaApplicationData;
  onUpdate: (data: Partial<VisaApplicationData>) => void;
  errors?: Record<string, string>;
}

export function ServiceTypeStep({ data, onUpdate, errors = {} }: ServiceTypeStepProps) {
  const { serviceType } = data;

  const handleFieldChange = useCallback((field: keyof ServiceTypeData, value: unknown) => {
    console.log('handleFieldChange called:', field, value);
    console.log('Current serviceType:', serviceType);
    const updatedServiceType = {
      ...serviceType,
      [field]: value,
    };
    console.log('Updated serviceType:', updatedServiceType);
    onUpdate({
      serviceType: updatedServiceType,
    });
  }, [serviceType, onUpdate]);

  const selectedVisa = visaTypes.find(visa => visa.type === serviceType.visaType);
  const selectedProcessingTime = processingTimes.find(pt => pt.value === serviceType.processingTime);

  const totalPrice = calculateTotalPrice(
    serviceType.visaType,
    serviceType.visaDuration,
    serviceType.processingTime,
    serviceType.numberOfApplicants
  );

  const estimatedDelivery = serviceType.processingTime 
    ? getEstimatedDeliveryDate(serviceType.processingTime)
    : null;

  return (
    <div className="space-y-8" data-testid="service-type-step">
      {/* Step Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Service Type Selection</h2>
        <p className="text-base text-gray-600 mt-2">
          Choose your visa type, duration, and processing preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Form Fields */}
        <div className="space-y-6">
          {/* Number of Applicants */}
          <div className="space-y-2">
            <label htmlFor="numberOfApplicants" className="block text-sm font-medium text-gray-700">
              Number of Applicants <span className="text-red-500">*</span>
            </label>
            <Select
              id="numberOfApplicants"
              value={serviceType.numberOfApplicants || ''}
              onChange={(value) => handleFieldChange('numberOfApplicants', parseInt(value as string))}
              options={Array.from({ length: 10 }, (_, i) => ({
                value: i + 1,
                label: `${i + 1} ${i === 0 ? 'Applicant' : 'Applicants'}`
              }))}
              placeholder="Select number of applicants"
              error={!!errors.numberOfApplicants}
              aria-invalid={!!errors.numberOfApplicants}
              aria-describedby={errors.numberOfApplicants ? 'numberOfApplicants-error' : undefined}
            />
            {errors.numberOfApplicants && (
              <p id="numberOfApplicants-error" className="text-sm text-red-600">
                {errors.numberOfApplicants}
              </p>
            )}
          </div>

          {/* Visa Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Visa Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 gap-3">
              {visaTypes.map((visa: VisaOption) => (
                <label
                  key={visa.type}
                  className={`
                    relative cursor-pointer rounded-lg border p-4 transition-all
                    ${serviceType.visaType === visa.type
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500'
                      : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="visaType"
                    value={visa.type}
                    checked={serviceType.visaType === visa.type}
                    onChange={(e) => handleFieldChange('visaType', e.target.value)}
                    className="sr-only"
                    aria-describedby={errors.visaType ? 'visaType-error' : undefined}
                  />
                  <div className="flex items-start">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div
                          className={`
                            flex items-center justify-center w-5 h-5 border-2 rounded-full mr-3
                            ${serviceType.visaType === visa.type
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                            }
                          `}
                        >
                          {serviceType.visaType === visa.type && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">
                          {visa.label}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 ml-8">
                        {visa.description}
                      </p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
            {errors.visaType && (
              <p id="visaType-error" className="text-sm text-red-600">
                {errors.visaType}
              </p>
            )}
          </div>

          {/* Visa Duration */}
          {selectedVisa && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Visa Duration <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {selectedVisa.durations.map((duration) => (
                  <label
                    key={duration.value}
                    className={`
                      flex items-center justify-between cursor-pointer rounded-lg border p-3 transition-all
                      ${serviceType.visaDuration === duration.value
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500'
                        : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                      }
                    `}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="visaDuration"
                        value={duration.value}
                        checked={serviceType.visaDuration === duration.value}
                        onChange={(e) => handleFieldChange('visaDuration', e.target.value)}
                        className="sr-only"
                        aria-describedby={errors.visaDuration ? 'visaDuration-error' : undefined}
                      />
                      <div
                        className={`
                          flex items-center justify-center w-4 h-4 border-2 rounded-full mr-3
                          ${serviceType.visaDuration === duration.value
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                          }
                        `}
                      >
                        {serviceType.visaDuration === duration.value && (
                          <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {duration.label}
                        </div>
                        <div className="text-xs text-gray-600">
                          {duration.description}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {formatPrice(duration.price)}
                    </div>
                  </label>
                ))}
              </div>
              {errors.visaDuration && (
                <p id="visaDuration-error" className="text-sm text-red-600">
                  {errors.visaDuration}
                </p>
              )}
            </div>
          )}

          {/* Purpose of Visit */}
          <div className="space-y-2">
            <label htmlFor="purposeOfVisit" className="block text-sm font-medium text-gray-700">
              Purpose of Visit <span className="text-red-500">*</span>
            </label>
            <textarea
              id="purposeOfVisit"
              value={serviceType.purposeOfVisit}
              onChange={(e) => handleFieldChange('purposeOfVisit', e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Please describe the purpose of your visit to Vietnam..."
              className={`
                block w-full rounded-lg border px-4 py-3 text-base transition-colors resize-none
                placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0
                ${errors.purposeOfVisit
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }
              `}
              aria-invalid={!!errors.purposeOfVisit}
              aria-describedby={errors.purposeOfVisit ? 'purposeOfVisit-error' : undefined}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{serviceType.purposeOfVisit.length}/500 characters</span>
            </div>
            {errors.purposeOfVisit && (
              <p id="purposeOfVisit-error" className="text-sm text-red-600">
                {errors.purposeOfVisit}
              </p>
            )}
          </div>

          {/* Entry and Exit Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Entry Date <span className="text-red-500">*</span>
              </label>
              <DatePicker
                id="entryDate"
                value={serviceType.entryDate}
                onChange={(date) => handleFieldChange('entryDate', date)}
                placeholder="Select entry date"
                error={errors.entryDate}
                required
                minDate={new Date()}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Exit Date <span className="text-red-500">*</span>
              </label>
              <DatePicker
                id="exitDate"
                value={serviceType.exitDate}
                onChange={(date) => handleFieldChange('exitDate', date)}
                placeholder="Select exit date"
                error={errors.exitDate}
                required
                minDate={serviceType.entryDate ?? new Date()}
              />
            </div>
          </div>

          {/* Processing Time */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Processing Time <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {processingTimes.map((option: ProcessingTimeOption) => (
                <label
                  key={option.value}
                  className={`
                    flex items-center justify-between cursor-pointer rounded-lg border p-3 transition-all
                    ${serviceType.processingTime === option.value
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500'
                      : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                    }
                  `}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="processingTime"
                      value={option.value}
                      checked={serviceType.processingTime === option.value}
                      onChange={(e) => handleFieldChange('processingTime', e.target.value)}
                      className="sr-only"
                      aria-describedby={errors.processingTime ? 'processingTime-error' : undefined}
                    />
                    <div
                      className={`
                        flex items-center justify-center w-4 h-4 border-2 rounded-full mr-3
                        ${serviceType.processingTime === option.value
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                        }
                      `}
                    >
                      {serviceType.processingTime === option.value && (
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {option.label}
                      </div>
                      <div className="text-xs text-gray-600">
                        {option.description} ({option.businessDays} business days)
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    {option.additionalFee > 0 ? `+${formatPrice(option.additionalFee)}` : 'Free'}
                  </div>
                </label>
              ))}
            </div>
            {errors.processingTime && (
              <p id="processingTime-error" className="text-sm text-red-600">
                {errors.processingTime}
              </p>
            )}
          </div>
        </div>

        {/* Right Column - Summary */}
        <div className="lg:sticky lg:top-8 lg:self-start">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
            
            <div className="space-y-3">
              {serviceType.numberOfApplicants && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Applicants:</span>
                  <span className="font-medium">{serviceType.numberOfApplicants}</span>
                </div>
              )}
              
              {serviceType.visaType && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Visa Type:</span>
                  <span className="font-medium">
                    {visaTypes.find(v => v.type === serviceType.visaType)?.label}
                  </span>
                </div>
              )}
              
              {serviceType.visaDuration && selectedVisa && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">
                    {selectedVisa.durations.find(d => d.value === serviceType.visaDuration)?.label}
                  </span>
                </div>
              )}
              
              {selectedProcessingTime && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Processing:</span>
                  <span className="font-medium">{selectedProcessingTime.label}</span>
                </div>
              )}
              
              {estimatedDelivery && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Estimated Delivery:</span>
                  <span className="font-medium">
                    {estimatedDelivery.toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
            
            {totalPrice > 0 && (
              <>
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span className="text-blue-600">{formatPrice(totalPrice)}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}