import { ArrowRight } from "lucide-react";

interface NavigationButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

export default function NavigationButton({
  text,
  onClick,
  disabled = false,
}: NavigationButtonProps) {
  return (
    <div className=" fixed flex justify-center bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          w-[460px] flex items-center justify-center space-x-2 py-4 rounded-lg font-medium transition-all
          ${
            disabled
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-800 border-2 border-gray-300 hover:bg-gray-50 active:bg-gray-100"
          }
        `}
      >
        <span>{text}</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
