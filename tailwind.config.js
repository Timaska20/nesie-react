export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00C300',        // яркий зелёный
        primaryHover: '#009900',   // для hover-зелёный
        secondary: '#0047FF',      // насыщенный синий
        secondaryHover: '#0033CC', // hover-синий
      },
    },
  },
  plugins: [],
}
