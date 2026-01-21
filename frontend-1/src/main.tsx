import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import Layout from './Layout.tsx';
import HomePage from './pages/HomePage.tsx';
import SignInPage from './pages/SignInPage.tsx';
import SignUpPage from './pages/SignUpPage.tsx';
import NotesPage from './pages/NotesPage.tsx';
import { AuthProvider, useAuth } from './auth/AuthContext.tsx';



function Protected({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/sign-in" replace />;
}


const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />
      },
      {
        path: "/sign-in",
        element: <SignInPage />
      },
      {
        path: "/sign-up",
        element: <SignUpPage />
      },
      {
        path: "/notes",
        element: (
          <Protected>
            <NotesPage />
          </Protected>
        )
      },
    ]
  }
])


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <App /> */}
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
)
