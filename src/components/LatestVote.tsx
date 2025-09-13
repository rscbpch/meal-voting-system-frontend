import React from "react";

interface LatestVoteProps {
    name: string,
    id: number,
    description: string,
    categoryId: number,
    totalVote: number,
    votedAt: string,
    imgURL: string,
}

const LatestVote: React.FC<LatestVoteProps> = ({ name, categoryId, votedAt, description, totalVote, imgURL }) => (
    <div>
        <p>{name}</p>
        <p>Category: {categoryId}</p>
        <span>{new Date(votedAt).toLocaleDateString()}</span>
        <p>{description}</p>
        <p>Total Votes:{totalVote}</p>
        <img src={imgURL} alt={name} />
    </div>
)

export default LatestVote;