import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getKey } from "../../store/maps";
import Maps from "./Maps";
import StaticMap from "./StaticMap";

const MapContainer = ({ mapType, settings }) => {
  const dispatch = useDispatch();
  const key = useSelector((state) => state.maps.key);

  useEffect(() => {
    if (!key) dispatch(getKey());
  }, [dispatch, key]);

  return !key ? null : mapType === "static" ? (
    <StaticMap apiKey={key} {...settings} />
  ) : (
    <Maps apiKey={key} />
  );
};

export default MapContainer;
