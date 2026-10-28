import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

const categories = [
  { icon: "🏠", name: "Household Works", count: "850+ services" },
  { icon: "🔧", name: "Repairing / Fixing", count: "720+ services" },
  { icon: "🚿", name: "Plumbing", count: "530+ services" },
  { icon: "🎪", name: "Event Volunteering", count: "410+ services" },
  { icon: "💝", name: "Charity Events", count: "340+ services" },
  { icon: "💻", name: "Programming", count: "1,200+ services" },
  { icon: "🎨", name: "Design", count: "950+ services" },
  { icon: "🎥", name: "Video & Animation", count: "620+ services" },
];

const demoGigs = [
  {
    icon: "🏠",
    iconStyle: "bg-amber-100",
    seller: "Ramesh Yadav",
    title: "I will do household cleaning and organizing work",
    rating: "4.8",
    reviews: 95,
    price: "₹400",
    category: "Household Works",
  },
  {
    icon: "🔧",
    iconStyle: "bg-red-100",
    seller: "Sunil Verma",
    title: "I will fix and repair your appliances at home",
    rating: "4.9",
    reviews: 112,
    price: "₹500",
    category: "Repairing / Fixing",
  },
  {
    icon: "🚿",
    iconStyle: "bg-blue-100",
    seller: "Manoj Sharma",
    title: "I will handle all plumbing and pipe fitting work",
    rating: "5.0",
    reviews: 78,
    price: "₹600",
    category: "Plumbing",
  },
  {
    icon: "🎪",
    iconStyle: "bg-purple-100",
    seller: "Priya Gupta",
    title: "I will volunteer and manage your events",
    rating: "4.7",
    reviews: 64,
    price: "₹300",
    category: "Event Volunteering",
  },
  {
    icon: "💝",
    iconStyle: "bg-pink-100",
    seller: "Anjali Singh",
    title: "I will organize and coordinate charity events",
    rating: "4.9",
    reviews: 53,
    price: "₹350",
    category: "Charity Events",
  },
  {
    icon: "👨‍💻",
    iconStyle: "bg-blue-100",
    seller: "Hussain",
    title: "I will build a modern responsive website",
    rating: "4.9",
    reviews: 124,
    price: "₹1000",
    category: "Programming",
  },
  {
    icon: "🎨",
    iconStyle: "bg-purple-100",
    seller: "Hanuman Choudhary",
    title: "I will design a professional modern logo",
    rating: "5.0",
    reviews: 89,
    price: "₹500",
    category: "Design",
  },
  {
    icon: "🎬",
    iconStyle: "bg-orange-100",
    seller: "Hitesh Sharma",
    title: "I will edit professional videos for you",
    rating: "4.9",
    reviews: 103,
    price: "₹1,200",
    category: "Video & Animation",
  },
];

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const categoryStyles = {
  "Household Works": { icon: "🏠", iconStyle: "bg-amber-100" },
  "Repairing / Fixing": { icon: "🔧", iconStyle: "bg-red-100" },
  Plumbing: { icon: "🚿", iconStyle: "bg-blue-100" },
  "Event Volunteering": { icon: "🎪", iconStyle: "bg-purple-100" },
  "Charity Events": { icon: "💝", iconStyle: "bg-pink-100" },
  Programming: { icon: "👨‍💻", iconStyle: "bg-blue-100" },
  Design: { icon: "🎨", iconStyle: "bg-purple-100" },
  "Video & Animation": { icon: "🎬", iconStyle: "bg-orange-100" },
};

function formatPrice(price) {
  if (typeof price === "string" && price.includes("₹")) return price;
  const amount = Number(price);
  return Number.isFinite(amount)
    ? `₹${amount.toLocaleString("en-IN")}`
    : "Price on request";
}

function normalizeGig(gig) {
  const category = gig.category || "Other";
  const style = categoryStyles[category] || {
    icon: "💼",
    iconStyle: "bg-indigo-100",
  };
  const worker = gig.worker || gig.seller || {};
  return {
    ...gig,
    id: gig._id || gig.id || gig.title,
    title: gig.title || "Untitled gig",
    category,
    seller:
      typeof worker === "string"
        ? worker
        : worker.name || gig.workerName || "GiGHire Worker",
    price: formatPrice(gig.price),
    icon: style.icon,
    iconStyle: style.iconStyle,
    rating: gig.rating ?? "New",
    reviews: gig.reviewCount ?? gig.reviews ?? 0,
  };
}

