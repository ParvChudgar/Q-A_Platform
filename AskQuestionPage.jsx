import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import RichTextEditor from '../components/RichTextEditor';
import AsyncSelect from 'react-select/async';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const AskQuestionPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    navigate('/login?redirect=/ask');
    return null;
  }

  const handleTagSearch = async (inputValue) => {
    if (!inputValue) return [];
    try {
      const { data } = await api.get(`/api/tags?search=${inputValue}`);
      return data.map(tag => ({ value: tag.name, label: tag.name }));
    } catch (err) {
      console.error('Tag search failed:', err);
      return [];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const plainTextDescription = description.replace(/<[^>]+>/g, '').trim();

    if (!title.trim() || tags.length === 0) {
      setError('Please fill in title and at least one tag.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const tagNames = tags.map(t => t.value);
      const { data } = await api.post('/api/questions', {
        title: title.trim(),
        description,
        tags: tagNames,
      });

      navigate(`/questions/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
      setIsSubmitting(false);
    }
  };

  const customStyles = {
    control: (styles) => ({ ...styles, backgroundColor: '#2d3748', border: '1px solid #4a5568' }),
    multiValue: (styles) => ({ ...styles, backgroundColor: '#4a5568' }),
    multiValueLabel: (styles) => ({ ...styles, color: '#e2e8f0' }),
    input: (styles) => ({ ...styles, color: '#e2e8f0' }),
    menu: (styles) => ({ ...styles, backgroundColor: '#2d3748' }),
    option: (styles, { isFocused, isSelected }) => ({
      ...styles,
      backgroundColor: isSelected ? '#3b82f6' : isFocused ? '#4a5568' : '#2d3748',
    }),
  };

  return (
    <div className="max-w-4xl mx-auto bg-secondary p-8 rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-white">Ask a Public Question</h1>
      {error && <div className="bg-red-500/20 text-red-300 p-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-lg font-medium text-gray-300">Title</label>
          <p className="text-sm text-gray-400 mb-2">Be specific and imagine you’re asking a question to another person.</p>
          <input
            type="text"
            id="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full bg-primary border border-gray-600 rounded-md p-2 text-white focus:ring-accent focus:border-accent"
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-300">Description</label>
          <p className="text-sm text-gray-400 mb-2">Include all the information someone would need to answer your question.</p>
          <RichTextEditor value={description} onChange={setDescription} />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-300">Tags</label>
          <p className="text-sm text-gray-400 mb-2">Add up to 5 tags to describe what your question is about.</p>
          <AsyncSelect
            isMulti
            cacheOptions
            defaultOptions
            components={animatedComponents}
            loadOptions={handleTagSearch}
            onChange={(selected) => {
              if (selected.length <= 5) setTags(selected);
            }}
            value={tags}
            placeholder="e.g. (react jwt nodejs)"
            styles={customStyles}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-accent hover:bg-blue-600 text-white font-bold py-2 px-6 rounded disabled:bg-gray-500"
        >
          {isSubmitting ? 'Submitting...' : 'Post Your Question'}
        </button>
      </form>
    </div>
  );
};

export default AskQuestionPage;
