import axios from 'axios';

const API_URL = 'http://localhost:8080/api/utf-8';

export const UTF_8Encode = (data, encoding) => {
    return axios.post(`${API_URL}/encode`, {
        data,
        encoding
    });
};

export const UTF_8Decode = (data, encoding) => {
    return axios.post(`${API_URL}/decode`, {
        data,
        encoding
    });
};