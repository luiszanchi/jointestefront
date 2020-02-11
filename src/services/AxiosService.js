import axios from 'axios';

require('dotenv').config()

export default class AxiosService {
    constructor()
    {
        let params = {};

        if(typeof process.env.VUE_APP_API_URL == 'string' && process.env.VUE_APP_API_URL.length) {
            params.baseURL = process.env.VUE_APP_API_URL;
        }

        this.axios = axios.create(params);

        this.axios.interceptors.response.use(this.onRequestSuccess, this.onRequestFailure);
    }

    static onRequestSuccess(response) {
        return response.data;
    }

    onRequestFailure(err) {
        const { response } = err;
        if(process.env.VUE_APP_NODE_ENV == 'development') {
            console.error('function AxiosService.onRequestFailure', err, response);
        }
        throw response;
    }

    getAxios()
    {
        return this.axios;
    }
}
