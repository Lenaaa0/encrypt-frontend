import axios from 'axios';

const API_URL = 'http://localhost:8080/api/base64';

export const encode = (data) => {
    return axios.post(`${API_URL}/encode`, {
        data
    });
};

export const decode = (data) => {
    return axios.post(`${API_URL}/decode`, {
        data
    });
};