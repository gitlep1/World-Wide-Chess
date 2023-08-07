import "./Shop.scss";
import { useEffect, useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { nanoid } from "nanoid";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

const Shop = ({ screenVersion }) => {
  let shopItemsArr = [];
  const [shopSearchbar, setShopSearchbar] = useState("");
  const [shopItems, setShopItems] = useState([]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    if (name === "shopSearchbar") {
      setShopSearchbar(value);
    }
  };

  useEffect(() => {
    axios
      .get(`${API}/shop`)
      .then((res) => {
        setShopItems(res.data.payload);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

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
        {shopItemsArr.map((item) => {
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
                  <Card.Text>Price: {item.item_price}</Card.Text>
                  <Button variant="dark">Buy Now</Button>
                </Card.Body>
              </Card>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Shop;