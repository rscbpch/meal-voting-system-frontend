import { useEffect, useState } from "react";

interface Card {
    name: string;
    categoryId: number;
    description: string;
    imgURL?: string;
    initialVotes?: number;
    disabled?: boolean;
    hasVoted?: boolean;
    onVote?: () => void;
    onCancelVote?: () => void;
}

const FoodCard = ({ 
    name, 
    categoryId, 
    description, 
    imgURL, 
    initialVotes = 0, 
    disabled = false, 
    hasVoted = false,
    onVote, 
    onCancelVote 
  }: Card) => {
    const [votes, setVotes] = useState<number>(initialVotes);
    // const [hasVoted, setHasVoted] = useState<boolean>(false);


    // const handleVote = () => {
    //     if (!disabled && onVote) {
    //       setVotes(votes + 1);
    //       onVote();
          
    //     }
    // };
    useEffect(() => {
      setVotes(initialVotes);
    }, [initialVotes]);
    const handleClick = () => {
      if (disabled && !hasVoted) return;
      if (!hasVoted) {
        setVotes(prev => prev + 1);
        // setHasVoted(true);
        onVote && onVote();
      } else {
        const confirmCancel = window.confirm("Are you sure you want to cancel your vote?");
        if (confirmCancel) {
          setVotes(prev => prev -1);
          // setHasVoted(false);
          onCancelVote && onCancelVote();
        }
      }
      }

    return (
      <div className="bg-white">
        <div className="relative border-0 rounded-lg shadow-md overflow-visible p-5 flex flex-col justify-between h-96">
          {imgURL ? (
            <img src={imgURL} alt={name} className="absolute -top-15 left-1/2 transform -translate-x-1/2 w-50 h-50 object-cover rounded-full shadow-xl"/>
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
                    >{name}
                  </h1>
                  <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-max max-w-xs bg-black text-white text-sm rounded-lg px-3 py-1 shadow-lg z-10">
                    {name}
                  </div>
                </div>
                <p className="bg-[#F4F4F4] p-2 rounded text-[#919191]">cat {categoryId}</p>
              </div>
              <div className="h-24 text-[14px] overflow-y-auto text-[#949494] mt-4">
                {description}
              </div>
              <div className="flex justify-between items-center mt-4">
                <p className="flex items-center">Votes: {votes}</p>
                <button 
                  onClick={handleClick} 
                  disabled={disabled && !hasVoted}
                  className= {`rounded p-2 transition-colors ${
                    hasVoted 
                    ? "bg-gray-300 text-white cursor-not-allowed"
                    : disabled
                      ? "bg-gray-300 text-white cursor-not-allowed"
                      : "bg-[#429818] text-white hover:bg-[#2a5b11]"

                  }`}
                >
                    {hasVoted ? "Voted" : "Vote Now"}
                </button> 
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
export default FoodCard;