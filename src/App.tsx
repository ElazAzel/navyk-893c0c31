import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {/**
           * Use data router and opt-in to React Router future flags to silence
           * warnings and prepare for v7 behavior. The `future` option below
           * enables startTransition wrapping and relative splat path changes.
           */}
          <RouterProvider
            router={createBrowserRouter(
              [
                { path: "/auth", element: <Auth /> },
                {
                  path: "/",
                  element: (
                    <ProtectedRoute>
                      <Index />
                    </ProtectedRoute>
                  ),
                },
                { path: "*", element: <NotFound /> },
              ] as any,
              ({
                future: {
                  // opt-in to v7 behaviors (TypeScript types may lag; cast to any)
                  v7_startTransition: true,
                  v7_relativeSplatPath: true,
                },
              } as any)
            )}
          />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
