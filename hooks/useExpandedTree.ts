import { create } from "zustand"

type ExpandedTreeStore = {
    expandedTree: Record<string, boolean>,
    setExpandedTree: (noteId: string) => void,
}

export const useExpandedTree = create<ExpandedTreeStore>((set, get) => ({
    expandedTree: {},
    setExpandedTree: (noteId: string) => set({ expandedTree: { ...get().expandedTree, [noteId]: !get().expandedTree[noteId] } })
}))