import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import Spinner from '../components/Spinner';
import Tag from '../components/Tag';

const HomePage = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setLoading(true);
                const { data } = await api.get('/api/questions');
                setQuestions(data.questions);
            } catch (error) {
                console.error("Failed to fetch questions:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    if (loading) return <Spinner />;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-white">All Questions</h1>
            <div className="space-y-4">
                {questions.map(q => (
                    <div key={q._id} className="bg-secondary p-4 rounded-lg shadow-lg flex">
                        <div className="flex flex-col items-center mr-4 text-center">
                            <span className="text-2xl font-bold">{q.votes}</span>
                            <span className="text-sm text-gray-400">votes</span>
                            <span className="text-2xl font-bold mt-2">{q.answers.length}</span>
                            <span className="text-sm text-gray-400">answers</span>
                        </div>
                        <div className="flex-grow">
                            <Link to={`/questions/${q._id}`} className="text-xl text-blue-400 hover:text-blue-300 font-semibold">
                                {q.title}
                            </Link>
                            <div className="mt-2">
                                {q.tags.map(tag => <Tag key={tag._id} name={tag.name} />)}
                            </div>
                            <div className="text-right text-sm text-gray-400 mt-2">
                                asked by <span className="text-blue-400">{q.author.username}</span> on {new Date(q.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;