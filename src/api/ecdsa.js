import axios from 'axios';

const API_URL = 'http://localhost:8080/api/ecdsa';

export const ecdsaSign = (message, privateKey) => {
    return axios.post(`${API_URL}/sign`, {
        message,
        privateKey
    });
};

export const ecdsaVerify = (message, signature, publicKey) => {
    // 从签名中提取R和S分量
    // 假设签名是以某种格式存储的，需要根据实际情况解析
    let signatureR = '';
    let signatureS = '';
    
    // 如果签名包含两部分，尝试解析
    if (signature && signature.includes(',')) {
        [signatureR, signatureS] = signature.split(',');
    } else {
        // 否则假设完整签名就是R，S为空
        signatureR = signature;
    }
    
    // 从publicKey中提取X和Y坐标
    // 假设publicKey格式为 "X,Y"
    let publicKeyX = '';
    let publicKeyY = '';
    
    if (publicKey && publicKey.includes(',')) {
        [publicKeyX, publicKeyY] = publicKey.split(',');
    } else {
        // 如果没有逗号，假设整个值是X坐标
        publicKeyX = publicKey;
    }
    
    return axios.post(`${API_URL}/verify`, {
        message,
        publicKeyX,
        publicKeyY,
        signatureR,
        signatureS
    });
};

export const ecdsaGenerateKey = () => {
    return axios.get(`${API_URL}/keypair`);
};
