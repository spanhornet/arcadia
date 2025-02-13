// it would start with empty current table row
// ashlee clicks start voting, chooses person (using select field), and submits
// candidate form is updated

"use client"

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
  import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";


  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  
  import { createClient } from '@/utils/supabase/client';
  import { createCurrentCandidate } from "../actions/create-current-candidate";
  import { getAllCandidates } from "../actions/get-all-candidates";
  import { ReloadIcon, PlusIcon } from "@radix-ui/react-icons";

const supabase = await createClient();

const formSchema = z.object({
  candidate: z.string().min(1, "Candidate is required"),
})

interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
  positiveVotes: number;
  negativeVotes: number;
  votePercentage: string;
  badges: string[];
}

export function StartVoteButton() {
  const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        candidate: "",
      }
    })

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

  const [isLoading, setLoading] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
      setLoading(true);
      
    console.log(values);
      // here i have to create the current candidate
      createCurrentCandidate({
        candidateId: values.candidate
      })
  
      setLoading(false);
      setDialogOpen(false);
    }

    return (
        <>
<Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      

            <DialogTrigger asChild>
            <Button>
              Start vote
            </Button>
            </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Starting voting</DialogTitle>
          <DialogDescription>
            Enter information to start voting
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <FormField
                control={form.control}
                name="candidate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Candidate</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          {candidates.map((candidate: Candidate) => (
                            <SelectItem key={candidate.id} value={candidate.id}>
                              {`${candidate.firstName} ${candidate.lastName}`}
                            </SelectItem>
                        ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Starting vote
              </>
            ) : (
              "Start vote"
            )}
          </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
        </>
    );
}