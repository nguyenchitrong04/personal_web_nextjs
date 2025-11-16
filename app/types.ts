// Kiểu dữ liệu cho Pikachu API
export interface PikachuData {
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
export interface ExchangeRateData {
    rates: {
        [key: string]: number; 
        VND: number;
    };
}

// Kiểu dữ liệu cho Open-Meteo API
export interface WeatherData {
    temperature: number;
    windspeed: number;
    weathercode: number;
}

// Kiểu dữ liệu cho vị trí Geolocation
export interface GeolocationPosition {
    coords: {
        latitude: number;
        longitude: number;
    };
}

// Kiểu dữ liệu cho lỗi Geolocation
export interface GeolocationError {
    code: number;
    message: string;
}

// Kiểu dữ liệu cho Form
export interface ContactFormData {
    name: string;
    email: string;
    message: string;
}

export interface FormMessageData {
    text: string;
    type: string;
}