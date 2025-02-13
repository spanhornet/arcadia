"use client"

import { useState, useEffect } from "react";

import { EndVoteButton } from "./EndVoteButton";
import { StartVoteButton } from "./StartVoteButton";

import { createClient } from '@/utils/supabase/client';
import { isCurrentCandidateEmpty } from "../actions/is-current-candidate-empty";

const supabase = await createClient();


export function VoteButton() {
    const [isEmpty, setEmpty] = useState(false);

    useEffect(() => {
        const fetchIsCurrentCandidateEmpty = async () => {
            const result = await isCurrentCandidateEmpty();
            setEmpty(result);
        };
        fetchIsCurrentCandidateEmpty();

        supabase
            .channel("current-candidate-channel-1")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "current_candidate"
                },
                (payload) => {
                    console.log("ELEMENT INSERTED");
                    setEmpty(false)
                }
            )
            .subscribe()

        supabase
            .channel("current-candidate-channel-2")
            .on(
                "postgres_changes",
                {
                    event: "DELETE",
                    schema: "public",
                    table: "current_candidate"
                },
                (payload) => {
                    console.log("ELEMENT DELETED");
                    setEmpty(true)
                }
            )
            .subscribe()
    }, []);

    return (

        // if empty (true) (not voting): start vote
        // if NOT empty (false) (voting): end vote

        <>
            {isEmpty ?  <StartVoteButton /> : <EndVoteButton />}
        </>
    );
}
