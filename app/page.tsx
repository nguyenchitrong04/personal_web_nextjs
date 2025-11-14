'use client'; // Đánh dấu đây là Client Component

// Import các kiểu dữ liệu cần thiết từ React
import React, { useState, useEffect, useCallback, ChangeEvent, FormEvent } from 'react';

// --- TYPE INTERFACES (Định nghĩa kiểu dữ liệu cho API) ---

// Kiểu dữ liệu cho Pikachu API
interface PikachuData {
    id: number;
    name: string;
    weight: number;
    sprites: {
        front_default: string;
        front_shiny: string;
    };
    abilities: {
        ability: {
            name: string;
        };
    }[];
    types: {
        type: {
            name: string;
        };
    }[];
}

// Kiểu dữ liệu cho ExchangeRate API
interface ExchangeRateData {
    rates: {
        [key: string]: number; // Cho phép các key là string, value là number
        VND: number;
    };
}

// Kiểu dữ liệu cho Open-Meteo API
interface WeatherData {
    temperature: number;
    windspeed: number;
    weathercode: number;
}

// Kiểu dữ liệu cho vị trí Geolocation
interface GeolocationPosition {
    coords: {
        latitude: number;
        longitude: number;
    };
}

// Kiểu dữ liệu cho lỗi Geolocation
interface GeolocationError {
    code: number;
    message: string;
}

// --- Loading Spinner Component ---
const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-48">
        <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-gray-400 ml-3">Đang tải dữ liệu...</p>
    </div>
);

