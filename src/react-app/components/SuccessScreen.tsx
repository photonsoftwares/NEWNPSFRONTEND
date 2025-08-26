import { Check } from 'lucide-react';

interface SuccessScreenProps {
  onClose: () => void;
}

export default function SuccessScreen({ onClose }: SuccessScreenProps) {
  return (
    <div className="px-6 py-16 text-center">
      <div className="flex justify-center mb-8">
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center">
          <Check className="w-12 h-12 text-white stroke-[3]" />
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-green-600 mb-8">
        Success!
      </h2>

      <p className="text-gray-700 text-lg mb-16">
        Thanks for your valuable feedback.
      </p>

      <button
        onClick={onClose}
        className="w-full max-w-sm mx-auto py-4 bg-white border-2 border-gray-300 rounded-lg text-gray-800 font-medium hover:bg-gray-50 transition-colors"
      >
        Close
      </button>
    </div>
  );
}
