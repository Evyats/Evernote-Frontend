import { createContext, useContext, useState } from "react"

const AuthContext = createContext<{
  token: string | null
  userId: string | null
  isAuthenticated: boolean
  setToken: (token: string | null) => void
  setUserId: (userId: string | null) => void
  clearAuth: () => void
} | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  return (
    <AuthContext.Provider
      value={{
        token,
        userId,
        isAuthenticated: Boolean(token),
        setToken: setTokenState,
        setUserId: setUserId,
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
