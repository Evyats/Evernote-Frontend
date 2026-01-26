import { useAuth } from "../auth/AuthContext"


function AuthenticatedHomePage() {  
  return (
    <div>
      Welcome back! Here is your personalized content.
    </div>
  )
}

function NotAuthenticatedHomePage() {
  return (
    <div>
      Welcome to our site! Please log in or sign up to access more features.
    </div>
  )
}


export default function HomePage() {

  const { isAuthenticated } = useAuth()

  return (
    <div className="p-5">
      This is the homepage.
      { isAuthenticated ? <AuthenticatedHomePage /> : <NotAuthenticatedHomePage /> }
    </div>
  )
}
