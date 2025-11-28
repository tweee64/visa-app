'use client';

import { Button } from '~/components/ui/Button';

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  canProceed: boolean;
  isSubmitting?: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onSaveAsDraft?: () => void;
  isDraftSaving?: boolean;
}

export function FormNavigation({
  currentStep,
  totalSteps,
  isFirstStep,
  isLastStep,
  canProceed,
  isSubmitting = false,
  onPrevious,
  onNext,
  onSubmit,
  onSaveAsDraft,
  isDraftSaving = false,
}: FormNavigationProps) {
  return (
    <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-white px-4 py-4 shadow-lg sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Step Info */}
          <div className="text-sm text-gray-600">
            Step {currentStep} of {totalSteps}
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            {/* Save as Draft Button */}
            {onSaveAsDraft && (
              <Button
                variant="secondary"
                size="md"
                onClick={onSaveAsDraft}
                disabled={isDraftSaving || isSubmitting}
                className="order-3 sm:order-1"
              >
                {isDraftSaving ? 'Saving...' : 'Save as Draft'}
              </Button>
            )}

            {/* Previous Button */}
            {!isFirstStep && (
              <Button
                variant="secondary"
                size="md"
                onClick={onPrevious}
                disabled={isSubmitting}
                className="order-2 sm:order-2"
              >
                Previous
              </Button>
            )}

            {/* Next/Submit Button */}
            {isLastStep ? (
              <Button
                variant="primary"
                size="md"
                onClick={onSubmit}
                disabled={!canProceed || isSubmitting}
                className="order-1 sm:order-3"
              >
                {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={onNext}
                disabled={!canProceed || isSubmitting}
                className="order-1 sm:order-3"
              >
                Next
              </Button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-blue-600 transition-all duration-300 ease-in-out"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500">
            {!canProceed && !isLastStep && 'Complete all required fields to continue'}
            {!canProceed && isLastStep && 'Complete all required fields to submit'}
            {canProceed && !isLastStep && 'All required information provided'}
            {canProceed && isLastStep && 'Ready to submit your application'}
          </p>
        </div>
      </div>
    </div>
  );
}