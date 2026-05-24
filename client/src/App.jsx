import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PageWrapper from './components/layout/PageWrapper';
import Loader from './components/common/Loader';
import PageLoader from './components/common/PageLoader';

// Lazy loaded Pages
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Expenses = lazy(() => import('./pages/Expenses'));
const Upload = lazy(() => import('./pages/Upload'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Insights = lazy(() => import('./pages/Insights'));
const Categories = lazy(() => import('./pages/Categories'));
const UnknownMerchants = lazy(() => import('./pages/UnknownMerchants'));

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <Loader />;
  if (user) return <Navigate to="/" replace />;
  
  return children;
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route 
          path="/login" 
          element={<PublicRoute><Login /></PublicRoute>} 
        />
        <Route 
          path="/register" 
          element={<PublicRoute><Register /></PublicRoute>} 
        />
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <PageWrapper />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="upload" element={<Upload />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="insights" element={<Insights />} />
          <Route path="categories" element={<Categories />} />
          <Route path="unknown-merchants" element={<UnknownMerchants />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
