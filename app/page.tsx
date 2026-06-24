import React from 'react';
import HomeClient from './components/HomeClient';
import { getCachedPolls } from './lib/get-cached-polls';

export const revalidate = 60; // Optional: Segment-level revalidation

export default async function Home() {
  const polls = await getCachedPolls();

  return <HomeClient initialPolls={polls} />;
}