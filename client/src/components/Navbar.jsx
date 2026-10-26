
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-4">
      <Link to="/" className="text-2xl font-bold text-indigo-700">
        GiG<span className="text-violet-600">Hire</span>
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/" className="text-gray-700 hover:text-indigo-600">
          Home
        </Link>

        <Link to="/login" className="text-gray-700 hover:text-indigo-600">
          Login
        </Link>

        <Link
          to="/register"
          className="rounded-lg bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700"
        >
          Join Now
        </Link>
      </div>
    </nav>
  );
}