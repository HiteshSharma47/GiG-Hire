import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav className="flex items-center justify-between px-8 py-4">
      <Link to="/" className="text-2xl font-bold text-indigo-700">
        GiG<span className="text-violet-600">Hire</span>
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/" className="text-gray-700 hover:text-indigo-600">
          Home
        </Link>

        {user ? (
          <>
            <div className="text-right">
              <p className="font-semibold text-gray-800">{user.name}</p>
              <p className="text-xs capitalize text-gray-500">{user.role}</p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-gray-700 hover:text-indigo-600"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-lg bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700"
            >
              Join Now
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}