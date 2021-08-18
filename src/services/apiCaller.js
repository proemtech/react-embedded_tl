/*
 * API Caller function, takes in a XML string
 * query and returns a JSON string from the
 * function that can be used to extract wanted data.
 */

export async function apiCaller(query) {
  const response = await fetch("https://api.trafikinfo.trafikverket.se/v2/data.json", {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "text/xml",
    },
    redirect: "follow",
    body: query,
  });
  return response
}
