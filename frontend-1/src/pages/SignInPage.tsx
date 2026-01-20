import { useState } from "react"


export default function SignInPage() {

  const [emailInput, setEmailInput] = useState<string>("")
  const [passwordInput, setPasswordInput] = useState<string>("")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
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

        <button className="rounded-full bg-slate-100 px-5 py-2 text-slate-950 transition hover:bg-white">Send</button>
      </form>

    </div>
  )
}
