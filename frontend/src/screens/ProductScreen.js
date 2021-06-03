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
  Alert,
} from "react-bootstrap";

import { listProductDetails, addReivew } from "../actions/productActions";
import { addToCart } from "../actions/cartActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Rating from "../components/Rating";
import { PRODUCT_ADD_REVIEW_RESET } from "../constants/productConstants";
import Meta from "../components/Meta";

const ProductScreen = ({ history, match }) => {
  // MODAL
  const [lgShow, setLgShow] = useState(false);
  const [cartFullAlert, setCartFullAlert] = useState(false);
  // QUANTITY
  const [qty, setQty] = useState(1);
  const [itemInCart, setItemInCart] = useState(null);
  const [itemQtyInCart, setItemQtyInCart] = useState(null);
  // REVIEW
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const dispatch = useDispatch();

  const productReview = useSelector((state) => state.productReview);
  const {
    loading: loadingAddReview,
    error: errorAddReview,
    success: successAddReview,
  } = productReview;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const cart = useSelector((state) => state.cart);
  const { loadingAdded, cartItems } = cart;

  useEffect(() => {
    setItemQtyInCart(null);
    const cartItem = cartItems.find((item) => item.product === product._id);
    if (cartItem) {
      setItemInCart(cartItem);
      setItemQtyInCart(+cartItem.qty + +qty);
    }
  }, [cartItems, itemQtyInCart, qty, product]);

  useEffect(() => {
    if (successAddReview) {
      dispatch({ type: PRODUCT_ADD_REVIEW_RESET });
      setComment("");
    }
    dispatch(listProductDetails(match.params.id));
  }, [dispatch, match, successAddReview]);

  const addToCartHandler = () => {
    if (itemInCart) {
      if (itemQtyInCart > product.countInStock) {
        return setCartFullAlert(`Only ${product.countInStock} left. You already have ${itemInCart.qty} of
                this item in your cart`);
      }
    }

    dispatch(addToCart(product._id, qty === 0 ? 1 : qty));

    if (!loadingAdded) {
      setLgShow(true);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(addReivew(match.params.id, { rating, comment }));
  };

  function convertToRupiah(angka = "") {
    var rupiah = "";
    var angkarev = angka.toString().split("").reverse().join("");
    for (var i = 0; i < angkarev.length; i++)
      if (i % 3 === 0) rupiah += angkarev.substr(i, 3) + ".";
    return (
      "Rp " +
      rupiah
        .split("", rupiah.length - 1)
        .reverse()
        .join("")
    );
  }

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
                <Image src={product.image} alt={product.name} fluid />
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
      {/* ERROR FULL CART */}
      {cartFullAlert && (
        <Alert
          variant="danger"
          onClose={() => setCartFullAlert(false)}
          dismissible
        >
          {cartFullAlert}
        </Alert>
      )}

      {/* {cartFullAlert && setTimeout(() => setCartFullAlert(false), 3000)} */}

      <Link className="btn btn-dark my-3" to="/">
        Go Back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Meta title={product.name} />
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
                  {" "}
                  <strong>Price: </strong>
                  {convertToRupiah(product.price)}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Description:</strong>
                  <br />
                  {product.description}
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
                        <strong>{convertToRupiah(product.price)}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.countInStock > 0 ? "In Stock" : "Out Of Stock"}
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
                            onChange={(e) => setQty(e.target.value)}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
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
          {/* <Row>
            <Col md={6}>
              <h2>Reviews</h2>
              {product.reviews.length === 0 && <Message>No Reviews</Message>}
              <ListGroup variant="flush">
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h2>Write a Customer Review</h2>
                  {successAddReview && (
                    <Message>Success add review to the product</Message>
                  )}
                  {errorAddReview && (
                    <Message variant="danger">{errorAddReview}</Message>
                  )}
                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId="rating">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as="select"
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value="">Select...</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very Good</option>
                          <option value="5">5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId="comment">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as="textarea"
                          row="3"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button type="submit" variant="primary">
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Please <Link to="/login"> sign in </Link> to write a
                      review
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row> */}
        </>
      )}
    </>
  );
};

export default ProductScreen;
