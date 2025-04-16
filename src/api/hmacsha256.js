import axios from 'axios';

const API_URL = 'http://localhost:8080/api/hmacsha256';

export const HMACSHA256 = (key, data, encoding) => {
    return axios.post(`${API_URL}/hash`, {
        key,
        data,
        encoding
    });
};