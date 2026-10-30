import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function WorkerProfile() {
  const { user, token, updateUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");
      setError("");

      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update profile.");
      }

      updateUser(data.user);

      setFormData({
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone || "",
      });

      setMessage("Profile updated successfully!");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-violet-100">
      <nav className="flex items-center justify-between border-b bg-white px-8 py-5">
        <Link to="/" className="text-2xl font-extrabold text-indigo-700">
          GiG<span className="text-gray-900">Hire</span>
        </Link>

        <Button
          onClick={() => navigate("/worker-dashboard")}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          Back to Dashboard
        </Button>
      </nav>

      <main className="mx-auto max-w-2xl px-6 py-12">
        <div className="rounded-2xl bg-white p-8 shadow-lg">
          <div className="mb-8 text-center">
            <div className="text-5xl">👤</div>

            <h1 className="mt-4 text-3xl font-bold text-gray-900">
              My Profile
            </h1>

            <p className="mt-2 text-gray-500">
              Manage your personal information.
            </p>
          </div>

          {message && (
            <div className="mb-5 rounded-lg bg-green-50 p-4 text-sm text-green-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
                placeholder="+919876543210"
              />

              <p className="mt-2 text-xs text-gray-500">
                Clients can see your contact details after you accept their
                booking.
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 py-3 hover:bg-indigo-700"
            >
              {loading ? "Saving Changes..." : "Save Changes"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default WorkerProfile;