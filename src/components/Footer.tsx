import { useEffect, useState } from "react";
import type { FooterProps } from "../types/PropTypes";
import { CalendarEvent } from "./CalendarEvent";
import type { CalendarEventType } from "../types/DataTypes";

export default function Footer({ currentUser }: FooterProps) {
    const [calendarEvents, setCalendarEvents] = useState<CalendarEventType[]>([]);
    const [iEvents, setIEvents] = useState<CalendarEventType[]>([]);


    useEffect(() => {
        async function fetchEvents(): Promise<void> {
            try {
                const response = await fetch("http://localhost:3002/upcomingEvents");
                if (!response.ok) throw new Error("Response failed.");

                const data: CalendarEventType[] = await response.json();
                setCalendarEvents(data);
                populateUserEvents(data);
            } catch (error) {
                console.error("Failed to load events:", error);
            }
        }

        fetchEvents();
    }, []);

    function populateUserEvents(allEvents: CalendarEventType[]) {
        if (!currentUser?.eventList) return;

        const matchedEvents = allEvents.filter(
            (event): event is CalendarEventType & { id: number } =>
                event.id !== undefined && currentUser.eventList.includes(event.id)
        );

        setIEvents(matchedEvents);
    }
    return (
        <div className="absolute bottom-0 left-0 w-full bg-blue-800 h-24 z-0 shadow-md flex items-center justify-between px-8">
            {/* Invite List */}
            <div className="flex items-center gap-4 text-white">
                <div>
                    <span className="text-xs uppercase tracking-wider text-blue-200 font-semibold block">
                        Upcoming Event
                    </span>
                    {iEvents.map((calendarEvent) => (
                        <div key={calendarEvent.id} className="note-item-container w-3/4 text-blue-300 border-2 mb-1.5 rounded">
                            <CalendarEvent
                                calendarEvent={calendarEvent}
                            />
                        </div>
                    ))}
                </div>
                <button
                    onClick={() => console.log("Test clicked")}
                    className="px-4 py-2 bg-slate-100 text-blue-900 font-semibold rounded-xl hover:bg-white active:bg-blue-100 transition-colors shadow"
                >
                    Test
                </button>
            </div>
        </div>
    )
}