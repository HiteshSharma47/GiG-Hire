import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const resetToken = location.state?.resetToken || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (password.length < 8) {
      setMessage({
        type: "error",
        text: "Password must contain at least 8 characters.",
      });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({
        type: "error",
        text: "Passwords do not match.",
      });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resetToken, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({
          type: "error",
          text: data.message || "Unable to reset password.",
        });
        return;
      }

      setMessage({
        type: "success",
        text: "Password reset successfully! Redirecting to login...",
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setMessage({
        type: "error",
        text: "Cannot connect to the server. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  if (!resetToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Verification Required
          </h2>

          <p className="text-gray-500 mb-6">
            Please verify your OTP first before resetting your password.
          </p>

          <Link
            to="/forgot-password"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700"
          >
            Start Again
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 sm:p-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5">
            🔐
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            Create New Password
          </h1>

          <p className="text-gray-500 mt-3">
            Choose a strong password for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              New Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter new password"
              required
              minLength={8}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Confirm Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Confirm new password"
              required
              minLength={8}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(event) => setShowPassword(event.target.checked)}
              className="accent-indigo-600"
            />
            Show passwords
          </label>

          {message && (
            <div
              className={`p-3 rounded-xl text-sm text-center ${
                message.type === "error"
                  ? "bg-red-50 text-red-600"
                  : "bg-green-50 text-green-600"
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Updating Password..." : "Reset Password"}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link
            to="/login"
            className="text-sm text-gray-500 hover:text-indigo-600"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;