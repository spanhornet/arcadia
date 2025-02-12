"use client"

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { createCurrentCandidate } from "../actions/create-current-candidate";

import { createClient } from '@/utils/supabase/client';

import { getCurrentCandidate } from "../actions/get-current-candidate";

const supabase = await createClient();

interface CurrentCandidate {
    candidateId: string;
    firstName: string;
    lastName: string;
}

export function HandleVotingButton({
    candidateId,
} : {
    candidateId: string,
}) {

    // Check if there is a current vote
    // if there is no vote, then it can be NOT disabled
    // if there is a vote, then
        // check if id matches current_vote id
        // if it is current vote, then change to end vote
        // if it is not current vote, then change to DISABLED

    // MUST LISTEN TO ANY CHANGES IN CURRENT VOTE
    // CHECK BASED ON CHANGES IN CURRENT VOTE

    // what if the Start Vote button is clicked
        // disable all other buttons
        // update the current vote table
        // change "Start vote" to "End vote"

    // what if the End Vote button is clicked
        // remove candidate from the current vote table
        // change "End vote" to "Start vote"

    const [isDisabled, setDisabled] = useState(false);
    const [buttonText, setButtonText] = useState("Start vote");

    const [currentCandidate, setCurrentCandidate] = useState<CurrentCandidate>()

    useEffect(() => {
        const fetchCurrentCandidate = async() => {
            const result = await getCurrentCandidate()
            setCurrentCandidate(result);
            if (!result) {
                setDisabled(false);
                setButtonText("Start vote");
            } else if (candidateId === result.candidateId) {
                setButtonText("End vote");
            } else if (candidateId !== result.candidateId) {
                setDisabled(true)
            }
        }
        fetchCurrentCandidate();

        supabase
            .channel("current-candidate-channel")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "current_candidate",
                },
                (payload) => {
                    console.log("INSERT CURRENT CANDIDATE!")
                    fetchCurrentCandidate()
               }
            )
            .subscribe()
    }, [currentCandidate])

    const handleClick = async () => {
        await createCurrentCandidate({
            candidateId: candidateId,
        });
        console.log("NEW CANDIDATE!!!")
    };

    return (
        <>
            <Button 
                disabled={isDisabled} 
                onClick={handleClick}
            >
                {buttonText}
            </Button>
        </>
    );
}