"use client"

import { useState, useEffect } from "react";
import { createClient } from '@/utils/supabase/client';
import { VoteForm } from "./VoteForm";
import { isCurrentCandidateEmpty } from "../actions/is-current-candidate-empty";
import { hasUserVoted } from "../actions/has-user-voted";
import { getCurrentCandidate } from "../actions/get-current-candidate";

interface User {
  id: string;
  name: string;
  role: string | null;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface CurrentCandidate {
  candidateId: string;
  firstName: string;
  lastName: string;
}

export function VoteContainer({ user }: { user: User }) {
  const [currentCandidate, setCurrentCandidate] = useState<CurrentCandidate | null>(null);
  const [isEmpty, setEmpty] = useState(true);
  const [isUserVoted, setUserVoted] = useState(false);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    const fetchCurrentCandidate = async () => {
      try {
        const result = await getCurrentCandidate();
        console.log(`fetchCurrentCandidate: ${result}`)
        setCurrentCandidate(result);
        return result;
      } catch (error) {
        console.error('Error fetching current candidate:', error);
        return null;
      }
    };

    const checkUserVoteStatus = async (candidateId: string) => {
      try {
        const result = await hasUserVoted({
          userId: user.id,
          currentCandidateId: candidateId,
        });
        console.log(`checkUserVoteStatus: ${result}`)
        setUserVoted(result);
      } catch (error) {
        console.error('Error checking user vote status:', error);
      }
    };

    const fetchIsCurrentCandidateEmpty = async () => {
      try {
        const isEmpty = await isCurrentCandidateEmpty();
        console.log(`isEmpty: ${isEmpty}`)
        setEmpty(isEmpty);
        
        if (!isEmpty) {
          const candidate = await fetchCurrentCandidate();
          if (candidate) {
            await checkUserVoteStatus(candidate.candidateId);
          }
        }
      } catch (error) {
        console.error('Error checking if candidate is empty:', error);
      }
    };

    // Initial fetch
    fetchIsCurrentCandidateEmpty();

    // Set up Supabase subscriptions
    const currentCandidateChannel = supabase
      .channel("current-candidate-changes")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all events (INSERT, DELETE)
          schema: "public",
          table: "current_candidate"
        },
        () => fetchIsCurrentCandidateEmpty()
      )
      .subscribe();

    const votesChannel = supabase
      .channel("votes-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "vote"
        },
        () => fetchIsCurrentCandidateEmpty()
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      currentCandidateChannel.unsubscribe();
      votesChannel.unsubscribe();
    };
  }, [user.id, supabase]);

  if (isEmpty) {
    return <div className="text-center p-4">Waiting for voting to start...</div>;
  }

  if (isUserVoted) {
    return <div className="text-center p-4">You have already cast your vote. 😏</div>;
  }

  return <VoteForm user={user} />;
}