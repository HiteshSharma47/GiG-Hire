import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function GigDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [message, setMessage] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingNotice, setBookingNotice] = useState("");
  const [bookingError, setBookingError] = useState("");

  useEffect(() => {
    async function fetchGig() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/gigs/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load this gig.");
        }

        setGig(data.gig || data);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    fetchGig();
  }, [id]);

  async function handleBooking() {
    if (!token) {
      navigate("/login");
      return;
    }

    if (user?.role !== "client") {
      setBookingError("Only clients can book a gig.");
      return;
    }

    try {
      setBookingLoading(true);
      setBookingError("");
      setBookingNotice("");

      const response = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          gigId: id,
          message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Booking request failed.");
      }

      setBookingNotice("Booking request sent successfully!");
      setMessage("");
    } catch (err) {
      setBookingError(err.message || "Unable to send booking request.");
    } finally {
      setBookingLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-lg font-semibold">
        Loading gig details...
      </div>
    );
  }

  if (error || !gig) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6">
        <h2 className="text-2xl font-bold">Gig not found</h2>
        <p className="text-gray-500">{error || "This gig is unavailable."}</p>
        <Link
          to="/"
          className="rounded-lg bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const worker =
    typeof gig.worker === "object"
      ? gig.worker?.name
      : gig.workerName || "GiGHire Worker";

  const isOwnGig =
    user?.role === "worker" && (gig.worker?._id || gig.worker) === user?._id;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white px-6 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link to="/" className="text-2xl font-extrabold text-indigo-700">
            GiG<span className="text-gray-900">Hire</span>
          </Link>

          <Link to="/" className="font-medium text-indigo-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </nav>

      <main className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-3">
        <section className="space-y-6 md:col-span-2">
          <div className="overflow-hidden rounded-2xl border bg-white">
            {gig.imageUrl ? (
              <img
                src={gig.imageUrl}
                alt={gig.title}
                className="h-80 w-full object-cover"
              />
            ) : (
              <div className="flex h-80 items-center justify-center bg-indigo-100 text-7xl">
                💼
              </div>
            )}
          </div>

          <div className="rounded-2xl border bg-white p-8">
            <p className="mb-3 font-medium text-indigo-600">{gig.category}</p>

            <h1 className="mb-6 text-3xl font-bold text-gray-900">
              {gig.title}
            </h1>

            <h2 className="mb-3 text-xl font-semibold">About this gig</h2>
            <p className="whitespace-pre-line leading-8 text-gray-600">
              {gig.description}
            </p>
          </div>
        </section>

        <aside className="h-fit rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Starting price</p>

          <h2 className="mb-6 text-3xl font-bold text-indigo-700">
            ₹{Number(gig.price).toLocaleString("en-IN")}
          </h2>

          <div className="space-y-5 border-t py-5">
            <div>
              <p className="text-sm text-gray-500">Service Provider</p>
              <p className="font-semibold">{worker}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Category</p>
              <p className="font-semibold">{gig.category}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Delivery Time</p>
              <p className="font-semibold">{gig.deliveryTime}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-semibold">{gig.location}</p>
            </div>
          </div>

          {user?.role === "client" && (
            <div className="border-t pt-5">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Additional Message (Optional)
              </label>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={500}
                rows={4}
                placeholder="Tell the worker about your requirements..."
                className="w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

              <button
                type="button"
                onClick={handleBooking}
                disabled={bookingLoading}
                className="mt-4 w-full rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {bookingLoading ? "Sending Request..." : "Book This Gig"}
              </button>
            </div>
          )}

          {!user && (
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
            >
              Login to Book
            </button>
          )}

          {isOwnGig && (
            <p className="rounded-lg bg-gray-100 p-3 text-center text-sm text-gray-600">
              This is your own gig.
            </p>
          )}

          {user?.role === "worker" && !isOwnGig && (
            <p className="rounded-lg bg-gray-100 p-3 text-center text-sm text-gray-600">
              Only clients can book services.
            </p>
          )}

          {bookingNotice && (
            <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
              {bookingNotice}
            </p>
          )}

          {bookingError && (
            <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {bookingError}
            </p>
          )}
        </aside>
      </main>
    </div>
  );
}

export default GigDetails;