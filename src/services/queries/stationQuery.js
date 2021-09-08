export const stationQuery = (locationId, activityType, limit) => `
  <REQUEST>
    <LOGIN authenticationkey="${process.env.REACT_APP_TRV_APIKEY}" />
    <QUERY objecttype="TrainAnnouncement" schemaversion="1.6" orderby="AdvertisedTimeAtLocation" limit="${isNaN(limit) ? 25 : limit}">
      <FILTER>
      <AND>
      <EQ name="ActivityType" value="${activityType}" />
      <EQ name="LocationSignature" value="${locationId}" />
      <EQ name="Advertised" value="true" />
        <OR>
          <AND>
            <GT name="AdvertisedTimeAtLocation" value="$dateadd(-00:15:00)" />
          </AND>
          <AND>
            <LT name="AdvertisedTimeAtLocation" value="$dateadd(00:30:00)" />
            <GT name="EstimatedTimeAtLocation" value="$dateadd(-00:15:00)" />
          </AND>
        </OR>
      </AND>
      </FILTER>
      <INCLUDE>Advertised</INCLUDE>
      <INCLUDE>AdvertisedTimeAtLocation</INCLUDE>
      <INCLUDE>AdvertisedTrainIdent</INCLUDE>
      <INCLUDE>Booking</INCLUDE>
      <INCLUDE>Canceled</INCLUDE>
      <INCLUDE>Deviation</INCLUDE>
      <INCLUDE>EstimatedTimeAtLocation</INCLUDE>
      <INCLUDE>FromLocation</INCLUDE>
      <INCLUDE>InformationOwner</INCLUDE>
      <INCLUDE>LocationSignature</INCLUDE>
      <INCLUDE>ProductInformation</INCLUDE>
      <INCLUDE>ScheduledDepartureDateTime</INCLUDE>
      <INCLUDE>Service</INCLUDE>
      <INCLUDE>TechnicalTrainIdent</INCLUDE>
      <INCLUDE>TimeAtLocation</INCLUDE>
      <INCLUDE>ToLocation</INCLUDE>
      <INCLUDE>TrackAtLocation</INCLUDE>
    </QUERY>
  </REQUEST>`