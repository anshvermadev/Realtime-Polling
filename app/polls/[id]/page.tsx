'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePolls } from '../../context/PollContext';
import { useAuth } from '../../context/AuthContext';

export default function PollDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { getPoll, submitVote } = usePolls();
    const { currentUser, setShowAuthModal } = useAuth();

    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const poll = getPoll(id as string);

    if (!poll) {
        return (
            <div className="max-w-6xl mx-auto px-8 py-16 text-center">
                <h2 className="text-2xl font-bold">Poll not found</h2>
                <button
                    onClick={() => router.push('/')}
                    className="mt-4 border-2 border-black px-6 py-2 font-bold hover:bg-black hover:text-white transition-colors"
                >
                    Return Home
                </button>
            </div>
        );
    }

    const hasVoted = currentUser && poll.voters.includes(currentUser.email);

    const handleVoteSubmit = () => {
        if (!currentUser) {
            setShowAuthModal(true);
            return;
        }
        if (!selectedOption) return;

        submitVote(poll.id, selectedOption, currentUser.email, currentUser.uid, currentUser.name || 'Anonymous');
    };

    const getPercentage = (votes: number, total: number) => {
        if (total === 0) return '0';
        return ((votes / total) * 100).toFixed(1);
    };

    return (
        <div className="max-w-6xl mx-auto px-8 py-8">
            <button
                onClick={() => router.push('/')}
                className="border-2 border-black px-6 py-2 font-bold hover:bg-black hover:text-white transition-colors mb-8"
                style={{ fontFamily: "'Space Mono', monospace" }}
            >
                ← BACK TO POLLS
            </button>

            {/* Header Image */}
            <div className="border-4 border-black mb-8 overflow-hidden">
                <img
                    src={poll.headerImage}
                    alt={poll.title}
                    className="w-full aspect-video object-cover"
                />
            </div>

            {/* Poll Details */}
            <div className="border-4 border-black p-8 mb-8">
                <div className="flex justify-between items-start mb-2">
                    <div className="text-xs font-bold text-orange-500" style={{ fontFamily: "'Space Mono', monospace" }}>
                        {poll.category}
                    </div>
                    {poll.isClosed && (
                        <span className="bg-red-600 text-white text-sm px-3 py-1 font-bold" style={{ fontFamily: "'Space Mono', monospace" }}>
                            POLLING CLOSED
                        </span>
                    )}
                </div>
                <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter break-words">{poll.title}</h1>
                <div className="flex gap-6 text-sm mb-6 pb-6 border-b-2 border-black" style={{ fontFamily: "'Space Mono', monospace" }}>
                    <div><span className="font-bold">CREATED BY:</span> {poll.createdBy}</div>
                    <div><span className="font-bold">DEADLINE:</span> {poll.deadline}</div>
                    <div><span className="font-bold">VOTES:</span> {poll.totalVotes}</div>
                </div>
                <p className="text-lg leading-relaxed" style={{ fontFamily: "'Space Mono', monospace" }}>{poll.description}</p>
            </div>

            {/* Voting or Results */}
            {hasVoted ? (
                // Results View
                <div className="border-4 border-black p-8">
                    <h2 className="text-3xl font-black mb-6 tracking-tighter" style={{ fontFamily: "'Space Mono', monospace" }}>RESULTS</h2>

                    {poll.showResults === false ? (
                        <div className="p-8 bg-gray-100 text-center border-2 border-black">
                            <h3 className="text-xl font-bold mb-2">Thank you for voting!</h3>
                            <p style={{ fontFamily: "'Space Mono', monospace" }}>
                                Results are currently hidden and will be revealed after polling ends.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {poll.options.map((option) => {
                                const percentage = getPercentage(option.votes, poll.totalVotes);
                                return (
                                    <div key={option.id} className="border-2 border-black p-4">
                                        <div className="flex justify-between mb-2" style={{ fontFamily: "'Space Mono', monospace" }}>
                                            <span className="font-bold">{option.text}</span>
                                            <span className="font-bold">{option.votes} votes ({percentage}%)</span>
                                        </div>
                                        <div className="border-2 border-black h-8 bg-white">
                                            <div
                                                className="h-full bg-orange-500 transition-all duration-500"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <div className="mt-6 p-4 border-2 border-black bg-gray-100">
                        <p className="font-bold" style={{ fontFamily: "'Space Mono', monospace" }}>✓ YOU HAVE VOTED IN THIS POLL</p>
                    </div>
                </div>
            ) : (
                // Voting UI
                <div className="border-4 border-black p-8">
                    <h2 className="text-3xl font-black mb-6 tracking-tighter" style={{ fontFamily: "'Space Mono', monospace" }}>CAST YOUR VOTE</h2>
                    <div className="space-y-4 mb-8">
                        {poll.options.map((option) => (
                            <label
                                key={option.id}
                                className={`border-2 border-black p-6 flex items-center cursor-pointer hover:bg-gray-100 transition-colors ${selectedOption === option.id ? 'bg-orange-500 text-white border-orange-500' : ''
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="poll-option"
                                    value={option.id}
                                    checked={selectedOption === option.id}
                                    onChange={() => setSelectedOption(option.id)}
                                    className="w-6 h-6 mr-4"
                                />
                                <span className="text-lg font-bold" style={{ fontFamily: "'Space Mono', monospace" }}>{option.text}</span>
                            </label>
                        ))}
                    </div>
                    <>{/* Options rendered above */}</>
                    <button
                        onClick={handleVoteSubmit}
                        disabled={!selectedOption || poll.isClosed}
                        style={{ fontFamily: "'Space Mono', monospace" }}
                        className={`w-full border-2 border-black px-8 py-4 text-xl font-bold transition-colors ${selectedOption && !poll.isClosed
                            ? 'bg-orange-500 text-white hover:bg-black'
                            : 'bg-gray-200 cursor-not-allowed text-gray-400'
                            }`}
                    >
                        {poll.isClosed ? 'POLLING ENDED' : 'SUBMIT VOTE'}
                    </button>
                    {poll.isClosed && (
                        <p className="text-center mt-4 text-red-600 font-bold" style={{ fontFamily: "'Space Mono', monospace" }}>
                            This poll has been closed. No further votes are accepted.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
