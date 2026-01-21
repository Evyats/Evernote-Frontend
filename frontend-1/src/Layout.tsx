import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from './auth/AuthContext'




function PageButton({ pageName, pagePath }: { pageName: string, pagePath: string }) {
    return (
        <NavLink to={pagePath} className={({ isActive }) => (isActive ? 'border rounded-full border-slate-950 border-2' : '')}>
            <button key={pagePath} className="rounded-full bg-slate-100 px-5 py-2 text-slate-950 transition hover:bg-white">
                {pageName}
            </button>
        </NavLink>
    )
}

function HealthButton() {

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

    async function handleSubmit() {
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
        <div>
            <button
                className="rounded-full bg-slate-100 px-5 py-2 text-slate-950 transition hover:bg-white"
                onClick={handleSubmit}
                disabled={isLoading}
            >
                {
                    isLoading ? "Loading..."
                        : errorMessage ? errorMessage
                            : healthData ? `Health: ${healthData.status}`
                                : "Check Health"
                }
            </button>
        </div>
    )
}



function UserStatus() {
    const { token, isAuthenticated, clearAuth } = useAuth()
    type userData = {
        id: string
        email: string
    }
    const [userData, setUserData] = useState<null | userData>(null)
    const [isChecking, setIsChecking] = useState<boolean>(false)

    useEffect(() => {
        if (isAuthenticated) {
            fetchUserInfo()
        }
        else {
            clearAuth()
            setUserData(null)
            setIsChecking(false)
        }
    }, [isAuthenticated])

    async function fetchUserInfo() {
        const baseUrl = "http://localhost:8123/auth/me"
        setIsChecking(true)
        try {
            const result = await fetch(
                baseUrl,
                { headers: { "authorization": `Bearer ${token}` } }
            )
            if (!result.ok) {
                throw new Error(`Failed to fetch user info (status ${result.status})`)
            }
            const resultJson = await result.json()
            setUserData({
                id: resultJson.user.id,
                email: resultJson.user.email
            })
        }
        catch (error) {
            console.log("something went wrong")
        }
        finally {
            setIsChecking(false)
        }
        console.log(userData)
    }

    return (
        <div className="border rounded-full p-2 text-sm text-center whitespace-pre-line">
            {
                isChecking ? "Checking\nauthentication . . ."
                : userData ? `Welcome back\n${userData.email} !!!`
                : "Please\nlogin / register"
            }
        </div>
    )
}



export default function Layout() {
    return (
        <div className="min-h-screen space-y-5 bg-slate-950 text-slate-50">
            <div className="max-w-3xl mx-auto bg-slate-800 p-3 flex flex-row gap-3 items-center">
                <PageButton pageName="Home" pagePath="/" />
                <PageButton pageName="Login" pagePath="/sign-in" />
                <PageButton pageName="Register" pagePath="/sign-up" />
                <div className="m-auto"></div>
                <UserStatus />
                <HealthButton />
            </div>

            <div className="max-w-2xl min-h-20 mx-auto bg-slate-800">
                <Outlet />
            </div>

            <div className="max-w-3xl mx-auto bg-slate-800">
                this is the footer
            </div>
        </div>
    )
}
