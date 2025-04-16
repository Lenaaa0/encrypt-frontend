import axios from 'axios';

const API_URL = 'http://localhost:8080/api/ecdsa';

export const ecdsaSign = (privateKey, message) => {
    return axios.post(`${API_URL}/sign`, {
        privateKey,
        message
    });
};

export const ecdsaVerify = (publicKeyX, publicKeyY, message, signatureR, signatureS) => {
    return axios.post(`${API_URL}/verify`, {
        publicKeyX,
        publicKeyY,
        message,
        signatureR,
        signatureS
    });
};

export const ecdsaGenerateKey = () => {
    return axios.get(`${API_URL}/keypair`, {
    });
};
