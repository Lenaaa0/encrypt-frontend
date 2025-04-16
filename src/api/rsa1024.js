import axios from 'axios';

const API_URL = 'http://localhost:8080/api/rsa1024';

export const rsa1024Encrypt = (data, key, modulus, encoding) => {
    return axios.post(`${API_URL}/encrypt`, {
        data,
        key,
        modulus,
        encoding
    });
};

export const rsa1024Decrypt = (data, key, modulus, encoding) => {
    return axios.post(`${API_URL}/decrypt`, {
        data,
        key,
        modulus,
        encoding
    });
};

export const rsa1024GenerateKey = () => {
    return axios.get(`${API_URL}/keypair`, {
    });
};
