import React, { useState, useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import {
    Navbar,
    Nav,
    Container,
    Badge,
    NavDropdown,
    Modal,
    Button,
} from "react-bootstrap";

import SearchBox from "./SearchBox";
import { logout } from "../actions/userActions";

const Header = () => {
    const [logoutModal, setLogoutModal] = useState(false);
    const [orderIncomplete, setOrderInComplete] = useState();

    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const orderList = useSelector((state) => state.orderList);
    const { orders } = orderList;

    const dispatch = useDispatch();

    useEffect(() => {
        if (orders) {
            const ordersAvailable = orders.filter(
                (order) => order.isDelivered === false
            );
            setOrderInComplete(ordersAvailable.length);
        }
    }, [orders]);

    const logoutHandler = () => {
        setLogoutModal(true);
    };

    const confirmLogout = () => {
        setLogoutModal(false);
        dispatch(logout());
    };

    return (
        <header>
            {!userInfo && <Redirect to="/login" />}
            {/* MODAL */}
            <Modal
                show={logoutModal}
                onHide={() => setLogoutModal(false)}
                size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <h4>Logout?</h4>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure to end session?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setLogoutModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={() => confirmLogout()}>
                        Logout
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* END MODAL */}
            <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
                <Container>
                    <LinkContainer to="/">
                        <Navbar.Brand>ProShop</Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Route
                            render={({ history }) => (
                                <SearchBox history={history} />
                            )}
                        />
                        <Nav className="ml-auto">
                            <LinkContainer to="/cart">
                                <Nav.Link>
                                    <i className="fas fa-shopping-cart"></i>Cart
                                    {cartItems.length > 0 ? (
                                        <Badge pill variant="light">
                                            {cartItems.reduce(
                                                (acc, item) => acc + item.qty,
                                                0
                                            )}
                                        </Badge>
                                    ) : null}
                                </Nav.Link>
                            </LinkContainer>
                            {userInfo ? (
                                <NavDropdown
                                    title={userInfo.name}
                                    id="username"
                                >
                                    {userInfo.isAdmin && (
                                        <>
                                            <LinkContainer to="/admin/userlist">
                                                <NavDropdown.Item>
                                                    All Users
                                                </NavDropdown.Item>
                                            </LinkContainer>
                                            <LinkContainer to="/admin/productlist">
                                                <NavDropdown.Item>
                                                    All Products{" "}
                                                </NavDropdown.Item>
                                            </LinkContainer>
                                            <LinkContainer to="/admin/orderlist">
                                                <NavDropdown.Item>
                                                    All Orders {""}
                                                    <Badge variant="dark">
                                                        {orderIncomplete}
                                                    </Badge>
                                                </NavDropdown.Item>
                                            </LinkContainer>
                                        </>
                                    )}
                                    <LinkContainer to="/profile">
                                        <NavDropdown.Item>
                                            Profile
                                        </NavDropdown.Item>
                                    </LinkContainer>
                                    <NavDropdown.Item onClick={logoutHandler}>
                                        Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <LinkContainer to="/login">
                                    <Nav.Link>
                                        <i className="fas fa-user"></i> Sign in
                                    </Nav.Link>
                                </LinkContainer>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
};

export default Header;
