import axios from 'axios';

// Criação da instância do Axios com a base URL do backend
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Base URL do backend
});

// Interceptor para adicionar o token de autenticação em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Obtém o token do localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Adiciona o token no cabeçalho Authorization
    }
    return config;
  },
  (error) => {
    // Lida com erros antes de enviar a requisição
    return Promise.reject(error);
  }
);

// Interceptor para lidar com respostas de erro
api.interceptors.response.use(
  (response) => response, // Retorna a resposta normalmente se não houver erro
  (error) => {
    if (error.response && error.response.status === 401) {
      // Se o status for 401 (não autorizado), redireciona para a página de login
      localStorage.removeItem('token'); // Remove o token inválido
      window.location.href = '/login'; // Redireciona para a página de login
    }
    return Promise.reject(error); // Rejeita a promessa com o erro
  }
);

export default api;