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
    </button>
  );
}