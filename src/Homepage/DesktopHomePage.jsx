import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    FaMoneyBill,
    FaCreditCard,
    FaPiggyBank,
    FaUniversity,
    FaHome,
    FaComments,
    FaCog,
    FaBell,
    FaUser,
    FaEnvelope,
    FaLock
} from 'react-icons/fa';
import { MdAttachMoney } from 'react-icons/md';

export default function DesktopHomePage() {
    const [rates, setRates] = useState({
        eur: { buy: '—', sell: '—' },
        rub: { buy: '—', sell: '—' },
        usd: { buy: '—', sell: '—' },
    });

    const [activeSection, setActiveSection] = useState('home');
    const [showPersonalForm, setShowPersonalForm] = useState(false);

    const [formData, setFormData] = useState({
        person_age: '',
        person_income: '',
        person_home_ownership: '',
        person_emp_length: ''
    });

    const [hasData, setHasData] = useState(false);
    const [isEditable, setIsEditable] = useState(true);

    useEffect(() => {
        axios.get('/api/currency-rates/')
            .then((response) => {
                setRates({
                    eur: response.data.eur,
                    rub: response.data.rub,
                    usd: response.data.usd,
                });
            })
            .catch((error) => {
                console.error('Ошибка загрузки курсов валют', error);
            });
    }, []);

    useEffect(() => {
        console.log('🔄 useEffect сработал: activeSection =', activeSection, 'showPersonalForm =', showPersonalForm);
        if (activeSection === 'settings' && showPersonalForm) {
            const token = localStorage.getItem('token');
            if (token) {
                axios.get('/api/personal-data/', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                .then((response) => {
                    console.log('✅ Персональные данные загружены', response.data);
                    setFormData(response.data);
                    setHasData(true);
                    setIsEditable(false);
                })
                .catch((error) => {
                    if (error.response && error.response.status === 404) {
                        console.log('ℹ️ Данные не найдены (404)');
                        setFormData({
                            person_age: '',
                            person_income: '',
                            person_home_ownership: '',
                            person_emp_length: ''
                        });
                        setHasData(false);
                        setIsEditable(true);
                    } else {
                        console.error('Ошибка при загрузке персональных данных:', error);
                    }
                });
            }
        }
    }, [activeSection, showPersonalForm]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        console.log('🟢 handleSubmit вызван (отправка данных на сервер)');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Ошибка: токен не найден. Пожалуйста, войдите заново.');
                return;
            }

            const response = await axios.post('/api/personal-data/', formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log('✅ Ответ сервера:', response.data);
            alert('Данные успешно сохранены!');
            setShowPersonalForm(false);
        } catch (error) {
            console.error('Ошибка при сохранении данных:', error.response?.data || error.message);
            alert('Ошибка при сохранении данных.');
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50 relative">
            <aside className="w-64 bg-white shadow-lg p-4">
                <h2 className="text-xl font-bold mb-6">Панель</h2>
                <nav className="space-y-4">
                    <div
                        className={`flex items-center space-x-2 cursor-pointer ${
                            activeSection === 'home' ? 'text-green-600' : 'text-gray-600 hover:text-green-600'
                        }`}
                        onClick={() => {
                            setActiveSection('home');
                            setShowPersonalForm(false);
                        }}
                    >
                        <FaHome className="w-5 h-5" />
                        <span>Главная</span>
                    </div>
                    <div
                        className={`flex items-center space-x-2 cursor-pointer ${
                            activeSection === 'chat' ? 'text-green-600' : 'text-gray-600 hover:text-green-600'
                        }`}
                        onClick={() => {
                            setActiveSection('chat');
                            setShowPersonalForm(false);
                        }}
                    >
                        <FaComments className="w-5 h-5" />
                        <span>Чат</span>
                    </div>
                    <div
                        className={`flex items-center space-x-2 cursor-pointer ${
                            activeSection === 'settings' ? 'text-green-600' : 'text-gray-600 hover:text-green-600'
                        }`}
                        onClick={() => {
                            setActiveSection('settings');
                            setShowPersonalForm(false);
                        }}
                    >
                        <FaCog className="w-5 h-5" />
                        <span>Настройки</span>
                    </div>
                </nav>
            </aside>

            <main className="flex-1 p-8">
                {activeSection === 'home' && (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold">Главная</h1>
                            <FaBell className="text-green-600 w-6 h-6" />
                        </div>

                        <div className="bg-white rounded-lg shadow p-6 mb-6">
                            <div className="flex items-center space-x-2 mb-4">
                                <FaUniversity className="text-green-600 w-5 h-5" />
                                <h2 className="text-lg font-semibold">Курсы валют</h2>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-4 border rounded-lg text-center">
                                    <p className="text-green-600 font-bold text-lg">
                                        € {rates.eur.buy} ₸
                                    </p>
                                    <p className="text-sm text-gray-500">{rates.eur.sell} ₸</p>
                                </div>
                                <div className="p-4 border rounded-lg text-center">
                                    <p className="text-green-600 font-bold text-lg">
                                        ₽ {rates.rub.buy} ₸
                                    </p>
                                    <p className="text-sm text-gray-500">{rates.rub.sell} ₸</p>
                                </div>
                                <div className="p-4 border rounded-lg text-center">
                                    <p className="text-green-600 font-bold text-lg">
                                        $ {rates.usd.buy} ₸
                                    </p>
                                    <p className="text-sm text-gray-500">{rates.usd.sell} ₸</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold mb-4">Быстрые действия</h2>
                            <div className="grid grid-cols-4 gap-4 text-center">
                                <div className="flex flex-col items-center text-sm">
                                    <FaMoneyBill className="text-green-600 w-6 h-6 mb-1" />
                                    <span>Пополнение</span>
                                </div>
                                <div className="flex flex-col items-center text-sm">
                                    <MdAttachMoney className="text-green-600 w-6 h-6 mb-1" />
                                    <span>Получить кредит</span>
                                </div>
                                <div className="flex flex-col items-center text-sm">
                                    <FaPiggyBank className="text-green-600 w-6 h-6 mb-1" />
                                    <span>Открыть депозит</span>
                                </div>
                                <div className="flex flex-col items-center text-sm">
                                    <FaCreditCard className="text-green-600 w-6 h-6 mb-1" />
                                    <span>Открыть карту</span>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {activeSection === 'chat' && (
                    <div>
                        <h1 className="text-2xl font-bold mb-4">Чат</h1>
                        <p>Раздел чата находится в разработке.</p>
                    </div>
                )}

                {activeSection === 'settings' && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <h1 className="text-2xl font-bold mb-4">Настройки</h1>
                        {!showPersonalForm ? (
                            <ul className="divide-y">
                                <li
                                    className="py-3 flex items-center cursor-pointer hover:bg-gray-50"
                                    onClick={() => {
                                        console.log('🔵 Клик по "Личные данные"');
                                        setShowPersonalForm(true);
                                    }}
                                >
                                    <FaUser className="w-5 h-5 text-gray-500 mr-3" />
                                    Личные данные
                                </li>
                                <li className="py-3 flex items-center">
                                    <FaEnvelope className="w-5 h-5 text-gray-500 mr-3" />
                                    Изменить e-mail
                                </li>
                                <li className="py-3 flex items-center">
                                    <FaLock className="w-5 h-5 text-gray-500 mr-3" />
                                    Изменить пароль
                                </li>
                            </ul>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="block mb-1 text-sm font-medium">Возраст</label>
                                    <input
                                        type="number"
                                        name="person_age"
                                        value={formData.person_age}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                        placeholder="Введите возраст"
                                        required
                                        disabled={!isEditable}
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-medium">Доход</label>
                                    <input
                                        type="number"
                                        name="person_income"
                                        value={formData.person_income}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                        placeholder="Введите доход"
                                        required
                                        disabled={!isEditable}
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-medium">Тип жилья</label>
                                    <select
                                        name="person_home_ownership"
                                        value={formData.person_home_ownership}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                        required
                                        disabled={!isEditable}
                                    >
                                        <option value="">Выберите</option>
                                        <option value="RENT">RENT — арендует жильё</option>
                                        <option value="OWN">OWN — владеет жильём полностью</option>
                                        <option value="MORTGAGE">MORTGAGE — жильё в ипотеке</option>
                                        <option value="OTHER">OTHER — другое</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-medium">Стаж работы (лет)</label>
                                    <input
                                        type="number"
                                        name="person_emp_length"
                                        value={formData.person_emp_length}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                        placeholder="Введите стаж"
                                        required
                                        disabled={!isEditable}
                                    />
                                </div>
                                <div className="flex space-x-2">
                                    {!isEditable ? (
                                        <button
                                            type="button"
                                            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                                            onClick={() => {
                                                console.log('🟡 Кнопка "Изменить" нажата');
                                                setIsEditable(true);
                                            }}
                                        >
                                            Изменить
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                type="button"
                                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                                onClick={() => {
                                                    console.log('🟠 Кнопка "Сохранить" нажата');
                                                    handleSubmit();
                                                }}
                                            >
                                                Сохранить
                                            </button>
                                            <button
                                                type="button"
                                                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                                onClick={() => {
                                                    console.log('🔙 Кнопка "Назад" нажата');
                                                    setShowPersonalForm(false);
                                                }}
                                            >
                                                Назад
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
