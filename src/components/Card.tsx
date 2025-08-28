import React, { useState } from "react";

interface Card {
    name: string;
    categoryId: number;
    description: string;
    imgURL: string;
    initialVotes?: number;
}

const FoodCard = ({ name, categoryId, description, imgURL, initialVotes = 0}: Card) => {
    const [votes, setVotes] = useState<number>(initialVotes);

    const handleVote = () => {
        setVotes(votes + 1);
    };

    return (
      <div className="border-0 rounded-lg shadow-md overflow-hidden p-5 flex flex-col justify-between h-96">
        <div>
          <img src={imgURL} alt={name} className="w-full h-40 object-cover"/>
          <div className="flex justify-between items-center">
            <h1 className="font-bold text-[32px]">{name}</h1>
            <p className="bg-[#F4F4F4] p-2 rounded text-[#919191]">cat {categoryId}</p>
          </div>
          <div className="break-words w-65 text-[14px] text-[#949494] mt-4 flex-1 overflow-hidden">
            {description}
          </div>
          <div className="flex justify-between items-center mt-4">
            <p className="flex items-center">Votes: {votes}</p>
            <button onClick={handleVote} className=" bg-[#429818] text-white rounded hover:bg-[#2a5b11] p-2">Vote Now</button>
          </div>
        </div>
      </div>
  );
}
export default FoodCard;