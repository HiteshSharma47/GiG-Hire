import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function ClientDashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    async function fetchBookings() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/bookings/my-bookings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.status === 401) {
          logout();
          navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(data.message || "Unable to load bookings.");
        }

        setBookings(data.bookings || data);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [token, navigate, logout]);

  function handleLogout() {
    logout();
    navigate("/");
  }

  const totalBookings = bookings.length;

  const activeBookings = bookings.filter((booking) =>
    ["pending", "accepted"].includes(booking.status),
  ).length;

  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed",
  ).length;

  function statusStyle(status) {
    const styles = {
      pending: "bg-amber-50 text-amber-700",
      accepted: "bg-blue-50 text-blue-700",
      rejected: "bg-red-50 text-red-700",
      completed: "bg-green-50 text-green-700",
      cancelled: "bg-gray-100 text-gray-600",
    };

    return styles[status] || "bg-gray-100 text-gray-600";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-violet-100">
      <nav className="flex items-center justify-between border-b bg-white px-8 py-5">
        <Link to="/" className="text-2xl font-extrabold text-indigo-700">
          GiG<span className="text-gray-900">Hire</span>
        </Link>

        <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
          Logout
        </Button>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user?.name || "Client"}!
          </h1>
          <p className="mt-2 text-gray-600">
            Find skilled workers and manage your bookings.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Statistics */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-gray-500">Total Bookings</p>
            <h2 className="mt-3 text-3xl font-bold">
              {loading ? "..." : totalBookings}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-gray-500">Active Bookings</p>
            <h2 className="mt-3 text-3xl font-bold">
              {loading ? "..." : activeBookings}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-gray-500">Completed Bookings</p>
            <h2 className="mt-3 text-3xl font-bold">
              {loading ? "..." : completedBookings}
            </h2>
          </div>
        </div>

        {/* Explore */}
        <div className="mt-10 rounded-xl bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold">Find Your Next Service</h2>
          <p className="mt-2 text-gray-600">
            Explore available gigs and find the right worker for your needs.
          </p>

          <Button
            onClick={() => navigate("/")}
            className="mt-5 bg-indigo-600 hover:bg-indigo-700"
          >
            Explore Gigs
          </Button>
        </div>

        {/* Booking history */}
        <div className="mt-8 rounded-xl bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold">My Bookings</h2>
          <p className="mt-2 text-sm text-gray-500">
            Track all the services you have requested.
          </p>

          {loading ? (
            <p className="mt-6 text-gray-500">Loading your bookings...</p>
          ) : bookings.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-5xl">📭</p>
              <h3 className="mt-4 font-semibold text-gray-800">
                No bookings yet
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Your booking requests will appear here.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {bookings.map((booking) => {
                const canContactWorker = ["accepted", "completed"].includes(
                  booking.status,
                );

                const worker = booking.worker;

                return (
                  <div
                    key={booking._id}
                    className="rounded-xl border border-gray-200 p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {booking.gig?.title || "Gig unavailable"}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Worker: {worker?.name || "Worker"}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {booking.gig?.category || ""}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyle(
                          booking.status,
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap justify-between gap-3 border-t pt-4">
                      <p className="text-sm text-gray-500">
                        Location: {booking.gig?.location || "Not available"}
                      </p>

                      <p className="font-bold text-indigo-700">
                        ₹{Number(booking.price).toLocaleString("en-IN")}
                      </p>
                    </div>

                    {booking.message && (
                      <p className="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                        <strong>Your message:</strong> {booking.message}
                      </p>
                    )}

                    {/* Worker Contact Details */}
                    {canContactWorker ? (
                      <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-5">
                        <div className="mb-4 flex items-center gap-2">
                          <span className="text-xl">🤝</span>
                          <div>
                            <h4 className="font-bold text-green-800">
                              Worker Contact Details
                            </h4>
                            <p className="text-xs text-green-700">
                              You can now contact your worker directly.
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="text-xs font-semibold text-gray-500">
                                EMAIL ADDRESS
                              </p>
                              <p className="break-all text-sm font-medium text-gray-800">
                                {worker?.email || "Email unavailable"}
                              </p>
                            </div>

                            {worker?.email && (
                              <a
                                href={`mailto:${worker.email}`}
                                className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm hover:bg-indigo-100"
                              >
                                <span className="mr-1">✉️</span>
                                Email
                              </a>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-green-200 pt-3">
                            <div>
                              <p className="text-xs font-semibold text-gray-500">
                                PHONE NUMBER
                              </p>
                              <p className="text-sm font-medium text-gray-800">
                                {worker?.phone || "Phone number unavailable"}
                              </p>
                            </div>

                            {worker?.phone && (
                              <a
                                href={`tel:${worker.phone}`}
                                className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-green-700 shadow-sm hover:bg-green-100"
                              >
                                <span className="mr-1">📞</span>
                                Call Worker
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-5 rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
                        🔒 Worker contact details will become available once
                        your booking is accepted.
                      </div>
                    )}

                    <p className="mt-3 text-xs text-gray-400">
                      Requested on:{" "}
                      {new Date(booking.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default ClientDashboard;