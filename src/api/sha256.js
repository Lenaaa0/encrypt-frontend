import axios from 'axios';

const API_URL = 'http://localhost:8080/api/sha256';

export const sha256Hash = (data, encoding) => {
    return axios.post(`${API_URL}/hash`, {
        data,
        encoding
    });
};