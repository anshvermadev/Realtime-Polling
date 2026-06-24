'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { Poll } from '../../../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowLeft, Download, ExternalLink } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

interface VoteRecord {
    userId: string;
    userName: string;
    userEmail: string;
    optionId: string;
    timestamp: string;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

export default function AnalyticsPage() {
    const { id } = useParams();
    const router = useRouter();
    const { currentUser } = useAuth();
    const [poll, setPoll] = useState<Poll | null>(null);
    const [votes, setVotes] = useState<VoteRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                // Fetch Poll Info
                const pollRef = doc(db, 'polls', id as string);
                const pollSnap = await getDoc(pollRef);

                if (pollSnap.exists()) {
                    setPoll({ id: pollSnap.id, ...pollSnap.data() } as Poll);
                }

                // Fetch Votes Subcollection
                const votesRef = collection(db, 'polls', id as string, 'votes');
                const q = query(votesRef, orderBy('timestamp', 'desc'));
                const querySnapshot = await getDocs(q);

                const votesData = querySnapshot.docs.map(doc => doc.data() as VoteRecord);
                setVotes(votesData);

            } catch (error) {
                console.error("Error fetching analytics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        if (!loading && !currentUser?.isAdmin) {
            router.push('/');
        }
    }, [loading, currentUser, router]);

    if (loading) return <div className="p-12 text-center font-bold">Loading Analytics...</div>;
    if (!currentUser?.isAdmin) return null; // Prevent flash


    if (!poll) return <div className="p-12 text-center font-bold">Poll not found</div>;

    // Prepare Chart Data
    const chartData = poll.options.map(opt => ({
        name: opt.text,
        votes: opt.votes
    }));

    const exportDetailedData = () => {
        const csvContent = "data:text/csv;charset=utf-8,"
            + "User Name,User Email,Option Selected,Timestamp\n"
            + votes.map(v => {
                const optionText = poll.options.find(o => o.id === v.optionId)?.text || 'Unknown';
                return `"${v.userName || 'Anonymous'}","${v.userEmail}","${optionText}","${new Date(v.timestamp).toLocaleString()}"`;
            }).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `analytics_${poll.id}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 md:px-8 md:py-12">
            <button
                onClick={() => router.push('/admin')}
                className="flex items-center gap-2 mb-6 md:mb-8 font-bold hover:underline"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0 mb-8 md:mb-12 border-b-4 border-black pb-6 md:pb-8">
                <div>
                    <span className="text-orange-500 font-bold text-sm tracking-widest uppercase mb-2 block">{poll.category}</span>
                    <h1 className="text-4xl font-black tracking-tighter mb-2">ANALYTICS: {poll.title}</h1>
                    <p className="font-mono text-gray-600">Total Votes: {poll.totalVotes}</p>
                </div>
                <button
                    onClick={exportDetailedData}
                    className="flex justify-center w-full md:w-auto items-center gap-2 border-2 border-black bg-black text-white px-6 py-3 font-bold hover:bg-orange-500 transition-colors"
                >
                    <Download className="w-4 h-4" /> EXPORT DETAILED CSV
                </button>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                <div className="border-4 border-black p-6">
                    <h3 className="text-xl font-bold mb-6 border-b-2 border-black pb-2">VOTE DISTRIBUTION</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="votes" fill="#f97316" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="border-4 border-black p-6">
                    <h3 className="text-xl font-bold mb-6 border-b-2 border-black pb-2">PERCENTAGE SHARE</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="votes"
                                    label
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Detailed Table */}
            <div className="border-4 border-black p-4 md:p-8 bg-white">
                <h3 className="text-2xl font-black mb-6">DETAILED VOTING RECORD</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-black bg-gray-100">
                                <th className="p-3 md:p-4 font-bold border-r-2 border-black min-w-[120px]">User Name</th>
                                <th className="p-3 md:p-4 font-bold border-r-2 border-black min-w-[200px]">Email</th>
                                <th className="p-3 md:p-4 font-bold border-r-2 border-black min-w-[150px]">Option Selected</th>
                                <th className="p-3 md:p-4 font-bold min-w-[150px]">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {votes.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-500">No votes recorded yet.</td>
                                </tr>
                            ) : (
                                votes.map((vote, idx) => (
                                    <tr key={idx} className="border-b border-gray-300 hover:bg-gray-50">
                                        <td className="p-3 md:p-4 border-r border-gray-300 font-medium">{vote.userName || 'Anonymous'}</td>
                                        <td className="p-3 md:p-4 border-r border-gray-300 font-mono text-sm">{vote.userEmail}</td>
                                        <td className="p-3 md:p-4 border-r border-gray-300">
                                            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-bold uppercase">
                                                {poll.options.find(o => o.id === vote.optionId)?.text || 'Unknown'}
                                            </span>
                                        </td>
                                        <td className="p-3 md:p-4 text-sm text-gray-600">
                                            {new Date(vote.timestamp).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
