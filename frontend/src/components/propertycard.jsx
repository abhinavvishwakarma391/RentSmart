import { Link } from "react-router-dom";

function PropertyCard({
  property,
  isSelected = false,
  onSelect,
  selectable = false,
  showAction = true,
  actionLabel = "Analyze →",
  actionLink = "/predict",
}) {
  if (!property) return null;

  const statusClass =
    property.status === "Underpriced"
      ? "status-good"
      : property.status === "Overpriced"
      ? "status-high"
      : "status-fair";

  return (
    <div
      className={`compare-property-card ${
        selectable && isSelected ? "selected" : ""
      }`}
    >
      <div className="property-placeholder">
        <span>{property.property_type || "Apartment"}</span>
        {property.status_label && (
          <span className={`card-badge ${statusClass}`}>
            {property.status_label}
          </span>
        )}
      </div>

      <div className="compare-property-info">
        <div className="property-card-top">
          <div>
            <h3>{property.name || property.title}</h3>
            <p>📍 {property.location || `${property.locality}, ${property.city}`}</p>
          </div>

          <div className="compare-price">
            ₹{(property.rent || 0).toLocaleString("en-IN")}
            <small>/month</small>
          </div>
        </div>

        <div className="property-mini-details">
          <span>🛏 {property.bhk} BHK</span>
          <span>📐 {property.area || property.area_sqft} sq.ft</span>
          {property.furnishing && <span>🛋 {property.furnishing}</span>}
          <span>🚗 {property.parking}</span>
        </div>

        {property.fair_rent && (
          <div className="property-card-fair">
            <small>AI Fair Rent:</small>
            <strong>₹{property.fair_rent.toLocaleString("en-IN")}</strong>
          </div>
        )}

        {selectable ? (
          <button
            type="button"
            className={`select-property-button ${
              isSelected ? "selected-button" : ""
            }`}
            onClick={() => onSelect && onSelect(property.id)}
          >
            {isSelected ? "✓ Selected" : "Select Property"}
          </button>
        ) : showAction ? (
          <Link to={actionLink} className="view-property">
            {actionLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}

export default PropertyCard;
