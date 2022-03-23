import { combineReducers } from "redux";
import FriendsOverviewReducer from "./friends/slice.js";

const rootReducer = combineReducers({
    friends: FriendsOverviewReducer,
});

export default rootReducer;
