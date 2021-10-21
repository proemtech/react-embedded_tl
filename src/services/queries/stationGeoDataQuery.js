export function stationGeoDataQuery(locations) {
  const input = locations.split(",");
  let stations = "";
  input.forEach((station) => {
    stations += `<EQ name="LocationSignature" value="${station}" />\n`;
  });

  // Return query
  const query = (locationsString) => `
<REQUEST>
  <LOGIN authenticationkey="${process.env.REACT_APP_TRV_APIKEY}" />
  <QUERY objecttype="TrainStation" schemaversion="1.4">
    <FILTER>
      <OR>
          ${locationsString}
      </OR>
    </FILTER>
    <INCLUDE>AdvertisedLocationName</INCLUDE>
    <INCLUDE>Geometry.WGS84</INCLUDE>
    <INCLUDE>LocationSignature</INCLUDE>
    <INCLUDE>OfficialLocationName</INCLUDE>
  </QUERY>
</REQUEST>`;

  return query(stations);
}
