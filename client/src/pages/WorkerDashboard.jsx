import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function DashboardCard({ title, value, description, icon }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <h2 className="mt-3 text-3xl font-bold text-gray-900">{value}</h2>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
    </div>
  );
}

function WorkerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token, logout } = useAuth();

  const [gigs, setGigs] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(location.state?.message || "");
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const name = user?.name || "Worker";

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    async function fetchDashboardData() {
      try {
        setError("");

        const [gigResponse, bookingResponse] = await Promise.all([
          fetch(`${API_URL}/api/gigs/my-gigs`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/api/bookings/worker-requests`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (gigResponse.status === 401 || bookingResponse.status === 401) {
          logout();
          navigate("/login");
          return;
        }

        const gigData = await gigResponse.json();
        const bookingData = await bookingResponse.json();

        if (!gigResponse.ok) {
          throw new Error(gigData.message || "Could not load your gigs.");
        }

        if (!bookingResponse.ok) {
          throw new Error(bookingData.message || "Could not load bookings.");
        }

        setGigs(gigData.gigs || []);
        setBookings(bookingData.bookings || bookingData);
      } catch (err) {
        setError(err.message || "Unable to connect to the server.");
      } finally {
        setLoading(false);
        setBookingLoading(false);
      }
    }

    fetchDashboardData();
  }, [token, navigate, logout]);

  const activeGigs = gigs.filter((gig) => gig.status === "active").length;
  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const acceptedBookings = bookings.filter(
    (b) => b.status === "accepted",
  ).length;
  const completedBookings = bookings.filter(
    (b) => b.status === "completed",
  ).length;

  const earnings = completedBookings
    ? bookings
        .filter((b) => b.status === "completed")
        .reduce((total, booking) => total + Number(booking.price), 0)
    : 0;

  async function handleDeleteGig(id) {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this gig?",
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");
      setNotice("");

      const response = await fetch(`${API_URL}/api/gigs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.status === 401) {
        logout();
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Could not delete this gig.");
      }

      setGigs((current) => current.filter((gig) => gig._id !== id));
      setNotice("Gig deleted successfully.");
    } catch (err) {
      setError(err.message || "Unable to delete this gig.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleBookingStatus(id, status) {
    try {
      setUpdatingId(id);
      setError("");
      setNotice("");

      const response = await fetch(`${API_URL}/api/bookings/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (response.status === 401) {
        logout();
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Could not update booking.");
      }

      setBookings((current) =>
        current.map((booking) =>
          booking._id === id ? { ...booking, status } : booking,
        ),
      );

      setNotice(`Booking ${status} successfully.`);
    } catch (err) {
      setError(err.message || "Unable to update booking.");
    } finally {
      setUpdatingId(null);
    }
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

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
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 flex-col bg-slate-950 p-6 text-white md:flex">
          <Link to="/" className="text-2xl font-extrabold">
            GiG<span className="text-violet-400">Hire</span>
          </Link>

          <p className="mt-2 text-xs text-slate-400">WORKER WORKSPACE</p>

          <nav className="mt-10 flex-1 space-y-2">
            <Link
              to="/worker-dashboard"
              className="block rounded-xl bg-violet-600 px-4 py-3 font-medium"
            >
              🏠 Overview
            </Link>

            <a
              href="#my-gigs"
              className="block rounded-xl px-4 py-3 text-slate-300 hover:bg-slate-800"
            >
              💼 My Gigs
            </a>

            <a
              href="#recent-orders"
              className="block rounded-xl px-4 py-3 text-slate-300 hover:bg-slate-800"
            >
              📦 Booking Requests
            </a>

            <Link
              to="/"
              className="block rounded-xl px-4 py-3 text-slate-300 hover:bg-slate-800"
            >
              🔎 Browse Marketplace
            </Link>

            <Link
              to="/worker-profile"
              className="block rounded-xl px-4 py-3 text-slate-300 hover:bg-slate-800"
            >
              👤 My Profile
            </Link>
          </nav>

          <button
            onClick={handleLogout}
            className="rounded-xl px-4 py-3 text-left text-red-300 hover:bg-slate-800"
          >
            ↪ Logout
          </button>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 p-5 md:p-8 lg:p-10">
          <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">
                Worker Dashboard / Overview
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight">
                Welcome back, {name}! 👋
              </h1>
              <p className="mt-2 text-gray-500">
                Here's what's happening with your services.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/worker-profile")}
                className="rounded-xl border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-700 hover:bg-gray-100"
              >
                👤 My Profile
              </button>

              <button
                onClick={() => navigate("/create-gig")}
                className="rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white shadow-sm hover:bg-violet-700"
              >
                + Create New Gig
              </button>
            </div>
          </header>

          {notice && (
            <div
              role="status"
              className="mb-5 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700"
            >
              {notice}
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {/* Dashboard statistics */}
          <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <DashboardCard
              title="Total Gigs"
              value={loading ? "..." : gigs.length}
              description="Your saved services"
              icon="💼"
            />

            <DashboardCard
              title="Active Gigs"
              value={loading ? "..." : activeGigs}
              description="Currently available"
              icon="🟢"
            />

            <DashboardCard
              title="Pending Requests"
              value={bookingLoading ? "..." : pendingBookings}
              description="Awaiting your response"
              icon="📩"
            />

            <DashboardCard
              title="Completed Earnings"
              value={
                bookingLoading ? "..." : `₹${earnings.toLocaleString("en-IN")}`
              }
              description="From completed bookings"
              icon="💰"
            />
          </section>

          {/* My gigs */}
          <section id="my-gigs" className="mt-10">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">My Gigs</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Manage the services you offer.
                </p>
              </div>

              <button
                onClick={() => navigate("/create-gig")}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-100"
              >
                + Add Gig
              </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              {loading ? (
                <div className="p-10 text-center text-gray-500">
                  Loading your gigs...
                </div>
              ) : gigs.length === 0 ? (
                <div className="p-10 text-center">
                  <p className="text-4xl">💼</p>
                  <h3 className="mt-3 font-semibold">No gigs yet</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Create your first gig to start offering services.
                  </p>
                  <button
                    onClick={() => navigate("/create-gig")}
                    className="mt-5 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white hover:bg-violet-700"
                  >
                    Create Your First Gig
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {gigs.map((gig) => (
                    <div
                      key={gig._id}
                      className="flex flex-wrap items-center justify-between gap-4 p-5"
                    >
                      <div className="min-w-0">
                        <h3 className="font-semibold">{gig.title}</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {gig.category}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {gig.location} · {gig.deliveryTime}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold">
                            ₹{Number(gig.price).toLocaleString("en-IN")}
                          </p>
                          <span
                            className={`text-xs font-medium ${gig.status === "active" ? "text-green-600" : "text-gray-500"}`}
                          >
                            {gig.status === "active" ? "Active" : "Inactive"}
                          </span>
                        </div>

                        <button
                          onClick={() => handleDeleteGig(gig._id)}
                          disabled={deletingId === gig._id}
                          className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          {deletingId === gig._id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Real booking requests */}
          <section id="recent-orders" className="mt-10">
            <div className="mb-5">
              <h2 className="text-xl font-bold">Booking Requests</h2>
              <p className="mt-1 text-sm text-gray-500">
                Manage requests received from clients.
              </p>
            </div>

            <div className="space-y-4">
              {bookingLoading ? (
                <div className="rounded-2xl border bg-white p-10 text-center text-gray-500">
                  Loading booking requests...
                </div>
              ) : bookings.length === 0 ? (
                <div className="rounded-2xl border bg-white p-10 text-center">
                  <p className="text-4xl">📭</p>
                  <h3 className="mt-3 font-semibold">
                    No booking requests yet
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Client booking requests will appear here.
                  </p>
                </div>
              ) : (
                bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold">
                          {booking.gig?.title || "Gig unavailable"}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Client: {booking.client?.name || "Client"}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {booking.client?.email || ""}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyle(booking.status)}`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-6 border-t pt-4 text-sm">
                      <p>
                        <span className="text-gray-500">Amount: </span>
                        <strong>
                          ₹{Number(booking.price).toLocaleString("en-IN")}
                        </strong>
                      </p>
                      <p>
                        <span className="text-gray-500">Location: </span>
                        <strong>
                          {booking.gig?.location || "Not available"}
                        </strong>
                      </p>
                    </div>

                    {booking.message && (
                      <div className="mt-4 rounded-lg bg-gray-50 p-3">
                        <p className="text-xs font-semibold text-gray-500">
                          CLIENT MESSAGE
                        </p>
                        <p className="mt-1 text-sm text-gray-700">
                          {booking.message}
                        </p>
                      </div>
                    )}

                    {booking.status === "pending" && (
                      <div className="mt-5 flex flex-wrap gap-3">
                        <button
                          onClick={() =>
                            handleBookingStatus(booking._id, "accepted")
                          }
                          disabled={updatingId === booking._id}
                          className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                        >
                          Accept
                        </button>

                        <button
                          onClick={() =>
                            handleBookingStatus(booking._id, "rejected")
                          }
                          disabled={updatingId === booking._id}
                          className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {booking.status === "accepted" && (
                      <button
                        onClick={() =>
                          handleBookingStatus(booking._id, "completed")
                        }
                        disabled={updatingId === booking._id}
                        className="mt-5 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                      >
                        Mark as Completed
                      </button>
                    )}

                    {updatingId === booking._id && (
                      <p className="mt-2 text-xs text-gray-500">
                        Updating booking...
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>

          <footer className="mt-10 border-t border-gray-200 pt-5 text-sm text-gray-500">
            © {new Date().getFullYear()} GiGHire. Built for freelancers.
          </footer>
        </main>
      </div>
    </div>
  );
}

export default WorkerDashboard;
