import { type EventProps } from '../types/PropTypes';

export function CalendarEvent({
  calendarEvent,
  ...props
}: EventProps) {
  return (
    <button
      type="button"
      className={`w-full flex-col flex-nowrap text-left`}
      {...props}
    >
        <h2 className='inline-block w-1/2'> <span className='font-bold'>Name: </span>{calendarEvent.name}  </h2>
        <p className='inline-block w-1/2'> <span className='font-bold'>Day(s):</span> {calendarEvent.day}</p>
        <p className='inline-block w-1/2'> <span className='font-bold'>Time:</span> {calendarEvent.time}</p>
    </button>
  );
}