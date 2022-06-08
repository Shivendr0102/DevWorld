import { applyMiddleware } from "redux";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
import reducer from "./reducers";

const initialState = {};

const middleWare = [thunk];

// const reducer = combineReducers();

const store = configureStore(
  reducer(),
  initialState,
  composeWithDevTools(applyMiddleware(...middleWare))
);

export default store;
