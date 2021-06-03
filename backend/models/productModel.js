import monggose from "mongoose";
import moment from "moment-timezone";

const timestamp = new Date();
timestamp.setHours(timestamp.getHours() + 7);
const today = moment.utc(timestamp).tz("Asia/Jakarta");

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
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    description: {
      type: String,
      required: true,
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
