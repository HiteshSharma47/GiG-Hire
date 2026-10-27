
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [role, setRole] = useState("client");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setMessageType("");

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters long.");
      setMessageType("error");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: fullName.trim(),
            email: email.trim().toLowerCase(),
            password,
            role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      setMessage("Account created successfully! Redirecting to sign in...");
      setMessageType("success");

      setTimeout(() => {
        navigate("/login", {
          state: { registeredEmail: email.trim().toLowerCase() },
        });
      }, 1200);
    } catch (error) {
      setMessage(
        error.message === "Failed to fetch"
          ? "Cannot connect to the server. Please ensure the backend is running."
          : error.message || "Something went wrong. Please try again."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const roleButtonClass = (buttonRole) =>
    `flex-1 rounded-lg px-4 py-3 text-sm font-semibold transition ${
      role === buttonRole
        ? "bg-indigo-600 text-white shadow"
        : "bg-white text-gray-600 hover:bg-indigo-50"
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-violet-100 px-4 py-6 sm:px-6 lg:px-8">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <Link to="/" className="text-2xl font-extrabold tracking-tight text-indigo-700">
          GiG<span className="text-violet-600">Hire</span>
        </Link>
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-indigo-700 hover:text-violet-700">
            Sign in
          </Link>
        </p>
      </header>

      <main className="mx-auto mt-8 grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl md:min-h-[680px] md:grid-cols-2">
        <section className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 p-10 text-white md:flex lg:p-12">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
          <div className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-violet-300/20" />

          <div className="relative">
            <p className="mb-5 inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]">
              Welcome to GiGHire
            </p>
            <h1 className="max-w-md text-4xl font-extrabold leading-tight lg:text-5xl">
              Your journey starts here.
            </h1>
            <p className="mt-5 max-w-md text-lg leading-8 text-indigo-100">
              Find your people. Build your future. Grow together.
            </p>
            <p className="mt-5 max-w-md leading-7 text-indigo-100/90">
              Whether you are looking for the right talent or searching for your
              next opportunity, GiGHire helps clients and workers connect, create,
              and grow together.
            </p>
          </div>

          <div className="relative space-y-4">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
              <p className="font-semibold">For clients</p>
              <p className="mt-1 text-sm text-indigo-100">
                Find skilled people and bring your ideas to life.
              </p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
              <p className="font-semibold">For workers</p>
              <p className="mt-1 text-sm text-indigo-100">
                Showcase your skills and discover new opportunities.
              </p>
            </div>
            <p className="pt-2 text-sm text-indigo-100">
              GiGHire — Connect. Create. Grow.
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
          <div className="w-full max-w-md">
            <Link to="/" className="mb-6 inline-flex text-sm font-medium text-gray-500 hover:text-indigo-700">
              ← Back to home
            </Link>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
              Get started today
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Choose how you want to use GiGHire.
            </p>

            <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  I want to join as a
                </label>
                <div className="flex rounded-xl bg-gray-100 p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setRole("client");
                      setMessage("");
                    }}
                    className={roleButtonClass("client")}
                    disabled={loading}
                  >
                    Client
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRole("worker");
                      setMessage("");
                    }}
                    className={roleButtonClass("worker")}
                    disabled={loading}
                  >
                    Worker
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="fullName" className="mb-2 block text-sm font-semibold text-gray-700">
                  Full name
                </label>
                <input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-700">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-20 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    minLength={8}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute inset-y-0 right-3 text-sm font-semibold text-indigo-600 hover:text-violet-700"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold text-gray-700">
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Enter your password again"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  required
                  disabled={loading}
                />
              </div>

              {message && (
                <p
                  role="status"
                  aria-live="polite"
                  className={`rounded-lg px-4 py-3 text-sm ${
                    messageType === "success"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3.5 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-indigo-700 hover:text-violet-700">
                Sign in
              </Link>
            </p>
            <p className="mt-5 text-center text-xs leading-5 text-gray-400">
              By creating an account, you agree to our{" "}
              <a href="#terms" className="underline hover:text-indigo-600">Terms of Service</a>
              {" "}and{" "}
              <a href="#privacy" className="underline hover:text-indigo-600">Privacy Policy</a>.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}