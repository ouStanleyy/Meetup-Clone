import { csrfFetch } from "./csrf";

const LOAD_GROUPS = "groups/LOAD_GROUPS";
const LOAD_DETAILS = "groups/LOAD_DETAILS";
const ADD_GROUP = "groups/ADD_GROUP";
const REMOVE_GROUP = "groups/REMOVE_GROUP";

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

const removeGroup = (groupId) => ({
  type: REMOVE_GROUP,
  groupId,
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
  const group = await res.json();

  if (res.ok) {
    dispatch(loadDetails(group));
  }

  return group;
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

export const updateGroup = (group) => async (dispatch) => {
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
    dispatch(addGroup(data));
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

export const addImage = (groupId, imgUrl) => async (dispatch) => {
  const res = await csrfFetch(`/api/groups/${groupId}/images`, {
    method: "POST",
    body: JSON.stringify(imgUrl),
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
    // dispatch(addImage(data));
    return data;
  }
};

const groupsReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_GROUPS:
      return { ...state, ...action.groups };
    case LOAD_DETAILS:
    // return {
    //   ...state,
    //   [action.group.id]: { ...state[action.group.id], ...action.group },
    // };
    case ADD_GROUP:
      return {
        ...state,
        [action.group.id]: { ...state[action.group.id], ...action.group },
      };
    case REMOVE_GROUP:
      const newState = { ...state };
      delete newState[action.groupId];
      return newState;
    default:
      return state;
  }
};

export default groupsReducer;
