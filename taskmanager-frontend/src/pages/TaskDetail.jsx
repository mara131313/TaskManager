import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const TaskDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [users, setUsers] = useState([]); // pastreaza utilizatorii pentru dropdown
    const [error, setError] = useState('');
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('Pending');
    const [assignedToUserId, setAssignedToUserId] = useState(''); // starea pentru id ul responsabilului
    
    const userRole = localStorage.getItem('userRole') || 'User';

    const fetchTask = () => {
    API.get(`/Tasks/${id}`)
        .then(res => {
            const taskData = res.data;
            setTask(taskData);
            setTitle(taskData.title);
            setDescription(taskData.description);
            setStatus(taskData.status);
            
            if (taskData.assignedUserId) {
                setAssignedToUserId(taskData.assignedUserId.toString());
            } else if (taskData.assignedTo && users.length > 0) {
                const foundUser = users.find(u => 
                    u.fullName === taskData.assignedTo || u.email === taskData.assignedTo
                );
                setAssignedToUserId(foundUser ? foundUser.id.toString() : '');
            } else {
                setAssignedToUserId('');
            }
        })
        .catch(() => setError('Sarcina căutată nu a fost găsită sau a fost ștearsă din baza de date.'));
    };


    useEffect(() => {
        if (userRole === 'Admin') {
            API.get('/Users')
                .then(res => {
                    setUsers(res.data);
                    API.get(`/Tasks/${id}`)
                        .then(taskRes => {
                            setTask(taskRes.data);
                            setTitle(taskRes.data.title);
                            setDescription(taskRes.data.description);
                            setStatus(taskRes.data.status);
                            
                            const backendId = taskRes.data.assignedUserId;
                            if (backendId) {
                                setAssignedToUserId(backendId.toString());
                            } else if (taskRes.data.assignedTo) {
                                const foundUser = res.data.find(u => u.fullName === taskRes.data.assignedTo || u.email === taskRes.data.assignedTo);
                                setAssignedToUserId(foundUser ? foundUser.id.toString() : '');
                            }
                        });
                })
                .catch(() => console.error('Nu s-au putut încărca utilizatorii laboratorului.'));
        } else {
            fetchTask();
        }
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const payload = {
            title,
            description,
            status,
            isApproved: task.isApproved,
            assignedUserId: assignedToUserId ? parseInt(assignedToUserId) : null
        };

        try {
            if (userRole === 'Admin') {
                await API.put(`/Tasks/admin-update/${id}`, payload);
            } else {
                await API.put(`/Tasks/user-update/${id}`, {
                    description,
                    status
                });
            }
            alert('Task actualizat cu succes!');
            fetchTask();
        } catch (err) {
            alert(err.response?.data?.message || 'Nu aveți permisiunea să modificați acest task.');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Sigur doriți ștergerea definitivă a acestui task?')) {
            try {
                await API.delete(`/Tasks/${id}`);
                navigate('/');
            } catch (err) {
                alert('Eroare la ștergerea resursei.');
            }
        }
    };

    if (error) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', flexDirection: 'column', gap: '16px' }}>
            <p style={{ color: '#d95371', fontWeight: '500' }}>{error}</p>
            <Link to="/" style={{ color: '#b5828c', fontWeight: '600', textDecoration: 'none' }}>Înapoi la panou</Link>
        </div>
    );
    
    if (!task) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#b5828c' }}>Se încarcă detaliile piesei...</div>;

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh', padding: '20px' }}>
            <div style={{ background: '#ffffff', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(218, 143, 163, 0.05)', width: '100%', maxWidth: '550px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <span style={{ fontSize: '12px', background: '#f5effa', color: '#685977', padding: '6px 12px', borderRadius: '8px', fontWeight: '600' }}>
                        ID Fisă: #{task.id}
                    </span>
                    <span style={{ padding: '6px 12px', borderRadius: '20px', background: task.status === 'Pending' ? '#fff6db' : '#e2f9e7', color: task.status === 'Pending' ? '#b78300' : '#227237', fontSize: '12px', fontWeight: '600' }}>
                        Curent: {task.status}
                    </span>
                </div>
                
                <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#4a3e56', marginBottom: '16px' }}>Editare Resursă Tehnică</h2>
                <hr style={{ border: 'none', borderTop: '1px solid #f0e6f5', marginBottom: '20px' }} />
                
                <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {userRole === 'Admin' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ fontSize: '13px', fontWeight: '600', color: '#685977' }}>Titlu Sarcina</label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={{ borderRadius: '12px', padding: '10px', border: '1px solid #e1d5eb' }} required />
                        </div>
                    ) : (
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#4a3e56' }}>{task.title}</h3>
                            <p style={{ fontSize: '11px', color: '#8a7a99' }}>Titlul poate fi editat doar de către administratori.</p>
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#685977' }}>Specificații & Descriere</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{ height: '100px', resize: 'none', borderRadius: '12px', padding: '10px', border: '1px solid #e1d5eb' }} required />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#685977' }}>Schimbă Statusul</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ borderRadius: '12px', padding: '10px', border: '1px solid #e1d5eb' }}>
                            <option value="Pending">Pending</option>
                            <option value="InProgress">In Progress</option>
                            <option value="Done">Done</option>
                        </select>
                    </div>

                    {/* ZONA DE RESPONSABIL MODIFICATĂ DINAMIC */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#685977' }}>Membru Responsabil</label>
                        {userRole === 'Admin' ? (
                            <select 
                                value={assignedToUserId} 
                                onChange={(e) => setAssignedToUserId(e.target.value)}
                                style={{ borderRadius: '12px', padding: '10px', border: '1px solid #e1d5eb', background: '#faf6fc', color: '#4a3e56', fontWeight: '500' }}
                            >
                                <option value="">Membru nespecificat</option>
                                {users.map(u => (
                                    <option key={u.id} value={u.id}>{u.fullName || u.email}</option>
                                ))}
                            </select>
                        ) : (
                            <div style={{ display: 'flex', justifyContent: 'space-between', background: '#faf6fc', padding: '12px', borderRadius: '12px', fontSize: '13px', border: '1px solid #f0e6f5' }}>
                                <span style={{ color: '#685977' }}>Responsabil curent:</span>
                                <span style={{ fontWeight: '600', color: '#4a3e56' }}>{task.assignedTo || 'Membru nespecificat'}</span>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                        <button type="submit" style={{ flex: '2', padding: '14px', background: 'linear-gradient(135deg, #e5989b 0%, #b5828c 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer' }}>
                            Salvează Modificările
                        </button>
                        {userRole === 'Admin' && (
                            <button type="button" onClick={handleDelete} style={{ flex: '1', padding: '14px', background: '#fff0f3', color: '#d95371', border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer' }}>
                                Șterge
                            </button>
                        )}
                    </div>
                </form>

                <div style={{ marginTop: '32px', textAlign: 'center' }}>
                    <Link to="/" style={{ color: '#b5828c', fontWeight: '600', textDecoration: 'none', fontSize: '14px' }}>
                        ← Înapoi la meniul central
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TaskDetail;