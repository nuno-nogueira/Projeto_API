import axios from 'axios';

export default(() => {
    const token = localStorage.getItem('token');
    return axios.create({
        baseURL: "http://127.0.0.1:3000/",
        headers: {
            'Authorization': token ? `Bearer ${token}` : ""
        }
    })
})