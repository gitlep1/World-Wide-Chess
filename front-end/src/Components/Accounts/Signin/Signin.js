import "./Signin.scss";
import { useState } from "react";
import { Form, Button, Modal, Image } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";

import Logo from "../../../Images/Logo.png";

const API = process.env.REACT_APP_API_URL;

const Signin = ({ screenVersion, handleUser, showSignIn, handleClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios
      .post(`${API}/users/signin`, {
        email,
        password,
      })
      .then((res) => {
        notify(res.data);
      })
      .catch((err) => {
        setError(err.response.data);
        notify("error");
      });
  };

  const notify = (foundUser) => {
    if (foundUser === "error") {
      return noUser();
    } else {
      toast.success("You have been successfully signed in.", {
        containerId: "toast-notify",
      });
      setTimeout(() => {
        handleClose();
        handleUser(foundUser);
      }, 4100);
    }
    return clearFields();
  };

  const noUser = () => {
    return toast.error(
      "No user with these credentials have been found. \n Please make sure your email and password are correct.",
      {
        containerId: "toast-notify",
      }
    );
  };

  const clearFields = () => {
    setPassword("");
    setEmail("");
  };

  return (
    <Modal
      show={showSignIn}
      onHide={handleClose}
      centered
      className={`${screenVersion}-signin-modal-container`}
    >
      <Modal.Title className="signin-modal-title">
        <h3 className="closeButton" onClick={handleClose}>
          X
        </h3>
        <Image src={Logo} alt="Logo" className="logoImgModal" />
        <h6>World Wide Chess</h6>
        <h1>Sign In</h1>
      </Modal.Title>
      <Modal.Body className="signin-modal-body">
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Email Address"
              value={email}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={handleChange}
            />
          </Form.Group>

          <br />
          <Button variant="light" type="submit" id="signin-modal-button">
            Sign in
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Signin;
