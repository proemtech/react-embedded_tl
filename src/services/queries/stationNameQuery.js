export const stationNameQuery = (locationId) => `
<REQUEST>
    <LOGIN authenticationkey="${process.env.REACT_APP_TRV_APIKEY}" />
    <QUERY objecttype="TrainStation" schemaversion="1.4">
        <FILTER>
            <EQ name="LocationSignature" value="${locationId}" />
        </FILTER>
        <INCLUDE>AdvertisedLocationName</INCLUDE>
        <INCLUDE>OfficialLocationName</INCLUDE>
    </QUERY>
</REQUEST>`;
