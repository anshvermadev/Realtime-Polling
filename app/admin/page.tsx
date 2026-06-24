'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePolls } from '../context/PollContext';
import { db } from '../lib/firebase';
import { collection, updateDoc, deleteDoc, doc, setDoc, getDoc } from 'firebase/firestore';
import { generateSlug } from '../lib/utils';
import { Poll, PollOption } from '../types';
import { Trash2, Edit, Plus, Download, BarChart2, CheckCircle, XCircle, Lock, Unlock, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';

export default function AdminPage() {
    const { currentUser, login } = useAuth();
    const { polls } = usePolls();
    const [isEditing, setIsEditing] = useState(false);
    const [currentPoll, setCurrentPoll] = useState<Partial<Poll> | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [pollToDelete, setPollToDelete] = useState<string | null>(null);

    // Simple poll form state
    const emptyPoll: Partial<Poll> = {
        title: '',
        category: '',
        description: '',
        headerImage: '',
        createdBy: '',
        deadline: '',
        totalVotes: 0,
        options: [
            { id: 'opt1', text: '', votes: 0 },
            { id: 'opt2', text: '', votes: 0 }
        ],
        voters: [],
        isActive: true,
        isClosed: false,
        showResults: false
    };

    // Protect route: 404 if not admin
    if (!currentUser?.isAdmin) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <h1 className="text-9xl font-black mb-4">404</h1>
                <p className="text-xl font-bold mb-8">PAGE NOT FOUND</p>
                <p className="max-w-md mb-8">The page you are looking for does not exist or you do not have permission to view it.</p>
                <a href="/" className="border-2 border-black px-6 py-3 font-bold hover:bg-black hover:text-white transition-colors">
                    RETURN HOME
                </a>
            </div>
        );
    }

    const handleSave = async () => {
        if (!currentPoll?.title || !currentPoll.options) return;

        try {
            if (currentPoll.id) {
                // Update
                const pollRef = doc(db, 'polls', currentPoll.id);
                const { id, ...data } = currentPoll; // Exclude ID from data
                await updateDoc(pollRef, data as any);
            } else {
                // Create with slug as ID
                let slug = generateSlug(currentPoll.title);

                // Check if slug exists
                const checkDoc = await getDoc(doc(db, 'polls', slug));
                if (checkDoc.exists()) {
                    // Append timestamp if duplicate
                    slug = `${slug}-${Date.now()}`;
                }

                const newPoll = { ...currentPoll, totalVotes: 0, voters: [] };
                // Use setDoc to specify the ID
                await setDoc(doc(db, 'polls', slug), newPoll);
            }

            setIsEditing(false);
            setCurrentPoll(null);
        } catch (error) {
            console.error("Error saving poll: ", error);
            alert("Error saving: " + error);
        }
    };

    const handleDelete = (id: string) => {
        setPollToDelete(id);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (pollToDelete) {
            await deleteDoc(doc(db, 'polls', pollToDelete));
            setDeleteModalOpen(false);
            setPollToDelete(null);
        }
    };

    const exportData = () => {
        const csvContent = "data:text/csv;charset=utf-8,"
            + "Poll ID,Title,Total Votes,Option,Option Votes\n"
            + polls.map(p =>
                p.options.map(o =>
                    `${p.id},"${p.title}",${p.totalVotes},"${o.text}",${o.votes}`
                ).join("\n")
            ).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "poll_data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 md:px-8 md:py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0 mb-8 md:mb-12 border-b-4 border-black pb-6 md:pb-8">
                <div>
                    <h1 className="text-5xl font-black tracking-tighter mb-2">ADMIN DASHBOARD</h1>
                    <p className="font-mono text-gray-600">Manage polls and view real-time analytics.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <button
                        onClick={exportData}
                        className="flex items-center justify-center gap-2 border-2 border-black px-4 py-2 font-bold hover:bg-gray-100 transition-colors"
                    >
                        <Download className="w-4 h-4" /> EXPORT DATA
                    </button>
                    <button
                        onClick={() => { setCurrentPoll(emptyPoll); setIsEditing(true); }}
                        className="flex items-center justify-center gap-2 border-2 border-black bg-black text-white px-4 py-2 font-bold hover:bg-orange-500 transition-colors"
                    >
                        <Plus className="w-4 h-4" /> CREATE POLL
                    </button>
                </div>
            </div>

            {isEditing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white border-4 border-black w-full max-w-2xl p-4 md:p-8 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-3xl font-black mb-6">{currentPoll?.id ? 'EDIT POLL' : 'CREATE NEW POLL'}</h2>

                        <div className="grid gap-6">
                            <div>
                                <label className="block font-bold mb-2">Title</label>
                                <input
                                    className="w-full border-2 border-black p-3"
                                    value={currentPoll?.title || ''}
                                    onChange={e => setCurrentPoll(prev => ({ ...prev!, title: e.target.value }))}
                                />
                            </div>

                            <div>
                                <label className="block font-bold mb-2">Header Image URL</label>
                                <div className="flex gap-2">
                                    <input
                                        className="w-full border-2 border-black p-3"
                                        value={currentPoll?.headerImage || ''}
                                        onChange={e => setCurrentPoll(prev => ({ ...prev!, headerImage: e.target.value }))}
                                        placeholder="https://..."
                                    />
                                    {currentPoll?.headerImage && (
                                        <div className="w-12 h-12 border-2 border-black overflow-hidden shrink-0">
                                            <img src={currentPoll.headerImage} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block font-bold mb-2">Category</label>
                                    <input
                                        className="w-full border-2 border-black p-3"
                                        value={currentPoll?.category || ''}
                                        onChange={e => setCurrentPoll(prev => ({ ...prev!, category: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold mb-2">Created By</label>
                                    <input
                                        className="w-full border-2 border-black p-3"
                                        value={currentPoll?.createdBy || ''}
                                        onChange={e => setCurrentPoll(prev => ({ ...prev!, createdBy: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold mb-2">Deadline</label>
                                    <input
                                        type="date"
                                        className="w-full border-2 border-black p-3"
                                        value={(() => {
                                            if (!currentPoll?.deadline) return '';
                                            try {
                                                const date = new Date(currentPoll.deadline);
                                                if (isNaN(date.getTime())) return '';
                                                // unique fix for timezone offset: use local components
                                                const year = date.getFullYear();
                                                const month = String(date.getMonth() + 1).padStart(2, '0');
                                                const day = String(date.getDate()).padStart(2, '0');
                                                return `${year}-${month}-${day}`;
                                            } catch { return ''; }
                                        })()}
                                        onChange={e => {
                                            if (!e.target.value) return;
                                            // Handle as local date (append time to force local parsing if needed, 
                                            // but YYYY-MM-DD + 'T00:00' helps usually, or just components)
                                            const parts = e.target.value.split('-');
                                            const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));

                                            const formatted = date.toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            });
                                            setCurrentPoll(prev => ({ ...prev!, deadline: formatted }));
                                        }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold mb-2">Description</label>
                                <textarea
                                    className="w-full border-2 border-black p-3 h-32"
                                    value={currentPoll?.description || ''}
                                    onChange={e => setCurrentPoll(prev => ({ ...prev!, description: e.target.value }))}
                                />
                            </div>

                            <div>
                                <label className="block font-bold mb-2">Options</label>
                                {currentPoll?.options?.map((opt, idx) => (
                                    <div key={idx} className="flex gap-2 mb-2">
                                        <input
                                            className="w-full border-2 border-black p-2"
                                            value={opt.text}
                                            placeholder={`Option ${idx + 1}`}
                                            onChange={e => {
                                                const newOpts = [...(currentPoll?.options || [])];
                                                newOpts[idx] = { ...newOpts[idx], text: e.target.value };
                                                setCurrentPoll(prev => ({ ...prev!, options: newOpts }));
                                            }}
                                        />
                                        <button
                                            onClick={() => {
                                                const newOpts = (currentPoll?.options || []).filter((_, i) => i !== idx);
                                                setCurrentPoll(prev => ({ ...prev!, options: newOpts }));
                                            }}
                                            className="bg-red-500 text-white p-2 border-2 border-black"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => setCurrentPoll(prev => ({ ...prev!, options: [...(prev?.options || []), { id: `opt${Date.now()}`, text: '', votes: 0 }] }))}
                                    className="text-sm font-bold underline mt-2"
                                >
                                    + ADD OPTION
                                </button>
                            </div>

                            <div className="flex gap-4 mt-4">
                                <button
                                    onClick={handleSave}
                                    className="flex-1 bg-black text-white py-3 font-bold border-2 border-black hover:bg-orange-500 transition-colors"
                                >
                                    SAVE POLL
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="flex-1 bg-white py-3 font-bold border-2 border-black hover:bg-gray-100 transition-colors"
                                >
                                    CANCEL
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {deleteModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-red-50 border-4 border-black w-full max-w-md p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <div className="flex justify-center mb-4 text-red-600">
                            <Trash2 className="w-16 h-16" />
                        </div>
                        <h2 className="text-3xl font-black mb-4 text-center text-red-600">DELETE POLL?</h2>
                        <p className="font-bold text-center mb-8">
                            Are you sure you want to delete this poll? This action cannot be undone and all vote data will be lost.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={confirmDelete}
                                className="flex-1 bg-red-600 text-white py-3 font-black border-2 border-black hover:bg-red-700 hover:scale-105 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                            >
                                DELETE
                            </button>
                            <button
                                onClick={() => { setDeleteModalOpen(false); setPollToDelete(null); }}
                                className="flex-1 bg-white py-3 font-black border-2 border-black hover:bg-gray-100 hover:scale-105 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                            >
                                CANCEL
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid gap-8">
                {polls.map(poll => (
                    <div key={poll.id} className="border-4 border-black p-4 md:p-6 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
                        <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4 md:gap-0">
                            <div>
                                <span className="text-orange-500 font-bold text-xs font-mono mb-1 block">{poll.category}</span>
                                <h3 className="text-2xl font-black">{poll.title}</h3>
                            </div>
                            <div className="flex flex-wrap gap-3 w-full md:w-auto">
                                <button
                                    onClick={() => { setCurrentPoll(poll); setIsEditing(true); }}
                                    className="group relative p-2 border-2 border-black transition-all duration-200 hover:scale-110 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-200"
                                >
                                    <Edit className="w-5 h-5" />
                                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1 bg-black text-white text-sm font-black whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] z-10">
                                        Edit Poll
                                    </span>
                                </button>
                                <button
                                    onClick={async () => {
                                        await updateDoc(doc(db, 'polls', poll.id), { isActive: !poll.isActive });
                                    }}
                                    className={`group relative p-2 border-2 border-black transition-all duration-200 hover:scale-110 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${poll.isActive === false ? 'bg-gray-300 hover:bg-gray-400' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                                >
                                    {poll.isActive === false ? <XCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1 bg-black text-white text-sm font-black whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] z-10">
                                        {poll.isActive === false ? "Activate" : "Deactivate"}
                                    </span>
                                </button>
                                <button
                                    onClick={async () => {
                                        await updateDoc(doc(db, 'polls', poll.id), { isClosed: !poll.isClosed });
                                    }}
                                    className={`group relative p-2 border-2 border-black transition-all duration-200 hover:scale-110 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${poll.isClosed ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                                >
                                    {poll.isClosed ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1 bg-black text-white text-sm font-black whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] z-10">
                                        {poll.isClosed ? "Open Polling" : "Close Polling"}
                                    </span>
                                </button>
                                <button
                                    onClick={async () => {
                                        await updateDoc(doc(db, 'polls', poll.id), { showResults: !poll.showResults });
                                    }}
                                    className={`group relative p-2 border-2 border-black transition-all duration-200 hover:scale-110 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${poll.showResults === false ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' : 'bg-purple-100 text-purple-600 hover:bg-purple-200'}`}
                                >
                                    {poll.showResults === false ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1 bg-black text-white text-sm font-black whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] z-10">
                                        {poll.showResults === false ? "Show Results" : "Hide Results"}
                                    </span>
                                </button>
                                <button
                                    onClick={() => handleDelete(poll.id)}
                                    className="group relative p-2 border-2 border-black hover:bg-red-500 hover:text-white transition-all duration-200 hover:scale-110 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-red-600"
                                >
                                    <Trash2 className="w-5 h-5" />
                                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1 bg-black text-white text-sm font-black whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] z-10">
                                        Delete Poll
                                    </span>
                                </button>
                                <button
                                    onClick={() => window.location.href = `/admin/analytics/${poll.id}`}
                                    className="group relative p-2 border-2 border-black hover:bg-indigo-200 text-purple-600 transition-all duration-200 hover:scale-110 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                >
                                    <BarChart2 className="w-5 h-5" />
                                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1 bg-black text-white text-sm font-black whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] z-10">
                                        Analytics
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="font-bold border-b-2 border-black mb-4 pb-2 flex items-center gap-2">
                                    <BarChart2 className="w-4 h-4" /> LIVE RESULTS
                                </h4>
                                <div className="space-y-3">
                                    {poll.options.map(opt => (
                                        <div key={opt.id} className="relative">
                                            <div className="flex justify-between text-sm mb-1 font-mono">
                                                <span>{opt.text}</span>
                                                <span className="font-bold">{opt.votes}</span>
                                            </div>
                                            <div className="h-2 bg-gray-200 border border-black">
                                                <div
                                                    className="h-full bg-orange-500"
                                                    style={{ width: `${poll.totalVotes ? (opt.votes / poll.totalVotes) * 100 : 0}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    <div className="text-right font-bold mt-2">TOTAL: {poll.totalVotes}</div>
                                </div>
                            </div>

                            <div className="bg-gray-50 border-2 border-black p-4">
                                <h4 className="font-bold mb-2">DETAILS</h4>
                                <p className="text-sm text-gray-600 mb-1"><span className="font-bold">ID:</span> {poll.id}</p>
                                <p className="text-sm text-gray-600 mb-1"><span className="font-bold">Created By:</span> {poll.createdBy}</p>
                                <p className="text-sm text-gray-600 mb-1"><span className="font-bold">Deadline:</span> {poll.deadline}</p>
                                <div className="mt-4 pt-4 border-t border-gray-300 flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                                    <span className="text-xs font-bold text-green-600">LIVE SYNC ACTIVE</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
