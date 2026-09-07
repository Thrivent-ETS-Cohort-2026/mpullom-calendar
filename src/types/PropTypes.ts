import type { User, CalendarEventType } from "./DataTypes"
import type { ButtonHTMLAttributes } from "react";

export interface LandingProps {
    callbackToggle: (toggle: boolean) => void;
    callbackUser: (user: User) => void;
}

export interface DashboardProps {
    currentUser: User;
    callbackAssignEvent: (eventID: number) => Promise<void>;
}

export interface DashboardHeaderProps {
    currentUser: User;
}

export interface EventProps extends ButtonHTMLAttributes<HTMLButtonElement>{
    calendarEvent: CalendarEventType
}

export interface UserEventsProps {
    currentUser: User;
    callBackView: (eventId?: number) => void;
    callbackAssignEvent: (eventID: number) => Promise<void>;
}

export interface EditorProps {
    activeEvent: CalendarEventType;
}