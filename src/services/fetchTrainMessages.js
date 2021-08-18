import { apiCaller } from "./apiCaller";
import { trainMessageQuery } from "./queries/trainMessageQuery";

export async function fetchTrainMessages(locationId) {
  const result = await apiCaller(trainMessageQuery(locationId));
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
