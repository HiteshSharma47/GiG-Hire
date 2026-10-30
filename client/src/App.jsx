import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import WorkerDashboard from "./pages/WorkerDashboard";
import CreateGig from "./pages/CreateGig";
import ProtectedRoute from "./components/ProtectedRoute";
import GigDetails from "./pages/GigDetails";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/gig/:id" element={<GigDetails />} />
          <Route element={<ProtectedRoute allowedRole="worker" />}>
            <Route path="/worker-dashboard" element={<WorkerDashboard />} />
            <Route path="/create-gig" element={<CreateGig />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
