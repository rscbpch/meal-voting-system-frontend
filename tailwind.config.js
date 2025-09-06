/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "flip-top": {
          "0%": { transform: "rotateX(0deg)" },
          "60%": { transform: "rotateX(-80deg)" },
          "100%": { transform: "rotateX(-90deg)" },
        },
        "flip-bottom": {
          "0%": { transform: "rotateX(90deg)" , opacity: 0},
          "60%": { transform: "rotateX(20deg)", opacity: 1},
          "100%": { transform: "rotateX(0deg)", opacity: 1 },
        },
      },
      animation: {
        // slightly longer durations and custom easing for smoother 3d perception
        "flip-top": "flip-top 0.35s cubic-bezier(.2,.9,.2,1) forwards",
        "flip-bottom": "flip-bottom 0.35s cubic-bezier(.2,.9,.2,1) 0.18s forwards",
      },
    },
  },
  plugins: [],
};

// tailwind.config.js
// module.exports = {
//   content: ["./src/**/*.{js,ts,jsx,tsx}"],
//   theme: {
//     extend: {
//       keyframes: {
//         "flip-top": {
//           "100%": { transform: "rotateX(90deg)" },
//         },
//         "flip-bottom": {
//           "0%": { transform: "rotateX(90deg)" },
//           "100%": { transform: "rotateX(0deg)" },
//         },
//       },
//       animation: {
//         "flip-top": "flip-top 0.25s ease-in forwards",
//         "flip-bottom": "flip-bottom 0.25s ease-out 0.25s forwards",
//       },
//     },
//   },
//   plugins: [],
// };
