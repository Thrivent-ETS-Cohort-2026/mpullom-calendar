import { render, screen } from '@testing-library/react';
import { CalendarEvent } from '../components/CalendarEvent';
import type { Attendee } from '../types/DataTypes';
function renderCalendarEvent(attendees: Attendee[]) {
    const testEvent = {
        name: "Dano Festival",
        when: new Date("2026-09-04T09:22:00.000Z"),
        location: "Seattle",
        description: "Korean festival for the end of Summer.",
        attendees: attendees,
        "id": 1
    }

    render(
        <CalendarEvent calendarEvent={testEvent}/>
    );
}

describe('SavedSummary', () => {
    test('displays event info', () => {
        // Arrange
        const attendees: Attendee[] = [            {
                "name": "Matt",
                "isComing": false
            }]

        // Act
        renderCalendarEvent(attendees);
        const attendeeBadge = screen.getByText('Matt')

        // Assert
        expect(screen.getByText('Dano Festival')).toBeInTheDocument()
        expect(attendeeBadge).toHaveClass('bg-rose-400');
        expect(attendeeBadge).toHaveClass('text-rose-800');
        expect(attendeeBadge).not.toHaveClass('bg-emerald-400');
        
    });
    test('new case', () => {
        // Arrange
        const attendees: Attendee[] = []

        // Act
        renderCalendarEvent(attendees);
        // const attendeeBadge = screen.getAllByText('Matt')

        // Assert
        expect(screen.getByText('No attendees yet')).toBeInTheDocument();
        // expect(attendeeBadge).toHaveClass('bg-emerald-400');
        // expect(attendeeBadge).toHaveClass('text-emerald-800');
        // expect(attendeeBadge).not.toHaveClass('bg-rose-400');
    }

    )
});