import "./Shop.scss";
import { useEffect, useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { nanoid } from "nanoid";

const Shop = ({}) => {
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
    addItemsToShop();
  }, []);

  const addItemsToShop = () => {
    const itemsArr = [
      { name: "Dragon Border", value: 1000 },
      { name: "Knight Border", value: 800 },
      { name: "Bishop Border", value: 750 },
      { name: "Castle Border", value: 900 },
      { name: "Pawn Border", value: 500 },
      { name: "Marble Piece Set", value: 1500 },
      { name: "Wooden Piece Set", value: 1000 },
      { name: "Glass Piece Set", value: 1200 },
      { name: "Metal Piece Set", value: 1300 },
      { name: "Classic Board Style", value: 500 },
      { name: "Modern Board Style", value: 700 },
      { name: "Futuristic Board Style", value: 900 },
      { name: "Dark Theme", value: 300 },
      { name: "Light Theme", value: 400 },
      { name: "Rainbow Chat Effects", value: 2000 },
      { name: "Monochronic Chat Effects", value: 4000 },
    ];

    return setShopItems(itemsArr);
  };

  if (shopSearchbar !== "") {
    shopItemsArr = shopItems.filter((item) =>
      item.name.toLowerCase().includes(shopSearchbar)
    );
  } else {
    shopItemsArr = [...shopItems];
  }

  return (
    <section className="desktop-shop-container">
      <div className="desktop-shop-searchbar-container">
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
      <div className="desktop-shop-items-container">
        {shopItemsArr.map((item) => {
          return (
            <div key={nanoid()} className="shop-item-card-container">
              <Card className="shop-item-card">
                <Card.Img
                  className="shop-item-card-img"
                  variant="top"
                  src={
                    item.imageSrc
                      ? item.imageSrc
                      : "https://via.placeholder.com/150"
                  }
                  alt={item.name}
                />
                <Card.Body>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>Value: {item.value}</Card.Text>
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
