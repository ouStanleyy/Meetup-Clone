import { csrfFetch } from "./csrf";

const LOAD_GROUPS = "groups/LOAD_GROUPS";
const LOAD_DETAILS = "groups/LOAD_DETAILS";
const ADD_GROUP = "groups/ADD_GROUP";
const UPDATE_GROUP = "groups/UPDATE_GROUP";
const REMOVE_GROUP = "groups/REMOVE_GROUP";
const ADD_IMAGE = "groups/ADD_IMAGE";
const ADD_VENUE = "groups/ADD_VENUE";
const UPDATE_VENUE = "groups/UPDATE_VENUE";
const LOAD_EVENTS = "groups/LOAD_EVENTS";
const LOAD_MEMBERS = "groups/LOAD_MEMBERS";
const UPDATE_MEMBERSHIP = "groups/UPDATE_MEMBERSHIP";
const REMOVE_MEMBERSHIP = "groups/REMOVE_MEMBERSHIP";

const loadGroups = (groups) => ({
  type: LOAD_GROUPS,
  groups,
});

const loadDetails = (group) => ({
  type: LOAD_DETAILS,
  group,
});

const addGroup = (group) => ({
  type: ADD_GROUP,
  group,
});

const updateGroup = (group) => ({
  type: UPDATE_GROUP,
  group,
});

const removeGroup = (groupId) => ({
  type: REMOVE_GROUP,
  groupId,
});

const addImage = (groupId, image) => ({
  type: ADD_IMAGE,
  groupId,
  image,
});

const addVenue = (groupId, venue) => ({
  type: ADD_VENUE,
  groupId,
  venue,
});

const updateVenue = (groupId, venue) => ({
  type: UPDATE_VENUE,
  groupId,
  venue,
});

const loadEvents = (groupId, events) => ({
  type: LOAD_EVENTS,
  groupId,
  events,
});

const loadMembers = (groupId, members) => ({
  type: LOAD_MEMBERS,
  groupId,
  members,
});

const updateMembership = (groupId, membership) => ({
  type: UPDATE_MEMBERSHIP,
  groupId,
  membership,
});

const removeMemberhip = (groupId, memberId) => ({
  type: REMOVE_MEMBERSHIP,
  groupId,
  memberId,
});

export const getGroups = () => async (dispatch) => {
  const res = await csrfFetch("/api/groups");
  const { Groups } = await res.json();

  if (res.ok) {
    const normalizedData = {};
    Groups.forEach((group) => (normalizedData[group.id] = group));
    dispatch(loadGroups(normalizedData));
  }

  return Groups;
};

