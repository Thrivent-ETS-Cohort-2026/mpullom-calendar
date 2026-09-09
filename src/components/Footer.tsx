import { useEffect, useState } from "react";
import type { FooterProps } from "../types/PropTypes";
import { CalendarEvent } from "./CalendarEvent";
import type { Attendee, CalendarEventType, User } from "../types/DataTypes";

export default function Footer({ currentUser, callbackAssignEvent, callbackLogout}: FooterProps) {
    const [calendarEvents, setCalendarEvents] = useState<CalendarEventType[]>([]);
    const [iEvents, setIEvents] = useState<CalendarEventType[]>([]);
    const [lastEvent, setLastEvent] = useState<CalendarEventType>()


    useEffect(() => {
        async function fetchEvents(): Promise<void> {
            try {
                const response = await fetch("http://localhost:3002/upcomingEvents");
                if (!response.ok) throw new Error("Response failed.");

                const data: CalendarEventType[] = await response.json();
                setCalendarEvents(data);
                populateIReq(data);
            } catch (error) {
                console.error("Failed to load events:", error);
            }
        }

        fetchEvents();
    }, []);

    async function popIReq() {
        try {
            const updatedIReq = currentUser.iRequests.slice(0, -1);
            const updates: Partial<User> = { iRequests: updatedIReq };

            const response = await fetch(`http://localhost:3002/users/${currentUser.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });

            if (!response.ok) throw new Error("iReq pop request failed.");
        } catch (error) {
            console.error("Failed to update user events:", error);
        }
    }

    useEffect(() => {
        if (iEvents.length > 0) {
            setLastEvent(iEvents[iEvents.length - 1]);
        }
    }, [iEvents])

    function populateIReq(allEvents: CalendarEventType[]) {
        if (!currentUser?.iRequests) return;

        const matchedEvents = allEvents.filter(
            (event): event is CalendarEventType & { id: number } =>
                event.id !== undefined && currentUser.iRequests.includes(event.id)
        );

        setIEvents(matchedEvents);
    }

    async function addAttendee(calendarEvent: CalendarEventType, isComing: boolean) {
        try {
            if ((calendarEvent.id != undefined) && (currentUser.name != undefined)) {

                const newAttendee: Attendee = {
                    name: currentUser.name,
                    isComing: isComing
                }
                const currentAttendees = calendarEvent.attendees
                const updatedRequests: Partial<CalendarEventType> = { attendees: [...currentAttendees, newAttendee] };
                const response = await fetch(`http://localhost:3002/upcomingEvents/${calendarEvent.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updatedRequests)
                });
                if (!response.ok) throw new Error("PATCH request failed.");
            }
            else {
                throw new Error("Not enough info to call addAttendee()")
            }
        } catch (error) {
            console.error("Failed to PATCH to iRequests", error);
            return null;
        }
    }

    //Assign event to user => remove it from requests => remove it from state requests
    //to invoke re-render.
    async function handleAccept() {
        if ((lastEvent != undefined) && (lastEvent.id != undefined)) {
            await callbackAssignEvent(lastEvent.id)
            await popIReq()
            setIEvents(prev => {
                const updatedEvents = prev.slice(0, -1);
                if (updatedEvents.length === 0) {
                    setLastEvent(undefined);
                }
                return updatedEvents;

            });
            await addAttendee(lastEvent, true)
        }

    }

    async function handleDecline() {
        if ((lastEvent != undefined) && (lastEvent.id != undefined)) {
            await addAttendee(lastEvent, false)
            await popIReq()
            setIEvents(prev => {
                const updatedEvents = prev.slice(0, -1);
                if (updatedEvents.length === 0) {
                    setLastEvent(undefined);
                }
                return updatedEvents;

            });
        }

    }
    return (
        <div className="absolute bottom-0 left-0 w-full bg-blue-800 h-24 z-0 shadow-md flex items-center justify-between">
            {/* Invite List */}
            <div className="flex items-center text-white">
                <div>
                    <span className="text-xs uppercase text-blue-200 font-semibold">
                        You've been invited to...
                    </span>
                    {(lastEvent != undefined) && (
                        <div key={lastEvent.id} className="note-item-container text-blue-300 border-2 mr-1 mb-1.5 rounded">
                            <CalendarEvent
                                className="text-left text-xs"
                                calendarEvent={lastEvent}
                            />
                        </div>
                    )}
                </div>
                <div className="flex flex-col">
                    <button
                        className="px-4 py-2 text-xs bg-emerald-500 text-slate-900  font-semibold rounded-xl hover:bg-slate-300 active:bg-slate-400 transition-colors shadow"
                        onClick={() => handleAccept()}
                    >
                        Accept
                    </button>
                    <button
                        className="px-4 py-2 text-xs bg-rose-400 text-slate-900 font-semibold rounded-xl hover:bg-slate-300 active:bg-slate-400 transition-colors shadow"
                        onClick={() => handleDecline()}
                    >
                        Decline
                    </button>
                </div>
            </div>
            <div>
                 <button
                        className="px-4 py-2 text-xs mr-5 bg-rose-400 text-slate-900 font-semibold rounded-xl hover:bg-slate-300 active:bg-slate-400 transition-colors shadow"
                        onClick={() => callbackLogout()}
                    >
                        Logout
                    </button>
            </div>
        </div>
    )
}