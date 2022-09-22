import axios from 'axios';
import Api from './Api';
import AuthApi from './AuthApi';
//import pkg from '../../package.json';


export const buildVariables = {
    domainUrl: 'gw-guidedchoice.com',
    appVersion: '0.0',
    env: 'local',
    apiUrl: null,
    authUrl: null,
    securityEnabled: true,
  };
  
const domain = buildVariables.domainUrl;

const AUTH_URL = buildVariables.authUrl ? buildVariables.authUrl : `https://auth.${domain}/api/`;
const API_URL = buildVariables.apiUrl ? buildVariables.apiUrl : `https://mob.${domain}/api/`;

const AUTH = new AuthApi(
  axios.create({
    baseURL: AUTH_URL,
    timeout: 10000, // 10 seconds,
  }),
);

const API = new Api(
  axios.create({
    baseURL: API_URL,
    timeout: 10000, // 10 seconds
  }),
);

export { AUTH, API };
