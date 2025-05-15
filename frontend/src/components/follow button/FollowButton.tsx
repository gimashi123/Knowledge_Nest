import React, { useState } from 'react';

type FollowButtonProps = {
    initialFollowing?: boolean;
};

const FollowButton: React.FC<FollowButtonProps> = ({ initialFollowing = false }) => {
    const [isFollowing, setIsFollowing] = useState(initialFollowing);

    const handleFollowToggle = () => {
        setIsFollowing(prev => !prev);
        // You can also call API here to update follow status
    };

    return (
        <button
            onClick={handleFollowToggle}
            className={`px-4 py-2 rounded-md font-semibold transition-colors duration-200 ${
                isFollowing ? 'bg-white text-black border border-gray-300' : 'bg-black text-white'
            }`}
        >
            {isFollowing ? 'Following' : 'Follow'}
        </button>
    );
};

export default FollowButton;
