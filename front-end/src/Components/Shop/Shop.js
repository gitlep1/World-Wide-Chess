import "./Shop.scss";
import { useEffect, useState } from "react";
import { Card, Form, Button, Image } from "react-bootstrap";
import { toast } from "react-toastify";
import { nanoid } from "nanoid";
import axios from "axios";

import ChessCoinIcon from "../../Images/Chess_Coins.png";

import { ShopConfirmModal } from "../../CustomFunctions/CustomModals";

const API = process.env.REACT_APP_API_URL;

const Shop = ({ screenVersion, user, token }) => {
  let shopItemsArr = [];
  const [shopSearchbar, setShopSearchbar] = useState("");
  const [shopItems, setShopItems] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [buyingItem, setBuyingItem] = useState({});

  const [error, setError] = useState("");

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    if (name === "shopSearchbar") {
      setShopSearchbar(value);
    }
  };

  useEffect(() => {
    getAllShopItems();
  }, []); // eslint-disable-line

  const getAllShopItems = async () => {
    await axios
      .get(`${API}/shop`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setShopItems(res.data.payload);
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const handleConfirm = async (item) => {
    await axios
      .post(`${API}/inventory`, item, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        toast.success(
          `Successfully bought ${item.item_name} \n Remaining balance: ${
            user.chess_coins - item.item_price
          }`,
          {
            containerId: "toast-notify",
          }
        );
        setOpenConfirm(false);
        setBuyingItem({});
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const handleCancel = async () => {
    setOpenConfirm(false);
    setBuyingItem({});
  };

  if (shopSearchbar !== "") {
    shopItemsArr = shopItems.filter((item) =>
      item.item_name.toLowerCase().includes(shopSearchbar)
    );
  } else {
    shopItemsArr = [...shopItems];
  }

  return (
    <section className={`${screenVersion}-shop-container`}>
      <div className="shop-searchbar-container">
        <Form.Group controlId="basic-shopSearchbar">
          <Form.Control
            type="text"
            name="shopSearchbar"
            placeholder="Search Item Name..."
            onChange={handleOnChange}
            value={shopSearchbar}
          />
        </Form.Group>
      </div>
      <div className="shop-items-container">
        {error ? (
          <h1 className="shop-error-message">ERROR: {error}</h1>
        ) : (
          shopItemsArr.map((item) => {
            return (
              <div key={nanoid()} className="shop-item-card-container">
                <Card className="shop-item-card">
                  <Card.Img
                    className="shop-item-card-img"
                    variant="top"
                    src={item.item_img}
                    alt={item.item_name}
                  />
                  <Card.Body>
                    <Card.Title>{item.item_name}</Card.Title>
                    <Card.Text>
                      Price: {item.item_price}{" "}
                      <Image
                        src={ChessCoinIcon}
                        alt="Chess Coin Icon"
                        className="shop-item-card-coin-icon"
                      />
                    </Card.Text>
                    <Button
                      variant="dark"
                      onClick={() => {
                        setOpenConfirm(true);
                        setBuyingItem(item);
                      }}
                    >
                      Buy Now
                    </Button>
                  </Card.Body>
                </Card>
              </div>
            );
          })
        )}
      </div>

      {Object.keys(buyingItem).length > 0 && (
        <ShopConfirmModal
          user={user}
          token={token}
          item={buyingItem}
          openConfirm={openConfirm}
          handleConfirm={handleConfirm}
          handleCancel={handleCancel}
        />
      )}
    </section>
  );
};

export default Shop;
