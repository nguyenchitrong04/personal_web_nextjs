import React from 'react';

const AboutSection = () => {
    return (
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
    );
};

export default AboutSection;