import { div } from "motion/react-client";
import React, { useState } from "react";

interface Card {
    name: string;
    categoryId: number;
    description: string;
    imgURL: string;
    initialVotes?: number;
    disabled?: boolean;
    onVote?: () => void;
}

const FoodCard = ({ name, categoryId, description, imgURL, initialVotes = 0, disabled = false, onVote }: Card) => {
    const [votes, setVotes] = useState<number>(initialVotes);


    const handleVote = () => {
        if (!disabled && onVote) {
          setVotes(votes + 1);
          onVote();
          
        }
    };

    return (
      <div className="bg-white">
        <div className="relative border-0 rounded-lg shadow-md overflow-visible p-5 flex flex-col justify-between h-96">
          <img src={imgURL} alt={name} className="absolute -top-15 left-1/2 transform -translate-x-1/2 w-50 h-50 object-cover rounded-full shadow-xl"/>
          <div>
            <div className="mt-32">
              <div className="flex justify-between items-center">
                <h1 className="font-bold text-[32px]">{name}</h1>
                <p className="bg-[#F4F4F4] p-2 rounded text-[#919191]">cat {categoryId}</p>
              </div>
              <div className="h-24 text-[14px] overflow-y-auto text-[#949494] mt-4">
                {description}
              </div>
              <div className="flex justify-between items-center mt-4">
                <p className="flex items-center">Votes: {votes}</p>
                <button 
                  onClick={handleVote} 
                  disabled={disabled}
                  className=" bg-[#429818] text-white rounded hover:bg-[#2a5b11] p-2">
                  {disabled ? "Voted" : "Vote Now"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
export default FoodCard;

