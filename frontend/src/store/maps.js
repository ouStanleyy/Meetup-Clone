import { csrfFetch } from "./csrf";

const LOAD_API_KEY = "maps/LOAD_API_KEY";

const loadApiKey = (key) => ({
  type: LOAD_API_KEY,
  key,
});

export const getKey = () => async (dispatch) => {
  const res = await csrfFetch("/api/maps/key", { method: "POST" });
  const { googleMapsAPIKey } = await res.json();

  dispatch(loadApiKey(googleMapsAPIKey));
};

const mapsReducer = (state = { key: null }, action) => {
  switch (action.type) {
    case LOAD_API_KEY:
      return { key: action.key };
    default:
      return state;
  }
};

export default mapsReducer;
