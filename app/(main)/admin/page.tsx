import { CandidateTable } from "./components/CandidateTable";

import { VoteButton } from "./components/VoteButton";

import { Button } from "@/components/ui/button";

export default function Page() {

    return (
        <div>
            <nav className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-b dark:border-neutral-800">
                <span className="text-2xl flex items-center gap-2">Candidates</span>
                <div className="flex items-center gap-2">
                <VoteButton />
            </div>
            </nav>
            <CandidateTable />
        </div>
    );
}
