import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Row,
  Col,
  ListGroup,
  Card,
  Image,
  Spinner,
} from "react-bootstrap";
import { PayPalButton } from "react-paypal-button-v2";

import Loader from "../components/Loader";
import Message from "../components/Message";
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
  ORDER_DETAILS_RESET,
} from "../constants/orderConstants";
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
  payOrderMidtrans,
  updatePayOrderMidtrans,
} from "../actions/orderActions";

const OrderScreen = ({ history, match }) => {
  const dispatch = useDispatch();
  const orderId = match.params.id;
  const [sdkReady, setSdkReady] = useState(false);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const orderDetails = useSelector((state) => state.orderDetails);
  const { orderItems: order, loading, error, success } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderMidtrans = useSelector((state) => state.orderMidtrans);
  const {
    loading: loadingPayMidtrans,
    success: successPayMidtrans,
    order: orderPayMidtrans,
  } = orderMidtrans;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  const addDecimals = (num) => {
    return Math.round(num * 100) / 100;
  };

  if (!loading) {
    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
  }

  useEffect(() => {
    if (!userInfo) {
      return history.push("/login");
    }
    if (!order || order._id !== orderId) {
      dispatch(getOrderDetails(orderId));
    }
    // eslint-disable-next-line
  }, [order, orderId, userInfo, history]);

  useEffect(() => {
    if (!order || successPay || successDeliver) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch({ type: ORDER_DETAILS_RESET });
      dispatch(getOrderDetails(orderId));
    }
  }, [dispatch, order, orderId, successPay, successDeliver]);

  useEffect(() => {
    const ajaxGetToken = (transactionData, callback) => {
      var snapToken;
      // Request get token to your server & save result to snapToken variable
      snapToken = orderPayMidtrans.token;

      if (snapToken) {
        callback(null, snapToken);
      } else {
        callback(new Error("Failed to fetch snap token"), null);
      }
    };

    const snap = window.snap;
    console.log(snap);
    if (successPayMidtrans) {
      snap.show();
      ajaxGetToken(
        { "order_id": order._id, "gross_amount": 50000 },
        function (error, snapToken) {
          if (error) {
            snap.hide();
          } else {
            snap.pay(snapToken, {
              onSuccess: function (result) {
                console.log("success");
                console.log(result);
                return dispatch(updatePayOrderMidtrans(orderId, result));
              },
              onPending: function (result) {
                console.log("pending");
                console.log(result);
                return dispatch(updatePayOrderMidtrans(orderId, result));
              },
              onError: function (result) {
                console.log("error");
                console.log(result);
                return dispatch(updatePayOrderMidtrans(orderId, result));
              },
              onClose: function () {
                console.log(
                  "customer closed the popup without finishing the payment"
                );
              },
            });
          }
        }
      );
    }
  }, [successPayMidtrans, orderPayMidtrans, order, dispatch, orderId]);

  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult);
    dispatch(payOrder(orderId, paymentResult));
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(orderId));
  };

  const midtransHandler = () => {
    // window.snap.pay('')
    dispatch(payOrderMidtrans(orderId));
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

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      {/* {successPay && <Redirect to={window.location.href} />} */}
      <h2>ORDER {order._id}</h2>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong>
                {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                {order.user.email}
              </p>
              <p>
                <strong>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.address}{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Deliver on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
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
                  {order.orderItems.map((item, index) => (
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
                          <Link to={`/products/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x Rp {item.price} = Rp{" "}
                          {item.qty * item.price}
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
                  <Col>{convertToRupiah(order.itemsPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>{convertToRupiah(order.shippingPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>{convertToRupiah(order.taxPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>{convertToRupiah(order.totalPrice)}</Col>
                </Row>
              </ListGroup.Item>
              {userInfo && !order.isPaid && (
                <ListGroup.Item>
                  <Button onClick={midtransHandler}>MIDTRANS PAY</Button>
                </ListGroup.Item>
              )}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block"
                      onClick={deliverHandler}
                    >
                      {loadingDeliver ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        "Mark as delivered"
                      )}
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
