import "./AccountSettings.scss";
import { useEffect, useState } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

const AccountSettings = ({ user, users, handleUser, handleLogout }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [profImg, setProfImg] = useState("");

  const [error, setError] = useState("");

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    setUsername(user.username);
    setPassword(user.password);
    setEmail(user.email);
    setProfImg(user.profileimg);
  }, [user.username, user.password, user.email, user.profileimg]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "username") {
      setUsername(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "profileImg") {
      setProfImg(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const editUser = {
      username: username,
      password: password,
      email: email,
      profileimg: profImg,
    };

    if (editUser.username.length > 20) {
      return toast.error(
        `Your current username:(${editUser.username}) is ${editUser.username.length} characters long. \n The max character length allowed is 20.`,
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
      editUser.username === "" ||
      editUser.password === "" ||
      editUser.email === ""
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

    if (editUser.profileimg === "") {
      editUser.profileimg =
        "https://www.pngitem.com/pimgs/m/97-971070_chess-piece-black-king-king-chess-piece-png.png";
    }

    users.map((player, index) => {
      if (user.id === player.id) {
        users.splice(index, 1);
      }
      return users;
    });

    const checkUser = users.filter(
      (players) =>
        players.email === editUser.email ||
        players.username === editUser.username
    );

    if (checkUser.length > 0) {
      return toast.error("Email or Username already exists!", {
        position: "top-right",
        pauseOnFocusLoss: false,
        closeOnClick: true,
        pauseOnHover: false,
      });
    } else {
      axios
        .put(`${API}/users/${user.id}`, editUser)
        .then((res) => {
          notify(res.data);
        })
        .catch((err) => {
          setError(err);
        });
    }
  };

  const notify = (updatedUser) => {
    toast.success(
      `${user.username} your account has been updated. You will be redirected back to the lobby in 3 seconds.`,
      {
        position: "top-center",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        draggable: true,
        progress: undefined,
      }
    );
    setTimeout(() => {
      handleUser(updatedUser);
    }, 4100);
  };

  const deleteAccount = async (user) => {
    handleLogout();
    await axios.delete(`${API}/users/${user.id}`).then(() => {
      toast.success(
        "Your account has been successfully deleted you will be redirected back to the homepage in 3 seconds.",
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
      // setTimeout(() => {
      //   handleLogout();
      // }, 4100);
    });
  };

  return (
    <section className="editAccountSection">
      {error && <p className="error">{error}</p>}
      <Form onSubmit={handleSubmit} className="profileFormContainer">
        <div className="profileForm">
          <Form.Group controlId="formBasicUsername">
            <Form.Label>
              <h3>Username</h3>
            </Form.Label>
            <Form.Control
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              value={username}
            />
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>
              <h3>Password</h3>
            </Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              value={password}
            />
          </Form.Group>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>
              <h3>Email</h3>
            </Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              value={email}
            />
          </Form.Group>
          <Form.Group controlId="formProfileImg">
            <Form.Label>
              <h3>Profile Image</h3>
            </Form.Label>
            <Form.Control
              type="url"
              name="profileImg"
              placeholder="Profile Image URL"
              onChange={handleChange}
              value={profImg}
            />
          </Form.Group>
        </div>

        <div className="profilePic">
          <img src={profImg} alt="profile" />
        </div>

        <div className="profileButtons">
          <Button variant="dark" type="submit">
            Save
          </Button>
          <Button variant="dark" onClick={handleShow}>
            Delete Account
          </Button>
        </div>
      </Form>

      <ToastContainer autoClose={3000} theme="dark" />

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            Are you sure you wish to delete your account?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>THIS ACTION IS IRREVERSIBLE!!!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              deleteAccount(user);
            }}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
};

export default AccountSettings;
