'use client';
import React from 'react';

interface HeaderProps {
    theme: string;
    isMobileMenuOpen: boolean;
    handleThemeToggle: () => void;
    handleMobileMenuToggle: () => void;
    closeMobileMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
    theme, 
    isMobileMenuOpen, 
    handleThemeToggle, 
    handleMobileMenuToggle, 
    closeMobileMenu 
}) => {
    return (
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
    );
};

export default Header;