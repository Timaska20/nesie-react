import React, { useState } from 'react';
import EyeIcon from './assets/eye.svg?react';
import EyeOffIcon from './assets/eye-off.svg?react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LoginPage() {
    const [form, setForm] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate(); // 🚀 хук для редиректа

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const params = new URLSearchParams();
            params.append('username', form.username);
            params.append('password', form.password);

            const response = await axios.post('/api/token/', params);
            console.log('Успешный вход:', response.data);

            // ✅ Сохраняем токен в localStorage
            if (response.data && response.data.access_token) {
                localStorage.setItem('token', response.data.access_token);
            } else {
                console.error('Токен не получен от сервера');
                setError('Ошибка: токен не получен от сервера.');
                return;
            }

            // ✅ Переходим на главную страницу
            navigate('/home');
        } catch (error) {
            console.error('Ошибка входа:', error.response?.data || error.message);
            setError('Ошибка входа: проверьте логин и пароль.');
        }
    };

    return (
        <div className="flex justify-center mt-10">
            <div className="w-full max-w-md border rounded-lg p-6 bg-white shadow">
                <h2 className="text-lg font-semibold mb-4">Войти в личный кабинет</h2>

                {error && (
                    <div className="mb-4 p-2 text-sm text-red-600 bg-red-50 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Логин</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="Введите логин"
                            value={form.username}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Пароль</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Введите пароль"
                                value={form.password}
                                onChange={handleChange}
                                className="w-full p-2 border rounded pr-10 focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-primary transition"
                            >
                                {showPassword ? (
                                    <EyeOffIcon className="w-5 h-5" />
                                ) : (
                                    <EyeIcon className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="text-right text-sm">
                        <a href="#" className="text-secondary hover:text-secondaryHover underline">Забыли пароль?</a>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary text-white py-2 rounded hover:bg-primaryHover transition"
                    >
                        Войти
                    </button>

                    <div className="flex items-center my-4">
                        <div className="flex-grow border-t" />
                        <span className="mx-2 text-sm text-gray-400">или</span>
                        <div className="flex-grow border-t" />
                    </div>

                    <Link
                        to="/register"
                        className="w-full block text-center border py-2 rounded hover:bg-gray-50 transition"
                    >
                        Зарегистрироваться
                    </Link>
                </form>
            </div>
        </div>
    );
}
