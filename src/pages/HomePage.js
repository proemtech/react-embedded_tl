import React from 'react'
import { Link } from "react-router-dom"

export default function HomePage() {
    return (
        <div className="homePage">
            <h1>Trafikinformation för kioskklienter</h1>
            <ul className="homePageInfo">
                <li>För tågsökning, url/train/*tågnummer*, exempelvis <Link to="/train/360">/train/360</Link></li>
                <li>För stations ankomster samt avgångar, /station/*stationssignatur*, exempelvis <Link to="/station/Cst">/station/Cst</Link></li>
                <li>För stations ankomster, /arrivals/*stationssignatur*, exempelvis <Link to="/arrivals/Cst">/arrivals/Cst</Link></li>
                <li>För stations avgångar, /departures/*stationssignatur*, exempelvis <Link to="/departures/Cst">/departures/Cst</Link></li>
                <li>För trafikinformation, /msg/*stationssignatur*, exempelvis <Link to="/msg/M">/msg/M</Link></li>
            </ul>
        </div>
    )
}
