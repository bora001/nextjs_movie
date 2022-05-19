const initialState = {
  movieList: null,
};

// Creating my reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case "setList":
      return { ...state, movieList: action.payload };

    default:
      return state;
  }
}
