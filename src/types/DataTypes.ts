export interface User {
    email: string;
    password: string;
    eventList: number[];
    id?: number;
}

export interface CalendarEventType {
    name: string;
    day: string;
    time: string;
    id?: number;
}
