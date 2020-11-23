import React from "react";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";

import Rating from "./Rating";

const Product = ({ product }) => {
    return (
        <Link to={`/product/${product._id}`}>
            <Card className="my-3 p-3 rounded ">
                <Card.Img src={product.image} variant="top" />

                <Card.Body>
                    <Card.Title as="div">
                        <strong>{product.name}</strong>
                    </Card.Title>
                    <Card.Text as="div">
                        <div className="my-3">
                            <Rating
                                value={product.rating}
                                text={`${product.numReviews} reviews`}
                            />
                        </div>
                    </Card.Text>
                    <Card.Text as="h3">${product.price}</Card.Text>
                </Card.Body>
            </Card>
        </Link>
    );
};

export default Product;
