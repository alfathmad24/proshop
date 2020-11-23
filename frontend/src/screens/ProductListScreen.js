import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Alert, Button, Col, Modal, Row, Table } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";

import Spinner from "../components/Spinner";
import Message from "../components/Message";
import { PRODUCT_CREATE_RESET } from "../constants/productConstants";
import {
    listProducts,
    removeProduct,
    createProduct,
} from "../actions/productActions";
import Paginations from "../components/Paginations";

const ProductListScreen = ({ history, match }) => {
    const dispatch = useDispatch();
    const pageNumber = match.params.pageNumber || 1;
    const [deleteModal, setDeleteModal] = useState(false);

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const productList = useSelector((state) => state.productList);
    const { loading, error, products, pages, page } = productList;

    const productRemove = useSelector((state) => state.productRemove);
    const { success: successRemove, loading: loadingDelete } = productRemove;

    const productCreate = useSelector((state) => state.productCreate);
    const {
        success: successCreate,
        error: errorCreate,
        loading: loadingCreate,
    } = productCreate;

    useEffect(() => {
        if (successCreate) {
            return dispatch({ type: PRODUCT_CREATE_RESET });
        }

        if (!userInfo || !userInfo.isAdmin) {
            return history.push("/login");
        }
        dispatch(listProducts("", pageNumber));
    }, [dispatch, successRemove, userInfo, history, successCreate, pageNumber]);

    const deleteHandler = () => {
        setDeleteModal(true);
    };

    const confirmDeleteHandler = (id) => {
        dispatch(removeProduct(id));
        setDeleteModal(false);
    };

    const createProductHandler = () => {
        dispatch(createProduct());
    };

    return (
        <>
            <Row className="align-items-center">
                <Col>
                    <h1>Products</h1>
                </Col>
                <Col className="text-right">
                    <Button className="my-3" onClick={createProductHandler}>
                        <i className="fas fa-plus"></i> Create Product
                    </Button>
                </Col>
            </Row>

            {loading ? (
                <Spinner />
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : (
                <Table striped bordered responsive className="table-sm">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>PRICE</th>
                            <th>CATEGORY</th>
                            <th>BRAND</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id}>
                                {/* MODAL */}
                                <Modal
                                    show={deleteModal}
                                    onHide={() => setDeleteModal(false)}
                                    size="sm"
                                    aria-labelledby="contained-modal-title-vcenter"
                                    centered
                                >
                                    <Modal.Header>
                                        <h4>Remove product?</h4>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <p>
                                            This product will be removed from
                                            your list.
                                        </p>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button
                                            onClick={() =>
                                                setDeleteModal(false)
                                            }
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() =>
                                                confirmDeleteHandler(
                                                    product._id
                                                )
                                            }
                                        >
                                            Remove User
                                        </Button>
                                    </Modal.Footer>
                                </Modal>

                                {/* END MODAL */}
                                <td>{product._id}</td>
                                <td>{product.name}</td>
                                <td>${product.price}</td>
                                <td>{product.category}</td>
                                <td>{product.brand}</td>
                                <td>
                                    <LinkContainer
                                        to={`/admin/product/${product._id}/edit`}
                                    >
                                        <Button
                                            variant="light"
                                            className="btn-sm"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </Button>
                                    </LinkContainer>
                                    <Button
                                        variant="danger"
                                        className="btn-sm"
                                        onClick={() =>
                                            deleteHandler(product._id)
                                        }
                                    >
                                        <i className="fas fa-trash"></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <Paginations pages={pages} page={page} isAdmin />
                </Table>
            )}
        </>
    );
};

export default ProductListScreen;
