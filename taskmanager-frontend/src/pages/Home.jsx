import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

const Home = () => {
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [activeTab, setActiveTab] = useState('proiecte'); 
    
    const navigate = useNavigate();
    
    const userRole = localStorage.getItem('userRole') || 'User';
    const userEmail = localStorage.getItem('userEmail') || '';

    const loadData = async () => {
        try {
            const [tasksRes, projectsRes, usersRes] = await Promise.all([
                API.get('/Tasks'),
                API.get('/Projects'),
                API.get('/Users').catch(() => ({ data: [] }))
            ]);
            setTasks(tasksRes.data);
            setProjects(projectsRes.data);
            setUsers(usersRes.data);
            setLoading(false);
        } catch (err) {
            setError('Eroare la conectarea cu sistemul central al laboratorului.');
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const handleApprove = async (id) => {
        try {
            await API.post(`/Tasks/approve/${id}`);
            loadData();
        } catch (err) {
            alert('Eroare la aprobare. Doar un administrator autorizat poate face asta.');
        }
    };

    const allTasks = tasks.filter(t => t.isApproved);
    
    const currentUserProfile = users.find(u => 
        u.email && userEmail && u.email.trim().toLowerCase() === userEmail.trim().toLowerCase()
    );

    const myTasks = tasks.filter(t => {
        if (!t.isApproved) return false;
        
        if (currentUserProfile) {
            const matchesId = t.assignedUserId === currentUserProfile.id || t.assignedToUserId === currentUserProfile.id;
            if (matchesId) return true;
        }

        const assignedToClean = t.assignedTo ? t.assignedTo.trim() : '';
        const currentRoleClean = userRole ? userRole.trim() : '';
        const currentEmailClean = userEmail ? userEmail.trim() : '';

        if (currentEmailClean && assignedToClean.toLowerCase() === currentEmailClean.toLowerCase()) {
            return true;
        }

        if (currentUserProfile && assignedToClean === currentUserProfile.fullName?.trim()) {
            return true;
        }

        return !currentEmailClean && currentRoleClean && assignedToClean.toLowerCase() === currentRoleClean.toLowerCase();
    });
    
    const myProposals = tasks.filter(t => !t.isApproved);

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '18px', color: '#b5828c', fontWeight: '500' }}>Se conectează la rețeaua robotului...</div>;

    const sidebarLinkStyle = (tabName) => ({
        width: '100%',
        padding: '14px 20px',
        background: activeTab === tabName ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
        color: '#ffffff',
        border: 'none',
        borderRadius: '12px',
        textAlign: 'left',
        fontSize: '14px',
        fontWeight: activeTab === tabName ? '700' : '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'block',
        textDecoration: 'none'
    });

    const sidebarActionButtonStyle = {
        width: '100%',
        padding: '12px 16px',
        background: '#ffffff',
        color: '#b5828c',
        border: 'none',
        borderRadius: '12px',
        textAlign: 'center',
        fontSize: '13px',
        fontWeight: '700',
        cursor: 'pointer',
        textDecoration: 'none',
        display: 'inline-block',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        whiteSpace: 'nowrap'
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#faf6fc' }}>
            
            {/* SIDEBAR */}
            <div style={{ 
                width: '280px', 
                background: 'linear-gradient(135deg, #e5989b 0%, #b5828c 100%)', 
                padding: '30px 20px', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                position: 'fixed',
                height: '100vh',
                boxShadow: '4px 0 25px rgba(181, 130, 140, 0.15)',
                zIndex: 100
            }}>
                <div>
                    <div style={{ marginBottom: '40px', paddingLeft: '10px' }}>
                        <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#ffffff', letterSpacing: '0.5px' }}>RoboLab Menu</h1>
                        <div style={{ width: '40px', height: '4px', background: '#ffffff', borderRadius: '2px', marginTop: '8px' }}></div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <button onClick={() => setActiveTab('proiecte')} style={sidebarLinkStyle('proiecte')}>
                            Proiecte Laborator
                        </button>
                        
                        <button onClick={() => setActiveTab('toate-taskurile')} style={sidebarLinkStyle('toate-taskurile')}>
                            Toate Task-urile ({allTasks.length})
                        </button>
                        
                        <button onClick={() => setActiveTab('taskurile-tale')} style={sidebarLinkStyle('taskurile-tale')}>
                            Task-urile Tale ({myTasks.length})
                        </button>
                        
                        <button onClick={() => setActiveTab('propuneri')} style={sidebarLinkStyle('propuneri')}>
                            Propuneri active ({myProposals.length})
                        </button>
                    </div>

                    {userRole === 'Admin' && (
                        <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.2)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', paddingLeft: '10px', letterSpacing: '0.5px' }}>Acțiuni Administrator</p>
                            
                            <Link to="/create" style={sidebarActionButtonStyle}>
                                Adaugă Sarcină Oficială
                            </Link>
                            
                            <Link to="/manage-projects" style={{ ...sidebarActionButtonStyle, background: 'rgba(255, 255, 255, 0.15)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)' }}>
                                Configurare Proiecte
                            </Link>
                        </div>
                    )}

                    {userRole !== 'Admin' && (
                        <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                            <Link to="/create" style={sidebarActionButtonStyle}>
                                Propune Sarcină Nouă
                            </Link>
                        </div>
                    )}
                </div>

                <div style={{ background: 'rgba(0, 0, 0, 0.05)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <p style={{ color: '#ffffff', fontSize: '12px', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><b>{userEmail}</b></p>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px', margin: '2px 0 0 0' }}>Grad: {userRole}</p>
                </div>
            </div>

            <div style={{ flex: 1, padding: '40px', marginLeft: '280px', width: 'calc(100% - 280px)' }}>
                
                <div style={{ background: '#ffffff', padding: '20px 32px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.01)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#4a3e56', textTransform: 'capitalize' }}>
                            Panou Principal / {activeTab.replace('-', ' ')}
                        </h2>
                    </div>
                    <button onClick={handleLogout} style={{ padding: '10px 20px', background: '#fff0f3', color: '#d95371', border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer' }}>
                        Ieșire cont
                    </button>
                </div>

                {error && <p style={{ color: '#d95371', textAlign: 'center', margin: '20px' }}>{error}</p>}
                
                {/* TAB PROIECTE */}
                {activeTab === 'proiecte' && (
                    <div>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#685977', marginBottom: '16px' }}>Proiecte active în Laborator ({projects.length})</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                            {projects.map(p => (
                                <div key={p.id} style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #f6f0fa', boxShadow: '0 4px 12px rgba(0,0,0,0.01)' }}>
                                    <h4 style={{ color: '#4a3e56', fontWeight: '700', fontSize: '16px' }}>{p.name}</h4>
                                    <p style={{ color: '#8a7a99', fontSize: '13px', margin: '8px 0' }}>{p.description}</p>
                                    <div style={{ marginTop: '12px' }}>
                                        {p.projectTags?.map((tag, i) => (
                                            <span key={i} style={{ display: 'inline-block', background: '#faf6fc', fontSize: '11px', padding: '3px 8px', borderRadius: '6px', marginRight: '6px', color: '#b5828c', fontWeight: '500' }}>#{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* TAB TASKS */}
                {activeTab !== 'proiecte' && (
                    <div>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#685977', marginBottom: '16px' }}>
                            {activeTab === 'toate-taskurile' && `Sarcini Active (${allTasks.length})`}
                            {activeTab === 'taskurile-tale' && `Sarcinile repartizate ție (${myTasks.length})`}
                            {activeTab === 'propuneri' && `Sugestii și Propuneri de Verificat (${myProposals.length})`}
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            {((activeTab === 'toate-taskurile' && allTasks.length === 0) ||
                              (activeTab === 'taskurile-tale' && myTasks.length === 0) ||
                              (activeTab === 'propuneri' && myProposals.length === 0)) ? (
                                <div style={{ gridColumn: '1 / -1', background: '#ffffff', padding: '40px', textAlign: 'center', borderRadius: '16px', color: '#8a7a99' }}>
                                    <p style={{ fontSize: '15px' }}>Nu există nicio înregistrare în această secțiune.</p>
                                </div>
                            ) : (
                                (activeTab === 'toate-taskurile' ? allTasks : activeTab === 'taskurile-tale' ? myTasks : myProposals).map((task) => (
                                    <div key={task.id} style={{ background: '#ffffff', padding: '24px', borderRadius: '18px', boxShadow: '0 4px 15px rgba(0,0,0,0.01)', border: task.isApproved ? '1px solid #f6f0fa' : '2px dashed #e5989b', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#4a3e56', marginBottom: '8px' }}>{task.title}</h3>
                                                {!task.isApproved && (
                                                    <span style={{ fontSize: '10px', background: '#fff0f3', color: '#d95371', padding: '2px 8px', borderRadius: '6px', fontWeight: '700' }}>PROPUNERE</span>
                                                )}
                                            </div>
                                            <p style={{ color: '#685977', fontSize: '13px', lineHeight: '1.5', marginBottom: '16px' }}>{task.description}</p>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px dashed #f0e6f5' }}>
                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                <span style={{ padding: '6px 12px', borderRadius: '20px', background: task.status === 'Pending' ? '#fff6db' : '#e2f9e7', color: task.status === 'Pending' ? '#b78300' : '#227237', fontSize: '12px', fontWeight: '600' }}>
                                                    {task.status}
                                                </span>
                                                
                                                {userRole === 'Admin' && !task.isApproved && (
                                                    <div style={{ display: 'flex', gap: '6px' }}>
                                                        <button 
                                                            onClick={() => handleApprove(task.id)} 
                                                            style={{ padding: '6px 12px', background: '#e2f9e7', color: '#227237', border: '1px solid #227237', borderRadius: '8px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}
                                                        >
                                                            Aprobă
                                                        </button>
                                                        <button 
                                                            onClick={async () => {
                                                                if (window.confirm(`Sigur refuzi și ștergi propunerea "${task.title}"?`)) {
                                                                    try {
                                                                        await API.delete(`/Tasks/${task.id}`);
                                                                        loadData();
                                                                    } catch (err) {
                                                                        alert('Eroare la respingerea task-ului.');
                                                                    }
                                                                }
                                                            }} 
                                                            style={{ padding: '6px 12px', background: '#fff0f3', color: '#d95371', border: '1px solid #fca5a5', borderRadius: '8px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}
                                                        >
                                                            Refuză
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <Link to={`/tasks/${task.id}`} style={{ color: '#b5828c', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}>
                                                Detalii & Editare →
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;