import { useState } from 'react'
import { Link } from 'react-router-dom'

function Login() {
  const [role, setRole] = useState('client')
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)

  function handleRoleChange(selectedRole) {
    setRole(selectedRole)
    setMessage(null)
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!email.trim() || !password) {
      setMessage({
        type: 'error',
        text: 'Please enter your email and password.',
      })
      return
    }

    setMessage({
      type: 'info',
      text: `Form validated. Selected role: ${role}. Login is not connected yet; the backend must verify your credentials.`,
    })
  }

  function handleForgotPassword(event) {
    event.preventDefault()
    setMessage({
      type: 'info',
      text: 'Password recovery will be available after we connect the backend.',
    })
  }

  const roleButtonClass = (selectedRole) =>
    `border-2 rounded-xl p-4 text-left transition ${
      role === selectedRole
        ? 'border-indigo-600 bg-indigo-50'
        : 'border-gray-200 hover:border-indigo-300'
    }`

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-violet-100 text-gray-900">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <Link to="/" className="text-2xl font-extrabold tracking-tight text-indigo-700">
            GiG<span className="text-gray-900">Hire</span>
          </Link>

          <div className="flex items-center gap-3 text-sm">
            <span className="hidden sm:inline text-gray-600">
              Don't have an account?
            </span>
            <Link
              to="/register"
              className="px-4 py-2 rounded-lg border border-indigo-200 text-indigo-700 font-semibold hover:bg-indigo-50 transition"
            >
              Sign up
            </Link>
          </div>
        </div>
      </nav>

      {/* Login Section */}
      <main className="min-h-[calc(100vh-81px)] flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white rounded-3xl shadow-2xl shadow-indigo-200/50 overflow-hidden">
          {/* Left Panel */}
          <section className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 text-white">
            <div>
              <span className="inline-block px-4 py-2 rounded-full bg-white/15 text-indigo-50 text-sm font-medium">
                Your next opportunity starts here
              </span>

              <h1 className="text-4xl lg:text-5xl font-bold leading-tight mt-8">
                Work smarter.
                <br />
                Connect better.
                <br />
                <span className="text-indigo-200">Grow together.</span>
              </h1>

              <p className="text-indigo-100 mt-6 leading-7">
                Find trusted workers for your projects or discover opportunities to turn your skills into meaningful work.
              </p>
            </div>

            <div className="mt-12 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center text-xl">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold">One platform, two possibilities</h3>
                  <p className="text-sm text-indigo-200">
                    Hire talent or offer your services.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center text-xl">
                  ↗
                </div>
                <div>
                  <h3 className="font-semibold">Opportunities that fit you</h3>
                  <p className="text-sm text-indigo-200">
                    Connect with people who need your skills.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-indigo-200 mt-12">
              GiGHire — Connect. Create. Grow.
            </p>
          </section>

          {/* Right Panel */}
          <section className="p-7 sm:p-10 lg:p-12">
            <div className="max-w-md mx-auto">
              <Link
                to="/"
                className="text-sm text-indigo-600 font-medium hover:text-indigo-800"
              >
                ← Back to home
              </Link>

              <div className="mt-8 mb-8">
                <p className="text-sm font-semibold text-indigo-600 mb-3">
                  WELCOME BACK
                </p>
                <h2 className="text-3xl font-bold tracking-tight">
                  Sign in to GiGHire
                </h2>
                <p className="text-gray-500 mt-3 leading-6">
                  Enter your details to access your account.
                </p>
              </div>

              {/* Role Selector */}
              <div className="mb-7">
                <label className="block text-sm font-semibold mb-3">
                  I want to continue as
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className={roleButtonClass('client')}
                    aria-pressed={role === 'client'}
                    onClick={() => handleRoleChange('client')}
                  >
                    <span className="text-2xl">👤</span>
                    <span className="block font-semibold mt-2">Client</span>
                    <span className="block text-xs text-gray-500 mt-1">
                      Hire workers
                    </span>
                  </button>

                  <button
                    type="button"
                    className={roleButtonClass('worker')}
                    aria-pressed={role === 'worker'}
                    onClick={() => handleRoleChange('worker')}
                  >
                    <span className="text-2xl">🛠️</span>
                    <span className="block font-semibold mt-2">Worker</span>
                    <span className="block text-xs text-gray-500 mt-1">
                      Find work
                    </span>
                  </button>
                </div>
              </div>

              {/* Login Form */}
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="password" className="block text-sm font-semibold">
                      Password
                    </label>
                    <a
                      href="#forgot-password"
                      onClick={handleForgotPassword}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                    >
                      Forgot password?
                    </a>
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="w-full px-4 py-3.5 pr-20 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                {message && (
                  <div
                    role="status"
                    aria-live="polite"
                    className={`rounded-xl p-3 text-sm ${
                      message.type === 'error'
                        ? 'bg-red-50 text-red-700'
                        : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {message.text}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.99] transition"
                >
                  Sign in
                </button>
              </form>

              <div className="flex items-center gap-4 my-7">
                <div className="flex-1 border-t border-gray-200" />
                <span className="text-xs text-gray-400">NEW TO GIGHIRE?</span>
                <div className="flex-1 border-t border-gray-200" />
              </div>

              <Link
                to="/register"
                className="block w-full text-center py-3.5 rounded-xl border border-indigo-200 text-indigo-700 font-semibold hover:bg-indigo-50 transition"
              >
                Create an account
              </Link>

              <p className="text-xs text-center text-gray-400 leading-5 mt-7">
                By continuing, you agree to GiGHire's{' '}
                <a href="#terms" className="underline hover:text-indigo-600">
                  Terms
                </a>{' '}
                and{' '}
                <a href="#privacy" className="underline hover:text-indigo-600">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default Login
