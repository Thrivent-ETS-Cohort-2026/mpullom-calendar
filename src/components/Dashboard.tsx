import { UserEvents } from "./UserEvents";
import { DashboardHeader } from "./DashboardHeader";
import type { DashboardHeaderProps, DashboardProps, EditorProps, FooterProps, UserEventsProps } from "../types/PropTypes";
import { useState } from "react";
import merry from "../assets/merry.png";
import { Editor } from './Editor';
import type { CalendarEventType } from "../types/DataTypes";
import Footer from "./Footer";


export default function Dashboard({ currentUser, callbackAssignEvent }: DashboardProps) {
    const defaultEvent: CalendarEventType = {
        name: "New Event",
        location: "Seattle",
        when: new Date(),
        description: "What Arrr ye up to?",
        attendees: []
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
        activeEvent: activeEvent,
        callBackView: () => handleViewToggle()
    }

    const footerProps: FooterProps = {
        currentUser: currentUser,
        callbackAssignEvent: callbackAssignEvent
    }

    return (
        <main className="flex min-h-screen flex-col h-full w-full bg-sky-300 overflow-hidden">
            <DashboardHeader {...dashboardHeaderProps} />

            <section className="flex justify-center mt-auto px-4 min-h-0">
                <div
                    className={`w-1/2 bg-[#c9ab9a] text-center rounded-xl p-4 overflow-y-auto shadow-md transition-all duration-500 ease-in-out ${viewEvent ? "h-128 max-h-[80vh]" : "h-64 max-h-64"
                        }`}
                >
                    {viewEvent ? (
                        <Editor {...editorProps} />
                    ) : (
                        <UserEvents {...userEventsProps} />
                    )}
                </div>
            </section>

            {/* Have the ship and footer overlap */}
            <div className="relative w-full flex justify-center items-end shrink-0">
                {/* Ship */}
                <div className="relative z-10 pointer-events-none">
                    <img
                        src={merry}
                        alt="Luffy's ship"
                        className={`object-contain transition-all duration-500 ease-in-out drop-shadow-xl ${viewEvent ? "h-60" : "h-80"}`}
                    />
                </div>
                <Footer {...footerProps} />
            </div>
        </main>
    )
}