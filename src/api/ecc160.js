import axios from 'axios';

const API_URL = 'http://localhost:8080/api/ecc160';

export const ecc160Encrypt = (publicKey, plaintext) => {
    return axios.post(`${API_URL}/encrypt`, {
        publicKey,
        plaintext
    });
};

export const ecc160Decrypt = (privateKey, ciphertext) => {
    return axios.post(`${API_URL}/decrypt`, {
        privateKey,
        ciphertext
    });
};

export const ecc160GenerateKey = () => {
    return axios.get(`${API_URL}/keypair`, {
    });
};
