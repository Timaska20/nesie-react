import React, { useState } from 'react';
import axios from 'axios';
import { FaEnvelope, FaTimes } from 'react-icons/fa';

export default function EmailUpdateForm({ onClose }) {
  const [newEmail, setNewEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleUpdateEmail = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/update-email/',
        new URLSearchParams({ new_email: newEmail }),
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(response.data.message);
    } catch (error) {
      console.error('Ошибка обновления email:', error);
      setMessage('Произошла ошибка. Попробуйте снова.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FaEnvelope className="text-gray-600" />
          Изменить email
        </h2>
        <FaTimes className="cursor-pointer text-gray-400 hover:text-red-500" onClick={onClose} />
      </div>

      <input
        type="email"
        value={newEmail}
        onChange={(e) => setNewEmail(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
        placeholder="Введите новый email"
      />
      <button
        onClick={handleUpdateEmail}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Обновить email
      </button>

      {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
    </div>
  );
}
