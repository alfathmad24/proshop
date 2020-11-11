import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
    Row,
    Col,
    Image,
    ListGroup,
    Card,
    Button,
    Form,
    Modal,
    Container,
    Spinner,
} from "react-bootstrap";

import { listProductDetails } from "../actions/productActions";
import { addToCart } from "../actions/cartActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Rating from "../components/Rating";

const ProductScreen = ({ history, match }) => {
    const [qty, setQty] = useState(0);
    const [lgShow, setLgShow] = useState(false);

    const dispatch = useDispatch();

    const productDetails = useSelector((state) => state.productDetails);
    const cart = useSelector((state) => state.cart);

    const { loadingAdded, cartItems } = cart;

    const { loading, error, product } = productDetails;

    useEffect(() => {
        dispatch(listProductDetails(match.params.id));
    }, [dispatch, match]);

    const addToCartHandler = async () => {
        // history.push(`/cart/${match.params.id}?qty=${qty === 0 ? 1 : qty}`);

        const cartItem = cartItems.find((item) => item.product === product._id);

        if (cartItems.length >= 1 && cartItem.qty >= product.countInStock) {
            alert("not more!");
            return;
        }
        dispatch(addToCart(product._id, qty === 0 ? 1 : qty));

        if (!loadingAdded) {
            setLgShow(true);
        }
    };

    return (
        <>
            {/* MODAL */}
            <Modal
                size="lg"
                show={lgShow}
                onHide={() => setLgShow(false)}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        Added To Cart
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row>
                            <Col md={2}>
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fluid
                                />
                            </Col>
                            <Col md={7}>
                                <p>{product.name}</p>
                            </Col>
                            <Col md={3}>
                                <Link className="btn btn-dark my-3" to="/cart">
                                    Go to cart
                                </Link>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
            </Modal>

            <Link className="btn btn-dark my-3" to="/">
                Go Back
            </Link>

            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : (
                <Row>
                    <Col md={6}>
                        <Image src={product.image} alt={product.name} fluid />
                    </Col>
                    <Col md={3}>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h3>{product.name}</h3>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Rating
                                    value={product.rating}
                                    text={`${product.numReviews} reviews`}
                                />
                            </ListGroup.Item>
                            <ListGroup.Item>
                                Price: ${product.price}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                Description: {product.description}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col md={3}>
                        <Card>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Price:</Col>
                                        <Col>
                                            <strong>${product.price}</strong>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col>Status:</Col>
                                        <Col>
                                            {product.countInStock > 0
                                                ? "In Stock"
                                                : "Out Of Stock"}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>

                                {product.countInStock > 0 && (
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Qty</Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    value={qty}
                                                    size="sm"
                                                    onChange={(e) =>
                                                        setQty(e.target.value)
                                                    }
                                                >
                                                    {[
                                                        ...Array(
                                                            product.countInStock
                                                        ).keys(),
                                                    ].map((x) => (
                                                        <option
                                                            key={x + 1}
                                                            value={x + 1}
                                                        >
                                                            {x + 1}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                )}

                                <ListGroup.Item>
                                    <Button
                                        onClick={addToCartHandler}
                                        className="btn-block"
                                        type="button"
                                        disabled={product.countInStock === 0}
                                    >
                                        {loadingAdded ? (
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                            />
                                        ) : (
                                            "Add To Cart"
                                        )}
                                    </Button>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            )}
        </>
    );
};

export default ProductScreen;
