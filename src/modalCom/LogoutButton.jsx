import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react"; // 👈 Plus ki jagah LogOut use kar rahe hain

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // ✅ Local storage clear
    localStorage.clear();

    // ✅ Redirect to login page
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center"
    >
      <LogOut className="mr-2 w-5 h-5" /> {/* 👈 Logout icon */}
      LogOut
    </button>
  );
}
