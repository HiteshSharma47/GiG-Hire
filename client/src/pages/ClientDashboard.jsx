import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";

function ClientDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-violet-100">
      <nav className="flex items-center justify-between border-b bg-white px-8 py-5">
        <Link to="/" className="text-2xl font-extrabold text-indigo-700">
          GiG<span className="text-gray-900">Hire</span>
        </Link>

        <Button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700"
        >
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

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-gray-500">Total Bookings</p>
            <h2 className="mt-3 text-3xl font-bold">0</h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-gray-500">Active Bookings</p>
            <h2 className="mt-3 text-3xl font-bold">0</h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-gray-500">Completed Bookings</p>
            <h2 className="mt-3 text-3xl font-bold">0</h2>
          </div>
        </div>

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

        <div className="mt-8 rounded-xl bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold">My Bookings</h2>
          <p className="mt-4 text-gray-500">
            You haven't placed any bookings yet.
          </p>
        </div>
      </main>
    </div>
  );
}

export default ClientDashboard;
