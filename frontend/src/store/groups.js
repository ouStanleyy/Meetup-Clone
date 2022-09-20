import { csrfFetch } from "./csrf";

const LOAD_GROUPS = "groups/LOAD_GROUPS";

const loadGroups = (groups) => ({
  type: LOAD_GROUPS,
  groups,
});

export const getGroups = () => async (dispatch) => {
  const res = await csrfFetch("/api/groups");
  const data = await res.json();

  if (res.ok) {
    const normalizedData = {};
    data.forEach((group) => (normalizedData[group.id] = group));
    dispatch(loadGroups(normalizedData));
  }

  return data;
};

const groupsReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_GROUPS:
      return action.groups;
    default:
      return state;
  }
};

export default groupsReducer;
