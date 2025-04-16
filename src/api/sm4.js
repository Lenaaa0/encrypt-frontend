import axios from 'axios';

const API_URL = 'http://localhost:8080/api/sm4';

export const sm4Encrypt = (key, plaintext, encoding) => {
    return axios.post(`${API_URL}/encrypt`, {
        key,
        data: plaintext,
        encoding
    });
};

export const sm4Decrypt = (key, ciphertext, encoding) => {
    return axios.post(`${API_URL}/decrypt`, {
        key,
        data: ciphertext,
        encoding
    });
};
