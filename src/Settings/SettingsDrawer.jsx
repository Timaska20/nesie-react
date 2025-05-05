import React, { useState } from 'react';
import { FaCog, FaUserCircle, FaPhone, FaIdCard, FaUser, FaEnvelope, FaLock, FaUserEdit } from 'react-icons/fa';

export default function SettingsDrawer() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Кнопка для открытия панели */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed top-4 right-4 bg-green-500 text-white p-3 rounded-full hover:bg-green-600 z-50"
            >
                <FaCog className="w-6 h-6" />
            </button>

            {/* Затемнение фона при открытии */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-30 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Панель настроек */}
            <div
                className={`fixed top-0 right-0 h-full bg-white shadow-lg w-80 max-w-full z-50 transform ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                } transition-transform duration-300 ease-in-out`}
            >
                <div className="p-6">
                    {/* Верхняя часть */}
                    <div className="flex items-center space-x-4 mb-6">
                        <FaUserCircle className="w-12 h-12 text-gray-400" />
                        <div>
                            <h2 className="text-lg font-semibold">Имя Пользователя</h2>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <FaPhone className="w-4 h-4" />
                                <span>+7 (777) 123-45-67</span>
                            </div>
                        </div>
                        <button className="ml-auto bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-xs flex items-center space-x-1">
                            <FaUserEdit className="w-4 h-4" />
                            <span>Консультант</span>
                        </button>
                    </div>

                    {/* Меню */}
                    <div className="divide-y">
                        <div className="flex items-center py-3 cursor-pointer hover:bg-gray-50">
                            <FaIdCard className="w-5 h-5 text-gray-500 mr-3" />
                            <span>Удостоверение личности</span>
                        </div>
                        <div className="flex items-center py-3 cursor-pointer hover:bg-gray-50">
                            <FaUser className="w-5 h-5 text-gray-500 mr-3" />
                            <span>Личные данные</span>
                        </div>
                        <div className="flex items-center py-3 cursor-pointer hover:bg-gray-50">
                            <FaEnvelope className="w-5 h-5 text-gray-500 mr-3" />
                            <span>Изменить e-mail</span>
                        </div>
                        <div className="flex items-center py-3 cursor-pointer hover:bg-gray-50">
                            <FaLock className="w-5 h-5 text-gray-500 mr-3" />
                            <span>Изменить пароль</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
