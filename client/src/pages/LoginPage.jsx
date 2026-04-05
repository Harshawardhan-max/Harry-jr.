import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { authAction } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    try {
      const { data } = await api.post('/auth/login', form);
      authAction(data);
      setSuccess('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="mx-auto mt-16 max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">
      <h1 className="mb-4 text-2xl font-bold">Welcome back</h1>
      <form onSubmit={submit} className="space-y-3">
        <input
          className="w-full rounded border p-2 dark:bg-slate-800"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          required
        />
        <input
          className="w-full rounded border p-2 dark:bg-slate-800"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
          required
        />
        {error && <p className="text-sm text-rose-500">{error}</p>}
        {success && <p className="text-sm text-emerald-500">{success}</p>}
        <button className="w-full rounded bg-brand-500 py-2 text-white">Login</button>
      </form>
      <a href={`${import.meta.env.VITE_API_BASE_URL}/auth/google`} className="mt-3 block text-center text-sm text-brand-500">
        Continue with Google
      </a>
      <p className="mt-4 text-sm">
        New here? <Link className="text-brand-500" to="/signup">Create account</Link>
      </p>
    </div>
  );
};

export default LoginPage;
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { authAction } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    try {
      const { data } = await api.post('/auth/login', form);
      authAction(data);
      setSuccess('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="mx-auto mt-16 max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">
      <h1 className="mb-4 text-2xl font-bold">Welcome back</h1>
      <form onSubmit={submit} className="space-y-3">
        <input
          className="w-full rounded border p-2 dark:bg-slate-800"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          required
        />
        <input
          className="w-full rounded border p-2 dark:bg-slate-800"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
          required
        />
        {error && <p className="text-sm text-rose-500">{error}</p>}
        {success && <p className="text-sm text-emerald-500">{success}</p>}
        <button className="w-full rounded bg-brand-500 py-2 text-white">Login</button>
      </form>
      <a href={`${import.meta.env.VITE_API_BASE_URL}/auth/google`} className="mt-3 block text-center text-sm text-brand-500">
        Continue with Google
      </a>
      <p className="mt-4 text-sm">
        New here? <Link className="text-brand-500" to="/signup">Create account</Link>
      </p>
    </div>
  );
};

export default LoginPage;
