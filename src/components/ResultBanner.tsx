import React from "react";

interface BannerProps {
    title: string;
    subtitle: string;
    description: string;
    imgSrc?: string; 
}

const Banner: React.FC<BannerProps> = ({ title, subtitle, description }) => {
    return (
        <div className="bg-[#F7F7F7] p-10 m-5 rounded">
            <h1 className="font-bold text-5xl">{title}</h1>
            <h2 className="font-bold text-3xl">{subtitle}</h2>
            <p>{description}</p>
        </div>
    )
}

export default Banner;