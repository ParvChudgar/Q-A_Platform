import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Spinner from '../components/Spinner';
import Tag from '../components/Tag';
import VoteControl from '../components/VoteControl';
import RichTextEditor from '../components/RichTextEditor';
import AuthContext from '../context/AuthContext';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const QuestionPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [answerContent, setAnswerContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchQuestion = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/api/questions/${id}`);
            // Sort answers: accepted first, then by votes
            data.answers.sort((a, b) => {
                if (a.isAccepted) return -1;
                if (b.isAccepted) return 1;
                return b.votes - a.votes;
            });
            setQuestion(data);
        } catch (error) {
            console.error("Failed to fetch question:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestion();
    }, [id]);

    const handleAnswerSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }
        setIsSubmitting(true);
        try {
            await api.post(`/api/questions/${id}/answers`, { content: answerContent });
            setAnswerContent('');
            fetchQuestion(); // Re-fetch to show the new answer
        } catch (error) {
            console.error("Failed to submit answer:", error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleAcceptAnswer = async (answerId) => {
        try {
            await api.post(`/api/questions/${question._id}/accept/${answerId}`);
            fetchQuestion(); // Re-fetch to update state
        } catch(error) {
            console.error("Failed to accept answer", error);
        }
    }

    if (loading) return <Spinner />;
    if (!question) return <div className="text-center text-red-500">Question not found.</div>;

    const isOwner = user && user._id === question.author._id;

    return (
        <div>
            {/* Question Section */}
            <div className="bg-secondary p-6 rounded-lg">
                <h1 className="text-3xl font-bold mb-2 text-white">{question.title}</h1>
                <div className="flex space-x-2 mb-4">
                    {question.tags.map(tag => <Tag key={tag._id} name={tag.name} />)}
                </div>
                <hr className="border-gray-600" />
                <div className="flex mt-4">
                    <VoteControl target={{ type: 'questions', id: question._id }} initialVotes={question.votes} />
                    <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: question.description }} />
                </div>
                <div className="text-right text-sm text-gray-400 mt-4">
                    Asked by <span className="text-blue-400">{question.author.username}</span>
                </div>
            </div>

            {/* Answers Section */}
            <h2 className="text-2xl font-bold mt-8 mb-4 text-white">{question.answers.length} Answers</h2>
            <div className="space-y-6">
                {question.answers.map(answer => (
                    <div key={answer._id} className={`bg-secondary p-4 rounded-lg flex ${answer.isAccepted ? 'border-2 border-green-500' : ''}`}>
                         <div className="flex flex-col items-center mr-4">
                            <VoteControl target={{ type: 'answers', id: answer._id }} initialVotes={answer.votes} />
                            {answer.isAccepted && <CheckCircleIcon className="h-8 w-8 text-green-500 mt-2" title="Accepted Answer"/>}
                            {isOwner && !answer.isAccepted && (
                                <button onClick={() => handleAcceptAnswer(answer._id)} className="mt-2 p-1 rounded-full hover:bg-gray-600" title="Accept this answer">
                                    <CheckCircleIcon className="h-6 w-6 text-gray-500 hover:text-green-400" />
                                </button>
                            )}
                        </div>
                        <div className="flex-grow">
                             <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: answer.content }} />
                             <div className="text-right text-sm text-gray-400 mt-4">
                                Answered by <span className="text-blue-400">{answer.author.username}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Post Answer Section */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4 text-white">Your Answer</h2>
                <form onSubmit={handleAnswerSubmit}>
                    <RichTextEditor value={answerContent} onChange={setAnswerContent} />
                    <button type="submit" disabled={isSubmitting || !answerContent} className="mt-4 bg-accent hover:bg-blue-600 text-white font-bold py-2 px-6 rounded disabled:bg-gray-500">
                        {isSubmitting ? 'Submitting...' : 'Post Your Answer'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default QuestionPage;