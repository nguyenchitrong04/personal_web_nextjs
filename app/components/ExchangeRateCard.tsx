'use client';
import React, { ChangeEvent } from 'react';

interface ExchangeRateProps {
    rate: number;
    isLoading: boolean;
    usdInput: string;
    vndInput: string;
    updateDate: string;
    onUsdChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onVndChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onRefresh: () => void;
}

const ExchangeRateCard: React.FC<ExchangeRateProps> = ({
    rate,
    isLoading,
    usdInput,
    vndInput,
    updateDate,
    onUsdChange,
    onVndChange,
    onRefresh
}) => {
    return (
        <div id="exchange-rate-card" className="card p-6 rounded-xl shadow-lg border-2 border-currency-green/50 bg-green-900/10 text-center transition duration-300">
            <h3 className="text-2xl font-bold text-currency-green mb-4">CHUYỂN ĐỔI TỶ GIÁ</h3>
            <div id="exchange-rate-data" className="flex flex-col gap-4">
                <div id="current-rate-display" className="bg-green-700/30 p-2 rounded-lg text-sm font-medium text-currency-green min-h-[60px]">
                    {isLoading ? 'Đang tải tỷ giá...' : (
                        rate > 0 ? (
                            <>
                                1 USD = <span className="text-xl font-bold">{rate.toLocaleString('vi-VN')} VND</span> 
                                <br /> (Cập nhật: {updateDate})
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
                            onChange={onUsdChange}
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
                            onChange={onVndChange}
                            placeholder="Số tiền VND"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-currency-green font-bold">VND</span>
                    </div>
                </div>
            </div>
            <button 
                id="refresh-rate-button" 
                onClick={onRefresh}
                className="mt-6 px-4 py-2 bg-secondary text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300 w-full disabled:opacity-50"
                disabled={isLoading}
                title="Làm mới tỷ giá">
                {isLoading ? 'Đang tải...' : 'Làm mới tỷ giá'}
            </button>
            <p className="text-sm text-gray-500 mt-2">Nguồn: Exchangerate-API</p>
        </div>
    );
};

export default ExchangeRateCard;