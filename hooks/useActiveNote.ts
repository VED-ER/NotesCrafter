import { Doc } from "@/convex/_generated/dataModel"
import { create } from "zustand"

type ActiveNoteStore = {
    activeNote: Doc<'notes'> | null,
    setActiveNote: (note: Doc<'notes'>) => void,
}

export const useActiveNote = create<ActiveNoteStore>((set) => ({
    activeNote: null,
    setActiveNote: (note: Doc<'notes'>) => set({ activeNote: note })
}))