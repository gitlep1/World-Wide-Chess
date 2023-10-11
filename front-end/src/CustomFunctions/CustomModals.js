import { useState, useEffect } from "react";
import { Button, Image, Modal } from "react-bootstrap";
import { useSpring, animated } from "react-spring";
import "./CustomModals.scss";

const ShopConfirmModal = ({
  user,
  item,
  openConfirm,
  handleConfirm,
  handleCancel,
}) => {
  const [timer, setTimer] = useState(3);
  const [loading, setLoading] = useState(false);
  const [buttonVariant, setButtonVariant] = useState("secondary");

  const [springProps, setSpringProps] = useSpring(() => ({
    width: "0%",
    config: { duration: 3500 },
  }));

  useEffect(() => {
    startTimer();
  }, []); // eslint-disable-line

  const startTimer = () => {
    setLoading(true);
    setButtonVariant("secondary");
    setSpringProps({ width: "100%" });

    setTimeout(() => {
      setLoading(false);
      setButtonVariant("success");
    }, 3500);
  };

  return (
    <Modal
      show={openConfirm}
      centered
      backdrop="static"
      keyboard={false}
      className="shop-modal-container"
    >
      <Modal.Header className="shop-modal-header border-0">
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
        <span className="shop-modal-span3">{item.item_price}</span> CCs?
        <h3 className="shop-modal-balance">
          <span>New balance</span>: {user.chess_coins} (
          <span>{user.chess_coins - item.item_price}</span>) CCs
        </h3>
      </Modal.Body>

      <Modal.Footer className="shop-modal-footer border-0">
        <Button variant="danger" onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          variant={buttonVariant}
          onClick={handleConfirm}
          disabled={loading}
          className="shop-modal-footer-confirm-botton"
        >
          Confirm
          <animated.div
            style={{
              width: springProps.width,
            }}
            className={`shop-modal-footer-confirm-botton-animation ${
              loading ? "add-border" : null
            }`}
          ></animated.div>
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export { ShopConfirmModal };
