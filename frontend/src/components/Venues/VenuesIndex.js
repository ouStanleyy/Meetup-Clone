import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import EditVenueForm from "./EditVenueForm";
import "./Venues.css";

const VenuesIndex = ({ organizer }) => {
  const { groupId } = useParams();
  const venues = useSelector((state) => state.groups[groupId].Venues);
  const [showEdit, setShowEdit] = useState({});

  const editVenueHandler = (idx) => () => {
    setShowEdit((state) => ({
      ...state,
      [idx]: true,
    }));
  };

  useEffect(() => {
    venues.forEach((_, idx) => {
      setShowEdit((state) => ({
        ...state,
        [idx]: false,
      }));
    });
  }, [venues]);

  return (
    venues && (
      <div className="venues container">
        {venues.map((venue, idx) => {
          return (
            <div
              key={venue.id}
              className={`venues venue-container ${
                showEdit[idx] ? "expand" : ""
              }`}
            >
              <div className="venue map-container">
                {/* <img
                  className="venue img"
                  src={venue.previewImage}
                  alt={venue.previewImage}
                /> */}
              </div>
              <div className="venue details-container">
                {!showEdit[idx] ? (
                  <>
                    <div className="venue location-container">
                      <i className="fa-solid fa-map-pin" />
                      <p>
                        {venue?.address}{" "}
                        <span className="venue interpunct">·</span>{" "}
                        {venue?.city}, {venue?.state}
                      </p>
                    </div>

                    <div className="venue button-container">
                      {organizer && (
                        <button
                          className="venue button"
                          onClick={editVenueHandler(idx)}
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <EditVenueForm
                    venue={venue}
                    onUpdate={() => setShowEdit(false)}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    )
  );
};

export default VenuesIndex;
