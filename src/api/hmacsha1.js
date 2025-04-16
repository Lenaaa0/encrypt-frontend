import axios from 'axios';

const API_URL = 'http://localhost:8080/api/hmacsha1';

export const HMACSHA1 = (key, data, encoding) => {
    return axios.post(`${API_URL}/hash`, {
        key,
        data,
        encoding
    });
};