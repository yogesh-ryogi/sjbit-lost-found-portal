import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Browse from './pages/Browse';
import ItemDetail from './pages/ItemDetail';
import Report from './pages/Report';
import Claims from './pages/Claims';
import Notifications from './pages/Notifications';
import Admin from './pages/Admin';
import Reports from './pages/Reports';
import Login from './pages/Login';

function Private({ children, admin }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="wrap muted">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (admin && user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="browse" element={<Browse />} />
        <Route path="items/:id" element={<ItemDetail />} />
        <Route
          path="report"
          element={
            <Private>
              <Report />
            </Private>
          }
        />
        <Route
          path="claims"
          element={
            <Private>
              <Claims />
            </Private>
          }
        />
        <Route
          path="notifications"
          element={
            <Private>
              <Notifications />
            </Private>
          }
        />
        <Route
          path="admin"
          element={
            <Private admin>
              <Admin />
            </Private>
          }
        />
        <Route
          path="reports"
          element={
            <Private admin>
              <Reports />
            </Private>
          }
        />
        <Route path="login" element={<Login />} />
      </Route>
    </Routes>
  );
}
