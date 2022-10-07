const StaticMap = ({ apiKey, zoom, lat, lng }) => {
  return (
    <img
      src={`https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=400x300&scale=2&markers=${lat},${lng}&key=${apiKey}`}
      alt="map"
    />
  );
};

export default StaticMap;
