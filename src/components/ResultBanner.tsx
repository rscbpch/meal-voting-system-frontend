import React from "react";

interface BannerItem {
    title: string;
    subtitle?: string;
    description?: string;
    imgSrc?: string;
    voteCount?: number;
}

interface BannerProps {
    items?: BannerItem[];
}

const ResultBanner: React.FC<BannerProps> = ({ items = [] }) => {
    if (!items || items.length === 0) {
        return (
            <div className="p-6">
                <div className="bg-[#F7F7F7] rounded-xl p-8 text-center">
                    <h3 className="text-lg font-semibold text-gray-700">No results yet</h3>
                    <p className="text-sm text-gray-500 mt-2">Check back after voting opens.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="bg-[#F7F7F7] rounded-xl p-8 flex flex-col gap-6">
                {items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-6">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-[#429818]">{item.title}</h2>
                            {item.subtitle && <p className="text-sm text-gray-700 mt-1">{item.subtitle}</p>}
                            {item.description && <p className="text-sm text-gray-600 mt-2">{item.description}</p>}
                            <div className="text-sm text-gray-600 mt-2">Votes: {item.voteCount ?? 0}</div>
                        </div>
                        {item.imgSrc && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.imgSrc} alt={item.title} className="w-40 h-40 object-cover rounded-full shadow-md" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ResultBanner;
