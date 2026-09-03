import { useEffect, useState, type ChangeEvent } from 'react';
import { CalendarEvent } from './CalendarEvent';
import { type UserEventsProps } from '../types/PropTypes';
import { type CalendarEventType, type User } from '../types/DataTypes'

export function UserEvents({ currentUser }: UserEventsProps) {
    const [searchTerm, setSearchTerm] = useState<string>("");

    const [calendarEvents, setCalendarEvents] = useState<CalendarEventType[]>();
    const [userEvents, setUserEvents] = useState<CalendarEventType[]>([]);
    const [filteredEvents, filter] = useState<CalendarEventType[]>(userEvents);


    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);

    };

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

        setUserEvents(matchedEvents);
    }

    useEffect(() => {
        filter(
            userEvents.filter((userEvent) => {
                const matchesSearch = userEvent.name.toLowerCase().includes(searchTerm.toLowerCase().trim());
                return matchesSearch;
            })
        )
    }, [searchTerm, userEvents])

    async function addEvent(eventID: number): Promise<void> {
        try {
            currentUser.eventList.push(eventID)
            const updates: Partial<User> = { eventList: currentUser.eventList }
            const response = await fetch(`http://localhost:3000/users/${currentUser.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates)
            });
            if (!response.ok) throw new Error("Post request failed.");
            const data = await response.json()
            console.log(data)
        } catch (error: any) {
            throw new Error(error);
        }
    }


    return (
        <>
            <label htmlFor="course-search" className='hidden'>
                Search by Date
            </label>
            <input
                id="course-search"
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-3/4 rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500"
            />
            <button className='border rounded px-2' onClick={() => {
                addEvent(1)
            }}>Create</button>
            {
                filteredEvents.length === 0
                    ? <h1 className='font-bold text-slate-600'>No Upcoming Events:</h1>
                    : <h1 className='font-bold text-slate-600'> Your Events: </h1>
            }
            {
                filteredEvents.map((calendarEvent) => (
                    <div key={calendarEvent.id} className="note-item-container text-slate-500 border-2 mb-1.5 rounded">
                        <CalendarEvent
                            calendarEvent={calendarEvent}
                            onClick={() => console.log(calendarEvent.id)}
                        >
                        </CalendarEvent>
                    </div>
                ))
            }
        </>
    );
}