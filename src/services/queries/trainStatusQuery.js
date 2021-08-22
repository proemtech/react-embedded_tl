export const trainStatusQuery = (trainIdent, searchDate) => `
    <REQUEST>
      <LOGIN authenticationkey="${process.env.REACT_APP_TRV_APIKEY}" />
      <QUERY objecttype="TrainAnnouncement" schemaversion="1.6" orderby="TimeAtLocation desc, ActivityType desc" limit="1" sseurl="true">
            <FILTER>
                <AND>
                  <OR>
                      <EQ name="AdvertisedTrainIdent" value="${trainIdent}" />
                      <EQ name="TechnicalTrainIdent" value="${trainIdent}" />
                  </OR>
                  <EQ name="ScheduledDepartureDateTime" value="${searchDate}" />
                  <EXISTS name="TimeAtLocation" value="true" />
                </AND>
            </FILTER>
            <INCLUDE>ActivityType</INCLUDE>
            <INCLUDE>AdvertisedTimeAtLocation</INCLUDE>
            <INCLUDE>AdvertisedTrainIdent</INCLUDE>
            <INCLUDE>Canceled</INCLUDE>
            <INCLUDE>LocationSignature</INCLUDE>
            <INCLUDE>ScheduledDepartureDateTime</INCLUDE>
            <INCLUDE>TechnicalDateTime</INCLUDE>
            <INCLUDE>TechnicalTrainIdent</INCLUDE>
            <INCLUDE>TimeAtLocation</INCLUDE>
            <INCLUDE>TimeAtLocationWithSeconds</INCLUDE>
      </QUERY>
    </REQUEST>`