import axios from 'axios';

const API_URL = 'http://localhost:8080/api/base64';

export const base64Encode = (data) => {
    return axios.post(`${API_URL}/encode`, {
        data
    });
};

export const base64Decode = (data) => {
    return axios.post(`${API_URL}/decode`, {
        data
    });
};