import { useState } from "react";
import { data } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL


export default function SignUpPage() {

  const [emailInput, setEmailInput] = useState<string>("")
  const [passwordInput, setPasswordInput] = useState<string>("")

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [data, setData] = useState<string | null>(null)



  async function fetchSignUp(email: string, password: string) {
    let backurl: string = `${API_BASE_URL}/api/users`
    const result = await fetch(backurl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    })
    if (!result.ok) {
      throw new Error("Sign Up failed")
    }
    return result.json()
  }


  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setData(null)
    setErrorMessage(null)
    setIsLoading(true)

    try {
      let result = await fetchSignUp(emailInput, passwordInput)
      setData(result)
      console.log(data)
      console.log(data)
    }
    catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unknown error")
      console.log(errorMessage)
    }
    finally {
      setIsLoading(false)
    }

  }




  return (
    <div className="p-5 flex flex-col gap-5">
      <div>
        This is the Sign Up page.
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

        <button className="rounded-full bg-slate-100 px-5 py-2 text-slate-950 transition hover:bg-white">Send</button>

        <div>
          {
            isLoading ? "Loading . . ."
            : errorMessage ? "Error! " + errorMessage
            : data ? "Created successfully! \n" + JSON.stringify(data, null, 2)
            : ""
          }
        </div>

      </form>

    </div>
  )
}
