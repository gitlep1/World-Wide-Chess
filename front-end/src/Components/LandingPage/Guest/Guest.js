import "./Guest.scss";
import { Modal } from "react-bootstrap";
import { nanoid } from "nanoid";
import axios from "axios";
import DefaultProfImg from "../../../Images/DefaultProfImg.png";

const API = process.env.REACT_APP_API_URL;

const Guest = ({ showGuest, handleUser }) => {
  const handleGuest = async () => {
    const newGuestData = {
      profileimg: DefaultProfImg,
      username: `Guest-${nanoid(5)}`,
    };

    await axios
      .post(`${API}/guests`, newGuestData)
      .then((res) => {
        handleUser(res.data);
      })
      .catch((err) => console.log(err));
  };
  return (
    <section>
      <Modal show={showGuest} backdrop="static">
        <h1>Signing in as guest ...</h1>
        {setTimeout(() => {
          handleGuest();
        }, 3000)}
      </Modal>
    </section>
  );
};

export default Guest;
