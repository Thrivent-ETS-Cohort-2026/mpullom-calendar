// import { NoteDetails } from "./NoteDetails";
// import { DashboardHeader } from "./DashboardHeader";
import type { DashboardProps } from "../types/PropTypes";
// import type { DashboardProps, NoteEditorProps } from "../types/PropTypes";
// import Editor from "./Editor";
import { useState } from "react";


export default function Dashboard({ currentUser }: DashboardProps) {

    // const [selectedNote, setSelectedNote] = useState<NoteType>(currentUser.notes[0]);

    // const noteEditorProps: NoteEditorProps = {
    //     activeNote: selectedNote
    // }

    return (
        <main className="flex flex-col h-screen bg-slate-300">
            {/* <DashboardHeader /> */}
            <section className="flex flex-row grow">
                {/* <div className="w-1/2 note-list bg-slate-300">
                    <NoteDetails currentUser={currentUser} />
                </div>
                <div className="w-1/2 border-2 rounded-3xl m-4 p-4">
                    <NoteEditor {...noteEditorProps} />
                </div> */}
            </section>
        </main>
    )
}