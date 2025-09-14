interface ResultCardProps {
  name: string;
  description: string;
  imgURL?: string;
  votes?: number;
}

const ResultCard = ({ name, description, imgURL, votes }: ResultCardProps) => {
  return (
    <div className="bg-white">
      <div className="relative border-0 rounded-lg shadow-md overflow-visible p-5 flex flex-col h-100">
        {/* Floating Image */}
        <div className="flex justify-center">
          {imgURL ? (
            <img
              src={imgURL}
              alt={name}
              className="w-40 h-40 object-cover rounded-full shadow-xl border-4 border-white -mt-20"
            />
          ) : (
            <div className="w-40 h-40 bg-gray-100 rounded-full shadow-inner border-4 border-white -mt-20" />
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 mt-6">
          {/* Name */}
          <h1
            className="font-bold text-[14px] lg:text-base break-words text-left h-[64px]"
            title={name}
          >
            {name}
          </h1>

          {/* Description */}
          <div className="mt-4 flex-1">
            <p className="text-[14px] lg:text-base font-semibold mb-1">Description:</p>
            <p className="text-[14px] overflow-y-auto text-[#949494] h-[60px] overflow-hidden">
              {description}
            </p>
          </div>

          {/* Votes aligned at bottom */}
          <div className="text-left mt-atuo">
            <p className="font-medium">Votes: {votes ?? 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
