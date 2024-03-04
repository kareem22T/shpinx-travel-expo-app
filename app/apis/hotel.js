import axios from 'axios';
// import { token } from './a-MainVariables';
import { url } from './a-MainVariables';

// Get Hotels
export function getHotels() {
    //axios call
    // console.log(token);
    return axios.get(
        `${url}/get-hotels`
    );
}
