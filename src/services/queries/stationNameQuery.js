export const stationNameQuery = (locationId) => `
<REQUEST>
    <LOGIN authenticationkey="${process.env.REACT_APP_TRV_APIKEY}" />
    <QUERY objecttype="TrainStation" schemaversion="1.4">
        <FILTER>
            <EQ name="LocationSignature" value="${locationId}" />
        </FILTER>
        <INCLUDE>Advertised</INCLUDE>
        <INCLUDE>AdvertisedLocationName</INCLUDE>
        <INCLUDE>Geometry.WGS84</INCLUDE>
        <INCLUDE>LocationSignature</INCLUDE>
        <INCLUDE>OfficialLocationName</INCLUDE>
    </QUERY>
</REQUEST>`;
