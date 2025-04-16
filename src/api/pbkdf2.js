import axios from 'axios';

const API_URL = 'http://localhost:8080/api/pbkdf2';

export const pbkdf2Derive = (password, salt, iterations, keyLength, encoding) => {
    return axios.post(`${API_URL}/encrypt`, {
        password, 
        salt, 
        iterations, 
        keyLength, 
        outputEncoding: encoding
    });
};