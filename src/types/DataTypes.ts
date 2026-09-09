export interface Attendee {
        name: string,
        isComing: boolean
    };

export interface User {
    email: string;
    password: string;
    eventList: number[];
    iRequests: number[];
    id?: number;
    name?: string;
}

export interface CalendarEventType {
    name: string;
    when: Date;
    location: string;
    description: string;
    attendees: Attendee[];
    id?: number;
}
