import axios from 'axios';

const API_URL = 'http://localhost:8080/api/pbkdf2';

export const pbkdf2Encrypt = (password, salt, iterations, keyLength, outputEncoding) => {
    return axios.post(`${API_URL}/encrypt`, {
        password, salt, iterations, keyLength, outputEncoding
    });
};