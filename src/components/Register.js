import React, { useState, useEffect } from 'react';
import api from '../api'; // Importa o Axios configurado
import { useNavigate } from 'react-router-dom'; // Para redirecionar após o cadastro
import '../styles/Register.css'; // Importa o CSS específico para o registro

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Campo para confirmar a senha
  const [teamId, setTeamId] = useState(''); // ID da equipe
  const [teams, setTeams] = useState([]); // Lista de equipes
  const [message, setMessage] = useState('');
  const [error, setError] = useState(''); // Mensagem de erro para validação
  const navigate = useNavigate();

  // Busca as equipes disponíveis ao carregar o componente
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const token = localStorage.getItem('jwt_token'); // Obtém o token JWT do localStorage
        const response = await api.get('/teams', {
          headers: {
            Authorization: `Bearer ${token}`, // Adiciona o token JWT ao cabeçalho
          },
        });
        setTeams(response.data); // Define as equipes no estado
      } catch (error) {
        console.error('Erro ao buscar equipes:', error.response || error.message);
        setError('Não foi possível carregar as equipes. Tente novamente mais tarde.');
      }
    };

    fetchTeams();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    // Valida se as senhas coincidem
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      const token = localStorage.getItem('jwt_token'); // Obtém o token JWT do localStorage

      // Envia a requisição para criar um novo usuário
      await api.post(
        '/users',
        {
          username,
          password,
          team: { id: teamId }, // Estrutura conforme o backend espera
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Adiciona o token JWT ao cabeçalho
          },
        }
      );
      setMessage('Usuário registrado com sucesso!');
      setTimeout(() => navigate('/'), 2000); // Redireciona para a tela de login após 2 segundos
    } catch (error) {
      console.error('Erro ao registrar usuário:', error.response || error.message);
      setError('Erro ao registrar usuário. Verifique os dados e tente novamente.');
    }
  };

  return (
    <div className="register-container">
      <h2>Cadastro de Usuário</h2>
      <form onSubmit={handleRegister}>
        <div className="user-box">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label>Usuário</label>
        </div>
        <div className="user-box">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label>Senha</label>
        </div>
        <div className="user-box">
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <label>Confirmar Senha</label>
        </div>
        <div className="user-box">
          <select
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
            required
          >
            <option value="" disabled>
              Selecione uma equipe
            </option>
            {teams.length > 0 ? (
              teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name} {/* Exibe o nome da equipe */}
                </option>
              ))
            ) : (
              <option disabled>Carregando equipes...</option>
            )}
          </select>
          <label>Equipe</label>
        </div>
        <button type="submit" className="register-button">
          Registrar
        </button>
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}
      </form>
      <div className="back-arrow" onClick={() => navigate('/login')}>
        ⬅ Voltar
      </div>
    </div>
  );
};

export default Register;