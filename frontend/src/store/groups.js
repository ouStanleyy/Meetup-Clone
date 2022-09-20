import { csrfFetch } from "./csrf";

const LOAD_GROUPS = "groups/LOAD_GROUPS";

const loadGroups = (groups) => ({
  type: LOAD_GROUPS,
  user,
});

export const getGroups = () => async (dispatch) => {
  const res = await csrfFetch("/api/groups");
  const data = await res.json();

  if (res.ok) dispatch(loadGroups(data));
  return data;
};

const groupsReducer = (state = { user: null }, action) => {
  switch (action.type) {
    case SET_SESSION:
      return { ...state, user: { ...action.user } };
    case REMOVE_SESSION:
      return { ...state, user: null };
    default:
      return state;
  }
};

export default groupsReducer;
