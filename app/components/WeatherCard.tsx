'use client';
import React from 'react';
import { WeatherData } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface WeatherCardProps {
    data: WeatherData | null;
    isLoading: boolean;
    location: string;
    onRefresh: () => void;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data, isLoading, location, onRefresh }) => {

    const renderContent = () => {
        if (isLoading) return <LoadingSpinner />;
        if (!data) return <p className="text-red-400">Lỗi: Không tải được thời tiết.</p>;
        
        const { temperature, windspeed, weathercode } = data;
        
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

    return (
        <div id="weather-card" className="card p-6 rounded-xl shadow-lg border-2 border-blue-500/50 bg-blue-900/10 text-center transition duration-300">
            <h3 className="text-2xl font-bold text-blue-400 mb-4">OPEN-METEO: THỜI TIẾT</h3>
            <p id="weather-location" className="text-sm text-blue-300 mb-4 min-h-[40px]">{location}</p>
            <div id="weather-data" className="min-h-[220px] flex flex-col justify-center items-center">
                {renderContent()}
            </div>
            <button 
                id="refresh-weather-button" 
                onClick={onRefresh}
                className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300 w-full disabled:opacity-50"
                disabled={isLoading}
                title="Làm mới thời tiết">
                {isLoading ? 'Đang tải...' : 'Làm mới'}
            </button>
            <p className="text-sm text-gray-500 mt-2">Nguồn: api.open-meteo.com</p>
        </div>
    );
};

export default WeatherCard;