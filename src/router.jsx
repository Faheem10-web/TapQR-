import React from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import ProfileView from './pages/ProfileView';
import NotFound from './pages/NotFound';
import ErrorBoundary from './pages/ErrorBoundary';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Outlet />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'p/:profileId',
        element: <ProfileView />,
      },
      {
        path: 'profile/:profileId',
        element: <ProfileView />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
