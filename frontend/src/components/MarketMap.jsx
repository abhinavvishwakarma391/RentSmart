import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function formatRent(value) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function MarketMap({ city, points }) {
  if (!points?.length) {
    return <div className="market-map-empty">No map data available.</div>;
  }

  const rents = points.map((point) => point.avg_rent);
  const minRent = Math.min(...rents);
  const maxRent = Math.max(...rents);
  const centerLat = points.reduce((sum, point) => sum + point.latitude, 0) / points.length;
  const centerLng = points.reduce((sum, point) => sum + point.longitude, 0) / points.length;

  const radiusForRent = (rent) => {
    if (maxRent === minRent) {
      return 12;
    }
    return 8 + ((rent - minRent) / (maxRent - minRent)) * 16;
  };

  return (
    <MapContainer
      center={[centerLat, centerLng]}
      zoom={12}
      scrollWheelZoom={false}
      className="market-map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {points.map((point) => (
        <CircleMarker
          key={point.locality}
          center={[point.latitude, point.longitude]}
          radius={radiusForRent(point.avg_rent)}
          pathOptions={{
            color: "#2f54eb",
            fillColor: "#4c7dff",
            fillOpacity: 0.55,
            weight: 2,
          }}
        >
          <Tooltip direction="top" offset={[0, -8]} opacity={1}>
            {point.locality}: {formatRent(point.avg_rent)}
          </Tooltip>
          <Popup>
            <strong>{point.locality}</strong>
            <br />
            {city} · {point.count} listings
            <br />
            Avg rent: {formatRent(point.avg_rent)}
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}

export default MarketMap;
