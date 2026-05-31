import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

const CreateTask = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [projectId, setProjectId] = useState('');
    const [assignedToUserId, setAssignedToUserId] = useState('');
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole') || 'User';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projectsRes, usersRes] = await Promise.all([
                    API.get('/Projects'),
                    API.get('/Users')
                ]);
                setProjects(projectsRes.data);
                setUsers(usersRes.data);
                
                if (projectsRes.data.length > 0) {
                    setProjectId(projectsRes.data[0].id.toString());
                }
            } catch (err) {
                setError('Nu s-au putut incarca datele necesare.');
            }
        };
        fetchData();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setError('');
        setFieldErrors({});

        // validare client-side
        let errors = {};
        if (title.trim().length < 5) {
            errors.title = 'Titlul activității trebuie să aibă minimum 5 caractere.';
        }
        if (description.trim().length < 10) {
            errors.description = 'Descrierea tehnică trebuie să fie mai detaliată (min. 10 caractere).';
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        // validare server-side
        try {
            const endpoint = userRole === 'Admin' ? '/Tasks' : '/Tasks/suggest';
            
            const payload = { 
                title, 
                description, 
                projectId: parseInt(projectId),
                assignedToUserId: (userRole === 'Admin' && assignedToUserId) ? parseInt(assignedToUserId) : null
            };

            await API.post(endpoint, payload);
            navigate('/');
        } catch (err) {
            if (err.response && err.response.data && err.response.data.errors) {
                const serverErrors = err.response.data.errors;
                let mappedErrors = {};
                Object.keys(serverErrors).forEach(key => {
                    const frontendKey = key.charAt(0).toLowerCase() + key.slice(1);
                    mappedErrors[frontendKey] = serverErrors[key][0];
                });
                setFieldErrors(mappedErrors);
            } else {
                alert('Eroare la comunicarea cu serverul central.');
            }
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh', padding: '20px' }}>
            <div style={{ background: '#ffffff', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(218, 143, 163, 0.1)', width: '100%', maxWidth: '500px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#4a3e56', marginBottom: '6px', textAlign: 'center' }}>
                    {userRole === 'Admin' ? 'Planificare Task' : 'Propune Task Tehnic'}
                </h2>
                <p style={{ color: '#8a7a99', fontSize: '14px', marginBottom: '24px', textAlign: 'center' }}>
                    {userRole === 'Admin' ? 'Asignează o activitate oficială direct în sistem' : 'Trimite o sugestie de activitate spre aprobarea administratorului'}
                </p>
                
                {error && <p style={{ color: '#d95371', background: '#fff0f3', padding: '10px', borderRadius: '8px', fontSize: '13px', textAlign: 'center' }}>{error}</p>}

                <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#685977' }}>Alege Proiectul Corespunzător</label>
                        <select value={projectId} onChange={(e) => setProjectId(e.target.value)}>
                            {projects.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#685977' }}>Titlu Activitate</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Calibrare imprimanta 3D" required />
                        {fieldErrors.title && <span style={{ color: '#d95371', fontSize: '12px' }}>{fieldErrors.title}</span>}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#685977' }}>Descriere tehnică / Componente</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Introduceți instrucțiunile detaliate..." style={{ height: '120px', resize: 'none' }} required />
                        {fieldErrors.description && <span style={{ color: '#d95371', fontSize: '12px' }}>{fieldErrors.description}</span>}
                    </div>

                    {/* SELECTIE UTILIZATOR RESPONSABIL - vizibil doar pentru admin */}
                    {userRole === 'Admin' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ fontSize: '13px', fontWeight: '600', color: '#685977' }}>Utilizator Responsabil</label>
                            <select value={assignedToUserId} onChange={(e) => setAssignedToUserId(e.target.value)}>
                                <option value="">Selectează un membru din laborator (Opțional)</option>
                                {users.map(u => (
                                    <option key={u.id} value={u.id}>{u.fullName || u.email}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                        <Link to="/" style={{ flex: '1', padding: '14px', background: '#f5effa', color: '#685977', borderRadius: '12px', textDecoration: 'none', textAlign: 'center', fontWeight: '600', fontSize: '14px' }}>
                            Anulează
                        </Link>
                        <button type="submit" style={{ flex: '2', padding: '14px', background: 'linear-gradient(135deg, #e5989b 0%, #b5828c 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '600', boxShadow: '0 4px 12px rgba(181, 130, 140, 0.3)', cursor: 'pointer' }}>
                            {userRole === 'Admin' ? 'Salvează Sarcina' : 'Trimite Sugestia'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTask;