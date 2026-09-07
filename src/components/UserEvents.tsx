import { useEffect, useState, type ChangeEvent } from 'react';
import { CalendarEvent } from './CalendarEvent';
import { type UserEventsProps } from '../types/PropTypes';
import { type CalendarEventType, type User } from '../types/DataTypes';

export function UserEvents({ currentUser, callBackView, callbackAssignEvent }: UserEventsProps) {
    const [searchTerm, setSearchTerm] = useState<string>("");

    const [calendarEvents, setCalendarEvents] = useState<CalendarEventType[]>([]);
    const [userEvents, setUserEvents] = useState<CalendarEventType[]>([]);
    const [filteredEvents, filter] = useState<CalendarEventType[]>(userEvents);

    const defaultEvent: CalendarEventType = {
        name: "New Event",
        location: "Seattle",
        when: new Date(),
        description: "What Arrr ye up to?"
    };

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
        );
    }, [searchTerm, userEvents]);

    async function createEvent(newEvent: CalendarEventType): Promise<CalendarEventType | null> {
        try {
            const response = await fetch(`http://localhost:3002/upcomingEvents`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newEvent)
            });
            if (!response.ok) throw new Error("POST request failed.");
            
            const createdData: CalendarEventType = await response.json();
            
            setCalendarEvents((prev) => [...prev, createdData]);
            return createdData;
        } catch (error) {
            console.error("Failed to create event:", error);
            return null;
        }
    }

    async function handleNewEvent(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        const createdEvent = await createEvent(defaultEvent);
        
        if (createdEvent && createdEvent.id !== undefined) {
            await callbackAssignEvent(createdEvent.id);
            setUserEvents((prev) => [...prev, createdEvent]);
        }
    }

    return (
        <>
            <div className='flex justify-between items-center gap-2 mb-4'>
                <label htmlFor="course-search" className='hidden'>
                    Search by Date
                </label>
                <input
                    id="course-search"
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-3/4 rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2 text-sm text-slate-100"
                />
                <button 
                    className='rounded border border-slate-700 bg-slate-400 px-3 py-2 text-sm font-medium hover:bg-slate-500' 
                    onClick={handleNewEvent}
                >
                    Create
                </button>
            </div>
            {
                filteredEvents.length === 0
                    ? <h1 className='font-bold text-slate-600 mb-2'>No Upcoming Events:</h1>
                    : <h1 className='font-bold text-slate-600 mb-2'> Your Events: </h1>
            }
            {
                filteredEvents.map((calendarEvent) => (
                    <div key={calendarEvent.id} className="note-item-container text-slate-700 border-2 mb-1.5 rounded">
                        <CalendarEvent
                            calendarEvent={calendarEvent}
                            onClick={() => callBackView(calendarEvent.id)}
                        />
                    </div>
                ))
            }
        </>
    );
}