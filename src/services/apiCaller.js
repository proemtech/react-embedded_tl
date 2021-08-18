/*
 * This is a generic API caller
 * Returns a JSON string from the function 
 * that can be used to extract wanted data.
 */

function apiCaller(query) {
    let response = fetch('https://api.trafikinfo.trafikverket.se/v2/data.json')
    console.log(response)
}