export interface User {
    name: string;
    email: string;
    password: string;
    eventList: number[];
    id?: number;
}

export interface CalendarEventType {
    name: string;
    when: Date;
    location: string;
    description: string;
    id?: number;
}
