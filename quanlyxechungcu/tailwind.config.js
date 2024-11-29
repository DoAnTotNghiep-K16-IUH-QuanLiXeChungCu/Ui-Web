/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "primary-gradient": `linear-gradient(
          86.88deg,
          #7d6aff 1.38%,
          #ffb86c 64.35%,
          #fc2872 119.91%
        );`,
        "secondary-gradient": `linear-gradient(86.88deg, #20e3b2, #2cccff)`,
      },
      fontFamily: {
        sans: [
          "Roboto",
          "Inter",
          "Open Sans",
          "system-ui",
          "Arial",
          "Gill Sans",
        ],
      },
    },
  },
  plugins: [],
};

// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         tblack: '#081C36',
//       },
//     },
//   },
//   plugins: [],
// }
