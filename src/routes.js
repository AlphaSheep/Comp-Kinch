import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';

const Home = lazy(() => import('./pages/home/Home'));
const About = lazy(() => import('./pages/about/About'));
const Competition = lazy(() => import('./pages/competition/Competition'));

const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/about',
    component: About,
  },
  {
    path: '/competition/:compid',
    component: Competition,
  }
];

const AppRouter = () => {
  return (
    <Router>
      <MainLayout>
        <Suspense fallback={<div className="lazy-loading">Loading...</div>}>
          <Routes>
            {routes.map((route, i) => (
              <Route path={route.path} key={i} element={<route.component />} />
            ))}
          </Routes>
        </Suspense>
      </MainLayout>
    </Router>
  );
};

export default AppRouter;
