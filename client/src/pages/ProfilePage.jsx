import { useEffect, useState } from 'react';
import { api } from '../api/client';

const initialState = {
  name: '',
  age: '',
  gender: '',
  profession: '',
  contact: { phone: '', address: '', emergencyContact: '' }
};

const ProfilePage = () => {
  const [form, setForm] = useState(initialState);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    api.get('/profile').then(({ data }) => {
      const profile = data.profile || {};
      setForm({
        name: data.name || '',
        age: profile.age || '',
        gender: profile.gender || '',
        profession: profile.profession || '',
        contact: {
          phone: profile.contact?.phone || '',
          address: profile.contact?.address || '',
          emergencyContact: profile.contact?.emergencyContact || ''
        }
      });
    });
  }, []);

  const update = async (event) => {
    event.preventDefault();
    await api.put('/profile', {
      ...form,
      age: form.age ? Number(form.age) : undefined
    });
    setFeedback('Profile updated successfully');
  };

  return (
    <form onSubmit={update} className="rounded-xl bg-white p-5 shadow-md dark:bg-slate-900">
      <h2 className="mb-4 text-xl font-semibold">Profile</h2>
      <div className="grid gap-3 md:grid-cols-2">
        <input className="rounded border p-2 dark:bg-slate-800" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="rounded border p-2 dark:bg-slate-800" type="number" placeholder="Age" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
        <input className="rounded border p-2 dark:bg-slate-800" placeholder="Gender" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} />
        <input className="rounded border p-2 dark:bg-slate-800" placeholder="Profession" value={form.profession} onChange={(e) => setForm({ ...form, profession: e.target.value })} />
        <input className="rounded border p-2 dark:bg-slate-800" placeholder="Phone" value={form.contact.phone} onChange={(e) => setForm({ ...form, contact: { ...form.contact, phone: e.target.value } })} />
        <input className="rounded border p-2 dark:bg-slate-800" placeholder="Emergency Contact" value={form.contact.emergencyContact} onChange={(e) => setForm({ ...form, contact: { ...form.contact, emergencyContact: e.target.value } })} />
      </div>
      <textarea className="mt-3 w-full rounded border p-2 dark:bg-slate-800" placeholder="Address" value={form.contact.address} onChange={(e) => setForm({ ...form, contact: { ...form.contact, address: e.target.value } })} />
      {feedback && <p className="mt-2 text-sm text-emerald-500">{feedback}</p>}
      <button className="mt-3 rounded bg-brand-500 px-4 py-2 text-white">Save profile</button>
    </form>
  );
};

export default ProfilePage;
