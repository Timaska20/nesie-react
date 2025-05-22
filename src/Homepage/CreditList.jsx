// CreditList.jsx — исправленная интерпретация SHAP по label
import React, { useState } from 'react';
import axios from 'axios';

const FEATURE_TRANSLATIONS = {
    "person_age": "Возраст",
    "person_income": "Доход",
    "person_home_ownership_MORTGAGE": "Жильё: ипотека",
    "person_home_ownership_RENT": "Жильё: аренда",
    "person_home_ownership_OWN": "Жильё: собственное",
    "person_home_ownership_OTHER": "Жильё: другое",
    "person_emp_length": "Стаж работы",
    "loan_intent_HOMEIMPROVEMENT": "Цель: ремонт",
    "loan_intent_VENTURE": "Цель: бизнес",
    "loan_intent_MEDICAL": "Цель: медицина",
    "loan_intent_PERSONAL": "Цель: личное",
    "loan_intent_EDUCATION": "Цель: образование",
    "loan_intent_DEBTCONSOLIDATION": "Цель: погашение долгов",
    "loan_grade_A": "Класс A",
    "loan_grade_B": "Класс B",
    "loan_grade_C": "Класс C",
    "loan_grade_D": "Класс D",
    "loan_grade_E": "Класс E",
    "loan_grade_F": "Класс F",
    "loan_grade_G": "Класс G",
    "loan_amnt": "Сумма кредита",
    "loan_int_rate": "Процентная ставка",
    "loan_percent_income": "Доля от дохода",
    "cb_person_default_on_file": "Была просрочка",
    "cb_person_cred_hist_length": "Кредитная история",
    "loan_to_income_ratio": "Кредит/доход",
    "loan_to_emp_length_ratio": "Кредит/стаж",
    "int_rate_to_loan_amt_ratio": "Ставка/сумма",
    "adjusted_age": "Коррект. возраст"
};

export default function CreditList({ credits }) {
    const [explanations, setExplanations] = useState({});

    const handleExplainClick = async (credit, index) => {
        if (explanations[index]) {
            setExplanations(prev => ({ ...prev, [index]: null }));
            return;
        }

        // Получаем токен из localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Токен не найден. Пожалуйста, войдите.');
            return;
        }

        try {
           const response = await axios.post(
  '/api/predict/?explain=true',
  {
      loan_intent: credit.loan_intent,
      loan_grade: credit.loan_grade,
      loan_amount: credit.loan_amnt_kzt,  // <-- здесь меняем
      loan_int_rate: credit.loan_int_rate ?? 15.0,
      loan_status: credit.loan_status,
      currency: 'KZT'
  },
  { headers: { Authorization: `Bearer ${token}` } }
);

            setExplanations(prev => ({ ...prev, [index]: response.data }));
        } catch (error) {
            console.error('Ошибка при получении объяснения:', error);
            alert('Не удалось загрузить объяснение модели');
        }
    };

    const renderExplanationTable = (explanation, credit) => {
        const shapEntries = Object.entries(explanation.shap_explanation);

        const currentIntentKey = `loan_intent_${credit.loan_intent}`;
        const currentGradeKey = `loan_grade_${credit.loan_grade}`;
        const currentHousingKey = `person_home_ownership_${credit.client_prediction.client_person_home_ownership}`;

        const filteredShapEntries = shapEntries.filter(([key]) => {
            if (key.startsWith('loan_intent_')) return key === currentIntentKey;
            if (key.startsWith('loan_grade_')) return key === currentGradeKey;
            if (key.startsWith('person_home_ownership_')) return key === currentHousingKey;
            return true;
        });

        const positives = filteredShapEntries
            .filter(([, v]) => v > 0)
            .sort(([, a], [, b]) => Math.abs(b) - Math.abs(a))
            .slice(0, 5);

        const negatives = filteredShapEntries
            .filter(([, v]) => v < 0)
            .sort(([, a], [, b]) => Math.abs(b) - Math.abs(a))
            .slice(0, 5);

        const label = explanation.prediction_label;

        const decreaseText = label === 1
            ? "Увеличивают риск дефолта:"
            : "Снижают риск — способствуют одобрению:";

        const increaseText = label === 1
            ? "Снижают риск дефолта:"
            : "Увеличивают риск — уменьшают шанс одобрения:";

        return (
            <div className="mt-2 border border-green-200 rounded-lg bg-green-50 p-3 text-sm text-gray-800">
                <p className="font-semibold text-green-700 mb-1">Что повлияло на решение:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <p className="text-red-600 font-semibold mb-1">⬆️ {increaseText}</p>
                        <ul className="list-disc pl-5 space-y-1">
                            {positives.map(([key, val], i) => (
                                <li key={`pos-${i}`}><b>{FEATURE_TRANSLATIONS[key] || key}</b>: +{val.toFixed(3)}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p className="text-green-700 font-semibold mb-1">⬇️ {decreaseText}</p>
                        <ul className="list-disc pl-5 space-y-1">
                            {negatives.map(([key, val], i) => (
                                <li key={`neg-${i}`}><b>{FEATURE_TRANSLATIONS[key] || key}</b>: {val.toFixed(3)}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h1 className="text-2xl font-semibold mb-6">Доступные кредиты</h1>
            {credits.map((credit, index) => (
                <div key={index} className="p-4 border-b border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-lg font-semibold">{credit.loan_intent}</h2>
                        <span className="text-xl text-green-600 font-bold">{credit.loan_amnt_kzt.toLocaleString()} ₸</span>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-sm text-gray-600">Ставка: {credit.loan_int_rate ?? '—'} %</p>
                        <button
                            onClick={() => handleExplainClick(credit, index)}
                            className="text-sm text-green-600 hover:underline"
                        >
                            Уверенность модели: {(credit.client_prediction.prediction_score * 100).toFixed(1)}%
                        </button>
                    </div>
                    {explanations[index] && renderExplanationTable(explanations[index], credit)}
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
            ))}
        </div>
    );
}
