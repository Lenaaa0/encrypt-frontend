import axios from 'axios';

const API_URL = 'http://localhost:8080/api/sha1';

export const sha1Hash = (data, encoding) => {
    return axios.post(`${API_URL}/hash`, {
        data,
        encoding
    });
};