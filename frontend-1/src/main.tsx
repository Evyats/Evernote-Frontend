import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './Layout.tsx';
import HomePage from './pages/HomePage.tsx';
import SignInPage from './pages/SignInPage.tsx';
import SignUpPage from './pages/SignUpPage.tsx';
import { AuthProvider } from './auth/AuthContext.tsx';
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
      }
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
