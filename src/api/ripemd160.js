import axios from 'axios';

const API_URL = 'http://localhost:8080/api/ripemd160';

export const ripemd160Hash = (data, outputEncoding) => {
    return axios.post(`${API_URL}/hash`, {
        data,
        outputEncoding
    });
};