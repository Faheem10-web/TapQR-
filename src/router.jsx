import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import ProfileView from './pages/ProfileView';
import NotFound from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/p/:profileId',
    element: <ProfileView />,
  },
  {
    path: '/profile/:profileId',
    element: <ProfileView />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
