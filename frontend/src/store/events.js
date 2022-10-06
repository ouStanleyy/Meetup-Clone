import { csrfFetch } from "./csrf";

const LOAD_EVENTS = "events/EVENTS";
const LOAD_DETAILS = "events/LOAD_DETAILS";
const ADD_EVENT = "events/ADD_EVENT";
const UPDATE_EVENT = "events/UPDATE_EVENT";
const REMOVE_EVENT = "events/REMOVE_EVENT";
const ADD_IMAGE = "events/ADD_IMAGE";
const LOAD_ATTENDEES = "events/LOAD_ATTENDEES";

const loadEvents = (events) => ({
  type: LOAD_EVENTS,
  events,
});

const loadDetails = (event) => ({
  type: LOAD_DETAILS,
  event,
});

const addEvent = (event) => ({
  type: ADD_EVENT,
  event,
});

const updateEvent = (event) => ({
  type: UPDATE_EVENT,
  event,
});

const removeEvent = (eventId) => ({
  type: REMOVE_EVENT,
  eventId,
});

const addImage = (eventId, image) => ({
  type: ADD_IMAGE,
  eventId,
  image,
});

const loadAttendees = (eventId, attendees) => ({
  type: LOAD_ATTENDEES,
  eventId,
  attendees,
});

export const getEvents = () => async (dispatch) => {
  const res = await csrfFetch("/api/events");
  const { Events } = await res.json();

  if (res.ok) {
    const normalizedData = {};
    Events.forEach((event) => (normalizedData[event.id] = event));
    dispatch(loadEvents(normalizedData));
  }

  return Events;
};

export const getEventById = (eventId) => async (dispatch) => {
  const res = await csrfFetch(`/api/events/${eventId}`);
  const data = await res.json();

  if (!res.ok) {
    const err = new Error();
    err.message = data.message;
    err.status = data.statusCode;
    throw err;
  } else {
    dispatch(loadDetails(data));
    return data;
  }
};

export const createEvent = (groupId, event) => async (dispatch) => {
  const res = await csrfFetch(`/api/groups/${groupId}/events`, {
    method: "POST",
    body: JSON.stringify(event),
  });
  const data = await res.json();

  if (!res.ok) {
    const err = new Error();
    err.message = data.message;
    err.status = data.statusCode;
    err.errors = data.errors;
    throw err;
  } else {
    dispatch(addEvent(data));
    return data;
  }
};

export const editEvent = (event) => async (dispatch) => {
  const res = await csrfFetch(`/api/events/${event.id}`, {
    method: "PUT",
    body: JSON.stringify(event),
  });
  const data = await res.json();

  console.log(data);

  if (!res.ok) {
    const err = new Error();
    err.message = data.message;
    err.status = data.statusCode;
    err.errors = data.errors;
    throw err;
  } else {
    dispatch(updateEvent(data));
    return data;
  }
};

export const deleteEvent = (eventId) => async (dispatch) => {
  const res = await csrfFetch(`/api/events/${eventId}`, { method: "DELETE" });
  const data = await res.json();

  if (!res.ok) {
    const err = new Error();
    err.message = data.message;
    err.status = data.statusCode;
    err.errors = data.errors;
    throw err;
  } else {
    dispatch(removeEvent(eventId));
    return data;
  }
};

export const uploadEventImage = (eventId, imgUrl) => async (dispatch) => {
  const res = await csrfFetch(`/api/events/${eventId}/images`, {
    method: "POST",
    body: JSON.stringify(imgUrl),
  });
  const data = await res.json();

  if (!res.ok) {
    const err = new Error();
    err.message = data.message;
    err.status = data.statusCode;
    throw err;
  } else {
    dispatch(addImage(eventId, data));
    return data;
  }
};

export const getAttendeesOfEvent = (eventId) => async (dispatch) => {
  const res = await csrfFetch(`/api/events/${eventId}/attendees`);
  const { Attendees } = await res.json();

  if (!res.ok) {
    const err = new Error();
    throw err;
  } else {
    const normalizedData = {};
    Attendees.forEach((attendee) => (normalizedData[attendee.id] = attendee));
    dispatch(loadAttendees(eventId, normalizedData));
  }
};

const eventsReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_EVENTS:
      return { ...action.events };
    case LOAD_DETAILS:
    // return {
    //   ...state,
    //   [action.event.id]: { ...state[action.event.id], ...action.event },
    // };
    case ADD_EVENT:
    // return {
    //   ...state,
    //   [action.event.id]: { ...state[action.event.id], ...action.event },
    // };
    case UPDATE_EVENT:
      return {
        ...state,
        [action.event.id]: { ...state[action.event.id], ...action.event },
      };
    case REMOVE_EVENT:
      const newState = { ...state };
      delete newState[action.eventId];
      return newState;
    case ADD_IMAGE:
      return {
        ...state,
        [action.eventId]: {
          ...state[action.eventId],
          Images: [...state[action.eventId].Images, { ...action.image }],
        },
      };
    case LOAD_ATTENDEES:
      return {
        ...state,
        [action.eventId]: {
          ...state[action.eventId],
          Attendees: { ...action.attendees },
        },
      };
    default:
      return state;
  }
};

export default eventsReducer;
