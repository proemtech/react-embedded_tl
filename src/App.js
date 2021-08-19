import { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, useParams } from "react-router-dom";
import "./App.css";
import { fetchTrainMessages } from "./services/fetchTrainMessages";

export default function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <></>
          </Route>
          <Route exact path="/train/:trainIdent/:searchDate?">
            <TrainPage />
          </Route>
          <Route exact path="/station/:locationId">
            <StationPage />
          </Route>
          <Route exact path="/station/:locationId/:type?">
            <StationPage />
          </Route>
          <Route exact path="/msg/:locationId">
            <TrainMessagePage />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

function StationPage() {
  const { locationId, type } = useParams();

  return (
    <div>
      <p>
        Location ID: {locationId}
        {type && (
          <>
            <br />
            Type: {type}
          </>
        )}
      </p>
    </div>
  );
}

function TrainPage() {
  const { trainIdent, searchDate } = useParams();
  return (
    <div>
      <p>
        Train ident: {trainIdent}
        {searchDate && (
          <>
            <br />
            Search date: {searchDate}
          </>
        )}
      </p>
    </div>
  );
}

function TrainMessagePage() {
  const { locationId } = useParams();
  const [messages, setMessages] = useState({});

  
  useEffect(() => {
    async function getMessages() {
      const result = await fetchTrainMessages(locationId);
      setMessages(result);
    }
    getMessages();
  }, [locationId]);

  console.log(messages);

  return (
    <>
      <h4>Visar trafikstörningsmeddelanden för {locationId}</h4>
      {messages && (
        <>
          {messages.TrainMessage?.map((msg) => (
            <div className="trainMessageCard">
              <h4 key={Math.random()}>{msg.Header}</h4>
              <p>{msg.ExternalDescription}</p>
            </div>
          ))}
        </>
      )}
    </>
  );
}
