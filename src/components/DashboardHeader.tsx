import { useEffect, useState } from "react";
import type { User } from "../types/DataTypes";
import type { DashboardHeaderProps } from "../types/PropTypes";
import cloud from "../assets/cloud.png";
import Settings from "./Settings";


export function DashboardHeader({ currentUser }: DashboardHeaderProps) {
    const [fallbackName, setFallbackName] = useState<string>("")
    const [settingsView, toggleSettingsView] = useState<boolean>(false)

    const settingsProps = {currentUser: currentUser}

    function handleDisplay(user: User) {
        if (user.name != undefined) {
            setFallbackName(user.name)
        }
    }

    useEffect(() => { if (currentUser) handleDisplay(currentUser) }, [currentUser])

    function handleSettingsToggle() {
        if (settingsView == false){
            toggleSettingsView(true)
        }
        else {
            toggleSettingsView(false)
        }
    }

    return (
        <header className="bg-slate-300 p-3">
            <h1 className="text-2xl font-extrabold text-slate-500">Calend Arrr</h1>
            <div className="flex-row text-left mt-2">
                <p className="text-slate-500">
                    Avast <span className="font-bold">{fallbackName}</span>!
                </p>
                <div className="relative flex justify-end items-center">
                    <img
                        src={cloud}
                        alt="cloud"
                        className="w-1/12 ml-auto mr-10"
                        onClick={() => handleSettingsToggle()}
                    />
                    <span className="absolute mr-10 w-1/12 mt-4 text-center text-xs font-bold text-slate-600 pointer-events-none">
                        Settings
                    </span>
                </div>
                {settingsView && <Settings {...settingsProps}/>}
            </div>
        </header >
    )
}