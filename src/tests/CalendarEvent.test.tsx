import React from 'react';
import { render, screen } from '@testing-library/react';
import { CalendarEvent } from '../components/CalendarEvent';
function renderCalendarEvent() {
    const testEvent = {
        name: "Dano Festival",
        when: new Date("2026-09-04T09:22:00.000Z"),
        location: "Seattle",
        description: "Korean festival for the end of Summer.",
        attendees: [
            {
                "name": "Matt",
                "isComing": false
            }
        ],
        "id": 1
    }

    render(
        <CalendarEvent calendarEvent={testEvent}/>
    );
}

describe('SavedSummary', () => {
    test('displays event info', () => {
        // Arrange


        // Act
        renderCalendarEvent();

        // Assert
        expect(screen.getByText('Dano Festival')).toBeInTheDocument();
    });
});