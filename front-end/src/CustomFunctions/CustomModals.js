import "./CustomModals.scss";
import { useState, useEffect } from "react";
import { Button, Image, Modal } from "react-bootstrap";
import { useSpring, animated, useSpringRef } from "react-spring";
import { toast } from "react-toastify";
import axios from "axios";

import ChessCoinIcon from "../Images/Chess_Coins.png";

const API = process.env.REACT_APP_API_URL;

const ShopConfirmModal = ({
  user,
  setUser,
  token,
  item,
  openConfirm,
  handleConfirm,
  handleCancel,
}) => {
  const api = useSpringRef();

  const [loading, setLoading] = useState(false);
  const [buttonVariant, setButtonVariant] = useState("secondary");
  const [canAfford, setCanAfford] = useState(false);
  const [balanceDisplay, setBalanceDisplay] = useState(user.chess_coins);

  const [error, setError] = useState("");

  const springConfirm = useSpring({
    ref: api,
  });

  useEffect(() => {
    checkBalance();
  }, []); // eslint-disable-line

  const startTimer = () => {
    api.start({
      from: { width: "0%" },
      to: { width: "100%" },
      config: { duration: 4000 },
    });

    setLoading(true);
    setButtonVariant("secondary");

    setTimeout(() => {
      setLoading(false);
      setButtonVariant("success");
    }, 4000);
  };

  const checkBalance = async () => {
    setError("");

    const userOrGuest = user.is_guest
      ? `${API}/guests/guest`
      : `${API}/users/user`;

    try {
      const checkUser = axios.get(userOrGuest, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const checkItem = axios.get(`${API}/shop/${item.id}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const [checkUserResponse, checkItemResponse] = await axios.all([
        checkUser,
        checkItem,
      ]);

      const userData = checkUserResponse.data.payload;
      const itemData = checkItemResponse.data.payload;

      setUser(userData);
      setBalanceDisplay(userData.chess_coins);

      if (userData.chess_coins >= itemData.item_price) {
        startTimer();
        setCanAfford(true);
      } else {
        setLoading(false);
        setCanAfford(false);
      }
    } catch (err) {
      setError(err.response.data);
    }
  };

  console.log(user);

  return (
    <Modal
      show={openConfirm}
      centered
      backdrop="static"
      keyboard={false}
      className="shop-modal-container"
    >
      <Modal.Header className="shop-modal-header">
        <div className="balanceDisplay">
          <Image
            src={ChessCoinIcon}
            alt="Chess Coin Icon"
            className="shop-modal-coin-icon"
          />{" "}
          {balanceDisplay}
        </div>
        <Modal.Title className="shop-modal-header-title1">Preview</Modal.Title>
        <Image
          className="shop-modal-header-image"
          src={item.item_img}
          alt={item.item_name}
        />
        <Modal.Title className="shop-modal-header-title2">
          <span>{item.item_name}</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="shop-modal-body">
        <span className="shop-modal-span1">Are you sure you want to buy</span>
        <br />
        <span className="shop-modal-span2">{item.item_name}</span> for{" "}
        <span className="shop-modal-span3">{item.item_price}</span>{" "}
        <Image
          src={ChessCoinIcon}
          alt="Chess Coin Icon"
          className="shop-modal-coin-icon"
        />
        <h3 className="shop-modal-balance">
          <span>New balance</span>:{" "}
          <span
            className={
              balanceDisplay - item.item_price < 0
                ? "negativeBalance"
                : "positiveBalance"
            }
          >
            {balanceDisplay - item.item_price}
          </span>{" "}
          <Image
            src={ChessCoinIcon}
            alt="Chess Coin Icon"
            className="shop-modal-coin-icon"
          />
        </h3>
        {error && <h1 style={{ color: "red" }}>ERROR: {error}</h1>}
      </Modal.Body>

      <Modal.Footer className="shop-modal-footer border-0">
        <Button variant="danger" onClick={handleCancel}>
          Cancel
        </Button>
        {canAfford ? (
          <Button
            variant={buttonVariant}
            onClick={() => {
              handleConfirm(item);
            }}
            disabled={loading}
            className="shop-modal-footer-confirm-botton"
          >
            Confirm
            <animated.div
              style={{
                width: springConfirm.width,
              }}
              className={`shop-modal-footer-confirm-botton-animation ${
                loading ? "add-border" : null
              }`}
            ></animated.div>
          </Button>
        ) : (
          <Button
            variant="secondary"
            disabled
            className="shop-modal-footer-confirm-botton"
          >
            Cannot Afford
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export { ShopConfirmModal };
