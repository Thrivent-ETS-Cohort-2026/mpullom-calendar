import type { User } from "./DataTypes"

export interface LandingProps {
    callbackToggle: (toggle: boolean) => void;
    callbackUser: (user: User) => void;
}

export interface DashboardProps {
    currentUser: User;
}

export interface DashboardHeaderProps {
    currentUser: User;
}
