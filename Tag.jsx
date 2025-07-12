import React from 'react';

const Tag = ({ name }) => {
    return (
        <span className="bg-secondary text-blue-300 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
            {name}
        </span>
    );
};

export default Tag;