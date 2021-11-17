import L from "leaflet";

export const mapTooltipIcon = L.Icon({
  iconUrl: require("../assets/tooltipIcon.svg"),
  iconRetinaUrl: require("../assets/tooltipIcon.svg"),
  iconAnchor: null,
  popupAnchor: null,
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null,
  iconSize: new L.Point(60, 75),
  className: "",
});
