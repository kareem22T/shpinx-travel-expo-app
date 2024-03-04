import axios from 'axios';
// import { token } from './a-MainVariables';
import { url } from './a-MainVariables';

// Get Tours
export function getTours() {
    //axios call
    // console.log(token);
    return axios.get(
        `${url}/get-tours`
    );
}
