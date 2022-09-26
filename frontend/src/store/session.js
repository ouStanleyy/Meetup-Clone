import { csrfFetch } from "./csrf";

const SET_SESSION = "session/SET_SESSION";
const REMOVE_SESSION = "session/REMOVE_SESSION";
const LOAD_GROUPS = "session/LOAD_GROUPS";
const LOAD_EVENTS = "session/LOAD_EVENTS";

const setSession = (user) => ({
  type: SET_SESSION,
  user,
});

const removeSession = () => ({
  type: REMOVE_SESSION,
});

const loadGroups = (groups) => ({
  type: LOAD_GROUPS,
  groups,
});

const loadEvents = (events) => ({
  type: LOAD_EVENTS,
  events,
});

export const login = (payload) => async (dispatch) => {
  const res = await csrfFetch("/api/users/session", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const data = await res.json();

  if (!res.ok) {
    const err = new Error();
    err.message = data.message;
    err.status = data.statusCode;
    throw err;
  } else {
    dispatch(setSession(data));
    return data;
  }
};

export const restoreSession = () => async (dispatch) => {
  const res = await csrfFetch("/api/users/session");
  const data = await res.json();

  if (res.ok) dispatch(setSession(data));
  return data;
};

export const signup = (payload) => async (dispatch) => {
  const res = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const data = await res.json();

  if (!res.ok) {
    const err = new Error();
    err.message = data.message;
    err.status = data.statusCode;
    err.errors = data.errors;
    throw err;
  } else {
    dispatch(setSession(data));
    return data;
  }
};

export const logout = () => async (dispatch) => {
  const res = await csrfFetch("/api/users/session", { method: "DELETE" });

  if (res.ok) dispatch(removeSession());
};

export const getSessionGroups = () => async (dispatch) => {
  const res = await csrfFetch("/api/users/session/groups");
  const { Groups } = await res.json();

  if (res.ok) {
    const normalizedData = {};
    Groups.forEach((group) => (normalizedData[group.id] = group));
    dispatch(loadGroups(normalizedData));
  }

  return Groups;
};

export const getSessionEvents = () => async (dispatch) => {
  const res = await csrfFetch("/api/users/session/events");
  const { Events } = await res.json();

  if (res.ok) {
    const normalizedData = {};
    Events.forEach((event) => (normalizedData[event.id] = event));
    dispatch(loadEvents(normalizedData));
  }

  return Events;
};

const sessionReducer = (
  state = { user: null, groups: {}, events: {} },
  action
) => {
  switch (action.type) {
    case SET_SESSION:
      return { ...state, user: { ...action.user } };
    case REMOVE_SESSION:
      return { ...state, user: null, groups: {} };
    case LOAD_GROUPS:
      return { ...state, groups: { ...action.groups } };
    case LOAD_EVENTS:
      return { ...state, events: { ...action.events } };
    default:
      return state;
  }
};

export default sessionReducer;
