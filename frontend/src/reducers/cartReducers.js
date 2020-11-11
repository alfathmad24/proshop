import {
    CART_ADD_ITEM,
    CART_REMOVE_ITEM,
    CART_ADD_SUCCESS,
    CART_UPDATE_ITEM,
} from "../constants/cartConstants";

export const initialState = {
    cartItems: [],
    success: true,
    loadingAdded: false,
};

export const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case CART_ADD_ITEM:
            const item = action.payload;
            const existItem = state.cartItems.find(
                (x) => x.product === item.product
            );
            if (existItem) {
                const updatedItem = {
                    ...existItem,
                    qty: existItem.qty + item.qty,
                };
                return {
                    ...state,
                    cartItems: state.cartItems.map((x) =>
                        x.product === existItem.product ? updatedItem : x
                    ),
                    loadingAdded: true,
                };
            } else {
                return {
                    ...state,
                    cartItems: [...state.cartItems, item],
                    loadingAdded: true,
                };
            }
        case CART_UPDATE_ITEM:
            const itemProduct = action.payload;
            const itemUpdateQty = state.cartItems.find(
                (x) => x.product === itemProduct.product
            );
            const updatedQty = {
                ...itemUpdateQty,
                qty: itemProduct.qty,
            };
            return {
                ...state,
                cartItems: state.cartItems.map(
                    (x) => x.product === itemUpdateQty.product && updatedQty
                ),
            };
        case CART_ADD_SUCCESS:
            return {
                ...state,
                success: true,
                loadingAdded: false,
            };
        case CART_REMOVE_ITEM:
            return {
                ...state,
                cartItems: state.cartItems.filter(
                    (item) => item.product !== action.payload
                ),
            };
        default:
            return state;
    }
};

// export const cartReducer = (state = initialState, action) => {
//     switch (action.type) {
//         case CART_ADD_ITEM:
//             const item = action.payload;
//             const existItem = state.cartItems.find(
//                 (x) => x.product === item.product
//             );
//             if (existItem) {
//                 return {
//                     ...state,
//                     cartItems: state.cartItems.map((x) =>
//                         x.product === existItem.product ? item : x
//                     ),
//                 };
//             } else {
//                 return {
//                     ...state,
//                     cartItems: [...state.cartItems, item],
//                 };
//             }
//         case CART_REMOVE_ITEM:
//             return {
//                 ...state,
//                 cartItems: state.cartItems.filter(
//                     (item) => item.product !== action.payload
//                 ),
//             };
//         default:
//             return state;
//     }
// };
