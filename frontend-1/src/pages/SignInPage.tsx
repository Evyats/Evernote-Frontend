import { useState } from "react"
import { useAuth } from "../auth/AuthContext"

const API_BASE_URL = import.meta.env.VITE_API_URL_1

export default function SignInPage() {

  const [emailInput, setEmailInput] = useState<string>("")
  const [passwordInput, setPasswordInput] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const { setToken } = useAuth()

  async function fetchSignIn(email: string, password: string) {
    const result = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    })
    if (!result.ok) {
      const errorBody = await result.text()
      console.log(result, errorBody)
      throw new Error(`Sign in failed: ${errorBody || result.statusText}`)
    }
    return result.json() as Promise<{ access_token: string; token_type: string }>
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)
    try {
      const data = await fetchSignIn(emailInput, passwordInput)
      setToken(data.access_token)
      setSuccessMessage("Signed in")
    } catch (error) {
      setToken(null)
      setErrorMessage(error instanceof Error ? error.message : "Unknown error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-5 flex flex-col gap-5">
      <div>
        This is the Sign In page.
      </div>

      <form className="grid grid-cols-3 gap-4" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-1">
          <span>Email</span>
          <input className="border p-2 text-slate-950 rounded" onChange={(e) => setEmailInput(e.target.value)} />
        </label>

        <label className="flex flex-col gap-1">
          <span>Password</span>
          <input className="border p-2 text-slate-950 rounded" type="password" onChange={(e) => setPasswordInput(e.target.value)} />
        </label>

        <button className="rounded-full bg-slate-100 px-5 py-2 text-slate-950 transition hover:bg-white" disabled={isLoading}>
          {isLoading ? "Loading..." : "Send"}
        </button>
      </form>
      
      {errorMessage && <div className="text-red-600">Error: {errorMessage}</div>}
      {successMessage && <div className="text-green-700">{successMessage}</div>}

    </div>
  )
}
