
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-gray-200 bg-white px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <Link to="/" className="text-xl font-bold text-indigo-700">
          GiG<span className="text-violet-600">Hire</span>
        </Link>

        <p className="text-center text-sm text-gray-500">
          Connect. Create. Grow.
        </p>

        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} GiGHire. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
