const defaultTheme = require('tailwindcss/defaultTheme');
const typography = require('@tailwindcss/typography');

function withOpacityValue(variable) {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variable}))`;
    }
    return `rgba(var(${variable}), ${opacityValue})`;
  };
}

function getColor(color) {
  var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  if (reg.test(color)) {
    if (color.length === 4) {
      var colorNew = '#';
      for (var i = 1; i < 4; i += 1) {
        colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
      }
      color = colorNew;
    }
    var colorChange = [];
    for (var i = 1; i < 7; i += 2) {
      colorChange.push(parseInt('0x' + color.slice(i, i + 2)));
    }
    return colorChange.join(',');
  } else {
    return color;
  }
}

function setAppTheme() {
  let theme = {};
  [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].forEach(item => {
    theme[item] = withOpacityValue(`--color-base-${item}`);
  });
  return theme;
}

module.exports = {
  content: ['./src/**/*.tsx', './src/**/*.html'],
  theme: {
    extend: {
      colors: {
        purple: {
          DEFAULT: '#663C99',
          50: '#E3D2F8',
          100: '#B898DF',
          200: '#926AC2',
          300: '#835CB4',
          400: '#6B4697',
          500: '#663C99',
          600: '#5A308D',
          700: '#472570',
          800: '#461E78',
          900: '#340E63',
        },
        blue: {
          DEFAULT: '#0993EC',
          50: '#B1DEFC',
          100: '#9DD6FB',
          200: '#76C6FA',
          300: '#4EB6F8',
          400: '#27A5F7',
          500: '#0993EC',
          600: '#0771B6',
          700: '#055080',
          800: '#032E4A',
          900: '#010C14',
        },
        red: {
          DEFAULT: '#FF3838',
          50: '#FFF0F0',
          100: '#FFDBDB',
          200: '#FFB2B2',
          300: '#FF8A8A',
          400: '#FF6161',
          500: '#FF3838',
          600: '#FF0000',
          700: '#C70000',
          800: '#8F0000',
          900: '#570000',
        },
        green: {
          DEFAULT: '#7CFF6B',
          50: '#FFFFFF',
          100: '#FFFFFF',
          200: '#E8FFE5',
          300: '#C4FFBD',
          400: '#A0FF94',
          500: '#7CFF6B',
          600: '#4AFF33',
          700: '#1DFA00',
          800: '#16C200',
          900: '#108A00',
        },
        yellow: {
          DEFAULT: '#FFD166',
          50: '#FFFFFF',
          100: '#FFFFFF',
          200: '#FFF6E0',
          300: '#FFEAB8',
          400: '#FFDD8F',
          500: '#FFD166',
          600: '#FFC02E',
          700: '#F5AB00',
          800: '#BD8400',
          900: '#855D00',
        },
        gray: {
          50: getColor('#ffffff'),
          100: getColor('#f9f9f9'),
          200: getColor('#e5e7eb'),
          300: getColor('#d1d5db'),
          400: getColor('#9ca3af'),
          500: getColor('#6b7280'),
          600: getColor('#4b5563'),
          700: getColor('#374151'),
          800: getColor('#1f2937'),
          900: getColor('#111827'),
        },
        theme: {
          ...setAppTheme(),
        },
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
      },
      textColor: {},
      backgroundColor: {},
      backgroundImage: () => ({}),
      backgroundSize: {},
      borderRadius: {
        none: '0',
        px: '1px',
        DEFAULT: '4px',
      },
      fontFamily: {
        sans: ['DM Sans', ...defaultTheme.fontFamily.sans],
      },
      spacing: {},
      boxShadow: {},
      screens: {
        xs: '280px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [typography],
};
