import React from 'react';

interface HeroProps {
    handleImageError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

const HeroSection: React.FC<HeroProps> = ({ handleImageError }) => {
    return (
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
    );
};

export default HeroSection;