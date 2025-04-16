import axios from 'axios';

const API_URL = 'http://localhost:8080/api/rsasha1';

export const rsasha1Sign = (data, privateKey, modulus) => {
    return axios.post(`${API_URL}/sign`, {
        data,
        privateKey,
        modulus
    });
};

export const rsasha1Verify = (data, signature, publicKey, modulus) => {
    return axios.post(`${API_URL}/verify`, {
        data,
        signature,
        publicKey,
        modulus
    });
};

export const rsasha1GenerateKey = () => {
    return axios.get(`${API_URL}/keypair`, {
    });
};
