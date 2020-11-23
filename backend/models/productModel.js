import monggose from "mongoose";
import moment from "moment-timezone";

const timestamp = new Date();
timestamp.setHours(timestamp.getHours() + 7);
const today = moment.utc(timestamp).tz("Asia/Jakarta");

const reviewSchema = monggose.Schema(
    {
        name: { type: String, requried: true },
        rating: { type: Number, requried: true },
        comment: { type: String, requried: true },
        user: {
            type: monggose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
    },
    {
        timestamps: {
            currentTime: () => today,
        },
    }
);

const productSchema = monggose.Schema(
    {
        user: {
            type: monggose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        brand: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        reviews: [reviewSchema],
        rating: {
            type: Number,
            required: true,
            default: 0,
        },
        numReviews: {
            type: Number,
            required: true,
            default: 0,
        },
        price: {
            type: Number,
            required: true,
            default: 0,
        },
        countInStock: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    {
        timestamps: { currentTime: () => today },
    }
);

const Product = monggose.model("Product", productSchema);

export default Product;
