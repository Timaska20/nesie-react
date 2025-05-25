import React, { useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import axios from 'axios';

export default function RegisterPage() {
    const [form, setForm] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState('');
    const navigate = useNavigate(); // ✅ хук для редиректа

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors('');

        if (!validateEmail(form.email)) {
            setErrors('Пожалуйста, введите корректный email.');
            return;
        }
        if (form.password.length < 6) {
            setErrors('Пароль должен быть не менее 6 символов.');
            return;
        }
        if (form.password !== form.confirmPassword) {
            setErrors('Пароль и повторный пароль не совпадают.');
            return;
        }

        try {
            const params = new URLSearchParams();
            params.append('username', form.username);
            params.append('password', form.password);
            params.append('email', form.email);

            const response = await axios.post('/api/register/', params);
            console.log('Регистрация успешна:', response.data);

            localStorage.setItem('token', response.data.access_token);
            navigate('/home');
        } catch (error) {
            console.error('Ошибка регистрации:', error.response?.data || error.message);
            if (error.response?.data?.detail === 'Пользователь уже существует') {
                setErrors('Пользователь с таким логином уже существует.');
            } else {
                setErrors('Ошибка регистрации.');
            }
        }
    };

    return (
        <div className="flex justify-center mt-10">
            <div className="w-full max-w-md border rounded-lg p-6 bg-white shadow">
                <h2 className="text-lg font-semibold mb-4">Регистрация</h2>

                {errors && (
                    <div className="mb-4 p-2 text-sm text-red-600 bg-red-50 rounded">
                        {errors}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Введите email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Логин</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="Придумайте логин"
                            value={form.username}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Пароль</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Придумайте пароль"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Повторите пароль</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Повторите пароль"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary text-white py-2 rounded hover:bg-primaryHover transition"
                    >
                        Зарегистрироваться
                    </button>
                </form>

                <p className="mt-4 text-sm text-center">
                    Уже есть аккаунт?{' '}
                    <Link
                        to="/"
                        className="text-secondary hover:text-secondaryHover underline"
                    >
                        Войти
                    </Link>
                </p>
            </div>
        </div>
    );
}
``