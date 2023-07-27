const axios = require('axios');

let urlBack = 'http://localhost:5000/api/';
if (process.env.NODE_ENV === 'production') {
    urlBack = 'https://mdos.onrender.com/api/';
}


class ServiceBack {
    static getAll(url) {
        return new Promise((resolve, reject) => {
            try{
                axios.get(urlBack + url + '/').then(res => {
                    resolve(res.data);
                })
            }
            catch(err){
                reject(err);
            }
        });
    }
    
    static get(url, id) {
        return new Promise((resolve, reject) => {
            try{
                axios.get(urlBack + url + '/' + id).then(res => {
                    resolve(res.data);
                })
            }
            catch(err){
                reject(err);
            }
        });
    }


    static insert(url, obj){
        return axios.post(urlBack + url + '/', obj);
    }


    static delete(url, id){
        return axios.delete(`${urlBack + url + '/'}${id}`);
    }
}


export default ServiceBack;
