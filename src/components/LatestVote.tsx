import React from "react";

interface LatestVoteProps {
  name: string;
  id: number;
  description: string;
  totalVote: number;
  votedAt: string;
  imgURL: string;
}

const LatestVote: React.FC<LatestVoteProps> = ({
  name,
  votedAt,
  description,
  totalVote,
  imgURL,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md  relative h-[180px] p-6">
      <div className="grid grid-cols-[200px_1fr_280px] gap-6 items-start relative h-full">
        {/* Column 1: Floating Image */}
        {/* <div className="relative"> */}
          <div className="relative -top-20">
            {imgURL ? (
              <img
                src={imgURL}
                alt={name}
                className="w-52 h-52 object-cover rounded-full shadow-xl border-4 border-white"
              />
            ) : (
              <div className="w-52 h-52 bg-gray-100 rounded-full shadow-inner border-4 border-white" />
            )}
          </div>
        {/* </div> */}

        {/* Column 2: Details */}
        <div className="flex flex-col justify-center">
          <h1 className="font-bold text-2xl mb-2">{name}</h1>
          <div className="text-sm text-gray-600 h-24 overflow-y-auto">
            <p className="text-[18px] font-bold mb-2">Description</p>
            <p className="text-[14px] text-[#949494]">
                {description || "No description available."}
            </p>
            <p className="mt-1 font-bold text-[18px]">Total Votes: {totalVote}</p>
          </div>
        </div>

        {/* Column 3: Voted Date */}
        <div className="flex items-center justify-end mt-13 text-sm text-gray-500 gap-2">
            <p className="font-bold text-[18px]">Voted At: </p> <p className="text-[18px]">{new Date(votedAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default LatestVote;
