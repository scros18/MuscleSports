import { Check } from "lucide-react";

interface Step {
  number: number;
  title: string;
}

interface CheckoutStepsProps {
  currentStep: number;
  steps: Step[];
}

export function CheckoutSteps({ currentStep, steps }: CheckoutStepsProps) {
  return (
    <div className="flex items-center justify-between max-w-3xl mx-auto">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center flex-1">
          {/* Step Circle */}
          <div className="flex flex-col items-center relative">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                currentStep > step.number
                  ? "bg-green-600 text-white"
                  : currentStep === step.number
                  ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {currentStep > step.number ? (
                <Check className="w-5 h-5" />
              ) : (
                step.number
              )}
            </div>
            <span
              className={`absolute -bottom-6 text-xs font-medium whitespace-nowrap ${
                currentStep >= step.number
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {step.title}
            </span>
          </div>

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-1 mx-2 transition-all duration-300 ${
                currentStep > step.number
                  ? "bg-green-600"
                  : "bg-muted"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
