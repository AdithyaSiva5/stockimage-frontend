import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/login/login';
import Signup from './pages/signup/signup';
import { AuthContext, AuthProvider } from './auth/AuthContext';
import UploadPage from './pages/upload/UploadPage';
import Gallery from './pages/gallery/Gallery';
const Home = lazy(() => import('./pages/home/home'));
const Profile = lazy(() => import('./pages/profile/profile'));

interface ProtectedRouteProps {
  children: React.ReactNode;
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = React.useContext(AuthContext);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* <Route path="/YourFiles" element={<YourFiles />} /> */}
            {/* <Route path="/profile" element={<Profile />} /> */}
            {/* <Route path="/upload" element={<UploadPage />} /> */}
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/gallery" element={<Gallery />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
};

export default App;
