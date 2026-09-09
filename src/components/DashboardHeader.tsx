import { useEffect, useState } from "react";
import type { User } from "../types/DataTypes";
import type { DashboardHeaderProps } from "../types/PropTypes";
import cloud from "../assets/cloud.png";
import Settings from "./Settings";


export function DashboardHeader({ currentUser }: DashboardHeaderProps) {
    const [fallbackName, setFallbackName] = useState<string>("")
    const [settingsView, toggleSettingsView] = useState<boolean>(false)

    const settingsProps = { currentUser: currentUser }

    function handleDisplay(user: User) {
        if (user.name != undefined) {
            setFallbackName(user.name)
        }
    }

    useEffect(() => { if (currentUser) handleDisplay(currentUser) }, [currentUser])

    function handleSettingsToggle() {
        if (settingsView == false) {
            toggleSettingsView(true)
        }
        else {
            toggleSettingsView(false)
        }
    }

    return (
        <header className="bg-pink-200 p-3">
            <div className="border-4 w-1/6 bg-white flex flex-col text-center">
                <h1 className="text-2xl font-extrabold text-blue-800">Calend Arrr</h1>
                <p className="text-blue-800">
                    Avast <span className="font-bold">{fallbackName}</span>!
                </p>
            </div>

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
            {settingsView && <Settings {...settingsProps} />}
        </header >
    )
}