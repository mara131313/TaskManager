import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import TaskDetail from './pages/TaskDetail';
import CreateTask from './pages/CreateTask';
import ManageProjects from './pages/ManageProjects';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* rute publice */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* rute protejate */}
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/tasks/:id" element={
          <ProtectedRoute>
            <TaskDetail />
          </ProtectedRoute>
        } />
        <Route path="/create" element={
          <ProtectedRoute>
            <CreateTask />
          </ProtectedRoute>
        } />
        
        {/* ruta protejata pentru admin */}
        <Route path="/manage-projects" element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <ManageProjects />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;