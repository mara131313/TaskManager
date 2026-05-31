import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const res = await API.post('/Auth/login', { email, password });
            
            localStorage.setItem('isLoggedIn', 'true');
            
            localStorage.setItem('userEmail', email);
            
            if (res.data && res.data.role) {
                localStorage.setItem('userRole', res.data.role);
            } else {
                localStorage.setItem('userRole', 'User');
            }

            navigate('/'); 
            
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Email sau parolă incorectă. Te rugăm să încerci din nou.');
            }
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh' }}>
            <div style={{ background: '#ffffff', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(218, 143, 163, 0.1)', width: '100%', maxWidth: '420px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px', color: '#4a3e56' }}>Bine ai revenit!</h2>
                <p style={{ color: '#8a7a99', fontSize: '14px', marginBottom: '24px' }}>Introduceți datele pentru a accesa laboratorul</p>
                
                {error && <p style={{ color: '#d95371', background: '#fff0f3', padding: '12px', borderRadius: '12px', fontSize: '13px', marginBottom: '16px', fontWeight: '500' }}>{error}</p>}
                
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#685977' }}>Adresă Email</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="admin@laborator.com sau student@laborator.com" 
                            required 
                            style={{ padding: '12px', borderRadius: '12px', border: '1px solid #e1dbec', fontSize: '14px' }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#685977' }}>Parolă</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="••••••••" 
                            required 
                            style={{ padding: '12px', borderRadius: '12px', border: '1px solid #e1dbec', fontSize: '14px' }}
                        />
                    </div>
                    <button type="submit" style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #e5989b 0%, #b5828c 100%)', color: 'white', border: 'none', borderRadius: '12px', marginTop: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 15px rgba(181, 130, 140, 0.3)' }}>
                        Autentificare
                    </button>
                </form>
                <p style={{ marginTop: '24px', fontSize: '14px', color: '#8a7a99' }}>
                    Nu ai un cont încă? <Link to="/register" style={{ color: '#b5828c', fontWeight: '600', textDecoration: 'none' }}>Creează cont</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;