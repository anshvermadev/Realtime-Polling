'use client';

import React, { useState } from 'react';
import { initialPolls } from '../data/polls';
import { db } from '../lib/firebase';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';

export default function SeedPage() {
    const [status, setStatus] = useState('Idle');

    const seedData = async () => {
        try {
            setStatus('Checking existing data...');
            const pollsRef = collection(db, 'polls');
            const snapshot = await getDocs(pollsRef);

            if (!snapshot.empty) {
                setStatus('Data already exists. Skipping seed.');
                return;
            }

            setStatus('Seeding data...');
            for (const poll of initialPolls) {
                await setDoc(doc(db, 'polls', poll.id), poll);
            }
            setStatus('Seeding complete!');
        } catch (error) {
            console.error(error);
            setStatus('Error: ' + error);
        }
    };

    const clearData = async () => {
        // Warning: dangerous in prod, helpful for dev
        try {
            setStatus('Clearing data...');
            const pollsRef = collection(db, 'polls');
            const snapshot = await getDocs(pollsRef);
            for (const d of snapshot.docs) {
                // We don't delete subcollections here deeply easily without cloud functions, 
                // but for dev main docs is enough to reset 'polls' list
                // This is just a helper
            }
            setStatus('Clear manual needed (delete from console)');
        } catch (error) {
            setStatus('Error: ' + error);
        }
    };

    return (
        <div className="p-10 font-sans">
            <h1 className="text-3xl font-bold mb-4">Database Seeder</h1>
            <p className="mb-4">Status: {status}</p>
            <div className="flex gap-4">
                <button
                    onClick={seedData}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    Seed Initial Polls
                </button>
            </div>
        </div>
    );
}
