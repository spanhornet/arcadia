"use client"

import { useEffect, useState } from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";

import { createClient } from '@/utils/supabase/client';

import { getAllCandidates } from "../actions/get-all-candidates";
import { getCurrentCandidate } from "../actions/get-current-candidate";

interface Candidate {
    id: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    updatedAt: Date;
    positiveVotes: number;
    negativeVotes: number;
    votePercentage: string;
    votedUsers: string[];
}

const supabase = await createClient();

export function CandidateTable() {

    const [candidates, setCandidates] = useState<Candidate[]>([]);

    useEffect(() => {
        const fetchCandidates = async () => {
            const result = await getAllCandidates();
            setCandidates(result);
        };
        fetchCandidates();

        supabase
            .channel("candidate-channel")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "candidate"
                },
                (payload) => {
                    fetchCandidates()
                }
            )
            .subscribe()
    }, []);

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>First name</TableHead>
                        <TableHead>Last name</TableHead>
                        <TableHead>Votes (#)</TableHead>
                        <TableHead>Votes (%)</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {candidates.map((candidate: any) => (
                        <TableRow key={candidate.id}>
                            <TableCell>{candidate.firstName}</TableCell>
                            <TableCell>{candidate.lastName}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2 text-md">
                                    <CheckCircledIcon /> {candidate.positiveVotes}
                                    <CrossCircledIcon /> {candidate.negativeVotes}
                                </div>
                            </TableCell>
                            <TableCell>
                                {candidate.votePercentage}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );

}