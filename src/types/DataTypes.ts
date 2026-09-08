export interface User {
    email: string;
    password: string;
    eventList: number[];
    iRequests: number[]
    id?: number;
    name?: string;
}

export interface CalendarEventType {
    name: string;
    when: Date;
    location: string;
    description: string;
    id?: number;
}
