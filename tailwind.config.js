/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // 1. 반응형 breakpont
    screens: {
      'desktop': '1440px',
      'wide': '1920px',
    },
    // 2. 폰트, 그림자 등 확장
    extend: {
      fontFamily: {
        sans: ['"Pretendard"', 'sans-serif'],
      },
      boxShadow: {
        'ds-100': '0px 0px 6px 0px rgba(0, 0, 0, 0.1)',
        'ds-200': '0px 0px 12px 0px rgba(0, 0, 0, 0.1)',
        'ds-300': '0px 4px 20px 0px rgba(0, 0, 0, 0.2)',
        'ds-400': '0px 0px var(--layout-margin) 0px rgba(0, 0, 0, 0.1)', // 음... 이거맞나
        'is-100': 'inset 0px 0px 8px 0px rgba(0, 0, 0, 0.1)',
      },
      colors: {
        primary: {
          sg400: "var(--color-primary-sg400)",
          sg500: "var(--color-primary-sg500)",
          sg550: "var(--color-primary-sg550)",
          sg600: "var(--color-primary-sg600)",
        },
        secondary: {
          aq400: "var(--color-secondary-aq400)",
          sg100: "var(--color-secondary-sg100)",
        },
        chip: {
          pass: "var(--color-chip-pass)",
          block: "var(--color-chip-block)",
          fail: "var(--color-chip-fail)",
          untest: "var(--color-chip-untest)",
        },
        grayscale: {
          white: "var(--color-grayscale-white)",
          gy50: "var(--color-grayscale-gy50)",
          gy100: "var(--color-grayscale-gy100)",
          gy200: "var(--color-grayscale-gy200)",
          gy300: "var(--color-grayscale-gy300)",
          gy400: "var(--color-grayscale-gy400)",
          gy500: "var(--color-grayscale-gy500)",
          gy600: "var(--color-grayscale-gy600)",
          gy700: "var(--color-grayscale-gy700)",
          gy800: "var(--color-grayscale-gy800)",
          gy900: "var(--color-grayscale-gy900)",
          black: "var(--color-grayscale-black)",
        },
        system: {
          deactive: "var(--color-system-deactive)",
          active: "var(--color-system-active)",
          success: "var(--color-system-success)",
          errors: "var(--color-system-errors)",
          warning: "var(--color-system-warning)",
        },
      },
      spacing: {
        'layout-margin': 'var(--layout-margin)',
        'layout-margin-l': 'var(--layout-margin-l)',
        'layout-gutter': 'var(--layout-gutter)',

        'gap-xxl': 'var(--gap-xxl)',
        'gap-xl': 'var(--gap-xl)',
        'gap-l': 'var(--gap-l)',
        'gap-m': 'var(--gap-m)',
        'gap-s': 'var(--gap-s)',
        'gap-xs': 'var(--gap-xs)',
        'gap-xxs': 'var(--gap-xxs)',
      },
      width: {
        // max랑 min은 기존 tailwind에 존재하는 키워드라 앞에 size- 붙임
        'size-max': 'var(--width-max)',
        'xl': 'var(--width-xl)',
        'l': 'var(--width-l)',
        'm': 'var(--width-m)',
        's': 'var(--width-s)',
        'xs': 'var(--width-xs)',
        'size-min': 'var(--width-min)',

        'overlay-modal': 'var(--overlay-modal)',
        'overlay-center-sheet': 'var(--overlay-center-sheet)',
        'overlay-side-sheet': 'var(--overlay-side-sheet)',
        'overlay-dropdown': 'var(--overlay-dropdown-menu)',
        'overlay-menu': 'var(--overlay-menu)',
      },
      maxWidth: {
        "size-max": "var(--width-max)",
        xl: "var(--width-xl)",
        l: "var(--width-l)",
        m: "var(--width-m)",
        s: "var(--width-s)",
        xs: "var(--width-xs)",
        "size-min": "var(--width-min)",
        split:"var(--layout-split)",
      },
    },
  },
  plugins: [],
}