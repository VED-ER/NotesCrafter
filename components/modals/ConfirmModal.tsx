'use client'

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"


type ConfirmModalProps = {
    children: React.ReactNode,
    onConfirm: () => void
}

const ConfirmModal = ({ children, onConfirm }: ConfirmModalProps) => {
    const handleConfirm = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        onConfirm()
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger onClick={e => e.stopPropagation()} asChild>
                {/* whatever is wrapped with confirm modal will be a trigger for showing it */}
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={e => e.stopPropagation()}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirm}>
                        Confirm
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ConfirmModal