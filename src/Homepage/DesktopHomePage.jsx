import React, { useEffect, useState, useContext } from 'react';
import { CreditContext } from '../context/CreditContext';
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
import EmailUpdateForm from './EmailUpdateForm';
import PasswordUpdateForm from './PasswordUpdateForm';
import PersonalDataForm from './PersonalDataForm';

export default function DesktopHomePage() {
    const [rates, setRates] = useState({
        eur: { buy: 0, sell: 0 },
        rub: { buy: 0, sell: 0 },
        usd: { buy: 0, sell: 0 }
    });
    const [credits, setCredits] = useState([]);
    const [submittedCredits, setSubmittedCredits] = useState([]);
    const [activeSection, setActiveSection] = useState('home');
    const [showPersonalForm, setShowPersonalForm] = useState(false);
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [formData, setFormData] = useState({
        person_age: '',
        person_income: '',
        person_home_ownership: '',
        person_emp_length: ''
    });
    const [hasData, setHasData] = useState(false);
    const [isEditable, setIsEditable] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [emailConfirmed, setEmailConfirmed] = useState(true);
    const [userEmail, setUserEmail] = useState('');
    const { selectedCredit, setSelectedCredit } = useContext(CreditContext);

       useEffect(() => {
        axios.get('/api/email-status/', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).then((response) => {
            setEmailConfirmed(response.data.email_confirmed);
            setUserEmail(response.data.email);
            if (!response.data.email_confirmed) {
                setActiveSection('settings');
                setShowEmailForm(true);
                setShowPersonalForm(false);
                setShowPasswordForm(false);
            }
        }).catch(() => {});
    }, []);


    useEffect(() => {
        axios.get('/api/currency-rates/')
            .then((response) => {
                setRates({
                    eur: response.data.eur,
                    rub: response.data.rub,
                    usd: response.data.usd
                });
            })
            .catch((error) => {
                console.error('Ошибка загрузки курсов валют', error);
            });

        const token = localStorage.getItem('token');
        if (token) {
            axios.get('/api/credits/', {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => {
                setSubmittedCredits(res.data);
            }).catch(err => {
                console.error('Ошибка загрузки заявок:', err);
            });
        }
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


    const handleGetCredit = async () => {
        try {
            setIsLoading(true);
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
        setActiveSection('credits');
            } else {
                alert('Кредиты не найдены.');
            }
        } catch (error) {
            console.error('Ошибка при получении кредитов:', error.response?.data || error.message);
            alert('Ошибка при получении кредитов.');
        } finally {
      setIsLoading(false);
        }
    };

        const isLocked = !emailConfirmed;
       const navItem = (section, icon, label) => (
        <div
            className={`flex items-center space-x-2 cursor-pointer ${activeSection === section ? 'text-green-600' : 'text-gray-600 hover:text-green-600'} ${isLocked && section !== 'settings' ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => {
                if (isLocked && section !== 'settings') return;
                setActiveSection(section);
                setShowPersonalForm(false);
            }}
        >
            {icon}
            <span>{label}</span>
        </div>
    );
    return (
        <div className="flex min-h-screen bg-gray-50 relative">
            <aside className="w-64 bg-white shadow-lg p-4">
                <h2 className="text-xl font-bold mb-6">Панель</h2>
                <nav className="space-y-4">
                    {navItem('home', <FaHome className="w-5 h-5" />, 'Главная')}
                    {navItem('chat', <FaComments className="w-5 h-5" />, 'Чат')}
                    {navItem('settings', <FaCog className="w-5 h-5" />, 'Настройки')}
                </nav>
            </aside>

      <main className="flex-1 p-8">
                {!emailConfirmed && (
                    <div className="mb-4 p-4 bg-red-100 text-red-800 border border-red-300 rounded">
                        Вы не подтвердили адрес электронной почты <strong>{userEmail}</strong>. Подтвердите, чтобы продолжить использование системы.
          </div>
        )}

          {activeSection === 'settings' && showEmailForm && <EmailUpdateForm onClose={() => {}} />}
           {activeSection === 'settings' && showPasswordForm && <PasswordUpdateForm onClose={() => setShowPasswordForm(false)} />}

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

        <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h2 className="text-lg font-semibold mb-4">Продукты</h2>
            {submittedCredits.length > 0 ? (
                <div className="space-y-4">
                    {submittedCredits.map((credit, idx) => (
                        <div
                            key={idx}
                            className="flex items-center space-x-4 p-4 border border-yellow-300 bg-yellow-50 rounded-lg shadow-sm hover:shadow-md transition"
                        >
                            <div className="text-yellow-500 text-3xl">📁</div>
                            <div className="flex-1">
                                <h3 className="text-md font-semibold text-gray-800 mb-1">Кредит по заявке</h3>
                                <p className="text-sm text-gray-600">
                                    <strong>Сумма:</strong> {credit.loan_amount?.toLocaleString()} ₸
                                </p>
                                <p className="text-sm text-gray-600">
                                    <strong>Цель:</strong> {credit.loan_intent ?? '—'}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <strong>Класс:</strong> {credit.loan_grade ?? '—'} | <strong>Ставка:</strong> {credit.interest_rate}%
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">Нет активных продуктов</p>
            )}
        </div>
          </>
        )}


{activeSection === 'credits' && (
    <CreditList
        credits={credits}
        onApply={(credit) => {
            setSelectedCredit(credit);
            setActiveSection('home');
        }}
    />
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

    {showPersonalForm ? (
      <PersonalDataForm
        formData={formData}
        isEditable={isEditable}
                                onChange={(e) => {
                                    const { name, value } = e.target;
                                    setFormData((prev) => ({ ...prev, [name]: value }));
                                }}
        onSubmit={handleSubmit}
        onEdit={() => setIsEditable(true)}
        onCancel={() => setShowPersonalForm(false)}
      />
    ) : (
      <ul className="divide-y">
                                <li className={`py-3 flex items-center ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}`}
          onClick={() => {
                                        if (isLocked) return;
            setShowPersonalForm(true);
            setShowEmailForm(false);
            setShowPasswordForm(false);
          }}
        >
          <FaUser className="w-5 h-5 text-gray-500 mr-3" />
          Личные данные
        </li>
        <li
          className="py-3 flex items-center cursor-pointer hover:bg-gray-50"
          onClick={() => {
            setShowEmailForm(true);
            setShowPersonalForm(false);
            setShowPasswordForm(false);
          }}
        >
          <FaEnvelope className="w-5 h-5 text-gray-500 mr-3" />
          Изменить e-mail
        </li>
                                <li className={`py-3 flex items-center ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}`}
          onClick={() => {
                                        if (isLocked) return;
            setShowPasswordForm(true);
            setShowPersonalForm(false);
            setShowEmailForm(false);
          }}
        >
          <FaLock className="w-5 h-5 text-gray-500 mr-3" />
          Изменить пароль
        </li>
      </ul>
    )}
  </div>
)}
      </main>
    </div>
  );
}
