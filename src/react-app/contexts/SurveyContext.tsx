import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface SurveyData {
  npsScore: number | null;
  feedbackCategories: {
    product: string[];
    staffService: string[];
    checkoutExperience: string[];
    storeAmbience: string[];
  };
  customerDetails: {
    fullName: string;
    mobile: string;
    email: string;
  };
}

interface SurveyContextType {
  surveyData: SurveyData;
  updateNpsScore: (score: number) => void;
  updateFeedbackCategory: (category: keyof SurveyData['feedbackCategories'], values: string[]) => void;
  updateCustomerDetails: (details: Partial<SurveyData['customerDetails']>) => void;
  resetSurvey: () => void;
}

const initialSurveyData: SurveyData = {
  npsScore: null,
  feedbackCategories: {
    product: [],
    staffService: [],
    checkoutExperience: [],
    storeAmbience: [],
  },
  customerDetails: {
    fullName: '',
    mobile: '',
    email: '',
  },
};

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export const useSurvey = () => {
  const context = useContext(SurveyContext);
  if (!context) {
    throw new Error('useSurvey must be used within a SurveyProvider');
  }
  return context;
};

interface SurveyProviderProps {
  children: ReactNode;
}

export const SurveyProvider: React.FC<SurveyProviderProps> = ({ children }) => {
  const [surveyData, setSurveyData] = useState<SurveyData>(initialSurveyData);

  const updateNpsScore = (score: number) => {
    setSurveyData(prev => ({ ...prev, npsScore: score }));
  };

  const updateFeedbackCategory = (category: keyof SurveyData['feedbackCategories'], values: string[]) => {
    setSurveyData(prev => ({
      ...prev,
      feedbackCategories: {
        ...prev.feedbackCategories,
        [category]: values,
      },
    }));
  };

  const updateCustomerDetails = (details: Partial<SurveyData['customerDetails']>) => {
    setSurveyData(prev => ({
      ...prev,
      customerDetails: {
        ...prev.customerDetails,
        ...details,
      },
    }));
  };

  const resetSurvey = () => {
    setSurveyData(initialSurveyData);
  };

  return (
    <SurveyContext.Provider value={{
      surveyData,
      updateNpsScore,
      updateFeedbackCategory,
      updateCustomerDetails,
      resetSurvey,
    }}>
      {children}
    </SurveyContext.Provider>
  );
};
