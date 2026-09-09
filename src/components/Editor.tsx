import { useEffect, useState } from "react";
import type { EditorProps } from "../types/PropTypes";
import type { Attendee, CalendarEventType, User } from "../types/DataTypes";

export function Editor({ activeEvent, callBackView }: EditorProps) {
    const [notEditable, toggleEditable] = useState<boolean>(false);
    const [isSaved, toggleSavedStatus] = useState<boolean>(false);

    const [nameState, setNameState] = useState<string>(activeEvent.name);
    const [locationState, setLocationState] = useState<string>(activeEvent.location);
    const [whenState, setWhenState] = useState<Date>(activeEvent.when);
    const [dateState, setDateState] = useState<string>("")
    const [timeState, setTimeState] = useState<string>("")
    const [descriptionState, setDescriptionState] = useState<string>(activeEvent.description);
    const [inviteName, setInviteName] = useState<string>("Invite yer shipmate...");

    const handleEdit = (): void => {
        if (notEditable) {
            toggleEditable(false)
        } else {
            toggleSavedStatus(false)
            toggleEditable(true)
        }
    }

    //Format when field for display
    useEffect(() => {
        if (activeEvent?.when) {
            const dateObj = new Date(activeEvent.when);

            setTimeState(
                dateObj.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                })
            );

            setDateState(
                dateObj.toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                })
            )
        }
    }, [activeEvent]);

    function getFormattedDate(): Date {
        const combinedString = `${dateState} ${timeState}`.trim();
        const newDate = new Date(combinedString);

        if (isNaN(newDate.getTime())) {
            alert("Date is formatted incorreclty.");
            console.error("Date format is invalid, falling back to original date.");
            return whenState;
        }

        return newDate;
    }

    const handleSave = () => {
        const newDate = getFormattedDate();
        setWhenState(newDate);

        updateEvent({
            name: nameState,
            location: locationState,
            when: newDate,
            description: descriptionState,
            attendees: activeEvent.attendees
        });
    };

    // handle edit button color change
    function editColor(): string {
        const editColorMap = {
            green: "bg-green-300 hover:bg-green-200 active:bg-green-100",
            red: "bg-red-300 hover:bg-red-200 active:bg-red-100"
        }

        let activeColor: string = editColorMap.red;
        notEditable ? (activeColor = editColorMap.red) : (activeColor = editColorMap.green);
        return activeColor;
    }

    async function deleteEvent() {
        try {
            const response = await fetch(`http://localhost:3002/upcomingEvents/${activeEvent.id}`, {
                method: "DELETE"
            });
            if (!response.ok) throw new Error("Delete request failed.");
            toggleSavedStatus(true)
        } catch (error: any) {
            throw new Error(error);
        }
    }

    async function handleDelete() {
        if (confirm(`Delete Note: ${nameState}?`)) {
            await deleteEvent()
            callBackView()
        }
    }

    async function updateEvent(updatedInfo: CalendarEventType) {
        try {
            const calendarEvent: CalendarEventType = {
                name: updatedInfo.name,
                description: updatedInfo.description,
                location: updatedInfo.location,
                when: updatedInfo.when,
                attendees: updatedInfo.attendees
            }


            const response = await fetch(`http://localhost:3002/upcomingEvents/${activeEvent.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(calendarEvent)
            });
            if (!response.ok) throw new Error("Post request failed.");
            toggleSavedStatus(true)
        } catch (error: any) {
            throw new Error(error);
        }
    }

    async function getUser(email: string): Promise<User | undefined> {
        try {
            const response = await fetch("http://localhost:3002/users");
            if (!response.ok) throw new Error("Response failed.");

            const data: User[] = await response.json();
            const invitee = data.find(data => data.email === email)

            if (invitee != undefined) {
                return invitee
            }
            else {
                return undefined
            }
        } catch (error: any) {
            throw new Error(error);
        }
    }

    async function inviteUser(invitee: User) {
        try {
            if (activeEvent.id != undefined) {
                const currentRequests = invitee.iRequests
                const updatedRequests: Partial<User> = { iRequests: [...currentRequests, activeEvent.id] };
                const response = await fetch(`http://localhost:3002/users/${invitee.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updatedRequests)
                });
                if (!response.ok) throw new Error("PATCH request failed.");
            }
            else {
                throw new Error("activeEvent undefined")
            }
        } catch (error) {
            console.error("Failed to PATCH to iRequests", error);
            return null;
        }
    }

    async function addAttendee(invitee: User) {
        try {
            if ((activeEvent.id != undefined) && (invitee.name != undefined)) {

                const newAttendee: Attendee = {
                    name: invitee.name,
                    isComing: false
                }
                const currentAttendees = activeEvent.attendees
                const updatedRequests: Partial<CalendarEventType> = { attendees: [...currentAttendees, newAttendee] };
                const response = await fetch(`http://localhost:3002/upcomingEvents/${activeEvent.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updatedRequests)
                });
                if (!response.ok) throw new Error("PATCH request failed.");
            }
            else {
                throw new Error("Not enough info to call addAttendee()")
            }
        } catch (error) {
            console.error("Failed to PATCH to iRequests", error);
            return null;
        }
    }


    async function handleInvite(inviteeEmail: string) {
        const invitee = await getUser(inviteeEmail)
        console.log(invitee)
        if (invitee != undefined) {
            await inviteUser(invitee)
        }
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between align-baseline mb-1">
                <h2 className="grow mr-2">
                    <input
                        disabled={!notEditable}
                        value={nameState}
                        onChange={(change) => { setNameState(change.target.value) }}
                        className="w-full text-blue-800 font-bold text-2xl focus:outline-0"
                    />
                </h2>

                <div>
                    <button className="h-6 border-2 border-slate-300 px-2 bg-slate-800 text-slate-50 rounded hover:bg-slate-400 active:bg-slate-400 mr-2"
                        onClick={() => handleDelete()}
                    >
                        Delete
                    </button>
                    <button className={`h-6 border border-slate-600 px-2 mr-2 ${editColor()}`}
                        onClick={() => handleEdit()}
                    >
                        Edit
                    </button>
                    <button className={`h-6 border-2 border-slate-300 px-2 bg-slate-800 text-slate-50 rounded hover:bg-slate-400 active:bg-slate-400 mr-2`}
                        onClick={() => callBackView()}
                    >
                        Go back
                    </button>
                </div>
            </div>
            <div className="flex justify-between align-baseline mb-1">
                <input
                    type="text"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    className="w-full border-3 rounded-2xl p-3 text-white bg-blue-800 h-12"
                />
                <button className={`h-12 border-2 border-slate-300 px-2 bg-slate-800 text-slate-50 rounded hover:bg-slate-400 active:bg-slate-400 mr-2 ml-2`}
                    onClick={() => { handleInvite(inviteName) }}
                >
                    Invite
                </button>
            </div>
            <div className="flex flex-row items-center gap-4 mb-4">
                {/* Time Field */}
                <div className="flex-1">
                    <h3 className="mb-1 font-bold text-blue-800">Time</h3>
                    <input
                        type="text"
                        disabled={!notEditable}
                        value={timeState}
                        onChange={(e) => setTimeState(e.target.value)}
                        className="w-full border-3 rounded-2xl p-3 text-white bg-blue-800 h-12"
                    />
                </div>

                {/* Date Field */}
                <div className="flex-1">
                    <h3 className="mb-1 font-bold text-blue-800">Date</h3>
                    <input
                        type="text"
                        disabled={!notEditable}
                        value={dateState}
                        onChange={(e) => setDateState(e.target.value)}
                        className="w-full border-3 rounded-2xl p-3 text-white bg-blue-800 h-12"
                    />
                </div>

                {/* Location Field */}
                <div className="flex-1">
                    <h3 className="mb-1 font-bold text-blue-800">Location</h3>
                    <input
                        type="text"
                        disabled={!notEditable}
                        value={locationState}
                        onChange={(e) => setLocationState(e.target.value)}
                        className="w-full border-3 rounded-2xl p-3 text-white bg-blue-800 h-12"
                    />
                </div>
            </div>
            <h3 className="text-left mb-2 font-bold text-blue-800">Description:</h3>
            <textarea
                disabled={!notEditable}
                value={descriptionState}
                onChange={(change) => { setDescriptionState(change.target.value) }}
                className="grow resize-none w-full border-3 rounded-2xl text-white p-3 mb-2 bg-blue-800"
            />

            <div className="flex justify-end">
                {isSaved && <p className="inline mr-2">Saved</p>}
                <button className="border border-slate-600 rounded-2xl px-2 bg-slate-500 text-slate-50 hover:bg-slate-600 active:bg-slate-400"
                    onClick={() => { handleSave() }}
                >
                    Save
                </button>
            </div>
        </div>
    )
}