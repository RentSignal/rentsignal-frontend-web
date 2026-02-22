/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        atomic: {
          red: {
            95: '#FEECEC',
            90: '#FED5D5',
            80: '#FFB5B5',
            70: '#FF8C8C',
            60: '#FF6363',
            50: '#FF4242',
            40: '#E52222',
            30: '#B20C0C',
            20: '#750404',
            10: '#3B0101',
          },
          green: {
            99: '#F2FFF6',
            95: '#D9FFE6',
            90: '#ACFCC7',
            80: '#7DF5A5',
            70: '#49E57D',
            60: '#1ED45A',
            50: '#00BF40',
            40: '#009632',
            30: '#006E25',
            20: '#004517',
            10: '#00240C',
          },
          blue: {
          60: '#3385FF',
          50: '#0066FF',
          40: '#0054D1',
        },
        },
        blue: {
          99: '#F6FBFF',
          95: '#EAF2FE',
          90: '#C9DEFE',
          80: '#96C0FF',
          70: '#69A5FF',
          60: '#3385FF', // main color
          50: '#0066FF',
          40: '#0054D1',
          30: '#003E9C',
          20: '#002966',
          10: '#001536',
        },
        coolNeutral: {
          99: '#F7F7F8',
          97: '#F2F4F5',
          95: '#E2E3E4',
          90: '#C2C4C8',
          70: '#989BA2',
          50: '#70737C',
          30: '#46474C',
          25: '#333438',
          20: '#292A2D',
          10: '#171719',
          5: '#0F0F10',
        },
        red: {
          DEFAULT: '#FF4242',
        }, 
        lightBlue: {
          99: '#F7FDFF',
          95: '#E5F6FE',
          90: '#C4ECFE',
          80: '#A1E1FF',
          70: '#70D2FF',
          60: '#3DC2FF',
          50: '#00AEFF',
          40: '#008DCF',
          30: '#006796',
          20: '#004261',
          10: '#002130',
        },
        primary: '#3385FF',
        danger: '#FF4242'
      }
    },
  },
  plugins: [],
}

