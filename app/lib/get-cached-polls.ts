import { unstable_cache } from 'next/cache';
import { db } from './firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { Poll } from '../types';

export const getCachedPolls = unstable_cache(
    async () => {
        try {
            const q = query(collection(db, 'polls'), orderBy('deadline', 'asc'));
            const snapshot = await getDocs(q);

            const polls = snapshot.docs.map(doc => {
                const data = doc.data();
                // Ensure data is serializable. 
                // If deadline is already a string in Firestore/Context, we are good.
                // If it returns complex objects for Timestamps, we might need to convert.
                // Based on PollContext, it seems to just spread data, implying simple types.
                return {
                    id: doc.id,
                    ...data
                };
            }) as Poll[];

            return polls;
        } catch (error) {
            console.error("Error fetching cached polls:", error);
            return [];
        }
    },
    ['polls-home-cache'],
    { revalidate: 30, tags: ['polls'] }
);
