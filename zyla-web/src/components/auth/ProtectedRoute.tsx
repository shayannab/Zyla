import { useEffect, useState, type FC } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { authAPI } from '../../services/api';

/**
 * ProtectedRoute: Blocks access until auth is confirmed.
 * - Shows a small spinner while verifying token.
 * - Redirects to /login if no/invalid token.
 * - Renders child routes via <Outlet /> when authenticated.
 */
const ProtectedRoute: FC = () => {
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('zyla_token');
    if (!token) {
      setChecking(false);
      setAuthed(false);
      return;
    }
    authAPI
      .verify(token)
      .then(() => {
        setAuthed(true);
      })
      .catch(() => {
        localStorage.removeItem('zyla_token');
        localStorage.removeItem('zyla_user');
        setAuthed(false);
      })
      .finally(() => setChecking(false));
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-dark-300">Checking authentication…</p>
        </div>
      </div>
    );
  }

  if (!authed) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
