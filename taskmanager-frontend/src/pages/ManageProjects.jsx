import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

const ManageProjects = () => {
    const [projects, setProjects] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole');

    useEffect(() => {
        if (userRole !== 'Admin') {
            navigate('/');
        } else {
            fetchProjects();
        }
    }, [userRole, navigate]);

    const fetchProjects = async () => {
        try {
            const res = await API.get('/Projects');
            setProjects(res.data);
        } catch (err) {
            setError('Nu s-au putut incarca proiectele.');
        }
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await API.post('/Projects', { name, description });
            setName('');
            setDescription('');
            fetchProjects(); 
        } catch (err) {
            setError('Eroare la crearea proiectului. Verifica permisiunile.');
        }
    };

    const handleDeleteProject = async (id) => {
        if (window.confirm('Sigur vrei sa stergi acest proiect?')) {
            try {
                await API.delete(`/Projects/${id}`);
                fetchProjects();
            } catch (err) {
                alert('Nu s-a putut sterge proiectul.');
            }
        }
    };

    return (
        <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#4a3e56' }}>Panou Administrator</h1>
                    <p style={{ color: '#8a7a99', fontSize: '14px' }}>Managementul Proiectelor din Laborator</p>
                </div>
                <Link to="/" style={{ padding: '10px 20px', background: '#f5effa', color: '#685977', borderRadius: '12px', textDecoration: 'none', fontWeight: '600' }}>
                    Inapoi la Task-uri
                </Link>
            </div>

            {error && <p style={{ color: '#d95371', background: '#fff0f3', padding: '12px', borderRadius: '12px', fontSize: '13px', marginBottom: '16px' }}>{error}</p>}

            <div style={{ background: '#ffffff', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', marginBottom: '32px' }}>
                <h3 style={{ color: '#4a3e56', marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>Adauga un Proiect Nou</h3>
                <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <input type="text" placeholder="Nume Proiect" value={name} onChange={(e) => setName(e.target.value)} required />
                    <textarea placeholder="Descriere proiect tehnic" value={description} onChange={(e) => setDescription(e.target.value)} style={{ height: '80px', resize: 'none' }} required />
                    <button type="submit" style={{ padding: '12px', background: 'linear-gradient(135deg, #e5989b 0%, #b5828c 100%)', color: 'white', border: 'none' }}>
                        Salveaza Proiectul
                    </button>
                </form>
            </div>

            <h3 style={{ color: '#685977', marginBottom: '16px', fontSize: '16px' }}>Proiecte Configurate</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {projects.map(p => (
                    <div key={p.id} style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #f6f0fa' }}>
                        <div>
                            <h4 style={{ color: '#4a3e56', fontWeight: '700' }}>{p.name}</h4>
                            <p style={{ color: '#685977', fontSize: '13px', marginTop: '4px' }}>{p.description}</p>
                        </div>
                        <button onClick={() => handleDeleteProject(p.id)} style={{ padding: '8px 16px', background: '#fff0f3', color: '#d95371', border: 'none', borderRadius: '8px' }}>
                            Sterge
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageProjects;