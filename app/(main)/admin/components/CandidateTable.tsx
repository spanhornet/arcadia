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
    badges: string[];
}

import { Badge } from "@/components/ui/badge";

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
                        <TableHead className="w-[160px]">First name</TableHead>
                        <TableHead className="w-[160px]">Last name</TableHead>
                        <TableHead className="w-[160px]">Votes (#)</TableHead>
                        <TableHead className="w-[160px]">Votes (%)</TableHead>
                        <TableHead className="text-right">Results</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {candidates.map((candidate: Candidate) => (
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
                                {candidate.votePercentage === "N/A" ? "N/A" : candidate.votePercentage + "%"}
                            </TableCell>
                            <TableCell className="text-right">
                                {
                                    candidate.badges.map((badge: string, index: number) => {
                                    // Determine the badge color based on the badge string
                                    let badgeColor = '';

                                    if (badge.toLowerCase() === 'callback') {
                                        badgeColor = 'bg-red-500 text-red-100 hover:bg-red-500/80'; // Red for callback
                                    } else if (badge.toLowerCase() === 'pledge') {
                                        badgeColor = 'bg-green-500 text-green-100 hover:bg-green-500/80'; // Green for pledge
                                    } else if (badge.toLowerCase() === 'n/a') {
                                        badgeColor = 'bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100 hover:bg-gray-200/80'; // Gray for N/A
                                    }

                                    return (
                                        <Badge key={`${badge}-${index}`} className={badgeColor}>
                                            {badge}
                                        </Badge>
                                    );
                                    })
                                }
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );

}