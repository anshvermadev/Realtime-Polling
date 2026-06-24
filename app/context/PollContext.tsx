'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Poll, PollOption } from '../types';
import { db } from '../lib/firebase';
import {
    collection,
    onSnapshot,
    doc,
    runTransaction,
    query,
    orderBy
} from 'firebase/firestore';

interface PollContextType {
    polls: Poll[];
    submitVote: (pollId: string, optionId: string, userEmail: string, userId: string, userName: string) => Promise<void>;
    getPoll: (id: string) => Poll | undefined;
}

const PollContext = createContext<PollContextType | undefined>(undefined);

export function PollProvider({ children }: { children: ReactNode }) {
    const [polls, setPolls] = useState<Poll[]>([]);

    useEffect(() => {
        const q = query(collection(db, 'polls'), orderBy('deadline', 'asc')); // Just example ordering
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const pollsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Poll[];
            setPolls(pollsData);
        }, (error) => {
            console.error("Error fetching polls: ", error);
        });

        return () => unsubscribe();
    }, []);

    const submitVote = async (pollId: string, optionId: string, userEmail: string, userId: string, userName: string) => {
        if (!userId) return;

        const pollRef = doc(db, 'polls', pollId);
        const voteRef = doc(db, 'polls', pollId, 'votes', userId);

        try {
            await runTransaction(db, async (transaction) => {
                const pollDoc = await transaction.get(pollRef);
                const voteDoc = await transaction.get(voteRef);

                if (!pollDoc.exists()) {
                    throw new Error("Poll does not exist!");
                }

                if (voteDoc.exists()) {
                    throw new Error("You have already voted in this poll!");
                }

                const pollData = pollDoc.data() as Poll;
                const newOptions = pollData.options.map(opt => {
                    if (opt.id === optionId) {
                        return { ...opt, votes: opt.votes + 1 };
                    }
                    return opt;
                });

                transaction.update(pollRef, {
                    totalVotes: pollData.totalVotes + 1,
                    voters: [...(pollData.voters || []), userEmail], // Keep email for simple UI checks if needed, or use ID
                    options: newOptions
                });

                transaction.set(voteRef, {
                    userId: userId,
                    userEmail: userEmail,
                    userName: userName,
                    optionId: optionId,
                    timestamp: new Date().toISOString()
                });
            });
        } catch (e) {
            console.error("Transaction failed: ", e);
            alert("Vote failed: " + e);
        }
    };

    const getPoll = (id: string) => polls.find(p => p.id === id);

    return (
        <PollContext.Provider value={{ polls, submitVote, getPoll }}>
            {children}
        </PollContext.Provider>
    );
}

export function usePolls() {
    const context = useContext(PollContext);
    if (context === undefined) {
        throw new Error('usePolls must be used within a PollProvider');
    }
    return context;
}
