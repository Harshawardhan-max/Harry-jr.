import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuthSuccessPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { refresh } = useAuth();

  useEffect(() => {
    const token = params.get('token');
    if (token) {
      localStorage.setItem('ff_token', token);
      refresh().then(() => navigate('/dashboard'));
    } else {
      navigate('/login');
    }
  }, []);

  return <div className="p-10 text-center">Signing you in...</div>;
};

export default OAuthSuccessPage;
