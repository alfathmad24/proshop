import React from "react";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";

import Rating from "./Rating";

const Product = ({ product }) => {
  function convertToRupiah(angka) {
    var rupiah = "";
    var angkarev = angka.toString().split("").reverse().join("");
    for (var i = 0; i < angkarev.length; i++)
      if (i % 3 == 0) rupiah += angkarev.substr(i, 3) + ".";
    return (
      "Rp. " +
      rupiah
        .split("", rupiah.length - 1)
        .reverse()
        .join("")
    );
  }

  return (
    <Link to={`/product/${product._id}`}>
      <Card className="my-3 p-3 rounded ">
        <Card.Img src={product.image} variant="top" />

        <Card.Body>
          <Card.Title as="div">
            <strong>{product.name}</strong>
          </Card.Title>
          {/* <Card.Text as="div">
                        <div className="my-3">
                            <Rating
                                value={product.rating}
                                text={`${product.numReviews} reviews`}
                            />
                        </div>
                    </Card.Text> */}
          <Card.Text as="p">
            <strong>{convertToRupiah(product.price)}</strong>
          </Card.Text>
        </Card.Body>
      </Card>
    </Link>
  );
};

export default Product;
