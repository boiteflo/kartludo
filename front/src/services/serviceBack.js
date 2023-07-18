const axios = require('axios');


const urlBack = 'https://mdos.onrender.com/api/'; //'http://localhost:5000/api/';//


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


    static insert(url, obj){
        return axios.post(urlBack + url + '/', obj);
    }


    static delete(url, id){
        return axios.delete(`${urlBack + url + '/'}${id}`);
    }
}


export default ServiceBack;
