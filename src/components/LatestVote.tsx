import React from "react";

interface LatestVoteProps {
    name: string,
    id: number,
    description: string,
    category: number,
    totalVote: number,
    votedAt: string,
    imgURL: string,
}

const LatestVote: React.FC<LatestVoteProps> = ({ name, category, votedAt, description, totalVote, imgURL }) => (
    <div>
        <p>{name}</p>
        <p>{category}</p>
        <span>{new Date(votedAt).toLocaleDateString()}</span>
        <p>{description}</p>
        <p>{totalVote}</p>
        <p>{imgURL}</p>
    </div>
)

export default LatestVote;