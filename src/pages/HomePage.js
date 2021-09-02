import React from 'react'
import { Link } from "react-router-dom"

export default function HomePage() {
    return (
        <div className="homePage">
            <h1>Trafikinformation för kioskklienter</h1>
            <ul className="homePageInfo">
                <li>För tågsökning, url/train/*tågnummer*, exempelvis <Link to="/train/360">/train/360</Link></li>
                <li>För stations ankomster samt avgångar, /station/*stationssignatur*, exempelvis <Link to="/station/Cst">/station/Cst</Link></li>
                <li>För stations ankomster, /station/*stationssignatur*/arrivals, exempelvis <Link to="/station/Cst/arrivals">/station/Cst/arrivals</Link></li>
                <li>För stations avgångar, /station/*stationssignatur*/departures, exempelvis <Link to="/station/Cst/departures">/station/Cst/departures</Link></li>
                <li>För trafikinformation, /msg/*stationssignatur*, exempelvis <Link to="/msg/M">/msg/M</Link></li>
            </ul>
        </div>
    )
}
