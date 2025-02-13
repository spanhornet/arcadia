import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  import { Button } from "@/components/ui/button"
  import { useState, useEffect } from "react";

interface CurrentCandidate {
    candidateId: string;
    firstName: string;
    lastName: string;
}

import { getCurrentCandidate } from "../actions/get-current-candidate";
import { deleteCurrentCandidate } from "../actions/delete-current-candidate";

export function EndVoteButton() {
    const [candidate, setCandidate] = useState<CurrentCandidate | null>(null);

    useEffect(() => {
        const fetchCandidate = async () => {
            const currentCandidate = await getCurrentCandidate();
            setCandidate(currentCandidate);
        };
        fetchCandidate();
    }, []);

    const handleSubmit = async () => {
        try {
            await deleteCurrentCandidate()
        } catch (error) {
            console.error("Failed to end the vote", error);
        }
    };

    return (
        <>
            <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive">End voting</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                Are you sure you want to end the voting process for {candidate?.firstName} {candidate?.lastName}? Once ended, no more votes can be cast.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmit}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
