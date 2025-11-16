'use client'; 

import React, { useState, useEffect, useCallback, ChangeEvent, FormEvent } from 'react';

// Import các kiểu dữ liệu
import { 
    PikachuData, 
    ExchangeRateData, 
    WeatherData,
    GeolocationPosition,
    GeolocationError,
    ContactFormData,
    FormMessageData
} from './types';

// Import các component con
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import CVSection from './components/CVSection';
import PikachuCard from './components/PikachuCard';
import ExchangeRateCard from './components/ExchangeRateCard';
import WeatherCard from './components/WeatherCard';
import OtherProjectsSection from './components/OtherProjectsSection';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';

// --- Main Page Component ---
export default function PersonalWebsite() {

    // --- STATE MANAGEMENT ---
    const [theme, setTheme] = useState('dark');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [contactForm, setContactForm] = useState<ContactFormData>({ name: '', email: '', message: '' });
    const [formMessage, setFormMessage] = useState<FormMessageData>({ text: '', type: '' });

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

    const cleanInput = (value: string): string => {
        return value.toString().replace(/,/g, '').replace(/[^\d.]/g, '');
    };

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
    }, [usdInput]); 

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

    const fetchWeatherByLocation = useCallback(() => {
        const success = (position: GeolocationPosition) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            setWeatherLocation(`Vị trí hiện tại: (${lat.toFixed(4)}, ${lon.toFixed(4)})`);
            loadWeather(lat, lon);
        };

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

    useEffect(() => {
        fetchPikachu();
        fetchExchangeRate();
        fetchWeatherByLocation();
    }, [fetchPikachu, fetchExchangeRate, fetchWeatherByLocation]);

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

    const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setContactForm(prev => ({ ...prev, [id]: value }));
    };

    const handleToggleShiny = () => {
        setIsPikachuShiny(!isPikachuShiny);
    };

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
    
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.target as HTMLImageElement;
        target.onerror = null; 
        target.src = 'https://i.postimg.cc/jSWLg5FT/Screenshot-103.png';
    };

    // --- RENDER FUNCTIONS (Đã bị xóa, logic được chuyển vào component con) ---

    // --- JSX (Giao diện) ---
    return (
        <>
            {/* Global Styles */}
            <style jsx global>{`
                html {
                    scroll-behavior: smooth;
                    font-family: 'Inter', sans-serif;
                }
                /* ... (toàn bộ CSS của bạn giữ nguyên) ... */
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
        
            <Header 
                theme={theme}
                isMobileMenuOpen={isMobileMenuOpen}
                handleThemeToggle={handleThemeToggle}
                handleMobileMenuToggle={handleMobileMenuToggle}
                closeMobileMenu={closeMobileMenu}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                <HeroSection handleImageError={handleImageError} />

                <AboutSection />

                <CVSection />
                
                <section id="du-an-api" className="py-20">
                    <h2 className="text-4xl font-bold text-center mb-12 border-b-4 border-primary inline-block pb-2">Dự Án Tích Hợp API</h2>
                    <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
                        
                        <PikachuCard
                            data={pikachuData}
                            isLoading={isPikachuLoading}
                            isShiny={isPikachuShiny}
                            onToggleShiny={handleToggleShiny}
                        />
                        
                        <ExchangeRateCard
                            rate={usdToVndRate}
                            isLoading={isRateLoading}
                            usdInput={usdInput}
                            vndInput={vndInput}
                            updateDate={rateUpdateDate}
                            onUsdChange={handleUsdChange}
                            onVndChange={handleVndChange}
                            onRefresh={fetchExchangeRate}
                        />

                        <WeatherCard
                            data={weatherData}
                            isLoading={isWeatherLoading}
                            location={weatherLocation}
                            onRefresh={fetchWeatherByLocation}
                        />
                    </div>
                </section>

                <OtherProjectsSection />

                <ContactForm
                    contactForm={contactForm}
                    formMessage={formMessage}
                    onFormChange={handleFormChange}
                    onContactSubmit={handleContactSubmit}
                />

            </main>

            <Footer />
        </>
    );
}