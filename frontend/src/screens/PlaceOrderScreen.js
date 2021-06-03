import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Row,
  Col,
  ListGroup,
  Card,
  Image,
  Spinner,
  Modal,
  Container,
} from "react-bootstrap";

import Message from "../components/Message";
import CheckoutSteps from "../components/CheckoutSteps";
import { createOrder } from "../actions/orderActions";

const PlaceOrderScreen = ({ history }) => {
  const dispatch = useDispatch();
  // MODAL
  const [lgShow, setLgShow] = useState(false);

  const cart = useSelector((state) => state.cart);

  const { order, loading, error, success } = useSelector(
    (state) => state.orderCreate
  );

  useEffect(() => {
    if (success) {
      setLgShow(true);
      return history.push(`/order/${order._id}`);
    }
    // eslint-disable-next-line
  }, [success, history]);

  const addDecimals = (num) => {
    return Math.round(num * 100) / 100;
  };

  cart.itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 100);

  cart.taxPrice = addDecimals(Number(0.05 * cart.itemsPrice));

  cart.totalPrice =
    Number(cart.itemsPrice) +
    Number(cart.taxPrice) +
    Number(cart.shippingPrice);

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      })
    );
  };

  function convertToRupiah(angka) {
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
          <Modal.Title id="example-modal-sizes-title-lg">Success!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>Your order has been placed. Please make</Container>
        </Modal.Body>
      </Modal>
      {/* END MODAL */}

      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address: </strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.address}{" "}
                {cart.shippingAddress.postalCode},{" "}
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
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
                <ListGroup variant="flush">
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/Rp {item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x {convertToRupiah(item.price)} =
                          {convertToRupiah(item.qty * item.price)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>{convertToRupiah(cart.itemsPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>{convertToRupiah(cart.shippingPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>
                    Tax <strong>5%</strong>
                  </Col>
                  <Col>{convertToRupiah(cart.taxPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>{convertToRupiah(cart.totalPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && <Message variant="danger">{error}</Message>}
              </ListGroup.Item>
              <Button
                type="button"
                className="btn-block"
                disabled={cart.cartItems === 0 || loading}
                onClick={placeOrderHandler}
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />{" "}
                    Processing
                  </>
                ) : (
                  "Place Order"
                )}
              </Button>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
