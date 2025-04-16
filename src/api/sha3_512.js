import axios from 'axios';

const API_URL = 'http://localhost:8080/api/sha3-512';

export const sha3_512Hash = (data, encoding) => {
    return axios.post(`${API_URL}/hash`, {
        data,
        encoding
    });
};