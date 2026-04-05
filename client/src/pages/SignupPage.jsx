import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

const SignupPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { authAction } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setError('');
    setSuccess('');

    try {
      const { data } = await api.post('/auth/signup', form);
      authAction(data);
      setSuccess('Signup successful!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="mx-auto mt-16 max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">
      <h1 className="mb-4 text-2xl font-bold">Create your FocusFlow account</h1>
      <form onSubmit={submit} className="space-y-3">
        <input
          className="w-full rounded border p-2 dark:bg-slate-800"
          type="text"
          placeholder="Full name"
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          required
        />
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
        <button className="w-full rounded bg-brand-500 py-2 text-white">Signup</button>
      </form>
      <p className="mt-4 text-sm">
        Already have an account? <Link className="text-brand-500" to="/login">Login</Link>
      </p>
    </div>
  );
};

export default SignupPage;
