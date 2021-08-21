export const trainScheduleQuery = (trainIdent, searchDate) => `
    <REQUEST>
      <LOGIN authenticationkey="${process.env.REACT_APP_TRV_APIKEY}" />
      <QUERY objecttype="TrainAnnouncement" schemaversion="1.6" orderby="AdvertisedTimeAtLocation, ActivityType asc">
        <FILTER>
          <AND>
            <OR>
              <EQ name="AdvertisedTrainIdent" value="${trainIdent}" />
              <EQ name="TechnicalTrainIdent" value="${trainIdent}" />
            </OR>
            <EQ name="ScheduledDepartureDateTime" value="${searchDate}" />
            <EQ name="Advertised" value="true" />
          </AND>
        </FILTER>
      </QUERY>
    </REQUEST>`;
