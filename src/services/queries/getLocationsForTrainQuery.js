export const getLocationsForTrainQuery = (trainIdent, searchDate) => `
<REQUEST>
    <LOGIN authenticationkey="${process.env.REACT_APP_TRV_APIKEY}" />
    <QUERY runtime="true" objecttype="TrainAnnouncement" schemaversion="1.4" limit="0">
        <EVAL alias="OrderedLocations" function="$function.TrainAnnouncement_v1.GetLocationsForTrain(${trainIdent},${searchDate})" />
        <INCLUDE>LocationSignature</INCLUDE>
    </QUERY>
</REQUEST>`