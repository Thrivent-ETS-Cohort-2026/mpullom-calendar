import { UserEvents } from "./UserEvents";
import { DashboardHeader } from "./DashboardHeader";
import type { DashboardHeaderProps, DashboardProps, UserEventsProps } from "../types/PropTypes";
// import type { DashboardProps, NoteEditorProps } from "../types/PropTypes";
// import Editor from "./Editor";
import { useState } from "react";
import merry from "../assets/merry.png";


export default function Dashboard({ currentUser, callbackAssignEvent}: DashboardProps) {
    const userEventsProps: UserEventsProps = {
        currentUser: currentUser,
        callbackAssignEvent: callbackAssignEvent
    }

    const dashboardHeaderProps: DashboardHeaderProps = {
        currentUser: currentUser
    }

    return (
        <main className="flex flex-col h-screen w-full bg-slate-300 overflow-hidden">
            <DashboardHeader {...dashboardHeaderProps} />

            <section className="flex justify-center mt-auto px-4 min-h-0">
                <div className="w-1/2 max-h-64 bg-[#c9ab9a] text-center rounded-xl p-4 overflow-y-auto shadow-md">
                    <UserEvents {...userEventsProps} />
                </div>
                {/* <div className="w-1/2 border-2 rounded-3xl m-4 p-4"> */}
                {/* <EditorEvents {...EditorProps} /> */}
                {/* </div> */}
            </section>

            <div className="flex justify-center items-end w-full shrink-0 py-2">
                <img
                    src={merry}
                    alt="Luffy's ship"
                    className="h-50 w-auto object-contain"
                />
            </div>
        </main>
    )
}