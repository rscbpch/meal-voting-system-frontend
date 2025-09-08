import React from "react";

interface BannerItem {
    title: string;
    subtitle?: string;
    description?: string;
    imgSrc?: string;
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
    const first = items[0];

    return (
        <div className="p-6">
            <div className="bg-[#F7F7F7] rounded-xl p-8 flex items-center gap-6">
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-[#429818]">{first.title}</h2>
                    {first.subtitle && <p className="text-sm text-gray-700 mt-1">{first.subtitle}</p>}
                    {first.description && <p className="text-sm text-gray-600 mt-2">{first.description}</p>}
                </div>
                {first.imgSrc && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={first.imgSrc} alt={first.title} className="w-40 h-40 object-cover rounded-full shadow-md" />
                )}
            </div>
        </div>
    );
};

export default ResultBanner;
