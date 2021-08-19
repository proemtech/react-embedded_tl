import { apiCaller } from "./apiCaller";

/*
 * API Caller function, takes in a XML string
 * query and returns a JSON string from the
 * function that can be used to extract wanted data.
 */

export async function fetchJsonResponse(query) {
  const result = await apiCaller(query);
  const json = await result.json();
  if (!result.ok) {
    const message = json.RESPONSE.RESULT[0].ERROR?.MESSAGE;
    console.error(`HTTP status: ${result.status}`);
    console.error(message);
    return message;
  } else {
    //console.log(json.RESPONSE.RESULT[0]);
    return json.RESPONSE.RESULT[0];
  }
}
