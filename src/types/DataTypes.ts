export interface User {
    email: string;
    password: string;
    eventList: number[];
    id?: number;
}

export interface CalendarEventType {
    name: string;
    when: Date;
    description: string;
    id?: number;
}
