import axios from 'axios';

const API_URL = 'http://localhost:8080/api/rc6';

export const rc6Encrypt = (key, data, outputEncoding) => {
    return axios.post(`${API_URL}/encrypt`, {
        key,
        data,
        outputEncoding
    });
};

export const rc6Decrypt = (key, data, outputEncoding) => {
    return axios.post(`${API_URL}/decrypt`, {
        key,
        data,
        outputEncoding
    });
};
