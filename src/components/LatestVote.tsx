import React from "react";

interface LatestVoteProps {
    name: string,
    id: number,
    description: string,
    category: number,
    totalVote: number,
    votedAt: string,
}

const LatestVote: React.FC<LatestVoteProps> = ({ name, category, votedAt, description, totalVote }) => (
    <div>
        <p>{name}</p>
        <p>{category}</p>
        <span>{new Date(votedAt).toLocaleDateString()}</span>
        <p>{description}</p>
        <p>{totalVote}</p>
    </div>
)

export default LatestVote;