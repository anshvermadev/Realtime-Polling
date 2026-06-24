'use client';

import React from 'react';
import Link from 'next/link';
import { Poll } from '../types';

interface PollCardProps {
    poll: Poll;
}

export default function PollCard({ poll }: PollCardProps) {
    return (
        <Link href={`/polls/${poll.id}`}>
            <div className="border-4 border-black bg-white cursor-pointer transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:border-orange-500 h-full flex flex-col">
                <img
                    src={poll.headerImage}
                    alt={poll.title}
                    className="w-full aspect-video object-cover border-b-4 border-black"
                />
                <div className="p-6 flex flex-col flex-grow relative">
                    <div className="flex justify-between items-start mb-2">
                        <div className="text-xs font-bold text-orange-500" style={{ fontFamily: "'Space Mono', monospace" }}>
                            {poll.category}
                        </div>
                        {poll.isClosed && (
                            <span className="bg-red-600 text-white text-[10px] px-2 py-1 font-bold" style={{ fontFamily: "'Space Mono', monospace" }}>
                                CLOSED
                            </span>
                        )}
                    </div>
                    <h3 className="text-xl md:text-2xl font-black mb-3 tracking-tighter break-words">{poll.title}</h3>
                    <p className="mb-4 text-sm flex-grow" style={{ fontFamily: "'Space Mono', monospace" }}>
                        {poll.description.substring(0, 120)}...
                    </p>
                    <div className="flex justify-between items-center text-sm border-t-2 border-black pt-4" style={{ fontFamily: "'Space Mono', monospace" }}>
                        <span className="font-bold">{poll.totalVotes} VOTES</span>
                        <span>{poll.deadline}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