export const getGroupById = (groupId) => async (dispatch) => {
  const res = await csrfFetch(`/api/groups/${groupId}`);
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

export const createGroup = (group) => async (dispatch) => {
  const res = await csrfFetch("/api/groups", {
    method: "POST",
    body: JSON.stringify(group),
  });
  const data = await res.json();

  if (!res.ok) {
    const err = new Error();
    err.message = data.message;
    err.status = data.statusCode;
    err.errors = data.errors;
    throw err;
  } else {
    dispatch(addGroup(data));
    return data;
  }
};

export const editGroup = (group) => async (dispatch) => {
  const res = await csrfFetch(`/api/groups/${group.id}`, {
    method: "PUT",
    body: JSON.stringify(group),
  });
  const data = await res.json();

  if (!res.ok) {
    const err = new Error();
    err.message = data.message;
    err.status = data.statusCode;
    err.errors = data.errors;
    throw err;
  } else {
    await dispatch(getEventsOfGroup(group.id));
    dispatch(updateGroup(data));
    return data;
  }
};

export const deleteGroup = (groupId) => async (dispatch) => {
  const res = await csrfFetch(`/api/groups/${groupId}`, { method: "DELETE" });
  const data = await res.json();

  if (!res.ok) {
    const err = new Error();
    err.message = data.message;
    err.status = data.statusCode;
    err.errors = data.errors;
    throw err;
  } else {
    dispatch(removeGroup(groupId));
    return data;
  }
};

export const uploadGroupImage = (groupId, imgUrl) => async (dispatch) => {
  const res = await csrfFetch(`/api/groups/${groupId}/images`, {
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
    dispatch(addImage(groupId, data));
    return data;
  }
};

export const createVenue = (groupId, venue) => async (dispatch) => {
  const res = await csrfFetch(`/api/groups/${groupId}/venues`, {
    method: "POST",
    body: JSON.stringify(venue),
  });
  const data = await res.json();

  if (!res.ok) {
    const err = new Error();
    err.message = data.message;
    err.status = data.statusCode;
    err.errors = data.errors;
    throw err;
  } else {
    dispatch(addVenue(groupId, data));
    return data;
  }
};

export const editVenue = (groupId, venue) => async (dispatch) => {
  const res = await csrfFetch(`/api/venues/${venue.id}`, {
    method: "PUT",
    body: JSON.stringify(venue),
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
    dispatch(updateVenue(groupId, data));
    return data;
  }
};

export const getEventsOfGroup = (groupId) => async (dispatch) => {
  const res = await csrfFetch(`/api/groups/${groupId}/events`);
  const { Events } = await res.json();

  if (!res.ok) {
    const err = new Error();
    throw err;
  } else {
    const normalizedData = {};
    Events.forEach((event) => (normalizedData[event.id] = event));
    dispatch(loadEvents(groupId, normalizedData));
  }
};

export const getMembersOfGroup = (groupId) => async (dispatch) => {
  const res = await csrfFetch(`/api/groups/${groupId}/members`);
  const data = await res.json();
  const { Members } = data;

  if (!res.ok) {
    const err = new Error();
    throw err;
  } else {
    const normalizedData = {};
    Members.forEach((member) => (normalizedData[member.id] = member));
    dispatch(loadMembers(groupId, normalizedData));
  }
};

export const requestMembership = (groupId) => async (dispatch) => {
  const res = await csrfFetch(`/api/groups/${groupId}/memberships`, {
    method: "POST",
  });
  const data = await res.json();

  if (!res.ok) {
    const err = new Error();
    err.message = data.message;
    err.status = data.statusCode;
    throw err;
  } else {
    await dispatch(getMembersOfGroup(groupId));
    return data;
  }
};

export const addMember = (groupId, membership) => async (dispatch) => {
  const res = await csrfFetch(
    `/api/groups/${groupId}/memberships/${membership.memberId}`,
    {
      method: "PUT",
      body: JSON.stringify(membership),
    }
  );
  const data = await res.json();

  if (!res.ok) {
    const err = new Error();
    err.message = data.message;
    err.status = data.statusCode;
    err.errors = data.errors;
    throw err;
  } else {
    dispatch(updateMembership(groupId, data));
    return data;
  }
};

export const deleteMember = (groupId, memberId) => async (dispatch) => {
  const res = await csrfFetch(
    `/api/groups/${groupId}/memberships/${memberId}`,
    {
      method: "DELETE",
      body: JSON.stringify({ memberId }),
    }
  );
  const data = await res.json();

  if (!res.ok) {
    const err = new Error();
    err.message = data.message;
    err.status = data.statusCode;
    err.errors = data.errors;
    throw err;
  } else {
    dispatch(removeMemberhip(groupId, memberId));
    return data;
  }
};

const groupsReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_GROUPS:
      return { ...action.groups };
    case LOAD_DETAILS:
    // return {
    //   ...state,
    //   [action.group.id]: { ...state[action.group.id], ...action.group },
    // };
    case ADD_GROUP:
    // return {
    //   ...state,
    //   [action.group.id]: { ...state[action.group.id], ...action.group },
    // };
    case UPDATE_GROUP:
      return {
        ...state,
        [action.group.id]: { ...state[action.group.id], ...action.group },
      };
    case REMOVE_GROUP: {
      const newState = { ...state };
      delete newState[action.groupId];
      return newState;
    }
    case ADD_IMAGE:
      return {
        ...state,
        [action.groupId]: {
          ...state[action.groupId],
          Images: [...state[action.groupId].Images, { ...action.image }],
        },
      };
    case ADD_VENUE:
      return {
        ...state,
        [action.groupId]: {
          ...state[action.groupId],
          Venues: [...state[action.groupId].Venues, { ...action.venue }],
        },
      };
    case UPDATE_VENUE:
      return {
        ...state,
        [action.groupId]: {
          ...state[action.groupId],
          Venues: state[action.groupId].Venues.map((venue) =>
            venue.id === action.venue.id ? { ...action.venue } : venue
          ),
        },
      };
    case LOAD_EVENTS:
      return {
        ...state,
        [action.groupId]: {
          ...state[action.groupId],
          Events: { ...action.events },
        },
      };
    case LOAD_MEMBERS:
      return {
        ...state,
        [action.groupId]: {
          ...state[action.groupId],
          Members: { ...action.members },
        },
      };
    case UPDATE_MEMBERSHIP:
      return {
        ...state,
        [action.groupId]: {
          ...state[action.groupId],
          Members: {
            ...state[action.groupId].Members,
            [action.membership.memberId]: {
              ...state[action.groupId].Members[action.membership.memberId],
              Membership: { status: action.membership.status },
            },
          },
        },
      };
    case REMOVE_MEMBERSHIP: {
      const newState = {
        ...state,
        [action.groupId]: {
          ...state[action.groupId],
          Members: { ...state[action.groupId].Members },
        },
      };
      delete newState[action.groupId].Members[action.memberId];
      return newState;
    }
    default:
      return state;
  }
};

export default groupsReducer;
