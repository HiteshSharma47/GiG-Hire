import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function VerifyOTP() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  async function handleVerify(event) {
    event.preventDefault();

    if (otp.length !== 6) {
      setMessage({
        type: "error",
        text: "Please enter the complete 6-digit OTP.",
      });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({
          type: "error",
          text: data.message || "Invalid or expired OTP.",
        });
        return;
      }

      navigate("/reset-password", {
        state: { resetToken: data.resetToken },
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: "Cannot connect to the server. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    try {
      setResending(true);
      setMessage(null);

      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({
          type: "error",
          text: data.message || "Unable to resend OTP.",
        });
        return;
      }

      setOtp("");
      setMessage({
        type: "success",
        text: "A new OTP has been sent to your email.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: "Cannot connect to the server.",
      });
    } finally {
      setResending(false);
    }
  }

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Email not found
          </h2>

          <p className="text-gray-500 mb-6">
            Please enter your email address first.
          </p>

          <Link
            to="/forgot-password"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700"
          >
            Go Back
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
            ✉️
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            Verify Your Email
          </h1>

          <p className="text-gray-500 mt-3">
            We've sent a 6-digit verification code to
          </p>

          <p className="text-indigo-600 font-semibold mt-1 break-all">
            {email}
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Enter OTP
            </label>

            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              onChange={(event) =>
                setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="000000"
              className="w-full text-center tracking-[0.7em] text-2xl font-bold border border-gray-300 rounded-xl px-4 py-4 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

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
            disabled={loading || otp.length !== 6}
            className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="text-center mt-7">
          <p className="text-sm text-gray-500 mb-2">Didn't receive the code?</p>

          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="text-indigo-600 font-semibold hover:text-indigo-800 disabled:opacity-50"
          >
            {resending ? "Sending..." : "Resend OTP"}
          </button>
        </div>

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

export default VerifyOTP;