import { apiCaller } from "./apiCaller";

/*
 * API Caller function, takes in a XML string
 * query and returns a JSON string from the
 * function that can be used to extract wanted data.
 */

export async function fetchJsonResponse(query) {
  if (query) {
    try {
      const result = await apiCaller(query);
      if (result.ok) {
        const json = await result.json();
        return json.RESPONSE.RESULT[0];
        //const message = json.RESPONSE.RESULT[0].ERROR?.MESSAGE;
        //console.error(message);
      }
      if (!result.ok) console.error(`HTTP status code: ${result.status}`);
      return;
    } catch (error) {
      console.error(error);
    }
  }
  return;
}
