import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    if (!email.trim()) {
      setMessage({
        type: "error",
        text: "Please enter your email address.",
      });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({
          type: "error",
          text: data.message || "Unable to send OTP.",
        });
        return;
      }

      navigate("/verify-otp", {
        state: { email: email.trim().toLowerCase() },
      });
    } catch {
      setMessage({
        type: "error",
        text: "Cannot connect to the server. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-violet-100 flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-indigo-200/50 p-8 sm:p-10">
        <Link
          to="/login"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          ← Back to login
        </Link>

        <div className="mt-8 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-2xl mb-5">
            🔐
          </div>

          <p className="text-sm font-semibold text-indigo-600 mb-2">
            ACCOUNT RECOVERY
          </p>

          <h1 className="text-3xl font-bold text-gray-900">Forgot password?</h1>

          <p className="text-gray-500 mt-3 leading-6">
            Enter your registered email address. We'll send you a 6-digit
            verification code.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-2">
              Email address
            </label>

            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full px-4 py-3.5 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition"
            />
          </div>

          {message && (
            <div className="rounded-xl p-3 text-sm bg-red-50 text-red-700">
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-7">
          Remember your password?{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;