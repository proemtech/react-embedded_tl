export const trainMessageQuery = locationId => `
        <REQUEST>
          <LOGIN authenticationkey="${process.env.REACT_APP_TRV_APIKEY}" />
          <QUERY objecttype="TrainMessage" schemaversion="1.7" orderby="LastUpdateDateTime desc" sseurl="true">
            <FILTER>
              <EQ name="TrafficImpact.AffectedLocation.LocationSignature" value="${locationId}" />
            </FILTER>
            <EXCLUDE>CountyNo</EXCLUDE>
          </QUERY>
        </REQUEST>`
