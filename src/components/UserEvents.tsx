import { useEffect, useState, type ChangeEvent } from 'react';
import { CalendarEvent } from './CalendarEvent';
import { type UserEventsProps } from '../types/PropTypes';
import { type CalendarEventType } from '../types/DataTypes';

export function UserEvents({ currentUser, callBackView, callbackAssignEvent }: UserEventsProps) {
    const [dateSearch1, setDateSearch1] = useState<string>("");
    const [timeSearch1, setTimeSearch1] = useState<string>("");
    const [dateSearch2, setDateSearch2] = useState<string>("");
    const [timeSearch2, setTimeSearch2] = useState<string>("");

    const [calendarEvents, setCalendarEvents] = useState<CalendarEventType[]>([]);
    const [userEvents, setUserEvents] = useState<CalendarEventType[]>([]);
    const [filteredEvents, filter] = useState<CalendarEventType[]>(userEvents);

    const defaultEvent: CalendarEventType = {
        name: "New Event",
        location: "Seattle",
        when: new Date(),
        description: "What Arrr ye up to?",
        attendees: []
    };

    const handleTimeChange1 = (e: ChangeEvent<HTMLInputElement>) => {
        setTimeSearch1(e.target.value);
    };

    const handleDateChange1 = (e: ChangeEvent<HTMLInputElement>) => {
        setDateSearch1(e.target.value);
    };

    const handleTimeChange2 = (e: ChangeEvent<HTMLInputElement>) => {
        setTimeSearch2(e.target.value);
    };

    const handleDateChange2 = (e: ChangeEvent<HTMLInputElement>) => {
        setDateSearch2(e.target.value);
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
    }, [currentUser]);

    function populateUserEvents(allEvents: CalendarEventType[]) {
        if (!currentUser?.eventList) return;

        const matchedEvents = allEvents.filter(
            (event): event is CalendarEventType & { id: number } =>
                event.id !== undefined && currentUser.eventList.includes(event.id)
        );

        setUserEvents(matchedEvents);
    }

    //Filter date range
    useEffect(() => {
        const fromStr = `${dateSearch1.trim()} ${timeSearch1.trim()}`.trim();
        const toStr = `${dateSearch2.trim()} ${timeSearch2.trim()}`.trim();

        const fromDate = fromStr ? new Date(fromStr) : null;
        const toDate = toStr ? new Date(toStr) : null;

        //Require that both dates be substantiated to filter
        if ((fromDate == null) || (isNaN(fromDate.getTime())) || (toDate == null) || (isNaN(toDate.getTime()))) {
            filter(userEvents);
            return;
        }

        filter(
            userEvents.filter((userEvent) => {
                const eventDate = new Date(userEvent.when);
                const matchesFrom = eventDate.getTime() >= fromDate.getTime();
                const matchesTo = eventDate.getTime() <= toDate.getTime();

                return matchesFrom && matchesTo;
            })
        );
    }, [dateSearch1, timeSearch1, dateSearch2, timeSearch2, userEvents]);

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
            <h1 className='text-2xl py-2 font-extrabold text-blue-800'>DashbArrr</h1>
            <div className='flex justify-between items-center gap-2 mb-4'>
                <label htmlFor="course-search" className='hidden'>
                    Search by Date
                </label>
                <div className='flex gap-1'>
                    <h3>From: </h3>
                    <input
                        id="course-search"
                        type="text"
                        placeholder="Time..."
                        value={timeSearch1}
                        onChange={handleTimeChange1}
                        className="w-3/4 rounded-lg border-2 border-sky-800 bg-sky-300 px-3.5 py-2 text-sm text-slate-700"
                    />
                    <input
                        id="course-search"
                        type="text"
                        placeholder="Date..."
                        value={dateSearch1}
                        onChange={handleDateChange1}
                        className="w-3/4 rounded-lg border-2 border-sky-800 bg-sky-300 px-3.5 py-2 text-sm text-slate-700"
                    />
                    <h3>To: </h3>
                    <input
                        id="course-search"
                        type="text"
                        placeholder="Time..."
                        value={timeSearch2}
                        onChange={handleTimeChange2}
                        className="w-3/4 rounded-lg border-2 border-sky-800 bg-sky-300 px-3.5 py-2 text-sm text-slate-700"
                    />
                    <input
                        id="course-search"
                        type="text"
                        placeholder="Date..."
                        value={dateSearch2}
                        onChange={handleDateChange2}
                        className="w-3/4 rounded-lg border-2 border-sky-800 bg-sky-300 px-3.5 py-2 text-sm text-slate-700"
                    />
                </div>

                <button
                    className='rounded border-2 border-sky-800 bg-slate-400 px-3 py-2 text-sm font-medium hover:bg-slate-500'
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