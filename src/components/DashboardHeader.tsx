import type { DashboardHeaderProps } from "../types/PropTypes";

export function DashboardHeader({ currentUser }: DashboardHeaderProps) {
    function displayName(userEmail: string) {
        return userEmail.split('@')[0]
    }
    return (
        <header className="bg-slate-300 p-3">
            <h1 className="text-2xl font-extrabold text-slate-500">Calend Arrr</h1>
            <div className="text-left mt-2">
                <p className="text-slate-500">
                    Avast <span className="font-bold">{displayName(currentUser.email)}!</span>!
                </p>
            </div>

        </header>
    )
}