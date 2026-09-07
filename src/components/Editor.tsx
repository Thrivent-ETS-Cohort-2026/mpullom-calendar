import { useState } from "react";
import type { EditorProps } from "../types/PropTypes";
import type { CalendarEventType } from "../types/DataTypes";


export function Editor({ activeEvent }: EditorProps) {
    const [editState, setEditState] = useState<boolean>(false);
    const [nameState, setNameState] = useState<string>(activeEvent.name);
    const [descriptionState, setDescriptionState] = useState<string>(activeEvent.description);
    const [locationState, setLocationState] = useState<string>(activeEvent.location);

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

    // function updateEvent(updatedInfo: CalendarEventType): CalendarEventType {
    //     const calendarEvent {
    //         updatedInfo.name,
    //         updatedInfo,
    //         updatedInfo,
    //         description: updatedInfo,
    //     }

    //     return calendarEvent;
    // }

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between align-baseline mb-1">
                <h2 className="grow mr-2">
                    <input
                        disabled={!editState}
                        value={nameState}
                        onChange={(change) => {setNameState(change.target.value)}}
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
                onChange={(change) => {setDescriptionState(change.target.value)}} 
                className="grow resize-none w-full border rounded-2xl p-3 mb-2 bg-slate-200"
            />
                <div className="flex justify-between">
                    <h3 className="mb-2 font-bold">Location</h3>
                </div>
            <textarea
                disabled={!editState}
                value={locationState}
                onChange={(change) => {setLocationState(change.target.value)}}
                className="resize-none w-full border rounded-2xl p-3 mb-4 bg-slate-200 h-12"
            />

            <div className="flex justify-end">
                <p className="inline mr-2">Saved Successfully!</p>
                <button className="border border-slate-600 rounded-2xl px-2 bg-slate-500 text-slate-50 hover:bg-slate-600 active:bg-slate-400"
                >
                    Save
                </button>
            </div>
        </div>
    )
}