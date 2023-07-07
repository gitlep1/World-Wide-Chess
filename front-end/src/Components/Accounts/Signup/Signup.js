import "./Signup.scss";
import { useState } from "react";
import { Form, Button, Modal, Image } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import Logo from "../../../Images/Logo.png";
import defaultProfImg from "../../../Images/DefaultProfImg.png";

const API = process.env.REACT_APP_API_URL;

const Signup = ({ screenVersion, handleUser, showSignUp, handleClose }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [error, setError] = useState("");

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

    await axios
      .post(`${API}/users/signup`, newUser)
      .then((res) => {
        notify(res.data);
      })
      .catch((err) => {
        setError(err.response.data);
        notify("error");
      });
  };

  const notify = (newUser) => {
    if (newUser === "error") {
      return toast.error("That Username/Email is taken.", {
        position: "top-center",
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        draggable: true,
        progress: undefined,
      });
    } else {
      toast.success(
        "User account has been created. You have automatially been signed in.",
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
        handleClose();
        handleUser(newUser);
      }, 4100);
    }
    return clearFields();
  };

  const clearFields = () => {
    setUsername("");
    setPassword("");
    setEmail("");
    setPasswordConfirm("");
  };

  return (
    <Modal
      show={showSignUp}
      onHide={handleClose}
      centered
      className={`${screenVersion}-signup-modal-container`}
    >
      <Modal.Title className="signup-modal-title">
        <h3
          className="closeButton"
          onClick={() => {
            handleClose();
            clearFields();
          }}
        >
          X
        </h3>
        <Image src={Logo} alt="Logo" className="logoImgModal" />
        <h6>World Wide Chess</h6>
        <h1>Sign Up</h1>
      </Modal.Title>
      <Modal.Body className="signup-modal-body">
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              value={username}
            />
          </Form.Group>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              value={email}
            />
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              value={password}
            />
          </Form.Group>
          <Form.Group controlId="formPasswordConfirm">
            <Form.Label>Password Confirmation</Form.Label>
            <Form.Control
              type="password"
              name="passwordConfirm"
              placeholder="Password Confirmation"
              onChange={handleChange}
              value={passwordConfirm}
            />
          </Form.Group>
          <br />

          <Button variant="dark" type="submit" id="signup-modal-button">
            Sign Up
          </Button>
        </Form>
      </Modal.Body>
      <ToastContainer autoClose={3000} theme="dark" />
    </Modal>
  );
};

export default Signup;
