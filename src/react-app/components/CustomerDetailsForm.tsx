import { Store } from 'lucide-react';
import { useSurvey } from '@/react-app/contexts/SurveyContext';

export default function CustomerDetailsForm() {
  const { surveyData, updateCustomerDetails } = useSurvey();
  const { customerDetails } = surveyData;

  return (
    <div className="px-6 py-8">
      {/* Store Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
          <Store className="w-8 h-8 text-white" />
        </div>
      </div>
      
      <div className="text-center mb-8">
        <p className="text-gray-600">(Store Name)</p>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800">Customer Details</h3>
        
        {/* Full Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={customerDetails.fullName}
            onChange={(e) => updateCustomerDetails({ fullName: e.target.value })}
            placeholder="Jeet Patel"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        {/* Mobile */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Mobile
          </label>
          <input
            type="tel"
            value={customerDetails.mobile}
            onChange={(e) => updateCustomerDetails({ mobile: e.target.value })}
            placeholder="+91 9876543210"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        {/* Or divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-gray-500 font-medium">Or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            value={customerDetails.email}
            onChange={(e) => updateCustomerDetails({ email: e.target.value })}
            placeholder="xyz123@gmail.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
      </div>
    </div>
  );
}
