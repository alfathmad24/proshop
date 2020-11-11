import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

// REDUCERS
import {
    productListReducer,
    productDetailsReducer,
} from "./reducers/productReducers";
import { cartReducer, initialState } from "./reducers/cartReducers";
import {
    userLoginReducers,
    userRegisterReducers,
    userDetailsReducers,
    userUpdateProfileReducer,
} from "./reducers/userReducers";

const reducer = combineReducers({
    productList: productListReducer,
    productDetails: productDetailsReducer,
    cart: cartReducer,
    userLogin: userLoginReducers,
    userRegister: userRegisterReducers,
    userDetails: userDetailsReducers,
    userUpdate: userUpdateProfileReducer,
});

const cartItemsFromStorage = localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [];

const userInfoFromStorage = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

const cartState = {
    cart: {
        cartItems: cartItemsFromStorage,
        success: initialState.success,
        loadingAdded: initialState.loadingAdded,
    },
    userLogin: { userInfo: userInfoFromStorage },
};

const middleware = [thunk];

const store = createStore(
    reducer,
    cartState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
