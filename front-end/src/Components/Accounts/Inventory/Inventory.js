import "./Inventory.scss";
import { useState, useEffect } from "react";
import { Button, Modal, Form, Card } from "react-bootstrap";
import { nanoid } from "nanoid";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

const Inventory = ({
  screenVersion,
  openInventory,
  handleOpenInventory,
  user,
}) => {
  let InventoryItemsArr = [];
  const [searchbar, setSearchbar] = useState("");
  const [inventoryItems, setInventoryItems] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "searchbar") {
      setSearchbar(value);
    }
  };

  useEffect(() => {
    renderInventoryItems();
  }, []); // eslint-disable-line

  const renderInventoryItems = async () => {
    await axios
      .get(`${API}/inventory/${user.id}`)
      .then((inventoryRes) => {
        axios.get(`${API}/shop`).then((shopRes) => {
          const getAllInventoryItems = inventoryRes.data.map((item) => {
            for (const shopItem of shopRes.data) {
              if (item.item_id === shopItem.id) {
                return shopItem;
              }
            }
            return null;
          });
          setInventoryItems(getAllInventoryItems);
        });
      })
      .catch((err) => {
        console.clear();
      });
  };

  if (searchbar !== "") {
    InventoryItemsArr = inventoryItems.filter((item) =>
      item.item_name.toLowerCase().includes(searchbar)
    );
  } else {
    InventoryItemsArr = [...inventoryItems];
  }

  return (
    <Modal
      show={openInventory}
      centered
      backdrop="static"
      className={`${screenVersion}-inventory-container`}
    >
      <Modal.Header>
        <Button variant="danger" onClick={handleOpenInventory}>
          X
        </Button>
        <Modal.Title>INVENTORY</Modal.Title>
        <div className="inventory-searchbar-container">
          <Form.Group controlId="inventory-searchbar">
            <Form.Control
              type="text"
              name="searchbar"
              placeholder="Search Item Name..."
              onChange={handleChange}
              value={searchbar}
            />
          </Form.Group>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div>
          {InventoryItemsArr.map((item) => {
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
                    <Button variant="dark">Equip</Button>
                  </Card.Body>
                </Card>
              </div>
            );
          })}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Inventory;
