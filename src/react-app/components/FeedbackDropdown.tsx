import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface FeedbackDropdownProps {
  title: string;
  options: string[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  isExpanded?: boolean;
  onExpandChange?: (expanded: boolean) => void;
}

export default function FeedbackDropdown({
  title,
  options,
  selectedValues,
  onSelectionChange,
  isExpanded = false,
  onExpandChange,
}: FeedbackDropdownProps) {
  const [internalExpanded, setInternalExpanded] = useState(false);
  
  const expanded = onExpandChange ? isExpanded : internalExpanded;
  const setExpanded = onExpandChange || setInternalExpanded;

  const toggleOption = (option: string) => {
    if (selectedValues.includes(option)) {
      onSelectionChange(selectedValues.filter(v => v !== option));
    } else {
      onSelectionChange([...selectedValues, option]);
    }
  };

  return (
    <div className="mb-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-800">{title}</span>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600" />
        )}
      </button>
      
      {expanded && (
        <div className="mt-2 space-y-2">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => toggleOption(option)}
              className={`
                w-full text-left px-4 py-3 rounded-lg border transition-all
                ${selectedValues.includes(option)
                  ? 'border-blue-400 bg-blue-50 text-blue-800'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
