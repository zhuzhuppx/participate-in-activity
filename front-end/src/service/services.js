import axios from 'axios';
import queryString  from 'query-string';
let baseUrl = '/ws';
if(process.env.NODE_ENV === 'production'){
  baseUrl='';
}
function fetch(method,url,data){
  return axios.request({
    url:baseUrl+url,
    method:method||'post',
    params:data
  });
}
export const getQrCode=(data) =>fetch('get','/qr',data);
export const typePhone=(data) =>fetch('post','/typePhone',data);
export const loadShareUsers=(data) =>fetch('get','/loadShareUsers',data);
export const updateShareUser=(data) =>fetch('post','/updateShareUser',data);
export const loadActivities=(data) =>fetch('get','/loadActivities',data);
export const addActivity=(data) =>fetch('post','/addActivity',data);
