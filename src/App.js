import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import StationPage from "./pages/StationPage";
import TrainMessagePage from "./pages/TrainMessagePage";
import TrainPage from "./pages/TrainPage";

export default function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <HomePage />
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
