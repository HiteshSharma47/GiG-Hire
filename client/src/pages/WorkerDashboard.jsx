import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '/context/AuthContext'

const initialGigs = [
  {
    id: 1,
    title: 'Website Development',
    category: 'Programming & Tech',
    price: 2500,
    status: 'Active',
  },
  {
    id: 2,
    title: 'Logo Design',
    category: 'Graphics & Design',
    price: 800,
    status: 'Active',
  },
]

const initialOrders = [
  {
    id: 101,
    gig: 'Website Development',
    customer: 'Rahul Sharma',
    amount: 2500,
    status: 'In Progress',
  },
  {
    id: 102,
    gig: 'Logo Design',
    customer: 'Priya Singh',
    amount: 800,
    status: 'Pending',
  },
]

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
  )
}

function WorkerDashboard() {
  const navigate = useNavigate()

  const [gigs, setGigs] = useState(initialGigs)
  const [orders] = useState(initialOrders)

  // Temporary Data(Later will get replaced by Backend).
  const name = 'Hitesh'

  const activeGigs = gigs.filter(
    (gig) => gig.status === 'Active'
  ).length

  const earnings = orders
    .filter((order) => order.status === 'Completed')
    .reduce((total, order) => total + order.amount, 0)

  function handleDeleteGig(id) {
    const confirmed = window.confirm(
      'Are you sure you want to remove this gig?'
    )

    if (confirmed) {
      setGigs((currentGigs) =>
        currentGigs.filter((gig) => gig.id !== id)
      )
    }
  }

  const { logout } = useAuth()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 flex-col bg-slate-950 p-6 text-white md:flex">
          <Link to="/" className="text-2xl font-extrabold">
            GiG<span className="text-violet-400">Hire</span>
          </Link>

          <p className="mt-2 text-xs text-slate-400">
            WORKER WORKSPACE
          </p>

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
              📦 Orders
            </a>

            <Link
              to="/"
              className="block rounded-xl px-4 py-3 text-slate-300 hover:bg-slate-800"
            >
              🔎 Browse Marketplace
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

          {/* Header */}
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

            <button
              onClick={() => navigate('/create-gig')}
              className="rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-violet-700"
            >
              + Create New Gig
            </button>
          </header>

          {/* Summary cards */}
          <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <DashboardCard
              title="Total Gigs"
              value={gigs.length}
              description="Your listed services"
              icon="💼"
            />

            <DashboardCard
              title="Active Gigs"
              value={activeGigs}
              description="Currently available"
              icon="🟢"
            />

            <DashboardCard
              title="Total Orders"
              value={orders.length}
              description="Orders received"
              icon="📦"
            />

            <DashboardCard
              title="Completed Earnings"
              value={`₹${earnings.toLocaleString('en-IN')}`}
              description="From completed orders"
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
                onClick={() => navigate('/create-gig')}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-100"
              >
                + Add Gig
              </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              {gigs.length === 0 ? (
                <div className="p-10 text-center">
                  <p className="text-4xl">💼</p>
                  <h3 className="mt-3 font-semibold">
                    No gigs yet
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Create your first gig to start offering services.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {gigs.map((gig) => (
                    <div
                      key={gig.id}
                      className="flex flex-wrap items-center justify-between gap-4 p-5"
                    >
                      <div className="min-w-0">
                        <h3 className="font-semibold">
                          {gig.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {gig.category}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold">
                            ₹{gig.price.toLocaleString('en-IN')}
                          </p>
                          <span className="text-xs font-medium text-green-600">
                            {gig.status}
                          </span>
                        </div>

                        <button
                          onClick={() => handleDeleteGig(gig.id)}
                          className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Recent orders */}
          <section id="recent-orders" className="mt-10">
            <div className="mb-5">
              <h2 className="text-xl font-bold">Recent Orders</h2>
              <p className="mt-1 text-sm text-gray-500">
                Keep track of your customer orders.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="px-5 py-4 font-medium">Gig</th>
                    <th className="px-5 py-4 font-medium">Customer</th>
                    <th className="px-5 py-4 font-medium">Amount</th>
                    <th className="px-5 py-4 font-medium">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-5 py-4 font-medium">
                        {order.gig}
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {order.customer}
                      </td>
                      <td className="px-5 py-4 font-semibold">
                        ₹{order.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {orders.length === 0 && (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-5 py-10 text-center text-gray-500"
                      >
                        No orders received yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <footer className="mt-10 border-t border-gray-200 pt-5 text-sm text-gray-500">
            © {new Date().getFullYear()} GiGHire. Built for freelancers.
          </footer>
        </main>
      </div>
    </div>
  )
}

export default WorkerDashboard
