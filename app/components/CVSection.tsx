import React from 'react';

const CVSection = () => {
    return (
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
    );
};

export default CVSection;