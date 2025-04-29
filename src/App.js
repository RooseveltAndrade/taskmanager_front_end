import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import TaskList from './components/TaskList';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Redireciona a rota raiz (/) para /login */}
        <Route path="/" element={<Navigate to="/login" />} />
        {/* Página de login */}
        <Route path="/login" element={<Login />} />
        {/* Página de registro */}
        <Route path="/register" element={<Register />} />
        {/* Página de tarefas */}
        <Route path="/tasks" element={<TaskList />} />
      </Routes>
    </Router>
  );
};

export default App;