// --- Main Page Component ---
export default function PersonalWebsite() {

    // --- STATE MANAGEMENT ---
    const [theme, setTheme] = useState('dark');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
    const [formMessage, setFormMessage] = useState({ text: '', type: '' });

    // Sử dụng kiểu dữ liệu đã định nghĩa cho State
    const [pikachuData, setPikachuData] = useState<PikachuData | null>(null);
    const [isPikachuLoading, setIsPikachuLoading] = useState(true);
    const [isPikachuShiny, setIsPikachuShiny] = useState(false);

    const [usdToVndRate, setUsdToVndRate] = useState(0);
    const [isRateLoading, setIsRateLoading] = useState(true);
    const [usdInput, setUsdInput] = useState('1');
    const [vndInput, setVndInput] = useState('');
    const [rateUpdateDate, setRateUpdateDate] = useState('');

    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [isWeatherLoading, setIsWeatherLoading] = useState(true);
    const [weatherLocation, setWeatherLocation] = useState('Đang tìm vị trí...');

    // --- HELPER FUNCTIONS (API, etc.) ---

    // Hàm làm sạch input tiền tệ
    const cleanInput = (value: string): string => {
        return value.toString().replace(/,/g, '').replace(/[^\d.]/g, '');
    };

    // Hàm lấy dữ liệu Pikachu
    const fetchPikachu = useCallback(async () => {
        setIsPikachuLoading(true);
        try {
            const response = await fetch('https://pokeapi.co/api/v2/pokemon/pikachu');
            if (!response.ok) throw new Error('Không thể tải dữ liệu Pikachu.');
            const data: PikachuData = await response.json();
            setPikachuData(data);
        } catch (error) {
            console.error("Lỗi khi tải Pikachu:", error);
            setPikachuData(null);
        } finally {
            setIsPikachuLoading(false);
        }
    }, []);

    // Hàm lấy tỷ giá
    const fetchExchangeRate = useCallback(async () => {
        setIsRateLoading(true);
        try {
            const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
            if (!response.ok) throw new Error('Lỗi mạng hoặc API không phản hồi.');
            const data: ExchangeRateData = await response.json();
            
            if (!data.rates || !data.rates.VND) {
                throw new Error('Không tìm thấy tỷ giá VND.');
            }
            
            const rate = data.rates.VND;
            setUsdToVndRate(rate);
            setRateUpdateDate(new Date().toLocaleDateString('vi-VN'));
            
            const usdValue = parseFloat(cleanInput(usdInput)) || 0;
            const vndResult = (usdValue * rate).toFixed(0);
            setVndInput(vndResult.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));

        } catch (error) {
            console.error("Lỗi khi tải tỷ giá:", error);
            setUsdToVndRate(0);
        } finally {
            setIsRateLoading(false);
        }
    }, [usdInput]); // Phụ thuộc vào usdInput

    // Hàm tải thời tiết từ tọa độ
    const loadWeather = useCallback(async (lat: number, lon: number) => {
        setIsWeatherLoading(true);
        const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,weather_code&timezone=auto`;
        
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('Không thể tải dữ liệu thời tiết.');
            const data = await response.json();
            setWeatherData(data.current_weather as WeatherData);
        } catch (error) {
            console.error("Lỗi khi tải thời tiết:", error);
            setWeatherData(null);
        } finally {
            setIsWeatherLoading(false);
        }
    }, []);

    // Hàm lấy vị trí và sau đó tải thời tiết
    const fetchWeatherByLocation = useCallback(() => {
        // Thêm kiểu dữ liệu cho tham số
        const success = (position: GeolocationPosition) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            setWeatherLocation(`Vị trí hiện tại: (${lat.toFixed(4)}, ${lon.toFixed(4)})`);
            loadWeather(lat, lon);
        };

        // Thêm kiểu dữ liệu cho tham số
        const error = (err: GeolocationError) => {
            console.warn(`LỖI GEOLOCATION (${err.code}): ${err.message}`);
            const defaultLat = 10.8231; // TP. Hồ Chí Minh
            const defaultLon = 106.6297;
            setWeatherLocation(`Mô phỏng tại: TP. Hồ Chí Minh (Vị trí bị từ chối)`);
            loadWeather(defaultLat, defaultLon);
        };

        if (navigator.geolocation) {
            setWeatherLocation('Đang tìm vị trí hiện tại...');
            navigator.geolocation.getCurrentPosition(success, error, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            });
        } else {
            error({ code: 0, message: "Trình duyệt không hỗ trợ Geolocation." });
        }
    }, [loadWeather]);

    // --- EFFECTS ---

    // Effect 1: Tải dữ liệu API ban đầu
    useEffect(() => {
        fetchPikachu();
        fetchExchangeRate();
        fetchWeatherByLocation();
    }, [fetchPikachu, fetchExchangeRate, fetchWeatherByLocation]);

    // Effect 2: Quản lý Theme
    useEffect(() => {
        const storedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(storedTheme);
    }, []);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Effect 3: Cài đặt tiêu đề trang và font
    useEffect(() => {
        document.title = "Trang Web Cá Nhân - Nguyễn Chí Trọng";
        const fontLink = document.createElement('link');
        fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap";
        fontLink.rel = "stylesheet";
        if (!document.querySelector(`link[href="${fontLink.href}"]`)) {
            document.head.appendChild(fontLink);
        }
    }, []);

    // --- EVENT HANDLERS ---

    const handleThemeToggle = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const handleMobileMenuToggle = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };
    
    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    // Thêm kiểu 'FormEvent' cho submit
    const handleContactSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormMessage({ text: 'Đang gửi...', type: 'loading' });

        setTimeout(() => {
            setFormMessage({ 
                text: `Cảm ơn ${contactForm.name}! Tin nhắn của bạn đã được gửi. Tôi sẽ phản hồi sớm.`, 
                type: 'success' 
            });
            setContactForm({ name: '', email: '', message: '' });
        }, 1500);
    };

    // Thêm kiểu 'ChangeEvent' cho input/textarea
    const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setContactForm(prev => ({ ...prev, [id]: value }));
    };

    const handleToggleShiny = () => {
        setIsPikachuShiny(!isPikachuShiny);
    };

    // Thêm kiểu 'ChangeEvent' cho input
    const handleUsdChange = (e: ChangeEvent<HTMLInputElement>) => {
        let value = cleanInput(e.target.value);
        setUsdInput(value);

        const amount = parseFloat(value);
        if (!isNaN(amount) && usdToVndRate > 0) {
            const vndResult = (amount * usdToVndRate).toFixed(0);
            setVndInput(vndResult.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        } else {
            setVndInput('');
        }
    };

    // Thêm kiểu 'ChangeEvent' cho input
    const handleVndChange = (e: ChangeEvent<HTMLInputElement>) => {
        let value = cleanInput(e.target.value);
        
        if (value) {
            setVndInput(value.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        } else {
            setVndInput('');
        }

        const amount = parseFloat(value);
        if (!isNaN(amount) && usdToVndRate > 0) {
            const usdResult = (amount / usdToVndRate).toFixed(2);
            setUsdInput(usdResult);
        } else {
            setUsdInput('');
        }
    };
    
    // Thêm kiểu cho sự kiện 'onError' của Image
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.target as HTMLImageElement;
        target.onerror = null; // Ngăn lặp vô hạn nếu ảnh thay thế cũng lỗi
        target.src = 'https://i.postimg.cc/jSWLg5FT/Screenshot-103.png';
    };


    // --- RENDER FUNCTIONS ---

    const renderPikachu = () => {
        if (isPikachuLoading) return <LoadingSpinner />;
        // Kiểm tra pikachuData an toàn với TypeScript
        if (!pikachuData) return <p className="text-red-400">Lỗi: Không tải được Pikachu.</p>;

        const statusText = isPikachuShiny ? 'Shiny' : 'Normal';
        const pikachuImage = isPikachuShiny 
            ? pikachuData.sprites.front_shiny 
            : pikachuData.sprites.front_default;
        const pikachuAbilities = pikachuData.abilities.map(a => a.ability.name).join(', ');
        const pikachuWeight = pikachuData.weight / 10; // kg

        return (
            <>
                <img src={pikachuImage} alt={`Pikachu ${statusText}`} className="mx-auto w-32 h-32 object-contain animate-bounce-y" />
                <p className="text-3xl font-extrabold text-poke-yellow mt-4">#{pikachuData.id} {pikachuData.name.toUpperCase()} ({statusText})</p>
                <p className="text-lg text-gray-300 mt-2">Cân nặng: {pikachuWeight} kg</p>
                <p className="text-md text-gray-400 mt-1">Khả năng: {pikachuAbilities}</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">Type: {pikachuData.types[0].type.name.toUpperCase()}</span>
                </div>
            </>
        );
    };

    const renderWeather = () => {
        if (isWeatherLoading) return <LoadingSpinner />;
        if (!weatherData) return <p className="text-red-400">Lỗi: Không tải được thời tiết.</p>;
        
        const { temperature, windspeed, weathercode } = weatherData;
        
        // Kiểu dữ liệu cho icons và descriptions
        const icons: { [key: number]: string } = { 0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️', 45: '🌫️', 48: '🌫️', 51: '🌧️', 53: '🌧️', 55: '🌧️', 61: '🌦️', 63: '🌧️', 65: '⛈️', 71: '🌨️', 73: '🌨️', 75: '🌨️', 80: '☔', 81: '☔', 82: '⛈️', 95: '🌩️', 96: '⛈️', 99: '⛈️' };
        const descriptions: { [key: number]: string } = { 0: 'Trời Quang Mây', 1: 'Chủ yếu quang mây', 2: 'Mây rải rác', 3: 'Trời Âm U', 45: 'Có Sương Mù', 48: 'Sương mù đóng băng', 51: 'Mưa phùn nhẹ', 53: 'Mưa phùn vừa', 55: 'Mưa phùn đậm', 61: 'Mưa nhẹ', 63: 'Mưa vừa', 65: 'Mưa to', 71: 'Tuyết rơi nhẹ', 73: 'Tuyết rơi vừa', 75: 'Tuyết rơi dày', 80: 'Mưa rào nhẹ', 81: 'Mưa rào vừa', 82: 'Mưa rào lớn', 95: 'Giông bão', 96: 'Giông bão kèm mưa đá nhỏ', 99: 'Giông bão kèm mưa đá lớn' };

        const icon = icons[weathercode] || '❓';
        const description = descriptions[weathercode] || 'Không xác định';

        return (
            <>
                <div className="text-6xl my-4">{icon}</div>
                <p className="text-5xl font-extrabold text-blue-400">{temperature}°C</p>
                <p className="text-xl text-gray-300 mt-2">{description}</p>
                <p className="text-md text-gray-400 mt-1">Tốc độ gió: {windspeed} km/h</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <span className="bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-sm font-medium">WMO Code: {weathercode}</span>
                </div>
            </>
        );
    };


    // --- JSX (Giao diện) ---
    return (
        <>
            {/* Global Styles */}
            <style jsx global>{`
                html {
                    scroll-behavior: smooth;
                    font-family: 'Inter', sans-serif;
                }
                .dark body {
                    background-color: #1a1a2e;
                    color: #e4e4f0;
                }
                .dark .card {
                    background-color: #2c2c54;
                }
                .dark .navbar {
                    background-color: #16162d;
                }
                .dark .footer {
                    background-color: #16162d;
                }
                .cv-item {
                    border-left: 3px solid #10b981;
                    padding-left: 1rem;
                }
                @keyframes bounce-y {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .animate-bounce-y {
                    animation: bounce-y 1.5s infinite;
                }
                .weather-icon {
                    display: inline-block;
                    width: 48px;
                    height: 48px;
                    background-size: contain;
                    background-repeat: no-repeat;
                    margin: 0 auto;
                }
                body {
                    background-color: #f9fafb; /* bg-gray-50 */
                    color: #1f2937; /* text-gray-800 */
                    font-family: 'Inter', sans-serif;
                    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
                    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                    transition-duration: 300ms;
                }
                :root {
                    --color-primary: #3b82f6;
                    --color-secondary: #10b981;
                    --color-poke-yellow: #fcd3d9;
                    --color-currency-green: #34d399;
                    --color-hcmus-blue: #1e40af;
                }
                .text-primary { color: var(--color-primary); }
                .text-secondary { color: var(--color-secondary); }
                .text-poke-yellow { color: var(--color-poke-yellow); }
                .text-currency-green { color: var(--color-currency-green); }
                .bg-primary { background-color: var(--color-primary); }
                .bg-secondary { background-color: var(--color-secondary); }
                .border-primary { border-color: var(--color-primary); }
                .border-secondary { border-color: var(--color-secondary); }
                .border-poke-yellow\\/50 { border-color: rgba(252, 211, 217, 0.5); }
                .border-currency-green\\/50 { border-color: rgba(52, 211, 153, 0.5); }
                .border-blue-500\\/50 { border-color: rgba(59, 130, 246, 0.5); }
                .bg-yellow-900\\/10 { background-color: rgba(113, 63, 18, 0.1); }
                .bg-green-900\\/10 { background-color: rgba(20, 83, 45, 0.1); }
                .bg-blue-900\\/10 { background-color: rgba(30, 58, 138, 0.1); }
                .bg-primary\\/10 { background-color: rgba(59, 130, 246, 0.1); }
                .bg-primary\\/20 { background-color: rgba(59, 130, 246, 0.2); }
                .bg-secondary\\/20 { background-color: rgba(16, 185, 129, 0.2); }
                .bg-blue-600\\/20 { background-color: rgba(37, 99, 235, 0.2); }
                .bg-green-700\\/30 { background-color: rgba(4, 120, 87, 0.3); }
            `}</style>
        
            {/* Thanh Điều Hướng (Navigation Bar) */}
            <header id="navbar" className="navbar sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-md transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <a href="#hero" className="text-2xl font-extrabold text-primary">
                        Nguyễn Chí Trọng
                    </a>
                    <nav className="hidden md:flex space-x-8">
                        <a href="#gioi-thieu" className="text-gray-400 hover:text-primary transition duration-150 font-medium">Giới Thiệu</a>
                        <a href="#ho-so" className="text-gray-400 hover:text-primary transition duration-150 font-medium">Hồ Sơ (CV)</a>
                        <a href="#du-an-api" className="text-gray-400 hover:text-secondary transition duration-150 font-medium font-bold">Dự Án API</a>
                        <a href="#du-an" className="text-gray-400 hover:text-primary transition duration-150 font-medium">Dự Án Khác</a>
                        <a href="#lien-he" className="text-gray-400 hover:text-primary transition duration-150 font-medium">Liên Hệ</a>
                    </nav>
                    <div className="flex items-center space-x-4">
                        <button id="theme-toggle" onClick={handleThemeToggle} className="p-2 rounded-full hover:bg-gray-700 transition duration-150">
                            <svg id="sun-icon" className={`w-6 h-6 text-yellow-500 ${theme === 'light' ? '' : 'hidden'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 01-8 0 4 4 0 018 0z"></path></svg>
                            <svg id="moon-icon" className={`w-6 h-6 text-blue-300 ${theme === 'dark' ? '' : 'hidden'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                        </button>
                        <button id="mobile-menu-button" onClick={handleMobileMenuToggle} className="md:hidden p-2 rounded-lg hover:bg-gray-700 transition duration-150">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </button>
                    </div>
                </div>
                <nav id="mobile-menu" className={`md:hidden bg-gray-800 shadow-lg px-2 pt-2 pb-3 space-y-1 sm:px-3 ${isMobileMenuOpen ? '' : 'hidden'}`}>
                    <a href="#gioi-thieu" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700">Giới Thiệu</a>
                    <a href="#ho-so" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700">Hồ Sơ (CV)</a>
                    <a href="#du-an-api" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-secondary hover:bg-gray-700">Dự Án API</a>
                    <a href="#du-an" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700">Dự Án Khác</a>
                    <a href="#lien-he" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700">Liên Hệ</a>
                </nav>
            </header>

            {/* Nội dung chính */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Phần 1: Hero Section */}
                <section id="hero" className="flex flex-col md:flex-row items-center justify-between gap-12 pt-16 pb-24 min-h-screen">
                    <div className="md:w-1/2">
                        <p className="text-xl text-secondary font-semibold mb-3 animate-pulse">Xin chào, tôi là</p>
                        <h1 className="text-6xl sm:text-7xl font-extrabold leading-tight mb-4">
                            <span className="text-primary">NGUYỄN CHÍ TRỌNG</span>
                        </h1>
                        <h2 className="text-3xl sm:text-4xl font-light text-gray-300 mb-6">
                            Sinh viên Đại học Khoa học Tự nhiên - Công nghệ Vật Lý Điện tử và Tin học
                        </h2>
                        <p className="text-lg text-gray-400 mb-2 max-w-lg">
                            <span className="font-medium text-primary">Email:</span> nguyenchitrong04@gmail.com
                        </p>
                        <p className="text-lg text-gray-400 mb-8 max-w-lg">
                            <span className="font-medium text-primary">Địa chỉ:</span> 73 Nguyễn Huệ, Phan Thiết, Bình Thuận
                        </p>
                        <div className="flex space-x-4">
                            <a href="#ho-so" className="px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 transform hover:scale-105">
                                Xem Hồ Sơ (CV)
                            </a>
                            <a href="#lien-he" className="px-6 py-3 border border-primary text-primary font-semibold rounded-lg shadow-md hover:bg-blue-50 transition duration-300 dark:hover:bg-gray-700">
                                Liên Hệ
                            </a>
                        </div>
                    </div>
                    <div className="md:w-1/2 flex flex-col items-center justify-center mt-10 md:mt-0">
                        <div className="relative w-72 h-72 sm:w-96 sm:h-96">
                            <div className="absolute inset-0 border-4 border-primary rounded-full transform rotate-45 animate-spin-slow opacity-10"></div>
                            <img className="w-full h-full object-cover rounded-full shadow-2xl border-4 border-white dark:border-gray-800 transition duration-300" 
                                 src="https://i.postimg.cc/jSWLg5FT/Screenshot-103.png" 
                                 alt="Ảnh đại diện phong cách anime lúc hoàng hôn"
                                 onError={handleImageError} />
                        </div>
                        <div className="flex space-x-6 mt-6">
                            <a href="https://www.facebook.com/chitrong.nguyen.754?locale=vi_VN" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition duration-300 transform hover:scale-110" title="Facebook Profile">
                                <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.675 0h-21.35C.593 0 0 .593 0 1.325v21.35C0 23.407.593 24 1.325 24h11.458v-9.358H9.425V11.23h3.358V8.406c0-3.324 1.986-5.18 5.045-5.18 1.45 0 2.76.108 3.132.157v3.52l-2.083.003c-1.637 0-1.956.777-1.956 1.916v2.502h4.09l-.532 4.09H17.06V24h5.615c.732 0 1.325-.593 1.325-1.325V1.325c0-.732-.593-1.325-1.325-1.325z"/>
                                </svg>
                            </a>
                            <a href="https://vndb.org/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-300 transform hover:scale-110" title="GitHub Profile">
                                <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.042-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.388-1.332-1.755-1.332-1.755-1.087-.74.084-.725.084-.725 1.205.084 1.838 1.238 1.838 1.238 1.07 1.835 2.809 1.305 3.495.998.108-.778.418-1.305.762-1.604-2.665-.305-5.466-1.334-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.535-1.52.14-3.179 0 0 1.008-.323 3.301 1.23a11.517 11.517 0 016 0c2.293-1.553 3.3-1.23 3.3-1.23.675 1.66.276 2.877.14 3.179.77.84 1.235 1.91 1.235 3.22 0 4.606-2.805 5.62-5.474 5.923.43.37.823 1.107.823 2.222 0 1.605-.015 2.895-.015 3.285 0 .322.21.69.825.575C20.565 22.094 24 17.59 24 12.297c0-6.627-5.373-12-12-12z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </section>

                {/* Phần 2: Giới Thiệu Chung */}
                <section id="gioi-thieu" className="py-20">
                    <h2 className="text-4xl font-bold text-center mb-12 border-b-4 border-secondary inline-block pb-2">Giới Thiệu Chung</h2>
                    <div className="card p-8 rounded-xl shadow-lg transition-colors duration-300">
                        <h3 className="text-2xl font-semibold text-primary mb-4">Mục Tiêu Cá Nhân</h3>
                        <p className="text-lg mb-6 leading-relaxed cv-item">
                            Hướng đến việc phát triển bản thân thông qua làm việc trong môi trường chuyên nghiệp để học hỏi, tích lũy thêm kinh nghiệm và phát triển kỹ năng.
                        </p>
                        <h3 className="text-2xl font-semibold text-primary mt-8 mb-4">Sở Thích</h3>
                        <div className="flex flex-wrap gap-4 cv-item">
                            <span className="badge bg-secondary/20 text-secondary px-3 py-1 rounded-full text-sm font-medium">Nghe nhạc</span>
                            <span className="badge bg-secondary/20 text-secondary px-3 py-1 rounded-full text-sm font-medium">Đọc sách</span>
                        </div>
                    </div>
                </section>

                {/* PHẦN 3: HỒ SƠ CHI TIẾT (CV) */}
                <section id="ho-so" className="py-20 bg-gray-100 dark:bg-gray-900 rounded-xl">
                    <h2 className="text-4xl font-bold text-center mb-12 border-b-4 border-primary inline-block pb-2">Hồ Sơ Chi Tiết (CV)</h2>
                    <div className="card p-8 rounded-xl shadow-lg transition-colors duration-300 max-w-4xl mx-auto">
                        <div className="mb-10">
                            <h3 className="text-3xl font-bold text-primary mb-4 border-b pb-2">TRÌNH ĐỘ HỌC VẤN</h3>
                            <div className="flex items-start gap-6">
                                <div className="flex-shrink-0 w-24 h-24 rounded-lg bg-white shadow-xl overflow-hidden">
                                    <img src="https://i.postimg.cc/Cdpy3FzZ/Logo-chinh.png" alt="Logo HCMUS" className="w-full h-full object-cover p-2" />
                                </div>
                                <div className="cv-item flex-grow">
                                    <p className="text-xl font-semibold">Đại học Khoa học Tự nhiên, ĐHQG-HCM</p>
                                    <p className="text-lg text-gray-400">Sinh viên năm 4</p>
                                    <p className="text-md text-gray-500 dark:text-gray-500">Chuyên ngành: Công nghệ Vật Lý Điện tử và Tin học</p>
                                    <p className="text-md text-gray-500 dark:text-gray-500">Dự kiến tốt nghiệp: Tháng 10/2026</p>
                                    <p className="text-md font-medium mt-1">Điểm TB: 7.14</p>
                                </div>
                            </div>
                        </div>
                        <div className="mb-10">
                            <h3 className="text-3xl font-bold text-primary mb-4 border-b pb-2">KỸ NĂNG</h3>
                            <ul className="list-disc list-inside space-y-2 pl-4 text-lg">
                                <li className="cv-item">Khả năng làm việc nhóm tốt</li>
                                <li className="cv-item">Kỹ năng phân tích, quản lý thời gian hiệu quả</li>
                                <li className="cv-item">Sử dụng tốt các công cụ văn phòng: Word, Excel</li>
                                <li className="cv-item">Ngôn ngữ lập trình và công cụ: <span className="font-medium text-secondary">C++, Python, Proteus</span></li>
                            </ul>
                        </div>
                        <div className="mb-10">
                            <h3 className="text-3xl font-bold text-primary mb-4 border-b pb-2">ĐỒ ÁN THAM GIA</h3>
                            <ul className="list-disc list-inside space-y-4 pl-4 text-lg">
                                <li className="cv-item">Python: Population.</li>
                                <li className="cv-item">Xử lý tín hiệu lọc nhiễu âm thanh.</li>
                                <li className="cv-item">Dự đoán bệnh sử dụng máy học.</li>
                                <li className="cv-item">Lắp ráp mô hình chuyển động bằng radar.</li>
                                <li className="cv-item">Ứng dụng mạch đếm số vào bộ đếm vật thể và xử lý tín hiệu đèn giao thông cho người qua đường.</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-primary mb-4 border-b pb-2">HOẠT ĐỘNG & GIẢI THƯỞỞNG</h3>
                            <div className="text-lg text-gray-400 cv-item">
                                <p className="font-medium text-lg">Hoạt động Tình Nguyện và Ngoại Khóa</p>
                                <p className="font-medium text-lg mt-2">Giải Thưởng</p>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* PHẦN 4: DỰ ÁN TÍCH HỢP API */}
                <section id="du-an-api" className="py-20">
                    <h2 className="text-4xl font-bold text-center mb-12 border-b-4 border-primary inline-block pb-2">Dự Án Tích Hợp API</h2>
                    <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
                        
                        {/* Card 1: POKEMON API */}
                        <div id="pikachu-card" className="card p-6 rounded-xl shadow-lg border-2 border-poke-yellow/50 bg-yellow-900/10 text-center transition duration-300">
                            <h3 className="text-2xl font-bold text-poke-yellow mb-4">POKEAPI: PIKACHU</h3>
                            <div id="pikachu-data" className="min-h-[220px]">
                                {renderPikachu()}
                            </div>
                            <button 
                                id="toggle-shiny-button" 
                                onClick={handleToggleShiny}
                                className="mt-4 px-4 py-2 bg-yellow-600 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-700 transition duration-300 w-full disabled:opacity-50"
                                disabled={isPikachuLoading}
                                title="Chuyển đổi giữa Pikachu thường và Shiny">
                                {isPikachuShiny ? 'Xem Normal' : 'Xem Shiny'}
                            </button>
                            <p className="text-sm text-gray-500 mt-4">Nguồn: https://pokeapi.co/api/v2/pokemon/pikachu</p>
                        </div>
                        
                        {/* Card 2: EXCHANGE RATE API */}
                        <div id="exchange-rate-card" className="card p-6 rounded-xl shadow-lg border-2 border-currency-green/50 bg-green-900/10 text-center transition duration-300">
                            <h3 className="text-2xl font-bold text-currency-green mb-4">CHUYỂN ĐỔI TỶ GIÁ</h3>
                            <div id="exchange-rate-data" className="flex flex-col gap-4">
                                <div id="current-rate-display" className="bg-green-700/30 p-2 rounded-lg text-sm font-medium text-currency-green min-h-[60px]">
                                    {isRateLoading ? 'Đang tải tỷ giá...' : (
                                        usdToVndRate > 0 ? (
                                            <>
                                                1 USD = <span className="text-xl font-bold">{usdToVndRate.toLocaleString('vi-VN')} VND</span> 
                                                <br /> (Cập nhật: {rateUpdateDate})
                                            </>
                                        ) : (
                                            <span className="text-red-400">Lỗi tải tỷ giá.</span>
                                        )
                                    )}
                                </div>
                                <div className="flex flex-col items-start w-full">
                                    <label htmlFor="usd-input" className="text-sm font-medium mb-1 text-gray-300">Nhập USD:</label>
                                    <div className="relative w-full">
                                        <input 
                                            type="text" 
                                            id="usd-input" 
                                            className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-currency-green focus:border-currency-green bg-gray-700 text-white text-lg pr-12"
                                            value={usdInput}
                                            onChange={handleUsdChange}
                                            placeholder="Số tiền USD"
                                        />
                                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-currency-green font-bold">USD</span>
                                    </div>
                                </div>
                                <div className="text-2xl text-primary font-bold">&harr;</div>
                                <div className="flex flex-col items-start w-full">
                                    <label htmlFor="vnd-input" className="block text-sm font-medium mb-1 text-gray-300">Kết quả VND:</label>
                                    <div className="relative w-full">
                                        <input 
                                            type="text" 
                                            id="vnd-input" 
                                            className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-currency-green focus:border-currency-green bg-gray-700 text-white text-lg pr-12"
                                            value={vndInput}
                                            onChange={handleVndChange}
                                            placeholder="Số tiền VND"
                                        />
                                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-currency-green font-bold">VND</span>
                                    </div>
                                </div>
                            </div>
                            <button 
                                id="refresh-rate-button" 
                                onClick={fetchExchangeRate}
                                className="mt-6 px-4 py-2 bg-secondary text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300 w-full disabled:opacity-50"
                                disabled={isRateLoading}
                                title="Làm mới tỷ giá">
                                {isRateLoading ? 'Đang tải...' : 'Làm mới tỷ giá'}
                            </button>
                            <p className="text-sm text-gray-500 mt-2">Nguồn: Exchangerate-API</p>
                        </div>

                        {/* Card 3: OPEN-METEO API */}
                        <div id="weather-card" className="card p-6 rounded-xl shadow-lg border-2 border-blue-500/50 bg-blue-900/10 text-center transition duration-300">
                            <h3 className="text-2xl font-bold text-blue-400 mb-4">OPEN-METEO: THỜI TIẾT</h3>
                            <p id="weather-location" className="text-sm text-blue-300 mb-4 min-h-[40px]">{weatherLocation}</p>
                            <div id="weather-data" className="min-h-[220px] flex flex-col justify-center items-center">
                                {renderWeather()}
                            </div>
                            <button 
                                id="refresh-weather-button" 
                                onClick={fetchWeatherByLocation}
                                className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300 w-full disabled:opacity-50"
                                disabled={isWeatherLoading}
                                title="Làm mới thời tiết">
                                {isWeatherLoading ? 'Đang tải...' : 'Làm mới'}
                            </button>
                            <p className="text-sm text-gray-500 mt-2">Nguồn: api.open-meteo.com</p>
                        </div>
                    </div>
                </section>

                {/* Phần 5: DỰ ÁN KHÁC */}
                <section id="du-an" className="py-20">
                    <h2 className="text-4xl font-bold text-center mb-12 border-b-4 border-secondary inline-block pb-2">Dự Án Khác (Từ CV)</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Các dự án khác... */}
                        <div className="card p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
                            <h3 className="text-2xl font-bold text-primary mb-2">1. Python: Population</h3>
                            <p className="text-gray-400 mb-4">
                                Dự án sử dụng ngôn ngữ Python. (Cần bổ sung mô tả chi tiết nếu có).
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-md">Python</span>
                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-md">Phân tích dữ liệu?</span>
                            </div>
                            <a href="#ho-so" className="text-secondary hover:text-green-600 font-medium">
                                Xem chi tiết trong CV &rarr;
                            </a>
                        </div>
                        <div className="card p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
                            <h3 className="text-2xl font-bold text-primary mb-2">2. Xử lý tín hiệu lọc nhiễu âm thanh</h3>
                            <p className="text-gray-400 mb-4">
                                Đồ án liên quan đến xử lý tín hiệu số để loại bỏ nhiễu từ âm thanh.
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-md">Xử lý tín hiệu</span>
                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-md">Điện tử</span>
                            </div>
                            <a href="#ho-so" className="text-secondary hover:text-green-600 font-medium">
                                Xem chi tiết trong CV &rarr;
                            </a>
                        </div>
                        <div className="card p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
                            <h3 className="text-2xl font-bold text-primary mb-2">3. Dự đoán bệnh sử dụng máy học</h3>
                            <p className="text-gray-400 mb-4">
                                Ứng dụng các thuật toán Machine Learning vào lĩnh vực y tế.
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-md">Máy học (ML)</span>
                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-md">Python</span>
                            </div>
                            <a href="#ho-so" className="text-secondary hover:text-green-600 font-medium">
                                Xem chi tiết trong CV &rarr;
                            </a>
                        </div>
                    </div>
                </section>

                {/* Phần 6: Liên Hệ */}
                <section id="lien-he" className="py-20">
                    <h2 className="text-4xl font-bold text-center mb-12 border-b-4 border-secondary inline-block pb-2">Liên Hệ</h2>
                    <div className="max-w-xl mx-auto card p-8 rounded-xl shadow-lg transition-colors duration-300">
                        <p className="text-lg text-center text-gray-400 mb-6">
                            Hãy liên hệ với tôi qua email hoặc điện thoại để thảo luận về cơ hội làm việc hoặc hợp tác!
                        </p>
                        <form onSubmit={handleContactSubmit} id="contact-form">
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium mb-1">Tên của bạn</label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    name="name" 
                                    required
                                    value={contactForm.name}
                                    onChange={handleFormChange}
                                    className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-gray-700 text-white" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email" 
                                    required
                                    value={contactForm.email}
                                    onChange={handleFormChange}
                                    className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-gray-700 text-white" />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="message" className="block text-sm font-medium mb-1">Nội dung</label>
                                <textarea 
                                    id="message" 
                                    name="message" 
                                    rows={4} // Sửa: 'rows="4"' (string) thành 'rows={4}' (number)
                                    required
                                    value={contactForm.message}
                                    onChange={handleFormChange}
                                    className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-gray-700 text-white"></textarea>
                            </div>
                            
                            <button 
                                type="submit" 
                                className="w-full px-6 py-3 bg-secondary text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300 transform hover:scale-[1.02]">
                                Gửi Tin Nhắn
                            </button>
                            
                            {formMessage.text && (
                                <p id="form-message" className={`text-center mt-4 font-medium ${
                                    formMessage.type === 'success' ? 'text-green-500' : 
                                    formMessage.type === 'loading' ? 'text-gray-500' : 'text-red-500'
                                }`}>
                                    {formMessage.text}
                                </p>
                            )}
                        </form>
                    </div>
                </section>

            </main>

            {/* Footer */}
            <footer className="footer shadow-inner mt-12 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-400">
                    <p>&copy; 2025 Nguyễn Chí Trọng. Mọi bản quyền được bảo lưu.</p>
                    <p className="mt-2 text-sm">Thiết kế với tình yêu và sự tận tâm ❤️.</p>
                </div>
            </footer>
        </>
    );
}