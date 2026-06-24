'use client';

import React from 'react';
import { usePolls } from '../context/PollContext';
import PollCard from './PollCard';
import { Poll } from '../types';

interface HomeClientProps {
    initialPolls: Poll[];
}

export default function HomeClient({ initialPolls }: HomeClientProps) {
    const { polls: contextPolls } = usePolls();

    // Use context polls if available (loaded), otherwise fall back to initial (cached) polls
    // We prefer contextPolls if length > 0, assuming real-time updates might have happened.
    // However, initialPolls might ideally be shown while contextPolls are empty.
    // PollContext starts with [].
    const polls = contextPolls.length > 0 ? contextPolls : initialPolls;

    return (
        <main>
            {/* Hero Section */}
            <section className="border-b-4 border-black py-16 px-8 bg-orange-500 text-white">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-6xl font-black mb-4 tracking-tighter">ACTIVITY FEED<span style={{ fontFamily: "'EB Garamond', serif", fontStyle: "italic" }}>.</span></h2>
                    <p className="text-xl max-w-2xl" style={{ fontFamily: "'Space Mono', monospace" }}>
                        Browse active polls and make your voice heard. Vote on the innovations that matter most to you.
                    </p>
                </div>
            </section>

            {/* Active Polls */}
            <section className="py-16 px-8">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-black mb-12 tracking-tighter" style={{ fontFamily: "'Space Mono', monospace" }}>ACTIVE POLLS.</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {polls.filter(p => p.isActive !== false).map((poll) => (
                            <PollCard key={poll.id} poll={poll} />
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
