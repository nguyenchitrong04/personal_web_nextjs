/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Bật chế độ 'class' cho dark mode
  theme: {
    extend: {
      // Thêm font Inter
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      // Thêm các màu tùy chỉnh của bạn
      colors: {
        'primary': '#3b82f6', // Màu xanh dương
        'secondary': '#10b81', // Màu xanh lá cây
        'poke-yellow': '#fcd3d9', // Màu vàng Pikachu
        'currency-green': '#34d399', // Màu xanh lá cây nhạt cho tiền tệ
        'hcmus-blue': '#1e40af', // Màu xanh đậm đặc trưng (Màu chủ đạo logo)
      },
      // Thêm animation tùy chỉnh
      animation: {
         'spin-slow': 'spin 10s linear infinite', // Ví dụ
         'bounce-y': 'bounce-y 1.5s infinite', // Animation của Pikachu
      },
      keyframes: {
        'bounce-y': { // Định nghĩa keyframe cho bounce-y
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        }
      }
    },
  },
  plugins: [],
}