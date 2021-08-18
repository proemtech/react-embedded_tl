import { useEffect, useState } from "react";
import "./App.css";
import { fetchTrainMessages } from "./services/fetchTrainMessages";

function App() {
  const [messages, setMessages] = useState({})
  const locationId = 'M'

  async function getMessages() {
    const result = await fetchTrainMessages(locationId)
    setMessages(result)
  }

  useEffect(() => {
    getMessages()
  },[locationId])

  console.log(messages)
  
  return (
    <div className="App">
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
    </div>
  );
}

export default App;
