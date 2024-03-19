import axios from 'axios';
// import { token } from './a-MainVariables';
import { url } from './a-MainVariables';

// Get Hotels
export function getHotels(lang) {
    //axios call
    // console.log(token);
    return axios.get(
        `${url}/get-hotels?lang=${lang}`
    );
}
// Get Hotels
export function getHotelRestaurante(id, lang) {
    //axios call
    // console.log(token);
    return axios.get(
        `${url}/get-hotel-restaurent?id=${id}&lang=${lang}`
    );
}
