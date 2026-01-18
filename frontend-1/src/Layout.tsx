import { Outlet } from 'react-router-dom'

export default function Layout() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-50">
            <div className="max-w-2xl min-h-20 mx-auto bg-slate-800">
                <Outlet />
            </div>
        </div>
    )
}
