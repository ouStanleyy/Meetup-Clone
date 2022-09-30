import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import "./Venues.css";

const VenuesIndex = () => {
  const { groupId } = useParams();
  const venues = useSelector((state) => state.groups[groupId].Venues);

  return (
    venues && (
      <div className="venues container">
        {venues.map((venue) => {
          return (
            <div key={venue.id} className="venues venue-container">
              <div className="venue map-container">
                {/* <img
                  className="venue img"
                  src={venue.previewImage}
                  alt={venue.previewImage}
                /> */}
              </div>
              <div className="venue details-container">
                <i className="fa-solid fa-map-pin" />
                <p>
                  {venue?.address} <span className="venue interpunct">·</span>{" "}
                  {venue?.city}, {venue?.state}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    )
  );
};

export default VenuesIndex;
