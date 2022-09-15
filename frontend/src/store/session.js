import { csrfFetch } from "./csrf";

const SET_SESSION = "session/SET_SESSION";
const REMOVE_SESSION = "session/REMOVE_SESSION";

const setSession = (user) => ({
  type: SET_SESSION,
  user,
});

const removeSession = () => ({
  type: REMOVE_SESSION,
});

export const login = (payload) => async (dispatch) => {
  const res = await csrfFetch("/api/users/session", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (res.ok) {
    const user = await res.json();
    dispatch(setSession(user));
  }
};

const sessionReducer = (state = { user: null }, action) => {
  switch (action.type) {
    case SET_SESSION:
      return { ...state, user: { ...action.user } };
    case REMOVE_SESSION:
      return { ...state, user: null };
    default:
      return state;
  }
};

export default sessionReducer;
