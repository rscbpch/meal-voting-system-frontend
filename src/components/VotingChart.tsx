import React, { useState } from "react";
import borito from "../assets/borito.png";
import pizza from "../assets/pizza.png";
import fries from "../assets/fries.png";

type DataItem = { id: string; label: string; value: number; img?: string };

interface Props {
  data?: DataItem[];
  height?: number;
  highlightId?: string;
}

const VotingChart: React.FC<Props> = ({ data, height = 260, highlightId }) => {
  const sampleData: DataItem[] =
    data ?? [
      { id: "1", label: "Cat 1", value: 710, img: borito },
      { id: "2", label: "Cat 2", value: 410, img: fries },
      { id: "3", label: "Cat 3", value: 720, img: pizza },
      { id: "4", label: "Cat 4", value: 410, img: fries },
      { id: "5", label: "Cat 5", value: 710, img: borito },
    ];

  const max = Math.max(...sampleData.map((d) => d.value), 100);

  const [hover, setHover] = useState<{
    item?: DataItem;
    x: number;
    y: number;
  } | null>(null);

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-700 mb-4">Voting Graph</h3>

      <div className="relative">
        <div className={`flex items-end justify-between h-[${height}px] space-x-6`}> 
          {sampleData.map((item) => {
            const pct = Math.round((item.value / max) * 100);
            const isHighlight =
              highlightId != null
                ? highlightId === item.id
                : item.value === Math.max(...sampleData.map((d) => d.value));

            return (
              <div key={item.id} className="flex-1 flex flex-col items-center">
                <div
                  className="w-14 relative cursor-pointer"
                  onMouseEnter={(e) => {
                    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                    setHover({ item, x: rect.left + rect.width / 2, y: rect.top });
                  }}
                  onMouseLeave={() => setHover(null)}
                >
                  <div className="h-[200px] bg-gray-100 rounded-lg w-full flex items-end overflow-hidden">
                    <div
                      style={{ height: `${pct}%` }}
                      className={`w-full transition-all duration-700 ${isHighlight ? "bg-green-600" : "bg-gray-300"}`}
                    />
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-500">{item.label}</div>
              </div>
            );
          })}
        </div>

        {hover && hover.item && (
          <div
            style={{ left: hover.x, top: hover.y - 90 }}
            className="absolute transform -translate-x-1/2 -translate-y-full bg-white border rounded-md p-2 shadow-lg w-48 z-50"
          >
            <div className="flex items-center space-x-2">
              {hover.item.img ? (
                <img src={hover.item.img} alt="" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200" />
              )}

              <div>
                <div className="text-sm font-semibold">{hover.item.label}</div>
                <div className="text-xs text-gray-500">
                  Total votes: <span className="font-medium text-green-600">{hover.item.value}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VotingChart;
