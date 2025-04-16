import axios from 'axios';

const API_URL = 'http://localhost:8080/api/aes';

export const aesEncrypt = (key, plaintext, encoding) => {
    return axios.post(`${API_URL}/encrypt`, {
        key,
        data: plaintext,
        encoding
    });
};

export const aesDecrypt = (key, ciphertext, encoding) => {
    return axios.post(`${API_URL}/decrypt`, {
        key,
        data: ciphertext,
        encoding
    });
};