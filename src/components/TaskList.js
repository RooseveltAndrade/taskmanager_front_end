import React, { useEffect, useState, useRef } from 'react';
import api from '../api';
import '../styles/TaskList.css';
import { useNavigate } from 'react-router-dom';

// Função para formatar a data de forma amigável
const formatFriendlyDate = (date) => {
  if (!date) return '';
  const options = { day: '2-digit', month: 'long', year: 'numeric' };
  return new Date(date).toLocaleDateString('pt-BR', options);
};

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [teamFilter, setTeamFilter] = useState('');
  const [responsibleFilter, setResponsibleFilter] = useState('');
  const [teams, setTeams] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const formRef = useRef(null);
  const errorRef = useRef(null); // Referência para a mensagem de erro
  const navigate = useNavigate();

  const currentUserId = parseInt(localStorage.getItem('userId'), 10); // ID do usuário logado

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/tasks', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            responsibleId: currentUserId, // Filtra apenas as tarefas do usuário logado
          },
        });
        setTasks(response.data);
      } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
        setError('Não foi possível carregar as tarefas.');
      }
    };

    const fetchTeams = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/teams', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTeams(response.data);
      } catch (error) {
        console.error('Erro ao carregar equipes:', error.response || error.message);
      }
    };

    fetchTasks();
    fetchTeams();
  }, [currentUserId]);

  useEffect(() => {
    if (!teamFilter) {
      setTeamMembers([]);
      return;
    }

    const selectedTeam = teams.find((team) => team.id === parseInt(teamFilter, 10));
    if (selectedTeam) {
      setTeamMembers(selectedTeam.users);
    } else {
      setTeamMembers([]);
    }
  }, [teamFilter, teams]);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth' }); // Rola até a mensagem de erro
    }
  }, [error]);

  const handleFilter = async () => {
    if (!responsibleFilter) {
      setError('Por favor, selecione um membro responsável antes de filtrar.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/tasks/filter', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          status: statusFilter ? statusFilter.toUpperCase() : undefined,
          responsibleId: parseInt(responsibleFilter, 10), // Filtra apenas as tarefas do usuário logado
        },
      });
      setTasks(response.data);
      setError('');
    } catch (error) {
      console.error('Erro ao filtrar tarefas:', error);
      setError('Erro ao filtrar tarefas.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const title = e.target.title.value.trim();
    const description = e.target.description.value.trim();
    const dueDate = e.target.dueDate.value;
    const status = e.target.status.value;

    if (!title || !description || !dueDate || !status) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const taskData = {
      title,
      description,
      dueDate,
      status,
      responsible: { id: currentUserId }, // O responsável é sempre o usuário logado
    };

    try {
      const token = localStorage.getItem('token');
      if (selectedTaskId) {
        await api.put(`/tasks/${selectedTaskId}`, taskData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await api.post('/tasks', taskData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      handleFormSuccess();
    } catch (error) {
      console.error('Erro ao salvar a tarefa:', error);
      setError('Não foi possível salvar a tarefa.');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedTaskId(null);
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/tasks', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            responsibleId: currentUserId, // Filtra apenas as tarefas do usuário logado
          },
        });
        setTasks(response.data);
      } catch (error) {
        setError('Não foi possível carregar as tarefas.');
      }
    };
    fetchTasks();
  };

  const handleCreateTask = () => {
    setShowForm(true);
    setSelectedTaskId(null);
    setError('');
  };

  const handleEditTask = (task) => {
    if (task.title && task.description) {
      setShowForm(true);
      setSelectedTaskId(task.id);
      setError('');
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 0);
    } else {
      alert('Esta tarefa não pode ser editada porque está incompleta.');
    }
  };

  return (
    <div className="tasklist-container">
      <button className="logout-button" onClick={() => navigate('/login')}>
        Sair
      </button>

      <h2>Lista de Tarefas</h2>
      {error && (
        <p className="error-message" ref={errorRef}>
          {error}
        </p>
      )}

      <div className="filter-container">
        <h3>Filtrar Tarefas</h3>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Todos os status</option>
          <option value="PENDENTE">Pendente</option>
          <option value="CONCLUIDA">Concluída</option>
          <option value="EM_ANDAMENTO">Em andamento</option>
        </select>
        <select value={teamFilter} onChange={(e) => setTeamFilter(e.target.value)}>
          <option value="">Escolha uma equipe</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
        <select value={responsibleFilter} onChange={(e) => setResponsibleFilter(e.target.value)}>
          <option value="">Escolha um membro</option>
          {teamMembers.map((member) => (
            <option key={member.id} value={member.id}>
              {member.username}
            </option>
          ))}
        </select>
        <button onClick={handleFilter}>Filtrar</button>
      </div>

      <button onClick={handleCreateTask}>Criar Nova Tarefa</button>

      {showForm && (
        <div className="create-task-container" ref={formRef}>
          <button className="close-button" onClick={() => setShowForm(false)}>X</button>
          <h3>{selectedTaskId ? 'Editar Tarefa' : 'Criar Nova Tarefa'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Título</label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Digite o título"
                defaultValue={selectedTaskId ? tasks.find((task) => task.id === selectedTaskId)?.title || '' : ''}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Descrição</label>
              <textarea
                id="description"
                name="description"
                placeholder="Digite a descrição"
                defaultValue={selectedTaskId ? tasks.find((task) => task.id === selectedTaskId)?.description || '' : ''}
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="dueDate">Data de Entrega</label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                defaultValue={selectedTaskId ? tasks.find((task) => task.id === selectedTaskId)?.dueDate || '' : ''}
              />
            </div>
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                defaultValue={selectedTaskId ? tasks.find((task) => task.id === selectedTaskId)?.status || 'PENDENTE' : 'PENDENTE'}
              >
                <option value="">Escolha um status</option>
                <option value="PENDENTE">Pendente</option>
                <option value="EM_ANDAMENTO">Em andamento</option>
                <option value="CONCLUIDA">Concluída</option>
              </select>
            </div>
            <button type="submit" className="create-button">
              {selectedTaskId ? 'Salvar Alterações' : 'Criar'}
            </button>
          </form>
        </div>
      )}

      {tasks.length === 0 ? (
        <p className="no-tasks-message">Nenhuma tarefa encontrada.</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id}>
              <strong>{task.title || 'Sem título'}</strong> - {task.status || 'Sem status'}
              <p>{task.description || 'Sem descrição'}</p>
              <p>Responsável: {task.responsible?.username || 'Não informado'}</p>
              <p>Data de entrega: {formatFriendlyDate(task.dueDate)}</p>
              <button onClick={() => handleEditTask(task)}>Editar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;