"use client"

import { useState, useEffect } from "react";
import { createClient } from '@/utils/supabase/client';
import { Crosshair2Icon } from "@radix-ui/react-icons";
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
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getCurrentCandidate } from "../actions/get-current-candidate";
import { deleteCurrentCandidate } from "../actions/delete-current-candidate";
import { whoHasNotVoted } from "../actions/who-has-not-voted";

interface CurrentCandidate {
  candidateId: string;
  firstName: string;
  lastName: string;
}

export function EndVoteButton() {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [candidate, setCandidate] = useState<CurrentCandidate | null>(null);
  const [nonVoters, setNonVoters] = useState<string[]>([]);
  const [supabase] = useState(() => createClient());
  const [isLoading, setIsLoading] = useState(false);

  const fetchCandidate = async () => {
    try {
      const currentCandidate = await getCurrentCandidate();
      setCandidate(currentCandidate);
      return currentCandidate;
    } catch (error) {
      console.error("Failed to fetch current candidate:", error);
      return null;
    }
  };

  const fetchNonVoters = async (candidateId: string | undefined) => {
    if (!candidateId) return;
    try {
      const result = await whoHasNotVoted(candidateId);
      setNonVoters(result);
    } catch (error) {
      console.error("Failed to fetch non-voters:", error);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      const currentCandidate = await fetchCandidate();
      if (currentCandidate) {
        await fetchNonVoters(currentCandidate.candidateId);
      }
    };

    initializeData();

    // Set up Supabase subscription
    const votesChannel = supabase
      .channel("votes-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "vote"
        },
        async () => {
          const currentCandidate = await fetchCandidate();
          if (currentCandidate) {
            await fetchNonVoters(currentCandidate.candidateId);
          }
        }
      )
      .subscribe();

    return () => {
      votesChannel.unsubscribe();
    };
  }, [supabase]);

  const handleEndVote = async () => {
    setIsLoading(true);
    try {
      await deleteCurrentCandidate();
      setDialogOpen(false);
    } catch (error) {
      console.error("Failed to end the vote:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Crosshair2Icon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Who hasn't voted yet?</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Who hasn't voted yet?</DialogTitle>
            <DialogDescription>
              Below is a list of all users who have not voted yet. You can take action on their accounts if needed.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            {nonVoters.length === 0 ? (
              <p className="text-center text-muted-foreground">Everyone has voted!</p>
            ) : (
              <div className="space-y-2">
                {nonVoters.map((user: string, index: number) => (
                  <div
                    key={`${user}-${index}`}
                    className="flex items-center justify-between rounded-lg border p-2"
                  >
                    <div>
                      <p className="font-medium">{user}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
            
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" disabled={isLoading}>
            {isLoading ? "Ending..." : "End voting"}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to end the voting process for {candidate?.firstName} {candidate?.lastName}? 
              Once ended, no more votes can be cast.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleEndVote}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}