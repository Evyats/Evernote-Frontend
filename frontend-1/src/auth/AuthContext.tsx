import { createContext, useContext, useState } from "react"

const AuthContext = createContext<{
  token: string | null
  isAuthenticated: boolean
  setToken: (token: string | null) => void
  clearAuth: () => void
} | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null)

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: Boolean(token),
        setToken: setTokenState,
        clearAuth: () => setTokenState(null)
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
