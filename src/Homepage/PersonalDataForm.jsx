import React from 'react';

export default function PersonalDataForm({
  formData,
  isEditable,
  onChange,
  onSubmit,
  onEdit,
  onCancel
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-1 text-sm font-medium">Возраст</label>
        <input
          type="number"
          name="person_age"
          value={formData.person_age}
          onChange={onChange}
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
          onChange={onChange}
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
          onChange={onChange}
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
          onChange={onChange}
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
            onClick={onEdit}
          >
            Изменить
          </button>
        ) : (
          <>
            <button
              type="button"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={onSubmit}
            >
              Сохранить
            </button>
            <button
              type="button"
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              onClick={onCancel}
            >
              Назад
            </button>
          </>
        )}
      </div>
    </div>
  );
}
