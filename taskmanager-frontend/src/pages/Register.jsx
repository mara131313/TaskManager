import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

const Register = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [fieldErrors, setFieldErrors] = useState({});
    const [globalError, setGlobalError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setFieldErrors({});
        setGlobalError('');

        // validare client-side
        let errors = {};
        if (fullName.trim().length < 3) {
            errors.fullName = 'Numele trebuie să aibă cel puțin 3 caractere.';
        }
        if (password.length < 4) {
            errors.password = 'Parola trebuie să aibă minimum 4 caractere.';
        }
        
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        // validare server-side
        try {
            await API.post('/Auth/register', { email, password, fullName });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            if (err.response && err.response.data && err.response.data.errors) {
                const serverErrors = err.response.data.errors;
                let mappedErrors = {};
                Object.keys(serverErrors).forEach(key => {
                    // mapeaza cheia din backend in frontend
                    const frontendKey = key.charAt(0).toLowerCase() + key.slice(1);
                    mappedErrors[frontendKey] = serverErrors[key][0]; 
                });
                setFieldErrors(mappedErrors);
            } else {
                setGlobalError('Înregistrarea a eșuat. Încearcă o altă adresă de email.');
            }
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh' }}>
            <div style={{ background: '#ffffff', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(218, 143, 163, 0.1)', width: '100%', maxWidth: '420px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px', color: '#4a3e56', textAlign: 'center' }}>Cont Nou</h2>
                <p style={{ color: '#8a7a99', fontSize: '14px', marginBottom: '24px', textAlign: 'center' }}>Înregistrare în sistem</p>
                
                {globalError && <p style={{ color: '#d95371', background: '#fff0f3', padding: '12px', borderRadius: '12px', fontSize: '13px', marginBottom: '16px' }}>{globalError}</p>}
                {success && <p style={{ color: '#227237', background: '#e2f9e7', padding: '12px', borderRadius: '12px', fontSize: '13px', marginBottom: '16px' }}>Cont creat!</p>}
                
                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#685977' }}>Nume Complet</label>
                        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                        {fieldErrors.fullName && <span style={{ color: '#d95371', fontSize: '12px', fontWeight: '500' }}>{fieldErrors.fullName}</span>}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#685977' }}>Adresă Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        {fieldErrors.email && <span style={{ color: '#d95371', fontSize: '12px', fontWeight: '500' }}>{fieldErrors.email}</span>}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#685977' }}>Parolă</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        {fieldErrors.password && <span style={{ color: '#d95371', fontSize: '12px', fontWeight: '500' }}>{fieldErrors.password}</span>}
                    </div>

                    <button type="submit" style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #e5989b 0%, #b5828c 100%)', color: 'white', border: 'none' }}>
                        Creează Cont
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;