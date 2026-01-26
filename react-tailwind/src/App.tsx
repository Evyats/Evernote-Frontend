import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto bg-slate-900 flex max-w-3xl flex-col gap-6 px-6 py-16">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
            Vite + React + Tailwind
          </p>
          <h1 className="text-4xl font-semibold sm:text-5xl">
            Ready to build.
          </h1>
          <p className="text-slate-300">
            This project is wired for TypeScript and Tailwind CSS.
          </p>
        </header>
        <section className="flex items-center gap-4">
          <button
            className="rounded-full bg-slate-100 px-5 py-2 text-slate-950 transition hover:bg-white"
            onClick={() => setCount((current) => current + 1)}
          >
            Count is {count}
          </button>
          <span className="text-sm text-slate-400">
            Edit <code className="text-slate-200">src/App.tsx</code> and save.
          </span>
        </section>
      </div>
    </main>
  )
}

export default App

