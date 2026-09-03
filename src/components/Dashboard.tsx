import { UserEvents } from "./UserEvents";
import { DashboardHeader } from "./DashboardHeader";
import type { DashboardHeaderProps, DashboardProps, UserEventsProps } from "../types/PropTypes";
// import type { DashboardProps, NoteEditorProps } from "../types/PropTypes";
// import Editor from "./Editor";
import { useState } from "react";


export default function Dashboard({ currentUser }: DashboardProps) {
    const userEventsProps: UserEventsProps = {
        currentUser: currentUser
    }

    const dashboardHeaderProps: DashboardHeaderProps = {
        currentUser: currentUser
    }

    return (
        <main className="flex flex-col h-screen bg-slate-300">
            <DashboardHeader {...dashboardHeaderProps} />
            <section className="flex h-screen items-center justify-center">
                <div className="w-1/2 bg-blue-100 p-6 text-center">
                    <UserEvents currentUser={currentUser} />
                </div>
                     {/* <div className="w-1/2 border-2 rounded-3xl m-4 p-4"> */}
                    {/* <EditorEvents {...EditorProps} /> */}
                {/* </div> */}
            </section>
        </main>
    )
}