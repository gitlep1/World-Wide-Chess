import "./SignUp.scss";
import { useState, useEffect } from "react";
import { Form, Button, Modal, Image } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import Logo from "../../../Images/Logo.png";
import defaultProfImg from "../../../Images/DefaultProfImg.png";

import GetApi from "../../../CustomFunctions/GetApi";

const Signup = ({ handleUser, showSignUp, handleClose }) => {
  const API = process.env.REACT_APP_API_URL;
  const [getData, cancelRequests] = GetApi();
  const [users, setUsers] = useState([]);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    getUsers();
  }, []); // eslint-disable-line

  const getUsers = async () => {
    await getData(`${API}/users`, setUsers);

    return cancelRequests;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") {
      setUsername(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "passwordConfirm") {
      setPasswordConfirm(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUser = {
      username: username,
      password: password,
      email: email,
      profileimg: defaultProfImg,
    };

    if (newUser.username.length > 12) {
      return toast.error(
        `Your current username:(${newUser.username}) is ${newUser.username.length} characters long. \n The max chracter length allowed is 12.`,
        {
          position: "top-right",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          pauseOnFocusLoss: false,
          draggable: true,
          progress: undefined,
        }
      );
    }

    if (
      newUser.username === "" ||
      newUser.password === "" ||
      newUser.email === ""
    ) {
      return toast.error("Please make sure to fill out all fields.", {
        position: "top-center",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        pauseOnFocusLoss: false,
        draggable: true,
        progress: undefined,
      });
    }

    if (passwordConfirm !== password) {
      return toast.error("Passwords do not match", {
        position: "top-right",
        pauseOnFocusLoss: false,
        closeOnClick: true,
        pauseOnHover: false,
      });
    }

    const checkUser = users.filter(
      (user) => user.email === email || user.username === username
    );

    if (checkUser.length > 0) {
      return toast.error("Email or Username already exists!", {
        position: "top-right",
        pauseOnFocusLoss: false,
        closeOnClick: true,
        pauseOnHover: false,
      });
    } else {
      await axios
        .post(`${API}/users`, newUser)
        .then((res) => {
          notify(res.data);
        })
        .catch((err) => {
          setError(err);
          notify();
        });
    }
  };

  const notify = (newUser) => {
    error !== ""
      ? toast.error("There has been an unexpected error", {
          position: "top-center",
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          pauseOnFocusLoss: false,
          draggable: true,
          progress: undefined,
        })
      : toast.success(
          "User account has been created. You have automatially been signed in. \n You will be redirected in 3 seconds.",
          {
            position: "top-center",
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            pauseOnFocusLoss: false,
            draggable: true,
            progress: undefined,
          }
        );
    setTimeout(() => {
      handleUser(newUser);
    }, 4100);
    clearFields();
  };

  const clearFields = () => {
    setUsername("");
    setPassword("");
    setEmail("");
    setPasswordConfirm("");
  };

  return (
    <section className="SignupSection">
      <Modal
        show={showSignUp}
        onHide={handleClose}
        centered
        className="landing-modal-container"
      >
        <Modal.Title className="landing-modal-title-signup">
          <h3
            className="closeButton"
            onClick={() => {
              handleClose();
              clearFields();
            }}
          >
            X
          </h3>
          <Image src={Logo} alt="Logo" id="logoImgModal" />
          <h6>World Wide Chess</h6>
          <h1>Sign Up</h1>
        </Modal.Title>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <h3 className="landing-modal-form-label">Username</h3>
            <Form.Group controlId="formBasicUsername">
              <Form.Control
                type="text"
                name="username"
                placeholder="Username"
                onChange={handleChange}
                value={username}
                className="landing-modal-form-control"
              />
            </Form.Group>
            <h3 className="landing-modal-form-label">Email</h3>
            <Form.Group controlId="formBasicEmail">
              <Form.Control
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                value={email}
                className="landing-modal-form-control"
              />
            </Form.Group>
            <h3 className="landing-modal-form-label">Password</h3>
            <Form.Group controlId="formBasicPassword">
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                value={password}
                className="landing-modal-form-control"
              />
            </Form.Group>
            <h3 className="landing-modal-form-label">Password Confirmation</h3>
            <Form.Group controlId="formPasswordConfirm">
              <Form.Control
                type="password"
                name="passwordConfirm"
                placeholder="Password Confirmation"
                onChange={handleChange}
                value={passwordConfirm}
                className="landing-modal-form-control"
              />
            </Form.Group>
            <br />

            <Button variant="dark" type="submit" id="landing-modal-button">
              Sign Up
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <ToastContainer autoClose={3000} theme="dark" />
    </section>
  );
};

export default Signup;
