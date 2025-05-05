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
import CreditList from './CreditList';

export default function DesktopHomePage() {
    const [rates, setRates] = useState({
        eur: { buy: '—', sell: '—' },
        rub: { buy: '—', sell: '—' },
        usd: { buy: '—', sell: '—' },
    });

    const [activeSection, setActiveSection] = useState('home');
    const [showPersonalForm, setShowPersonalForm] = useState(false);
    const [credits, setCredits] = useState([]);
    const [formData, setFormData] = useState({
        person_age: '',
        person_income: '',
        person_home_ownership: '',
        person_emp_length: ''
    });
    const [hasData, setHasData] = useState(false);
    const [isEditable, setIsEditable] = useState(true);
    const [isLoading, setIsLoading] = useState(false);  // добавлено состояние загрузки

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
        if (activeSection === 'settings' && showPersonalForm) {
            const token = localStorage.getItem('token');
            if (token) {
                axios.get('/api/personal-data/', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                    .then((response) => {
                        setFormData(response.data);
                        setHasData(true);
                        setIsEditable(false);
                    })
                    .catch((error) => {
                        if (error.response && error.response.status === 404) {
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

            alert('Данные успешно сохранены!');
            setShowPersonalForm(false);
        } catch (error) {
            console.error('Ошибка при сохранении данных:', error.response?.data || error.message);
            alert('Ошибка при сохранении данных.');
        }
    };

    // Обработчик кнопки "Получить кредит" с загрузкой
    const handleGetCredit = async () => {
        try {
            setIsLoading(true);  // Показать загрузку

            const token = localStorage.getItem('token');
            if (!token) {
                alert('Ошибка: токен не найден. Пожалуйста, войдите заново.');
                setIsLoading(false);
                return;
            }

            const personalResponse = await axios.get('/api/personal-data/', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const personalData = personalResponse.data;

            const creditResponse = await axios.post('/api/find-credits/?filter_type=BEST', personalData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            if (creditResponse.data && creditResponse.data.credits) {
                setCredits(creditResponse.data.credits);
                setActiveSection('credits');  // Переключаем на список кредитов
            } else {
                alert('Кредиты не найдены.');
            }
        } catch (error) {
            console.error('Ошибка при получении кредитов:', error.response?.data || error.message);
            alert('Ошибка при получении кредитов.');
        } finally {
            setIsLoading(false);  // Скрыть загрузку
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50 relative">
            <aside className="w-64 bg-white shadow-lg p-4">
                <h2 className="text-xl font-bold mb-6">Панель</h2>
                <nav className="space-y-4">
                    <div
                        className={`flex items-center space-x-2 cursor-pointer ${activeSection === 'home' ? 'text-green-600' : 'text-gray-600 hover:text-green-600'}`}
                        onClick={() => {
                            setActiveSection('home');
                            setShowPersonalForm(false);
                        }}
                    >
                        <FaHome className="w-5 h-5" />
                        <span>Главная</span>
                    </div>
                    <div
                        className={`flex items-center space-x-2 cursor-pointer ${activeSection === 'chat' ? 'text-green-600' : 'text-gray-600 hover:text-green-600'}`}
                        onClick={() => {
                            setActiveSection('chat');
                            setShowPersonalForm(false);
                        }}
                    >
                        <FaComments className="w-5 h-5" />
                        <span>Чат</span>
                    </div>
                    <div
                        className={`flex items-center space-x-2 cursor-pointer ${activeSection === 'settings' ? 'text-green-600' : 'text-gray-600 hover:text-green-600'}`}
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
             {isLoading && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="flex space-x-2 justify-center items-center">
                <div className="h-4 w-4 bg-green-500 rounded-full animate-bounce"></div>
                <div className="h-4 w-4 bg-green-500 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                <div className="h-4 w-4 bg-green-500 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
            </div>
            <p className="text-lg font-semibold mt-4">Рассмотрение заявки...</p>
        </div>
    </div>
)}


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
                                    <span
                                        onClick={handleGetCredit}
                                        className="cursor-pointer bg-gray-100 rounded-lg p-2 transition-colors duration-300 hover:bg-green-200 hover:text-green-800"
                                    >
                                        Получить кредит
                                    </span>
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

                {activeSection === 'credits' && (
                    <CreditList credits={credits} />
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
                                    onClick={() => setShowPersonalForm(true)}
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
                                            onClick={() => setIsEditable(true)}
                                        >
                                            Изменить
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                type="button"
                                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                                onClick={handleSubmit}
                                            >
                                                Сохранить
                                            </button>
                                            <button
                                                type="button"
                                                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                                onClick={() => setShowPersonalForm(false)}
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
