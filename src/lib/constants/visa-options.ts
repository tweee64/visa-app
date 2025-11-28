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

export interface VisaOption {
  type: string;
  label: string;
  description: string;
  durations: VisaDurationOption[];
}

export const visaTypes: VisaOption[] = [
  {
    type: 'tourist',
    label: 'Tourist Visa',
    description: 'For leisure, sightseeing, visiting friends and relatives',
    durations: [
      {
        value: 'single',
        label: 'Single Entry',
        description: 'Valid for one entry only',
        price: 25,
      },
      {
        value: 'multiple-1month',
        label: 'Multiple Entry - 1 Month',
        description: 'Multiple entries within 1 month',
        price: 50,
      },
      {
        value: 'multiple-3months',
        label: 'Multiple Entry - 3 Months',
        description: 'Multiple entries within 3 months',
        price: 65,
      },
    ],
  },
  {
    type: 'business',
    label: 'Business Visa',
    description: 'For business meetings, conferences, trade activities',
    durations: [
      {
        value: 'single',
        label: 'Single Entry',
        description: 'Valid for one entry only',
        price: 45,
      },
      {
        value: 'multiple-1month',
        label: 'Multiple Entry - 1 Month',
        description: 'Multiple entries within 1 month',
        price: 80,
      },
      {
        value: 'multiple-3months',
        label: 'Multiple Entry - 3 Months',
        description: 'Multiple entries within 3 months',
        price: 95,
      },
      {
        value: 'multiple-6months',
        label: 'Multiple Entry - 6 Months',
        description: 'Multiple entries within 6 months',
        price: 135,
      },
      {
        value: 'multiple-1year',
        label: 'Multiple Entry - 1 Year',
        description: 'Multiple entries within 1 year',
        price: 180,
      },
    ],
  },
  {
    type: 'transit',
    label: 'Transit Visa',
    description: 'For passengers in transit through Vietnam',
    durations: [
      {
        value: 'single',
        label: 'Single Entry',
        description: 'Valid for one transit only',
        price: 20,
      },
    ],
  },
  {
    type: 'diplomatic',
    label: 'Diplomatic Visa',
    description: 'For diplomatic passport holders',
    durations: [
      {
        value: 'multiple-6months',
        label: 'Multiple Entry - 6 Months',
        description: 'Multiple entries within 6 months',
        price: 0,
      },
      {
        value: 'multiple-1year',
        label: 'Multiple Entry - 1 Year',
        description: 'Multiple entries within 1 year',
        price: 0,
      },
      {
        value: 'multiple-2years',
        label: 'Multiple Entry - 2 Years',
        description: 'Multiple entries within 2 years',
        price: 0,
      },
      {
        value: 'multiple-3years',
        label: 'Multiple Entry - 3 Years',
        description: 'Multiple entries within 3 years',
        price: 0,
      },
    ],
  },
];

export const processingTimes: ProcessingTimeOption[] = [
  {
    value: 'normal',
    label: 'Normal Processing',
    description: 'Standard processing time',
    additionalFee: 0,
    businessDays: 3,
  },
  {
    value: 'urgent',
    label: 'Urgent Processing',
    description: 'Expedited processing',
    additionalFee: 20,
    businessDays: 2,
  },
  {
    value: 'super-urgent',
    label: 'Super Urgent Processing',
    description: 'Super expedited processing',
    additionalFee: 40,
    businessDays: 1,
  },
  {
    value: 'express',
    label: 'Express Processing',
    description: 'Same day processing',
    additionalFee: 60,
    businessDays: 1,
  },
  {
    value: 'emergency',
    label: 'Emergency Processing',
    description: 'Immediate processing for emergencies',
    additionalFee: 100,
    businessDays: 1,
  },
  {
    value: 'weekend-holiday',
    label: 'Weekend/Holiday Processing',
    description: 'Processing on weekends and holidays',
    additionalFee: 80,
    businessDays: 1,
  },
];

export const getVisaOptionByType = (type: string): VisaOption | undefined => {
  return visaTypes.find(visa => visa.type === type);
};

export const getProcessingTimeByValue = (value: string): ProcessingTimeOption | undefined => {
  return processingTimes.find(option => option.value === value);
};

export const getDurationOptionByValue = (visaType: string, durationValue: string): VisaDurationOption | undefined => {
  const visa = getVisaOptionByType(visaType);
  if (!visa) return undefined;
  
  return visa.durations.find(duration => duration.value === durationValue);
};

export const calculateTotalPrice = (
  visaType: string,
  duration: string,
  processingTime: string,
  numberOfApplicants = 1
): number => {
  const durationOption = getDurationOptionByValue(visaType, duration);
  const processingOption = getProcessingTimeByValue(processingTime);
  
  if (!durationOption || !processingOption) return 0;
  
  const basePrice = durationOption.price;
  const processingFee = processingOption.additionalFee;
  
  return (basePrice + processingFee) * numberOfApplicants;
};

export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};

export const getEstimatedDeliveryDate = (processingTime: string): Date => {
  const option = getProcessingTimeByValue(processingTime);
  if (!option) return new Date();
  
  const now = new Date();
  const deliveryDate = new Date(now);
  deliveryDate.setDate(now.getDate() + option.businessDays);
  
  return deliveryDate;
};