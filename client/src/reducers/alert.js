import { SET_ALERT, REMOVE_ALERT } from "../actions/types";

const initialState = [
  // {
  //     id : 1,
  //     msg : 'please log in',
  // }
];

export default function (state = initialState, action) {
  // const { type } = action.type;
  console.log(action);
  // console.log(
  //   "Here is the action.type : ",
  //   action.type,
  //   action.payload,
  //   action.id
  // );
  // switch (type) {
  //   case SET_ALERT:
  //     return [...state, action.payload];

  //   case REMOVE_ALERT:
  //     return state.filter((alert) => alert.id !== action.payload);
  //   default:
  //     console.log("Here is the action.type in default case : ", type);
  //     return state;
  // }
  if (SET_ALERT === action) {
    return [...state, action.payload];
  } else if (REMOVE_ALERT === action) {
    return state.filter((alert) => alert.id !== action.payload);
  } else {
    console.log("Here is the action.type in default case : ", action);
    return state;
  }
}
