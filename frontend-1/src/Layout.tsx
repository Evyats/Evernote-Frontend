import { NavLink, Outlet } from 'react-router-dom'



function PageButton({ pageName, pagePath }: { pageName: string, pagePath: string }) {
    return (
        <NavLink to={pagePath} className={({ isActive }) => (isActive ? 'border rounded-full border-slate-950 border-2' : '')}>
            <button key={pagePath} className="rounded-full bg-slate-100 px-5 py-2 text-slate-950 transition hover:bg-white">
                {pageName}
            </button>
        </NavLink>
    )
}


export default function Layout() {
    return (
        <div className="min-h-screen space-y-5 bg-slate-950 text-slate-50">
            <div className="max-w-2xl mx-auto bg-slate-800 p-3 flex flex-row gap-3">
                <PageButton pageName="Home" pagePath="/" />
                <PageButton pageName="Login" pagePath="/sign-in" />
                <PageButton pageName="Register" pagePath="/sign-up" />
            </div>


            <div className="max-w-2xl min-h-20 mx-auto bg-slate-800">
                <Outlet />
            </div>

            <div className="max-w-2xl mx-auto bg-slate-800">
                this is the footer
            </div>
        </div>
    )
}
