export const movieAction = (info) => (dispatch) => {
  return dispatch({
    type: "setList",
    payload: info,
  });
};
