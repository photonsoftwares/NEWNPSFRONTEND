import { useState } from "react";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import DataService from "../services/requestApi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const LoginPage = ({ onLogin }) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    if (userName && password) {
      try {
        const response = await DataService.Login({ userName, password });

        if (response?.data?.status) {
          const { role, userId, token ,saasId} = response.data.data;
          localStorage.setItem("role", role);
          localStorage.setItem("token", token);
          localStorage.setItem("userId", userId.toString());
          localStorage.setItem("saasId", saasId.toString());
          localStorage.setItem("isLoggedIn", "true");

          Swal.fire({
            icon: "success",
            title: "Login Successful",
            text: "Welcome back to NPS Feedback System",
            confirmButtonText: "Continue",
          }).then(() => {
            window.location.href = "/";
          });

          onLogin();
        } else {
          Swal.fire({
            icon: "error",
            title: "Login Failed",
            text: response?.data?.message || "Invalid credentials",
            confirmButtonText: "Retry",
          });
          setError(response?.data?.message || "Invalid credentials");
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred during login",
          confirmButtonText: "OK",
        });
        setError("An error occurred during login");
      }
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Left side gradient background */}
      <div className="hidden md:flex w-6/12 bg-gradient-to-br from-blue-900 to-blue-600 text-white items-center justify-center relative">
        <div className="text-center px-8">
          <h1 className="text-4xl font-bold mb-4">NPS Feedback System</h1>
          <p className="text-lg opacity-90">
            Manage surveys, analyze responses and improve customer satisfaction.
          </p>
        </div>
        <div className="absolute bottom-10 text-xs opacity-70">
          © 2025 YK Almoayyed & Sons
        </div>
      </div>

      {/* Right side - Login card */}
      <div className="flex w-full md:w-6/12 items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
          {/* Logo / Title */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Admin Login</h2>
            <p className="text-gray-500 text-sm">Sign in to access dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Enter username"
                  className="w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-3 rounded-lg font-medium hover:bg-blue-800 transition"
            >
              Login
            </button>
          </form>

          <p className="text-center text-gray-400 text-xs mt-8">
            © 2025 YK Almoayyed & Sons • All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
