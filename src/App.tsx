import '@/index.css';
import { Router } from '../routes';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import { createHashRouter, RouterProvider, RouteObject } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';
import { SearchProvider } from '@/Context/SearchContext';
import { AuthProvider } from '@/Context/AuthContext';
import { SystemsProvider } from '@/Context/SystemsContext';
import { queryClient } from './lib/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import ResultsPage from '@/pages/app/ResultsPage';

const newRoutes: RouteObject[] = [    
  { path: "/pesquisaintegrada/results", element: <ResultsPage /> },
];

// Flags de futuro do React Router v7 (evita warnings e prepara migração)
const futureFlags = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
  v7_fetcherPersist: true,
  v7_normalizeFormMethod: true,
  v7_partialHydration: true,
  v7_skipActionErrorRevalidation: true,
};

// Combinando as rotas do Router com as novas rotas
const combinedRouter = createHashRouter(
  [
    ...Router.routes,
    ...newRoutes,
  ],
  { future: futureFlags }
);

export const App = () => (
  <HelmetProvider>
    <Helmet titleTemplate="Sistemas | %s" />
    <Toaster richColors position="top-right" />
    <ToastContainer />
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SystemsProvider>
          <SearchProvider>
            <RouterProvider router={combinedRouter} />
          </SearchProvider>
        </SystemsProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);