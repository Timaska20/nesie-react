import React, { useEffect, useState } from 'react';
import {
    FaBell,
    FaMoneyBill,
    FaCreditCard,
    FaPiggyBank,
    FaUserCircle,
    FaUniversity,
    FaHome,
    FaComments,
    FaCog,
    FaUser,
    FaEnvelope,
    FaLock
} from 'react-icons/fa';
import { MdAttachMoney } from 'react-icons/md';
import axios from 'axios';
import CreditList from './CreditList';

export default function MobileHomePage() {
    const [rates, setRates] = useState({
        eur: { buy: '—', sell: '—' },
        rub: { buy: '—', sell: '—' },
        usd: { buy: '—', sell: '—' },
    });

    const [activeSection, setActiveSection] = useState('home');
    const [credits, setCredits] = useState([]);
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

    const handleGetCredit = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Ошибка: токен не найден. Пожалуйста, войдите заново.');
                return;
            }

            const personalResponse = await axios.get('/api/personal-data/', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const personalData = personalResponse.data;

            const creditResponse = await axios.post('/api/find-credits/?filter_type=BEST', personalData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (creditResponse.data && creditResponse.data.credits) {
                setCredits(creditResponse.data.credits);
                setActiveSection('credits');
            } else {
                alert('Кредиты не найдены.');
            }
        } catch (error) {
            console.error('Ошибка при получении кредитов:', error.response?.data || error.message);
            alert('Ошибка при получении кредитов.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Ошибка: токен не найден. Пожалуйста, войдите заново.');
                return;
            }

            await axios.post('/api/personal-data/', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert('Данные успешно сохранены!');
            setShowPersonalForm(false);
        } catch (error) {
            console.error('Ошибка при сохранении данных:', error.response?.data || error.message);
            alert('Ошибка при сохранении данных.');
        }
    };

    const sectionTitles = {
        home: 'Главная',
        chat: 'Чат',
        settings: 'Настройки',
        credits: 'Доступные кредиты'
    };

    return (
        <div className="max-w-md mx-auto bg-gray-50 min-h-screen p-4 pb-16">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                    <FaUserCircle className="text-green-600 w-6 h-6" />
                    <h1 className="text-lg font-semibold">
                        {activeSection === 'home' && 'Главная'}
                        {activeSection === 'credits' && 'Доступные кредиты'}
                        {activeSection === 'chat' && 'Чат'}
                        {activeSection === 'settings' && 'Настройки'}
                    </h1>
                </div>
                <FaBell className="text-green-600 w-6 h-6" />
            </div>

            {activeSection === 'home' && (
                <>
                    <div className="bg-[#0A1B34] rounded-lg overflow-hidden mb-4 p-4 text-white flex items-center">
                        <div>
                            <p className="font-semibold">FX-обменник с выгодным курсом</p>
                            <p className="text-sm mt-1">Лучшие условия с 10:30 до 17:00 в будние дни</p>
                            <button className="mt-3 text-green-400 hover:underline">Подробнее</button>
                        </div>
                        <div className="ml-auto">
                            <img src="/phone-exchange.png" alt="FX Exchange" className="w-20 h-20" />
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-center mb-4">
                        <div className="flex flex-col items-center text-xs">
                            <FaMoneyBill className="w-6 h-6 text-green-600 mb-1" />
                            <span>Пополнение</span>
                        </div>
                        <div
                            className="flex flex-col items-center text-xs cursor-pointer"
                            onClick={handleGetCredit}
                        >
                            <MdAttachMoney className="w-6 h-6 text-green-600 mb-1" />
                            <span>Получить кредит</span>
                        </div>
                        <div className="flex flex-col items-center text-xs">
                            <FaPiggyBank className="w-6 h-6 text-green-600 mb-1" />
                            <span>Открыть депозит</span>
                        </div>
                        <div className="flex flex-col items-center text-xs">
                            <FaCreditCard className="w-6 h-6 text-green-600 mb-1" />
                            <span>Открыть карту</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center space-x-2">
                                <FaUniversity className="text-green-600 w-5 h-5" />
                                <p className="text-sm font-semibold">Курсы валют</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="bg-gray-50 rounded p-2">
                                <p className="text-green-600 font-semibold text-sm">
                                    € {rates.eur.buy} ₸
                                </p>
                                <p className="text-xs text-gray-400">{rates.eur.sell} ₸</p>
                            </div>
                            <div className="bg-gray-50 rounded p-2">
                                <p className="text-green-600 font-semibold text-sm">
                                    ₽ {rates.rub.buy} ₸
                                </p>
                                <p className="text-xs text-gray-400">{rates.rub.sell} ₸</p>
                            </div>
                            <div className="bg-gray-50 rounded p-2">
                                <p className="text-green-600 font-semibold text-sm">
                                    $ {rates.usd.buy} ₸
                                </p>
                                <p className="text-xs text-gray-400">{rates.usd.sell} ₸</p>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {activeSection === 'credits' && <CreditList credits={credits} />}

            {activeSection === 'chat' && (
                <div className="bg-white rounded-lg p-4">
                    <h2 className="text-lg font-semibold mb-4">Чат</h2>
                    <p>Раздел чата находится в разработке.</p>
                </div>
            )}

            {activeSection === 'settings' && (
                <div className="bg-white rounded-lg p-4">
                    <h2 className="text-lg font-semibold mb-4">Настройки</h2>
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
                        <form onSubmit={handleSubmit} className="space-y-4">
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
                        </form>
                    )}
                </div>
            )}

            <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t flex justify-around py-2">
                <div
                    className={`flex flex-col items-center text-xs cursor-pointer ${
                        activeSection === 'home' ? 'text-green-600' : 'text-gray-400'
                    }`}
                    onClick={() => setActiveSection('home')}
                >
                    <FaHome className="w-5 h-5" />
                    <span>Главная</span>
                </div>
                <div
                    className={`flex flex-col items-center text-xs cursor-pointer ${
                        activeSection === 'chat' ? 'text-green-600' : 'text-gray-400'
                    }`}
                    onClick={() => setActiveSection('chat')}
                >
                    <FaComments className="w-5 h-5" />
                    <span>Чат</span>
                </div>
                <div
                    className={`flex flex-col items-center text-xs cursor-pointer ${
                        activeSection === 'settings' ? 'text-green-600' : 'text-gray-400'
                    }`}
                    onClick={() => {
                        setActiveSection('settings');
                        setShowPersonalForm(false);
                    }}
                >
                    <FaCog className="w-5 h-5" />
                    <span>Настройки</span>
                </div>
            </div>
        </div>
    );
}
