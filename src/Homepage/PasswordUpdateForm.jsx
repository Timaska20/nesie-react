import React, { useState } from 'react';
import axios from 'axios';
import { FaLock, FaTimes } from 'react-icons/fa';

export default function PasswordUpdateForm({ onClose }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleUpdatePassword = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/update-password/',
        new URLSearchParams({
          old_password: oldPassword,
          new_password: newPassword,
        }),
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(response.data.message);
    } catch (error) {
      console.error('Ошибка обновления пароля:', error);
      setMessage('Ошибка при обновлении. Проверьте старый пароль.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FaLock className="text-gray-600" />
          Изменить пароль
        </h2>
        <FaTimes className="cursor-pointer text-gray-400 hover:text-red-500" onClick={onClose} />
      </div>

      <input
        type="password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
        placeholder="Старый пароль"
      />
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
        placeholder="Новый пароль"
      />
      <button
        onClick={handleUpdatePassword}
        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
      >
        Сменить пароль
      </button>

      {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
    </div>
  );
}
