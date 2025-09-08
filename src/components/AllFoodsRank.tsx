import React from "react";

interface FoodRow {
    name: string;
    votes: number;
}

interface Props {
    items: FoodRow[];
    title?: string;
}

const AllFoodsRank: React.FC<Props> = ({ items, title = "All Foods" }) => {
    const sorted = [...items].sort((a, b) => b.votes - a.votes);

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">{title}</h3>
            <table className="w-full text-left">
                <thead>
                    <tr className="text-sm text-gray-400">
                        <th className="py-2">Rank</th>
                        <th className="py-2">Food</th>
                        <th className="py-2 text-right">Votes</th>
                    </tr>
                </thead>
                <tbody>
                    {sorted.map((row, idx) => (
                        <tr key={`${row.name}-${idx}`} className="border-t">
                            <td className="py-3 text-sm text-gray-600 w-16">{idx + 1}</td>
                            <td className="py-3 text-sm text-gray-700">{row.name}</td>
                            <td className="py-3 text-sm text-gray-700 text-right">{row.votes}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AllFoodsRank;
