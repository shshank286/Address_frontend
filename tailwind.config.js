/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        assistant: ['Assistant', 'sans-serif'],
        jost: ['Jost', 'sans-serif'],
        kaushan: ['Kaushan Script', 'cursive'], 
        roboto: ['Roboto', 'sans-serif'],
        segoe: ['SegoeUi', 'sans-serif'],
        opensans: ['"Open Sans"', 'sans-serif'],
      },
      fontWeight: {
        thin: '100',       
        extraLight: '200', 
        light: '300',      
        normal: '400',     
        medium: '500',     
        semiBold: '600',   
        bold: '700',       
        extraBold: '800',  
        black: '900',      
      },
      
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
    

  ],
};
