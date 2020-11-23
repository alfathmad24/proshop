import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Alert, Button, Modal, Table } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";

import Spinner from "../components/Spinner";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { getAllUsers, userRemove } from "../actions/userActions";

const UserListScreen = ({ history }) => {
    const dispatch = useDispatch();
    const [deleteModal, setDeleteModal] = useState(false);
    const [closeMessage, setCloseMessage] = useState(false);

    const usersList = useSelector((state) => state.usersList);
    const { loading, error, users } = usersList;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const deleteUser = useSelector((state) => state.userRemove);
    const {
        loading: loadingDeleteUser,
        error: errorDeleteUser,
        success: successDeleteUser,
    } = deleteUser;

    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) {
            return history.push("/login");
        }
        dispatch(getAllUsers());
    }, [dispatch, successDeleteUser, userInfo, history]);

    const deleteHandler = () => {
        setDeleteModal(true);
    };

    const confirmDeleteHandler = (id) => {
        dispatch(userRemove(id));
        setDeleteModal(false);
        setCloseMessage(true);
    };

    return (
        <>
            <h1>Users</h1>
            {successDeleteUser && closeMessage && (
                <Alert
                    variant="success"
                    onClose={() => setCloseMessage(false)}
                    dismissible
                >
                    User successfully deleted
                </Alert>
            )}
            {errorDeleteUser && closeMessage && (
                <Alert
                    variant="danger"
                    onClose={() => setCloseMessage(false)}
                    dismissible
                >
                    Error deleted user!
                </Alert>
            )}
            {loading || loadingDeleteUser ? (
                <Spinner />
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : (
                <Table striped bordered responsive className="table-sm">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>EMAIL</th>
                            <th>ADMIN</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                {/* MODAL */}
                                <Modal
                                    show={deleteModal}
                                    onHide={() => setDeleteModal(false)}
                                    size="sm"
                                    aria-labelledby="contained-modal-title-vcenter"
                                    centered
                                >
                                    <Modal.Header>
                                        <h4>Remove user?</h4>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <p>
                                            This user will be removed from your
                                            database.
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
                                                confirmDeleteHandler(user._id)
                                            }
                                        >
                                            Remove User
                                        </Button>
                                    </Modal.Footer>
                                </Modal>

                                {/* END MODAL */}
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    {user.isAdmin ? (
                                        <i
                                            className="fas fa-check"
                                            style={{ color: "green" }}
                                        ></i>
                                    ) : (
                                        <i
                                            className="fas fa-times"
                                            style={{ color: "red" }}
                                        ></i>
                                    )}
                                </td>
                                <td>
                                    <LinkContainer
                                        to={`/admin/user/${user._id}/edit`}
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
                                        onClick={() => deleteHandler(user._id)}
                                    >
                                        <i className="fas fa-trash"></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </>
    );
};

export default UserListScreen;
