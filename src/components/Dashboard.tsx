import { UserEvents } from "./UserEvents";
import { DashboardHeader } from "./DashboardHeader";
import type { DashboardHeaderProps, DashboardProps, EditorProps, UserEventsProps } from "../types/PropTypes";
// import type { DashboardProps, NoteEditorProps } from "../types/PropTypes";
// import Editor from "./Editor";
import { useState } from "react";
import merry from "../assets/merry.png";
import { Editor } from './Editor';
import type { CalendarEventType } from "../types/DataTypes";


export default function Dashboard({ currentUser, callbackAssignEvent}: DashboardProps) {
    const defaultEvent: CalendarEventType = {
        name: "New Event",
        location: "Seattle",
        when: new Date(),
        description: "What Arrr ye up to?"
    };

    const [viewEvent, setViewEvent] = useState<boolean>(false);
    const [activeEvent, setActiveEvent] = useState<CalendarEventType>(defaultEvent);
  
    async function fetchEvent(noteId: number): Promise<void> {
        try {
            const response = await fetch(`http://localhost:3002/upcomingEvents/${noteId}`);
            if (!response.ok) throw new Error("Response failed.");

            const fetchedEvent = await response.json();
            setActiveEvent(fetchedEvent)
        } catch (error: any) {
            throw new Error(error);
        }
    }

    const handleViewToggle = async (noteId?: number) => {
        if (viewEvent) {
            setViewEvent(false)
        } 
        else {
            if (noteId) await fetchEvent(noteId)
            setViewEvent(true)
        }
    };

    const userEventsProps: UserEventsProps = {
        currentUser: currentUser,
        callBackView: (eventId?: number) => handleViewToggle(eventId),
        callbackAssignEvent: callbackAssignEvent
    }

    const dashboardHeaderProps: DashboardHeaderProps = {
        currentUser: currentUser
    }

    const editorProps: EditorProps = {
        activeEvent: activeEvent
    }

    return (
        <main className="flex flex-col h-screen w-full bg-slate-300 overflow-hidden">
            <DashboardHeader {...dashboardHeaderProps} />

            <section className="flex justify-center mt-auto px-4 min-h-0">
                {viewEvent ? (                
                    <div className="w-1/2 max-h-64 bg-[#c9ab9a] text-center rounded-xl p-4 overflow-y-auto shadow-md">
                        <Editor {...editorProps} />
                    </div>
                ) : (
                    <div className="w-1/2 max-h-64 bg-[#c9ab9a] text-center rounded-xl p-4 overflow-y-auto shadow-md">
                        <UserEvents {...userEventsProps} />
                    </div>
                )}
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