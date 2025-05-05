import React from 'react';

const intentTranslations = {
    PERSONAL: 'Личные нужды',
    EDUCATION: 'Образование',
    MEDICAL: 'Медицина',
    VENTURE: 'Бизнес',
    HOMEIMPROVEMENT: 'Ремонт жилья',
    DEBTCONSOLIDATION: 'Рефинансирование'
};

export default function CreditList({ credits }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h1 className="text-2xl font-semibold mb-6">Доступные кредиты</h1>
            <div className="space-y-4">
                {credits.length === 0 ? (
                    <p className="text-center text-gray-500">Нет доступных кредитов.</p>
                ) : (
                    credits.map((credit, index) => (
                        <div key={index} className="p-4 border-b border-gray-200">
                            <div className="flex justify-between items-center mb-2">
                                <div>
                                    <h2 className="text-lg font-semibold">
                                        {intentTranslations[credit.loan_intent] || credit.loan_intent}
                                    </h2>
                                    <p className="text-sm text-gray-500">Кредитный рейтинг: {credit.loan_grade}</p>
                                </div>
                                <span className="text-xl text-green-600 font-bold">
                                    {credit.loan_amnt_kzt.toLocaleString()} ₸
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-sm text-gray-600">Процентная ставка: {credit.loan_int_rate} %</p>
                                <p className="text-sm text-gray-600">
                                    Уверенность модели: {(credit.client_prediction?.prediction_score * 100).toFixed(1)}%
                                </p>
                            </div>
                            <div className="flex justify-between mt-4">
                                <p className="text-sm text-gray-600">
                                    Статус: {credit.loan_status === 0 ? 'Ожидает' : 'Одобрен'}
                                </p>
                                <button
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg"
                                    onClick={() => alert(`Заявка на кредит на сумму ${credit.loan_amnt_kzt.toLocaleString()} ₸ отправлена!`)}
                                >
                                    Подать заявку
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
