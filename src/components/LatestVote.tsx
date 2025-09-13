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

const LatestVote: React.FC<LatestVoteProps> = ({ name, categoryId, votedAt, description, totalVote, imgURL }) => {
    return (
         <div className="bg-white">
            <div className="relative border-0 rounded-lg shadow-md overflow-visible p-5 flex flex-col justify-between h-96">
                {imgURL ? (
                <img
                    src={imgURL}
                    alt={name}
                    className="absolute -top-15 left-1/2 transform -translate-x-1/2 w-50 h-50 object-cover rounded-full shadow-xl"
                />
                ) : (
                <div className="absolute -top-15 left-1/2 transform -translate-x-1/2 w-50 h-50 bg-gray-100 rounded-full shadow-inner" />
                )}

                <div>
                <div className="mt-32">
                    <div className="flex justify-between items-center">
                    <div className="relative max-w-[200px] group">
                        <h1
                        className="font-bold text-[32px] truncate cursor-pointer"
                        title={name}
                        >
                        {name}
                        </h1>
                        {/* Tooltip on hover */}
                        <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-max max-w-xs bg-black text-white text-sm rounded-lg px-3 py-1 shadow-lg z-10">
                        {name}
                        </div>
                    </div>
                    <p className="bg-[#F4F4F4] p-2 rounded text-[#919191]">
                        cat {categoryId}
                    </p>
                    </div>

                    <div className="h-24 text-[14px] overflow-y-auto text-[#949494] mt-4">
                    {description}
                    </div>

                    <div className="flex justify-between items-center mt-4">
                    <p className="flex items-center">Votes: {totalVote}</p>
                    <span className="text-sm text-gray-500">
                        {new Date(votedAt).toLocaleDateString()}
                    </span>
                    </div>
                </div>
                </div>
            </div>
            </div>
    )
}

export default LatestVote;