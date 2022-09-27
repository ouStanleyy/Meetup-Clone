import { csrfFetch } from "./csrf";

const LOAD_EVENTS = "events/EVENTS";
const LOAD_DETAILS = "events/LOAD_DETAILS";
const ADD_EVENT = "events/ADD_EVENT";
// const REMOVE_GROUP = "groups/REMOVE_GROUP";
// const ADD_IMAGE = "groups/ADD_IMAGE";

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

// const removeGroup = (groupId) => ({
//   type: REMOVE_GROUP,
//   groupId,
// });

// const addImage = (groupId, image) => ({
//   type: ADD_IMAGE,
//   groupId,
//   image,
// });

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

export const createEvent = (event) => async (dispatch) => {
  const res = await csrfFetch("/api/events", {
    method: "POST",
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
    dispatch(addEvent(data));
    return data;
  }
};

export const updateEvent = (event) => async (dispatch) => {
  const res = await csrfFetch(`/api/events/${event.id}`, {
    method: "PUT",
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

export const deleteEvent = (eventId) => async (dispatch) => {
  // const res = await csrfFetch(`/api/groups/${groupId}`, { method: "DELETE" });
  // const data = await res.json();
  // if (!res.ok) {
  //   const err = new Error();
  //   err.message = data.message;
  //   err.status = data.statusCode;
  //   err.errors = data.errors;
  //   throw err;
  // } else {
  //   dispatch(removeGroup(groupId));
  //   return data;
  // }
};

// export const uploadImage = (groupId, imgUrl) => async (dispatch) => {
//   const res = await csrfFetch(`/api/groups/${groupId}/images`, {
//     method: "POST",
//     body: JSON.stringify(imgUrl),
//   });
//   const data = await res.json();

//   if (!res.ok) {
//     const err = new Error();
//     err.message = data.message;
//     err.status = data.statusCode;
//     throw err;
//   } else {
//     dispatch(addImage(groupId, data));
//     return data;
//   }
// };

const eventsReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_EVENTS:
      return { ...state, ...action.events };
    case LOAD_DETAILS:
      return {
        ...state,
        [action.event.id]: { ...state[action.event.id], ...action.event },
      };
    // case ADD_GROUP:
    //   return {
    //     ...state,
    //     [action.group.id]: { ...state[action.group.id], ...action.group },
    //   };
    // case REMOVE_GROUP:
    //   const newState = { ...state };
    //   delete newState[action.groupId];
    //   return newState;
    // case ADD_IMAGE:
    //   return {
    //     ...state,
    //     [action.groupId]: {
    //       ...state[action.groupId],
    //       Images: [...state[action.groupId].Images, { ...action.image }],
    //     },
    //   };
    default:
      return state;
  }
};

export default eventsReducer;
