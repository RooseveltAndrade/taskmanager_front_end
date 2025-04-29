import React, { useState, useEffect } from 'react';
import api from '../api';

const TaskForm = ({ taskId, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('PENDENTE');
  const [responsibleId, setResponsibleId] = useState('');
  const [message, setMessage] = useState('');
  const [isLoaded, setIsLoaded] = useState(false); // Adicionado para controlar o carregamento

  useEffect(() => {
    if (taskId && !isLoaded) {
      // Busca os dados da tarefa ao editar
      const fetchTask = async () => {
        try {
          const response = await api.get(`/tasks/${taskId}`);
          const { title, description, dueDate, status, responsible } = response.data;
          setTitle(title);
          setDescription(description);
          setDueDate(dueDate);
          setStatus(status);
          setResponsibleId(responsible?.id || '');
          setIsLoaded(true); // Marca como carregado
        } catch (error) {
          console.error('Erro ao carregar tarefa:', error.response || error.message);
        }
      };
      fetchTask();
    } else if (!taskId) {
      // Limpa os campos ao criar uma nova tarefa
      setTitle('');
      setDescription('');
      setDueDate('');
      setStatus('PENDENTE');
      setResponsibleId('');
      setIsLoaded(true); // Marca como carregado
    }
  }, [taskId, isLoaded]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const taskData = {
      title,
      description,
      dueDate,
      status,
      responsible: { id: responsibleId },
    };
    try {
      if (taskId) {
        await api.put(`/tasks/${taskId}`, taskData);
        setMessage('Tarefa atualizada com sucesso!');
      } else {
        await api.post('/tasks', taskData);
        setMessage('Tarefa criada com sucesso!');
      }
      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error.response || error.message);
      setMessage('Erro ao salvar a tarefa.');
    }
  };

  return (
    <div>
      <h2>{taskId ? 'Editar Tarefa' : 'Criar Nova Tarefa'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="PENDENTE">Pendente</option>
          <option value="CONCLUÍDA">Concluída</option>
          <option value="EM_ANDAMENTO">Em andamento</option>
        </select>
        <input
          type="number"
          placeholder="ID do Responsável"
          value={responsibleId}
          onChange={(e) => setResponsibleId(e.target.value)}
        />
        <button type="submit">{taskId ? 'Atualizar' : 'Criar'}</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default TaskForm;