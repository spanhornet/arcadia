"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import { ReloadIcon } from "@radix-ui/react-icons";
import { Avatar } from "@/components/ui/avatar";

interface CurrentCandidate {
    candidateId: string;
    firstName: string;
    lastName: string;
}

interface User {
    id: string;
    name: string;
    role: string | null;
    email: string;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

import { getCurrentCandidate } from "../actions/get-current-candidate";
import { createVote } from "../actions/create-vote";

export function VoteForm({user} : {user: User}) {
    
  const [vote, setVote] = useState<null | boolean>(null);
  const [isLoading, setLoading] = useState(false);
  const [isDisabled, setDisabled] = useState(true);
  const [candidate, setCandidate] = useState<CurrentCandidate | null>(null);
  
    useEffect(() => {
        const fetchCandidate = async () => {
            const currentCandidate = await getCurrentCandidate();
            console.log(currentCandidate);
            setCandidate(currentCandidate);
        };
        fetchCandidate();
    }, []);

    const handleSelect = (select: boolean) => {
        setDisabled(false);
        setVote(select);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setDisabled(true);

        await createVote({
            userId: user.id,
            candidateId: candidate?.candidateId,
            vote: vote,
        })

        setLoading(false);
        setDisabled(false);
    };

  return (
    <>
      <Card>
        <CardHeader className="flex items-center">
          <Avatar>{`${candidate?.firstName[0]}${candidate?.lastName[0]}`}</Avatar>
          <CardTitle className="text-3xl text-center">{`${candidate?.firstName} ${candidate?.lastName}`}</CardTitle>
          <CardDescription className="text-center">
            Would you like {candidate?.firstName} to pledge for the Phi Class of the Delta Sigma Pi, Gamma Sigma Chapter?
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Button
              size="lg"
              className={`
                bg-green-500 green-50 hover:bg-green-500/90
                w-full transition-all duration-300 hover:ring-2 hover:ring-green-500/90 hover:ring-offset-2
                ${vote === true ? "ring-2 ring-green-500 ring-offset-2" : ""}
              `}
              onClick={() => handleSelect(true)}
            >
              Yes
            </Button>
            <Button
              size="lg"
              className={`
                bg-red-500 red-50 hover:bg-red-500/90
                w-full transition-all duration-300 hover:ring-2 hover:ring-red-500/90 hover:ring-offset-2
                ${vote === false ? "ring-2 ring-red-500 ring-offset-2" : ""}
              `}
              onClick={() => handleSelect(false)}
            >
              No
            </Button>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button type="submit" className="w-full" disabled={isDisabled}>
                    {isLoading ? (
                    <>
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                        Submitting vote
                    </>
                    ) : (
                        "Submit vote"
                    )}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    Are you sure you want to submit your vote for {candidate?.firstName} {candidate?.lastName}? You have voted "{vote && vote === true ? "Yes" : "No"}." Once submitted, you cannot change your vote
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmit}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>
        </CardContent>
      </Card>
    </>
  );
}
