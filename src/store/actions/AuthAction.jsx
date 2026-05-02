import { loginUser } from "../reducers/authSlice";

const loginAction = (email, password) => async (dispatch) => {
  return dispatch(loginUser({ email, password })).unwrap();
};

export { loginAction };
