export const trainRadarStationQuery = (locationId) => `
<REQUEST>
      <LOGIN authenticationkey="${process.env.REACT_APP_TRV_APIKEY}" />
      <QUERY objecttype="TrainAnnouncement" schemaversion="1.6" orderby="AdvertisedTimeAtLocation">
            <FILTER>
                  <AND>
                        <EQ name="LocationSignature" value="${locationId}" />
                        <EXISTS name="TimeAtLocation" value="true" />
                        <OR>
                              <AND>
                                    <GT name="TimeAtLocation" value="$dateadd(-00:05:00)" />
                                    <LT name="TimeAtLocation" value="$dateadd(00:15:00)" />
                              </AND>
                        </OR>
                  </AND>
            </FILTER>
            <INCLUDE>ActivityType</INCLUDE>
            <INCLUDE>AdvertisedTimeAtLocation</INCLUDE>
            <INCLUDE>TechnicalDateTime</INCLUDE>
            <INCLUDE>TechnicalTrainIdent</INCLUDE>
            <INCLUDE>TimeAtLocation</INCLUDE>
            <INCLUDE>TimeAtLocationWithSeconds</INCLUDE>
            <INCLUDE>ToLocation.LocationName</INCLUDE>
      </QUERY>
</REQUEST>`