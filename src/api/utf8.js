import axios from 'axios';

const API_URL = 'http://localhost:8080/api/utf-8';

export const encode = (data) => {
    return axios.post(`${API_URL}/encode`, {
        data,
        encoding: 'hex'  // 默认使用十六进制编码
    });
};

export const decode = (data) => {
    return axios.post(`${API_URL}/decode`, {
        data,
        encoding: 'hex'  // 默认使用十六进制编码
    });
}; 