import { csrfFetch } from "./csrf";

const LOAD_GROUPS = "groups/LOAD_GROUPS";
const LOAD_DETAILS = "groups/LOAD_DETAILS";

const loadGroups = (groups) => ({
  type: LOAD_GROUPS,
  groups,
});

const loadDetails = (group) => ({
  type: LOAD_DETAILS,
  group,
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

const groupsReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_GROUPS:
      return { ...state, ...action.groups };
    case LOAD_DETAILS:
      return {
        ...state,
        [action.group.id]: { ...state[action.group.id], ...action.group },
      };
    default:
      return state;
  }
};

export default groupsReducer;
