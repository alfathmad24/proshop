import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    Row,
    Col,
    ListGroup,
    Image,
    Form,
    Button,
    Card,
    Modal,
} from "react-bootstrap";

// import Message from "../components/Message";
import { removeFromCart, updatedCartItem } from "../actions/cartActions";

const CartScreen = ({ match, location, history }) => {
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteProduct, setDeleteProduct] = useState();
    const dispatch = useDispatch();

    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;

    const checkoutHandler = () => {
        history.push("/login?redirect=shipping");
    };

    const showDeleteModalHandler = (id) => {
        setDeleteModal(true);
        setDeleteProduct(id);
    };

    const confirmDeleteHandler = () => {
        dispatch(removeFromCart(deleteProduct));
        setDeleteModal(false);
    };

    return (
        <>
            {/* MODAL */}
            <Modal
                show={deleteModal}
                onHide={() => setDeleteModal(false)}
                size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <h4>Remove an item?</h4>
                </Modal.Header>
                <Modal.Body>
                    <p>This item will be removed from your cart.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => confirmDeleteHandler()}
                    >
                        Remove Item
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* END MODAL */}
            {cartItems.length === 0 ? (
                <Card
                    className="text-center"
                    style={{ width: "20rem", margin: "auto" }}
                >
                    <Card.Body>
                        <Card.Title>Your cart is empty</Card.Title>
                        <Card.Text>Make your dreams come true now!</Card.Text>
                        {/* <Button variant="primary">Shop Now</Button> */}
                        <Link className="btn btn-dark my-3" to="/">
                            Shop Now
                        </Link>
                    </Card.Body>
                </Card>
            ) : (
                <Row>
                    <Col md={8}>
                        <h1>Shopping Cart</h1>

                        <ListGroup variant="flush">
                            {cartItems.map((item) => (
                                <ListGroup.Item key={item.product}>
                                    <Row>
                                        <Col md={2}>
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fluid
                                                rounded
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <Link
                                                to={`/product/${item.product}`}
                                            >
                                                {item.name}
                                            </Link>
                                        </Col>
                                        <Col md={2}>${item.price}</Col>
                                        <Col md={2}>
                                            <Form.Control
                                                as="select"
                                                value={item.qty}
                                                size="sm"
                                                onChange={(e) =>
                                                    dispatch(
                                                        updatedCartItem(
                                                            item.product,
                                                            e.target.value
                                                        )
                                                    )
                                                }
                                            >
                                                {[
                                                    ...Array(
                                                        item.countInStock
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
                                        <Col md={2}>
                                            <Button
                                                type="button"
                                                variant="light"
                                                onClick={() =>
                                                    showDeleteModalHandler(
                                                        item.product
                                                    )
                                                }
                                            >
                                                <i className="fas fa-trash"></i>
                                            </Button>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Col>
                    <Col md={4}>
                        <Card>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <h2>
                                        {" "}
                                        Subtotal (
                                        {cartItems.reduce(
                                            (acc, item) => acc + item.qty,
                                            0
                                        )}
                                        ) items
                                    </h2>
                                    <p>
                                        $
                                        {cartItems
                                            .reduce(
                                                (acc, item) =>
                                                    acc + item.qty * item.price,
                                                0
                                            )
                                            .toFixed(2)}
                                    </p>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Button
                                        type="button"
                                        className="btn-block"
                                        disabled={cartItems.length === 0}
                                        onClick={checkoutHandler}
                                    >
                                        Procced to checkout
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

export default CartScreen;