function Home() {
  const [search, setSearch] = useState("");
  const [gigs, setGigs] = useState(demoGigs.map(normalizeGig));
  const [isLoadingGigs, setIsLoadingGigs] = useState(true);
  const [usingDemoGigs, setUsingDemoGigs] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    async function loadGigs() {
      try {
        const response = await fetch(`${API_URL}/api/gigs`);
        if (!response.ok) {
          throw new Error("The gigs API is not available yet.");
        }

        const data = await response.json();
        const apiGigs = Array.isArray(data) ? data : data.gigs;

        if (!Array.isArray(apiGigs)) {
          throw new Error("Unexpected response from the gigs API.");
        }

        if (isMounted) {
          setGigs(apiGigs.map(normalizeGig));
          setUsingDemoGigs(false);
        }
      } catch {
        // Keep the sample cards visible until the backend endpoint is ready.
        if (isMounted) {
          setGigs(demoGigs.map(normalizeGig));
          setUsingDemoGigs(true);
        }
      } finally {
        if (isMounted) setIsLoadingGigs(false);
      }
    }

    loadGigs();
    return () => {
      isMounted = false;
    };
  }, []);

  function handleDashboard() {
    if (user?.role === "worker") {
      navigate("/worker-dashboard");
    } else if (user?.role === "client") {
      navigate("/client-dashboard");
    }
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  const filteredGigs = gigs.filter((gig) => {
    const query = search.trim().toLowerCase();
    return (
      gig.title.toLowerCase().includes(query) ||
      gig.category.toLowerCase().includes(query) ||
      gig.seller.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-violet-100 text-gray-900">
      {/* Navbar */}
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            to="/"
            className="text-2xl font-extrabold tracking-tight text-indigo-700"
          >
            GiG<span className="text-gray-900">Hire</span>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-medium md:flex">
            <a href="#featured-gigs" className="hover:text-blue-600">
              Explore
            </a>
            <a href="#categories" className="hover:text-blue-600">
              Categories
            </a>
            <a href="#how-it-works" className="hover:text-blue-600">
              How It Works
            </a>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">
                    {user.name}
                  </p>
                  <p className="text-xs capitalize text-gray-500">
                    {user.role}
                  </p>
                </div>

                <Button
                  onClick={handleDashboard}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Dashboard
                </Button>

                <Button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium hover:text-blue-600"
                >
                  Login
                </Link>

                <Link to="/register">
                  <Button className="bg-blue-600 px-5 py-2.5 text-sm font-medium hover:bg-blue-700">
                    Join GiGHire
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section>
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-6 inline-block rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600">
              Connect. Create. Grow.
            </span>

            <h1 className="mb-6 text-5xl leading-tight font-bold md:text-6xl">
              Find the right talent
              <span className="text-blue-600"> for your next project.</span>
            </h1>

            <p className="mb-10 text-lg leading-relaxed text-gray-600">
              Hire skilled workers for household help, repairs, plumbing, event
              volunteering, charity work and everything in between.
            </p>

            <form
              className="mx-auto flex max-w-2xl rounded-xl border bg-white p-2 shadow-lg"
              onSubmit={(event) => {
                event.preventDefault();
                document
                  .getElementById("featured-gigs")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="What service are you looking for?"
                className="min-w-0 flex-1 px-4 py-3 text-gray-700 outline-none"
              />
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-7 py-3 font-medium text-white hover:bg-blue-700"
              >
                Search
              </button>
            </form>

            <div className="mt-6 text-sm text-gray-500">
              Popular:
              <button
                type="button"
                onClick={() => setSearch("Household Works")}
                className="ml-2 text-gray-700 hover:text-blue-600"
              >
                Household Help
              </button>
              <button
                type="button"
                onClick={() => setSearch("Plumbing")}
                className="ml-4 text-gray-700 hover:text-blue-600"
              >
                Plumbing
              </button>
              <button
                type="button"
                onClick={() => setSearch("Repairing")}
                className="ml-4 text-gray-700 hover:text-blue-600"
              >
                Repairs
              </button>
              <button
                type="button"
                onClick={() => setSearch("Event Volunteering")}
                className="ml-4 text-gray-700 hover:text-blue-600"
              >
                Event Volunteering
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section id="categories" className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="mb-2 font-medium text-blue-600">Explore</p>
              <h2 className="text-3xl font-bold">Popular Categories</h2>
            </div>
            <a
              href="#featured-gigs"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              View all
            </a>
          </div>

          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {categories.map((category) => (
              <button
                type="button"
                key={category.name}
                onClick={() => {
                  setSearch(category.name);
                  document
                    .getElementById("featured-gigs")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="cursor-pointer rounded-xl border bg-white p-6 text-left transition hover:shadow-md"
              >
                <div className="mb-4 text-3xl">{category.icon}</div>
                <h3 className="mb-1 font-semibold">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.count}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Gigs */}
      <section id="featured-gigs" className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="mb-2 font-medium text-blue-600">Top Picks</p>
              <h2 className="text-3xl font-bold">Featured Gigs</h2>
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-500">
                {search.trim()
                  ? `${filteredGigs.length} result(s)`
                  : "Explore our services"}
              </span>
              {isLoadingGigs && (
                <p className="mt-1 text-xs text-gray-400">
                  Checking for live gigs...
                </p>
              )}
              {!isLoadingGigs && usingDemoGigs && (
                <p className="mt-1 text-xs text-amber-700">
                  Showing sample gigs until the API is ready
                </p>
              )}
            </div>
          </div>

          {filteredGigs.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {filteredGigs.map((gig) => (
                <article
                  key={gig.id}
                  className="overflow-hidden rounded-xl border bg-white transition hover:shadow-lg"
                >
                  <div className="flex h-44 items-center justify-center bg-gray-200 text-gray-400">
                    Gig Image
                  </div>

                  <div className="p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${gig.iconStyle}`}
                      >
                        {gig.icon}
                      </div>
                      <span className="text-sm font-medium">{gig.seller}</span>
                    </div>

                    <h3 className="mb-3 leading-6 font-semibold">
                      {gig.title}
                    </h3>

                    <div className="mb-4 text-sm">
                      <span className="text-yellow-500">★</span>
                      <span className="font-medium"> {gig.rating}</span>
                      <span className="text-gray-400"> ({gig.reviews})</span>
                    </div>

                    <div className="flex items-center justify-between border-t pt-4">
                      <span className="text-xs text-gray-500">Starting at</span>
                      <span className="text-lg font-bold">{gig.price}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed p-10 text-center">
              <p className="font-semibold">No gigs found</p>
              <p className="mt-2 text-sm text-gray-500">
                Try another service or clear your search.
              </p>
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <p className="mb-2 font-medium text-blue-600">Simple Process</p>
            <h2 className="text-3xl font-bold">How GiGHire Works</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                number: "1",
                title: "Find a Service",
                description:
                  "Browse thousands of services and find the right freelancer for your project.",
              },
              {
                number: "2",
                title: "Place an Order",
                description:
                  "Choose a package, communicate with the freelancer and place your order.",
              },
              {
                number: "3",
                title: "Get Your Work",
                description:
                  "Receive your completed work and leave a review for the freelancer.",
              },
            ].map((step) => (
              <div key={step.number} className="text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600">
                  {step.number}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                <p className="text-sm leading-6 text-gray-500">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center text-white">
          <h2 className="mb-4 text-3xl font-bold">
            Ready to start your next project?
          </h2>
          <p className="mb-8 text-blue-100">
            Find talented freelancers and get your work done.
          </p>
          <a
            href="#featured-gigs"
            className="inline-block rounded-lg bg-white px-7 py-3 font-semibold text-blue-600 hover:bg-gray-100"
          >
            Explore Gigs
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-10 md:grid-cols-4">
            <div>
              <h3 className="mb-4 text-xl font-bold text-white">GiGHire</h3>
              <p className="text-sm leading-6">
                A simple marketplace connecting talented freelancers with people
                and businesses around the world.
              </p>
            </div>

            <div>
              <h4 className="mb-4 font-semibold text-white">Platform</h4>
              <div className="space-y-3 text-sm">
                <a href="#featured-gigs" className="block hover:text-white">
                  Explore Gigs
                </a>
                <a href="#categories" className="block hover:text-white">
                  Categories
                </a>
                <a href="#how-it-works" className="block hover:text-white">
                  How It Works
                </a>
              </div>
            </div>

            <div>
              <h4 className="mb-4 font-semibold text-white">For Freelancers</h4>
              <div className="space-y-3 text-sm">
                <Link to="/register" className="block hover:text-white">
                  Become a Seller
                </Link>
                <Link to="/register" className="block hover:text-white">
                  Create a Gig
                </Link>
                <Link to="/login" className="block hover:text-white">
                  Seller Dashboard
                </Link>
              </div>
            </div>

            <div>
              <h4 className="mb-4 font-semibold text-white">Support</h4>
              <div className="space-y-3 text-sm">
                <a href="#how-it-works" className="block hover:text-white">
                  Help Center
                </a>
                <a
                  href="mailto:support@gighire.example"
                  className="block hover:text-white"
                >
                  Contact Us
                </a>
                <a href="#how-it-works" className="block hover:text-white">
                  Terms &amp; Privacy
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-gray-800 pt-6 text-center text-sm">
            © 2026 GiGHire. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
