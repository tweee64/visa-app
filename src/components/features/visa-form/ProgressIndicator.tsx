interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: Array<{
    id: number;
    title: string;
    description?: string;
  }>;
}

export function ProgressIndicator({ currentStep, totalSteps: _totalSteps, steps }: ProgressIndicatorProps) {
  return (
    <div className="w-full max-w-4xl mx-auto" data-testid="progress-indicator">
      {/* Progress bar */}
      <div className="relative">
        <div className="flex items-center justify-between relative">
          {/* Connecting line background */}
          <div className="absolute top-4 left-5 right-5 h-0.5 bg-gray-300 -z-10" />
          
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center relative">
              {/* Step circle */}
              <div
                className={`
                  flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium bg-white relative z-10
                  ${index < currentStep
                    ? 'border-blue-600 text-blue-600'
                    : index === currentStep
                      ? 'border-blue-600 text-blue-600'
                      : 'border-gray-300 text-gray-400'
                  }
                `}
              >
                {index < currentStep ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  step.id
                )}
              </div>
              
              {/* Step labels */}
              <div className="mt-2 text-center">
                <div
                  className={`
                    text-sm font-medium
                    ${index <= currentStep ? 'text-gray-900' : 'text-gray-500'}
                  `}
                >
                  {step.title}
                </div>
              </div>
              
              {/* Progress line overlay */}
              {index < currentStep && index < steps.length - 1 && (
                <div className="absolute top-4 left-4 w-full h-0.5 bg-blue-600 -z-5" style={{ width: 'calc(100% + 2.5rem)' }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}