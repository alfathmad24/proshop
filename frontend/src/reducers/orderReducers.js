import {
    ORDER_CREATE_REQUEST,
    ORDER_CREATE_SUCCESS,
    ORDER_CREATE_FAIL,
    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_FAIL,
    ORDER_PAY_REQUEST,
    ORDER_PAY_SUCCESS,
    ORDER_PAY_FAIL,
    ORDER_PAY_RESET,
    USER_ORDERS_REQUEST,
    USER_ORDERS_SUCCESS,
    USER_ORDERS_FAIL,
    USER_ORDERS_RESET,
    ORDER_LIST_REQUEST,
    ORDER_LIST_SUCCESS,
    ORDER_LIST_FAIL,
    ORDER_DELIVER_REQUEST,
    ORDER_DELIVER_SUCCESS,
    ORDER_DELIVER_FAIL,
    ORDER_DELIVER_RESET,
    ORDER_DETAILS_RESET,
    ORDER_CREATE_RESET,
} from "../constants/orderConstants";
import {
    USER_LIST_FAIL,
    USER_LIST_REQUEST,
    USER_LIST_SUCCESS,
} from "../constants/userConstants";

const orderCreateState = {};

const orderDetailsState = {
    orderItems: [],
    shippingAddress: {},
    loading: true,
};

const userOrdersState = {
    orders: [],
};

export const orderCreateReducer = (state = orderCreateState, action) => {
    switch (action.type) {
        case ORDER_CREATE_REQUEST:
            return {
                loading: true,
            };
        case ORDER_CREATE_SUCCESS:
            return {
                loading: false,
                success: true,
                order: action.payload,
            };
        case ORDER_CREATE_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        case ORDER_CREATE_RESET:
            return {};
        default:
            return state;
    }
};

export const orderDetailsReducer = (state = orderDetailsState, action) => {
    switch (action.type) {
        case ORDER_DETAILS_REQUEST:
            return {
                loading: true,
            };
        case ORDER_DETAILS_SUCCESS:
            return {
                loading: false,
                orderItems: action.payload,
            };
        case ORDER_DETAILS_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        case ORDER_DETAILS_RESET:
            return {};
        default:
            return state;
    }
};

export const orderPayReducer = (state = {}, action) => {
    switch (action.type) {
        case ORDER_PAY_REQUEST:
            return {
                loading: true,
            };
        case ORDER_PAY_SUCCESS:
            return {
                loading: false,
                order: action.payload,
                success: true,
            };
        case ORDER_PAY_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        case ORDER_PAY_RESET:
            return {};
        default:
            return state;
    }
};

export const ordersUserReducer = (state = userOrdersState, action) => {
    switch (action.type) {
        case USER_ORDERS_REQUEST:
            return {
                loading: true,
            };
        case USER_ORDERS_SUCCESS:
            return {
                loading: false,
                orders: action.payload,
            };
        case USER_ORDERS_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        case USER_ORDERS_RESET:
            return {
                orders: [],
            };
        default:
            return state;
    }
};

export const ordersListReducer = (state = { orders: [] }, action) => {
    switch (action.type) {
        case ORDER_LIST_REQUEST:
            return {
                loading: true,
            };
        case ORDER_LIST_SUCCESS:
            return {
                loading: false,
                orders: action.payload,
            };
        case ORDER_LIST_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export const orderDeliveredReducer = (state = {}, action) => {
    switch (action.type) {
        case ORDER_DELIVER_REQUEST:
            return {
                loading: true,
            };
        case ORDER_DELIVER_SUCCESS:
            return {
                loading: false,
                order: action.payload,
            };
        case ORDER_DELIVER_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        case ORDER_DELIVER_RESET:
            return {};
        default:
            return state;
    }
};
