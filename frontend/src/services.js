import axios, { AxiosResponse, AxiosError } from 'axios';

axios.defaults.headers.get['Content-Type'] = 'application/json';

const baseurl = 'https://1bn1ydyxl7.execute-api.us-east-1.amazonaws.com/dev';

export const getRatio = (twitter_handle) => {
    let url = `${baseurl}/ratio?handle=${twitter_handle}`;

    return axios
        .get(url)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            return Promise.reject(JSON.stringify(err));
        });
};