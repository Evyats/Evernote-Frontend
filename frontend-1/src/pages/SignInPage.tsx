import { useState } from "react"


export default function SignInPage() {

  const [emailInput, setEmailInput] = useState<string>("")
  const [passwordInput, setPasswordInput] = useState<string>("")
  const [healthData, setHealthData] = useState<{ status: string } | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)



  const fetchHealth = async () => {
    const result = await fetch("http://localhost:8123/health")
    if (!result.ok) {
      throw new Error("Backend is not reachable")
    }
    return result.json() as Promise<{ status: string }>
  }


  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true)
    setErrorMessage(null)
    try {
      const data = await fetchHealth()
      setHealthData(data)
      console.log(data)
    } catch (error) {
      setHealthData(null)
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

      {errorMessage && <div className="text-red-600">{errorMessage}</div>}
      {healthData && <div className="text-green-700">Health: {healthData.status}</div>}

    </div>
  )
}
