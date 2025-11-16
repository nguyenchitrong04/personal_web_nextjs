'use client';
import React from 'react';
import { PikachuData } from '../types'; // Import kiểu
import LoadingSpinner from './LoadingSpinner';

interface PikachuCardProps {
    data: PikachuData | null;
    isLoading: boolean;
    isShiny: boolean;
    onToggleShiny: () => void;
}

const PikachuCard: React.FC<PikachuCardProps> = ({ data, isLoading, isShiny, onToggleShiny }) => {
    
    const renderContent = () => {
        if (isLoading) return <LoadingSpinner />;
        if (!data) return <p className="text-red-400">Lỗi: Không tải được Pikachu.</p>;

        const statusText = isShiny ? 'Shiny' : 'Normal';
        const pikachuImage = isShiny 
            ? data.sprites.front_shiny 
            : data.sprites.front_default;
        const pikachuAbilities = data.abilities.map(a => a.ability.name).join(', ');
        const pikachuWeight = data.weight / 10; // kg

        return (
            <>
                <img src={pikachuImage} alt={`Pikachu ${statusText}`} className="mx-auto w-32 h-32 object-contain animate-bounce-y" />
                <p className="text-3xl font-extrabold text-poke-yellow mt-4">#{data.id} {data.name.toUpperCase()} ({statusText})</p>
                <p className="text-lg text-gray-300 mt-2">Cân nặng: {pikachuWeight} kg</p>
                <p className="text-md text-gray-400 mt-1">Khả năng: {pikachuAbilities}</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">Type: {data.types[0].type.name.toUpperCase()}</span>
                </div>
            </>
        );
    };

    return (
        <div id="pikachu-card" className="card p-6 rounded-xl shadow-lg border-2 border-poke-yellow/50 bg-yellow-900/10 text-center transition duration-300">
            <h3 className="text-2xl font-bold text-poke-yellow mb-4">POKEAPI: PIKACHU</h3>
            <div id="pikachu-data" className="min-h-[220px]">
                {renderContent()}
            </div>
            <button 
                id="toggle-shiny-button" 
                onClick={onToggleShiny}
                className="mt-4 px-4 py-2 bg-yellow-600 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-700 transition duration-300 w-full disabled:opacity-50"
                disabled={isLoading}
                title="Chuyển đổi giữa Pikachu thường và Shiny">
                {isShiny ? 'Xem Normal' : 'Xem Shiny'}
            </button>
            <p className="text-sm text-gray-500 mt-4">Nguồn: https://pokeapi.co/api/v2/pokemon/pikachu</p>
        </div>
    );
};

export default PikachuCard;