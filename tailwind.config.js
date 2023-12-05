/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors:{
      mistblue:'#7AAFFF',
      lightblue:'#F4FAFF',
      hoverLightBlue: '#eff6ff',
      facebookblue:'#0865FE',
      friendblue:'#EBF5FF',
    },
    extend: {},
  },
  plugins: [],
  // plugins: [require("daisyui")],
  // daisyui:{
  //   darkTheme: "light"
  // }
}