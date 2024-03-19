import axios from 'axios';
// import { token } from './a-MainVariables';
import { url } from './a-MainVariables';

// Get Tours
export function getTours(lang) {
    //axios call
    // console.log(token);
    return axios.get(
        `${url}/get-tours?lang=${lang}`
    );
}

// Get Tour
export function getTour(id, lang) {
    //axios call
    // console.log(token);
    return axios.get(
        `${url}/get-tour?lang=${lang}&id=${id}`
    );
}
