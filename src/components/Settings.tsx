import { useState } from "react"
import type { User } from "../types/DataTypes"
import type { SettingsProps } from "../types/PropTypes"

export default function Settings({currentUser: currentUser} : SettingsProps) {
    const [nameState, setNameState] = useState<string>("")
    const [emailState, setEmailState] = useState<string>("")
    const [passwordState, setPasswordState] = useState<string>("")

    async function updateUser() {
        try {
            const newInfo: User = {
                name: nameState,
                email: emailState,
                password: passwordState,
                eventList: currentUser.eventList,
                iRequests: currentUser.iRequests,
                id: currentUser.id
            }


            const response = await fetch(`http://localhost:3002/users/${currentUser.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newInfo)
            });
            if (!response.ok) throw new Error("Post request failed.");
        } catch (error: any) {
            throw new Error(error);
        }
    }

    async function handleProfileChange() {
        await updateUser()
    }

    return (
        <div className="border-4 border-gray-400 rounded bg-white">
            <h1>Profile Settings</h1>
            <div className="flex-row">
                <h3>Name</h3>
                <input
                    type="text"
                    value={nameState}
                    onChange={(e) => setNameState(e.target.value)}
                    className="w-full border rounded-2xl p-3 bg-slate-200 h-12" />
            </div>
            <div className="flex-row">
                <h3>Email</h3>
                <input
                    type="text"
                    value={emailState}
                    onChange={(e) => setEmailState(e.target.value)}
                    className="w-full border rounded-2xl p-3 bg-slate-200 h-12" />
            </div>
            <div className="flex-row">
                <h3>Password</h3>
                <input
                    type="text"
                    value={passwordState}
                    onChange={(e) => setPasswordState(e.target.value)}
                    className="w-full border rounded-2xl p-3 bg-slate-200 h-12" />
            </div>
            <button
                className="mx-2 border-2 rounded bg-sky-300 hover:bg-sky-500 active:bg-sky-600"
                onClick={handleProfileChange}
            >
                Save Changes
            </button>
        </div>
    )
}