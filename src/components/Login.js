import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css'; // Importa o CSS diretamente

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Mensagem de erro
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Evita o comportamento padrão do formulário
    setError(''); // Limpa a mensagem de erro antes de tentar o login

    try {
      const response = await api.post(
        '/auth/login',
        { username, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const token = response.data.token;
      const userId = response.data.userId; // Certifique-se de que o backend retorna o userId

      if (!token || !userId) {
        throw new Error('Token ou ID do usuário não recebido do servidor.');
      }

      // Salva o token e o ID do usuário no localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);

      // Redireciona para a página de tarefas
      navigate('/tasks');
    } catch (error) {
      console.error('Erro ao fazer login:', error);

      // Define a mensagem de erro com base no código de status HTTP
      if (error.response) {
        switch (error.response.status) {
          case 400:
            setError('Requisição inválida. Verifique os dados enviados.');
            break;
          case 401:
            setError('Credenciais inválidas. Tente novamente.');
            break;
          case 403:
            setError('Acesso negado. Você não tem permissão para acessar.');
            break;
          case 500:
            setError('Erro interno do servidor. Tente novamente mais tarde.');
            break;
          default:
            setError('Ocorreu um erro inesperado. Tente novamente.');
        }
      } else {
        setError('Erro de conexão. Verifique sua internet e tente novamente.');
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} noValidate>
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
        {error && <p className="error-message">{error}</p>}
        <div className="button-container">
          <button type="submit" className="login-button">
            Entrar
          </button>
          <button
            type="button"
            className="register-button"
            onClick={() => navigate('/register')}
          >
            Cadastrar
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;