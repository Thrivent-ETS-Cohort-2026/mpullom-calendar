import { useEffect, useState } from "react";
import type { User } from "../types/DataTypes";
import type { DashboardHeaderProps } from "../types/PropTypes";

export function DashboardHeader({ currentUser }: DashboardHeaderProps) {
    const [fallbackName, setFallbackName] = useState<string>("")

    function handleDisplay(user: User){
        if (user.name != undefined){
            setFallbackName(user.name)
        }
    }

    useEffect(() => {if (currentUser) handleDisplay(currentUser)}, [currentUser])
    
    return (
        <header className="bg-slate-300 p-3">
            <h1 className="text-2xl font-extrabold text-slate-500">Calend Arrr</h1>
            <div className="text-left mt-2">
                <p className="text-slate-500">
                    Avast <span className="font-bold">{fallbackName}</span>!
                </p>
            </div>

        </header>
    )
}