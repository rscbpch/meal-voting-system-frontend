// components/Loading.tsx
import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface LoadingProps {
  loop?: boolean;
  autoplay?: boolean;
  size?: number;        // width & height in pixels
  className?: string;   // extra Tailwind classes
}

const Loading: React.FC<LoadingProps> = ({
  loop = true,
  autoplay = true,
  size = 170,
  className = "",
}) => {
  const defaultSrc =
    "https://lottie.host/e233eacb-3220-4eec-a930-a614a7d3e198/wd9zeCAkb5.lottie";

  return (
    <div
      className={`flex justify-center items-center ${className}`}
      style={{ width: size, height: size }}
    >
      <DotLottieReact
        src={defaultSrc}
        loop={loop}
        autoplay={autoplay}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default Loading;