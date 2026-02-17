import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';

import DsaTracker from './pages/DsaTracker';
import Interviews from './pages/Interviews';
import Contests from './pages/Contests';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="dsa" element={<DsaTracker />} />
          <Route path="interviews" element={<Interviews />} />
          <Route path="contests" element={<Contests />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
