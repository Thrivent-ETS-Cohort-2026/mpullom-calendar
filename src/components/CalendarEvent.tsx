import { type EventProps } from '../types/PropTypes';

export function CalendarEvent({
  calendarEvent,
  ...props
}: EventProps) {

  const eventDate = new Date(calendarEvent.when)

  const monthYear = eventDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const time = eventDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  function displayAttendees() {
    if (!calendarEvent.attendees || calendarEvent.attendees.length === 0) {
      return <p className="text-sm italic text-slate-400">No attendees yet</p>;
    }
    return (
      <ul className="mt-2 text-sm flex flex-row">
        {calendarEvent.attendees.map((attendee, index) => (
          <li key={index} className="flex items-center gap-1.5">
            <span
              className={`border rounded ${attendee.isComing
                  ? 'bg-emerald-400 text-emerald-800'
                  : 'bg-rose-400 text-rose-800'
                }`}
            >
              {attendee.name}
            </span>
          </li>
        ))}
      </ul>
    );
  }


  return (
    <button
      type="button"
      className={`w-full flex-col flex-nowrap text-left`}
      {...props}
    >
      <h2 className='inline-block w-1/2'> <span className='font-bold'>Name: </span>{calendarEvent.name}  </h2>
      <p className="inline-block w-1/2">
        <span className="font-bold">Date:</span> {monthYear}
      </p>
      <p className="inline-block w-1/2">
        <span className="font-bold">Time:</span> {time}
      </p>
      <div>
        {displayAttendees()}
      </div>
    </button>
  );
}