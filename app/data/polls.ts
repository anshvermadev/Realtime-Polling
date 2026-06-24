import { Poll } from '../types';

export const initialPolls: Poll[] = [
    {
        id: 'poll1',
        title: 'BEST AI INNOVATION 2025',
        category: 'ARTIFICIAL INTELLIGENCE',
        description: 'Which AI breakthrough has had the most significant impact on society this year? Consider factors like accessibility, real-world applications, and potential for future development.',
        headerImage: 'https://i.ibb.co/pjHWsVNM/Presents-700-x-400-px.png',
        createdBy: 'Tech Innovation Committee',
        deadline: 'Dec 31, 2025',
        totalVotes: 0,
        options: [
            { id: 'opt1', text: 'Advanced Language Models', votes: 0 },
            { id: 'opt2', text: 'Medical Diagnosis AI', votes: 0 },
            { id: 'opt3', text: 'Autonomous Vehicles', votes: 0 },
            { id: 'opt4', text: 'AI-Powered Climate Solutions', votes: 0 }
        ],
        voters: []
    },
    {
        id: 'poll2',
        title: 'MOST IMPACTFUL EDTECH TOOL',
        category: 'EDUCATION TECHNOLOGY',
        description: 'Vote for the educational technology tool that has transformed learning experiences in universities. Consider ease of use, engagement levels, and learning outcomes.',
        headerImage: 'https://i.ibb.co/pjHWsVNM/Presents-700-x-400-px.png',
        createdBy: 'Student Technology Board',
        deadline: 'Jan 15, 2026',
        totalVotes: 0,
        options: [
            { id: 'opt1', text: 'Interactive Virtual Labs', votes: 0 },
            { id: 'opt2', text: 'AI Tutoring Systems', votes: 0 },
            { id: 'opt3', text: 'Collaborative Learning Platforms', votes: 0 },
            { id: 'opt4', text: 'VR Educational Experiences', votes: 0 }
        ],
        voters: []
    },
    {
        id: 'poll3',
        title: 'BLOCKCHAIN USE CASE OF THE YEAR',
        category: 'BLOCKCHAIN',
        description: 'Which blockchain application demonstrated the most practical real-world value? We\'re looking for projects that solved actual problems beyond speculation.',
        headerImage: 'https://i.ibb.co/pjHWsVNM/Presents-700-x-400-px.png',
        createdBy: 'Crypto Research Lab',
        deadline: 'Jan 5, 2026',
        totalVotes: 0,
        options: [
            { id: 'opt1', text: 'Supply Chain Transparency', votes: 0 },
            { id: 'opt2', text: 'Digital Identity Verification', votes: 0 },
            { id: 'opt3', text: 'Decentralized Finance (DeFi)', votes: 0 },
            { id: 'opt4', text: 'NFTs for Digital Rights', votes: 0 }
        ],
        voters: []
    },
    {
        id: 'poll4',
        title: 'SUSTAINABILITY INNOVATION AWARD',
        category: 'ENVIRONMENTAL TECH',
        description: 'Select the green technology initiative that shows the most promise for combating climate change and promoting environmental sustainability.',
        headerImage: 'https://i.ibb.co/pjHWsVNM/Presents-700-x-400-px.png',
        createdBy: 'Green Campus Initiative',
        deadline: 'Dec 28, 2025',
        totalVotes: 0,
        options: [
            { id: 'opt1', text: 'Carbon Capture Technology', votes: 0 },
            { id: 'opt2', text: 'Renewable Energy Grid Systems', votes: 0 },
            { id: 'opt3', text: 'Sustainable Agriculture IoT', votes: 0 },
            { id: 'opt4', text: 'Ocean Cleanup Robotics', votes: 0 }
        ],
        voters: []
    }
];
