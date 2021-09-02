export const trainStreamQuery = (trainIdent, searchDate) => `
    <REQUEST>
      <LOGIN authenticationkey="${process.env.REACT_APP_TRV_APIKEY}" />
      <QUERY objecttype="TrainAnnouncement" schemaversion="1.6" sseurl="true">
            <FILTER>
                <AND>
                  <OR>
                      <EQ name="AdvertisedTrainIdent" value="${trainIdent}" />
                      <EQ name="TechnicalTrainIdent" value="${trainIdent}" />
                  </OR>
                  <EQ name="ScheduledDepartureDateTime" value="${searchDate}" />
                </AND>
            </FILTER>
      </QUERY>
    </REQUEST>`