import { useState } from "react";
import { SurveyProvider, useSurvey } from "@/react-app/contexts/SurveyContext";
import MobileHeader from "@/react-app/components/MobileHeader";
import NPSRating from "@/react-app/components/NPSRating";
import FeedbackDropdown from "@/react-app/components/FeedbackDropdown";
import CustomerDetailsForm from "@/react-app/components/CustomerDetailsForm";
import SuccessScreen from "@/react-app/components/SuccessScreen";
import NavigationButton from "@/react-app/components/NavigationButton";

function SurveyFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const { surveyData, updateNpsScore, updateFeedbackCategory, resetSurvey } =
    useSurvey();

  const feedbackOptions = {
    product: ["Size Avilability", "Fashion Trend", "Fitting & Stitching"],
    staffService: ["Helpfulness", "Knowledge", "Friendliness", "Response Time"],
    checkoutExperience: [
      "Queue Length",
      "Payment Options",
      "Staff Efficiency",
      "Clarity",
    ],
    storeAmbience: [
      "Cleanliness",
      "Lighting",
      "Music",
      "Temperature",
      "Layout",
    ],
  };

  const canProceedFromStep = (step: number) => {
    switch (step) {
      case 1:
        return surveyData.npsScore !== null;
      case 2:
        return true; // Can proceed without selecting feedback categories
      case 3:
        const { fullName, mobile, email } = surveyData.customerDetails;
        return (
          fullName.trim() !== "" &&
          (mobile.trim() !== "" || email.trim() !== "")
        );
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      setExpandedCategory(null);
    }
  };

  const handleClose = () => {
    resetSurvey();
    setCurrentStep(1);
    setExpandedCategory(null);
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
      case 2:
        return "Feedback";
      case 3:
        return "Feedback";
      case 4:
        return "Summary";
      default:
        return "Feedback";
    }
  };

  const getButtonText = () => {
    switch (currentStep) {
      case 1:
      case 2:
        return "Next";
      case 3:
        return "Proceed";
      default:
        return "Next";
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-[480px] min-h-screen bg-gray-100">
        <MobileHeader title={getStepTitle()} />

        <div className="pb-24">
          {currentStep === 1 && (
            <>
              <NPSRating
                selectedScore={surveyData.npsScore}
                onScoreSelect={updateNpsScore}
              />
              <NavigationButton
                text={getButtonText()}
                onClick={handleNext}
                disabled={!canProceedFromStep(1)}
              />
            </>
          )}

          {currentStep === 2 && (
            <>
              <div className="px-6 py-8">
                <h2 className="text-lg font-medium text-gray-800 mb-6 text-center">
                  What is one thing we could have done differently to improve
                  your experience?
                </h2>

                <FeedbackDropdown
                  title="Product"
                  options={feedbackOptions.product}
                  selectedValues={surveyData.feedbackCategories.product}
                  onSelectionChange={(values) =>
                    updateFeedbackCategory("product", values)
                  }
                  isExpanded={expandedCategory === "product"}
                  onExpandChange={(expanded) =>
                    setExpandedCategory(expanded ? "product" : null)
                  }
                />

                <FeedbackDropdown
                  title="Staff Service"
                  options={feedbackOptions.staffService}
                  selectedValues={surveyData.feedbackCategories.staffService}
                  onSelectionChange={(values) =>
                    updateFeedbackCategory("staffService", values)
                  }
                  isExpanded={expandedCategory === "staffService"}
                  onExpandChange={(expanded) =>
                    setExpandedCategory(expanded ? "staffService" : null)
                  }
                />

                <FeedbackDropdown
                  title="Checkout Experience"
                  options={feedbackOptions.checkoutExperience}
                  selectedValues={
                    surveyData.feedbackCategories.checkoutExperience
                  }
                  onSelectionChange={(values) =>
                    updateFeedbackCategory("checkoutExperience", values)
                  }
                  isExpanded={expandedCategory === "checkoutExperience"}
                  onExpandChange={(expanded) =>
                    setExpandedCategory(expanded ? "checkoutExperience" : null)
                  }
                />

                <FeedbackDropdown
                  title="Store Ambience"
                  options={feedbackOptions.storeAmbience}
                  selectedValues={surveyData.feedbackCategories.storeAmbience}
                  onSelectionChange={(values) =>
                    updateFeedbackCategory("storeAmbience", values)
                  }
                  isExpanded={expandedCategory === "storeAmbience"}
                  onExpandChange={(expanded) =>
                    setExpandedCategory(expanded ? "storeAmbience" : null)
                  }
                />
              </div>
              <NavigationButton
                text={getButtonText()}
                onClick={handleNext}
                disabled={!canProceedFromStep(2)}
              />
            </>
          )}

          {currentStep === 3 && (
            <>
              <CustomerDetailsForm />
              <NavigationButton
                text={getButtonText()}
                onClick={handleNext}
                disabled={!canProceedFromStep(3)}
              />
            </>
          )}

          {currentStep === 4 && <SuccessScreen onClose={handleClose} />}
        </div>
      </div>
    </div>
  );
}

export default function Survey() {
  return (
    <SurveyProvider>
      <SurveyFlow />
    </SurveyProvider>
  );
}
