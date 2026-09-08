import { useState } from "react";
import type { EditorProps } from "../types/PropTypes";
import type { CalendarEventType } from "../types/DataTypes";

export function Editor({ activeEvent }: EditorProps) {
    const [editState, setEditState] = useState<boolean>(false);

    const [nameState, setNameState] = useState<string>(activeEvent.name);
    const [locationState, setLocationState] = useState<string>(activeEvent.location);
    const [whenState, setWhenState] = useState<Date>(activeEvent.when);
    const [descriptionState, setDescriptionState] = useState<string>(activeEvent.description);

    const handleEdit = (): void => editState ? setEditState(false) : setEditState(true)

    // handle edit button color change
    function editColor(): string {
        const editColorMap = {
            green: "bg-green-300 hover:bg-green-200 active:bg-green-100",
            red: "bg-red-300 hover:bg-red-200 active:bg-red-100"
        }

        let activeColor: string = editColorMap.red;
        editState ? activeColor = editColorMap.green : editColorMap.red;

        return activeColor;
    }

    function handleDelete() {
        if (confirm(`Delete Note: ${nameState}?`)) {
            console.log("delete note");
        }
    }

    async function updateEvent(updatedInfo: CalendarEventType) {
        try {
            const calendarEvent: CalendarEventType = {
                name: updatedInfo.name,
                description: updatedInfo.description,
                location: updatedInfo.location,
                when: updatedInfo.when,
            }


            const response = await fetch(`http://localhost:3002/upcomingEvents/${activeEvent.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(calendarEvent)
            });
            if (!response.ok) throw new Error("Post request failed.");
        } catch (error: any) {
            throw new Error(error);
        }
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between align-baseline mb-1">
                <h2 className="grow mr-2">
                    <input
                        disabled={!editState}
                        value={nameState}
                        onChange={(change) => { setNameState(change.target.value) }}
                        className="w-full font-bold text-2xl focus:outline-0"
                    />
                </h2>

                <div>
                    <button className="h-6 border border-slate-600 rounded-2xl px-2 bg-slate-500 text-slate-50 hover:bg-slate-600 active:bg-slate-400 mr-2"
                        onClick={() => handleDelete()}
                    >
                        Delete
                    </button>
                    <button className={`h-6 border border-slate-600 rounded-2xl px-2 ${editColor()}`}
                        onClick={() => handleEdit()}
                    >
                        Edit
                    </button>
                </div>
            </div>

            <textarea
                disabled={!editState}
                value={descriptionState}
                onChange={(change) => { setDescriptionState(change.target.value) }}
                className="grow resize-none w-full border rounded-2xl p-3 mb-2 bg-slate-200"
            />
            <div className="flex justify-between">
                <h3 className="mb-2 font-bold">Location</h3>
            </div>
            <textarea
                disabled={!editState}
                value={locationState}
                onChange={(change) => { setLocationState(change.target.value) }}
                className="resize-none w-full border rounded-2xl p-3 mb-4 bg-slate-200 h-12"
            />

            <div className="flex justify-end">
                <p className="inline mr-2">Saved Successfully!</p>
                <button className="border border-slate-600 rounded-2xl px-2 bg-slate-500 text-slate-50 hover:bg-slate-600 active:bg-slate-400"
                    onClick={() => updateEvent({
                        name: nameState,
                        location: locationState,
                        when: whenState,
                        description: descriptionState
                    })}
                >
                    Save
                </button>
            </div>
        </div>
    )
}