import { User } from "lucide-react";
import logo from "../Images/YK-Logos.png";
interface MobileHeaderProps {
  title?: string;
}

export default function MobileHeader({ title }: MobileHeaderProps) {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3">
        <div className="flex items-center">
          <div className="ml-1 text-xs text-gray-600">
            <img src={logo} />
          </div>
        </div>
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-gray-600" />
        </div>
      </div>

      {/* Title section */}
      {title && (
        <div className="bg-blue-200 py-4 text-center">
          <h1 className="text-lg font-medium text-gray-800">{title}</h1>
        </div>
      )}
    </div>
  );
}
