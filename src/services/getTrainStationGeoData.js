export async function getTrainStationGeoData(locationSignature) {
  try {
    const locationsResponse = await fetch("/Trafikplats_jvg.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const locationsData = await locationsResponse.json();
    //console.log(locationsData?.features);
    const geoData = locationsData?.features?.find((station) => station?.properties?.signatur === locationSignature);
    // If geodata exists, return it, otherwise return only location signature
    if (geoData) return geoData;
  } catch (error) {
    console.error(error);
  }
  return {
    bandel: null,
    easting: null,
    lat: null,
    long: null,
    northing: null,
    signatur: locationSignature,
    trafikplatsnamn: locationSignature,
  };
}
