'use client';
import React, { ChangeEvent, FormEvent } from 'react';
import { ContactFormData, FormMessageData } from '../types';

interface ContactFormProps {
    contactForm: ContactFormData;
    formMessage: FormMessageData;
    onFormChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onContactSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ 
    contactForm, 
    formMessage, 
    onFormChange, 
    onContactSubmit 
}) => {
    return (
        <section id="lien-he" className="py-20">
            <h2 className="text-4xl font-bold text-center mb-12 border-b-4 border-secondary inline-block pb-2">Liên Hệ</h2>
            <div className="max-w-xl mx-auto card p-8 rounded-xl shadow-lg transition-colors duration-300">
                <p className="text-lg text-center text-gray-400 mb-6">
                    Hãy liên hệ với tôi qua email hoặc điện thoại để thảo luận về cơ hội làm việc hoặc hợp tác!
                </p>
                <form onSubmit={onContactSubmit} id="contact-form">
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium mb-1">Tên của bạn</label>
                        <input 
                            type="text" 
                            id="name" 
                            name="name" 
                            required
                            value={contactForm.name}
                            onChange={onFormChange}
                            className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-gray-700 text-white" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            required
                            value={contactForm.email}
                            onChange={onFormChange}
                            className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-gray-700 text-white" />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="message" className="block text-sm font-medium mb-1">Nội dung</label>
                        <textarea 
                            id="message" 
                            name="message" 
                            rows={4} 
                            required
                            value={contactForm.message}
                            onChange={onFormChange}
                            className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-gray-700 text-white"></textarea>
                    </div>
                    
                    <button 
                        type="submit" 
                        className="w-full px-6 py-3 bg-secondary text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300 transform hover:scale-[1.02]">
                        Gửi Tin Nhắn
                    </button>
                    
                    {formMessage.text && (
                        <p id="form-message" className={`text-center mt-4 font-medium ${
                            formMessage.type === 'success' ? 'text-green-500' : 
                            formMessage.type === 'loading' ? 'text-gray-500' : 'text-red-500'
                        }`}>
                            {formMessage.text}
                        </p>
                    )}
                </form>
            </div>
        </section>
    );
};

export default ContactForm;