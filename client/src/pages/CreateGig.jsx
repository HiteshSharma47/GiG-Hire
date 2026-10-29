import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const categories = [
  'Household Works',
  'Repairing / Fixing',
  'Plumbing',
  'Electrical Work',
  'Cleaning',
  'Painting',
  'Gardening',
  'Design & Technology',
  'Other Services',
]

const initialForm = {
  title: '',
  category: '',
  description: '',
  price: '',
  deliveryTime: '1 day',
  location: '',
  imageUrl: '',
}

function CreateGig() {
  const navigate = useNavigate()
  const { user, token } = useAuth()

  const [form, setForm] = useState(initialForm)
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')

    if (!token || !user) {
      navigate('/login')
      return
    }

    if (user.role !== 'worker') {
      setMessage('Only workers can publish gigs.')
      return
    }

    if (Number(form.price) <= 0) {
      setMessage('Please enter a price greater than ₹0.')
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch(`${API_URL}/api/gigs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Could not publish your gig.')
      }

      navigate('/worker-dashboard', {
        state: { message: 'Your gig was published successfully!' },
      })
    } catch (error) {
      setMessage(
        error.message ||
          'Unable to connect to the server. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'

  const labelClass = 'text-sm font-semibold text-gray-700'

  if (user && user.role !== 'worker') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-gray-900">
            Worker access only
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Only worker accounts can create gigs.
          </p>
          <Link
            to="/"
            className="mt-5 inline-block font-semibold text-indigo-600"
          >
            Return to home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link to="/" className="text-2xl font-extrabold text-indigo-600">
            GiGHire
          </Link>

          <Link
            to="/worker-dashboard"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Grow your business
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Create a New Gig
          </h1>
          <p className="mt-3 text-gray-500">
            Tell customers about your service and start getting work.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-7 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8"
        >
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Service Details
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Give your service a clear title and description.
            </p>
          </div>

          <div>
            <label htmlFor="title" className={labelClass}>
              Gig Title *
            </label>
            <input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g. Professional home plumbing service"
              maxLength={100}
              required
            />
          </div>

          <div>
            <label htmlFor="category" className={labelClass}>
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" className={labelClass}>
              Service Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              className={`${inputClass} min-h-36 resize-y`}
              placeholder="Explain what you offer, what is included, and why customers should choose you."
              maxLength={2000}
              required
            />
            <p className="mt-1 text-right text-xs text-gray-400">
              {form.description.length}/2000 characters
            </p>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h2 className="text-lg font-bold text-gray-900">
              Pricing & Availability
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Set your price and service location.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="price" className={labelClass}>
                Price (₹) *
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min="1"
                step="1"
                value={form.price}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. 500"
                required
              />
              <p className="mt-1 text-xs text-gray-400">
                Enter your price in Indian rupees.
              </p>
            </div>

            <div>
              <label htmlFor="deliveryTime" className={labelClass}>
                Estimated Time *
              </label>
              <select
                id="deliveryTime"
                name="deliveryTime"
                value={form.deliveryTime}
                onChange={handleChange}
                className={inputClass}
                required
              >
                <option value="Same day">Same day</option>
                <option value="1 day">1 day</option>
                <option value="2-3 days">2–3 days</option>
                <option value="1 week">1 week</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="location" className={labelClass}>
              Service Location *
            </label>
            <input
              id="location"
              name="location"
              value={form.location}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g. Jaipur, Rajasthan"
              maxLength={100}
              required
            />
          </div>

          <div>
            <label htmlFor="imageUrl" className={labelClass}>
              Service Image URL
              <span className="font-normal text-gray-400"> (Optional)</span>
            </label>
            <input
              id="imageUrl"
              name="imageUrl"
              type="url"
              value={form.imageUrl}
              onChange={handleChange}
              className={inputClass}
              placeholder="https://example.com/your-service.jpg"
            />
            <p className="mt-1 text-xs text-gray-400">
              You can add image uploads later.
            </p>
          </div>

          {message && (
            <div
              role="alert"
              className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {message}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
            <Link
              to="/worker-dashboard"
              className="rounded-xl border border-gray-200 px-6 py-3 text-center text-sm font-semibold text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-indigo-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Publishing...' : 'Publish Gig →'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default CreateGig