import React from 'react';

const OtherProjectsSection = () => {
    return (
        <section id="du-an" className="py-20">
            <h2 className="text-4xl font-bold text-center mb-12 border-b-4 border-secondary inline-block pb-2">Dự Án Khác (Từ CV)</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
    );
};

export default OtherProjectsSection;