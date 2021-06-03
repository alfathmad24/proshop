import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

// REDUCERS
import {
    productListReducer,
    productDetailsReducer,
    productRemoveReducer,
    productCreateReducer,
    productUpdateReducer,
    productAddReviewReducer,
    productsTopRatedReducer,
} from "./reducers/productReducers";
import { cartReducer } from "./reducers/cartReducers";
import {
    userLoginReducers,
    userRegisterReducers,
    userDetailsReducers,
    userUpdateProfileReducer,
    userListReducer,
    userRemoveReducer,
    userUpdateReducer,
} from "./reducers/userReducers";

import {
    orderCreateReducer,
    orderDetailsReducer,
    orderPayReducer,
    ordersUserReducer,
    ordersListReducer,
    orderDeliveredReducer,
    orderPayMidtransReducer,
    updateOrderPayMidtransReducer,
} from "./reducers/orderReducers";

const reducer = combineReducers({
    productList: productListReducer,
    productDetails: productDetailsReducer,
    cart: cartReducer,
    userLogin: userLoginReducers,
    userRegister: userRegisterReducers,
    userDetails: userDetailsReducers,
    userUpdateProfile: userUpdateProfileReducer,
    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    orderPay: orderPayReducer,
    userOrders: ordersUserReducer,
    usersList: userListReducer,
    userRemove: userRemoveReducer,
    userUpdate: userUpdateReducer,
    productRemove: productRemoveReducer,
    productCreate: productCreateReducer,
    productUpdate: productUpdateReducer,
    orderList: ordersListReducer,
    orderDeliver: orderDeliveredReducer,
    productReview: productAddReviewReducer,
    productsTopRated: productsTopRatedReducer,
    orderMidtrans: orderPayMidtransReducer,
    updateOrderMidtrans: updateOrderPayMidtransReducer,
});

const cartItemsFromStorage = localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [];

const userInfoFromStorage = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

const shippingAddressFromStorage = localStorage.getItem("shippingAddress")
    ? JSON.parse(localStorage.getItem("shippingAddress"))
    : {};

const cartState = {
    cart: {
        cartItems: cartItemsFromStorage,
        // success: initialState.success,
        // loadingAdded: initialState.loadingAdded,
        shippingAddress: shippingAddressFromStorage,
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
