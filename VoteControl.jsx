import React, { useState, useContext } from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const VoteControl = ({ target, initialVotes }) => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [votes, setVotes] = useState(initialVotes);

    const handleVote = async (voteType) => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            const { data } = await api.post(`/api/${target.type}/${target.id}/vote`, { voteType });
            setVotes(data.votes);
        } catch (error) {
            console.error("Vote failed:", error.response?.data?.message || error.message);
        }
    };

    return (
        <div className="flex flex-col items-center mr-4">
            <button onClick={() => handleVote('upvote')} className="text-gray-400 hover:text-green-500">
                <ArrowUpIcon className="h-6 w-6" />
            </button>
            <span className="text-xl font-bold text-white">{votes}</span>
            <button onClick={() => handleVote('downvote')} className="text-gray-400 hover:text-red-500">
                <ArrowDownIcon className="h-6 w-6" />
            </button>
        </div>
    );
};

export default VoteControl;