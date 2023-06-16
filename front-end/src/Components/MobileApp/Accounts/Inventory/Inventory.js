import { useState } from "react";
import "./Inventory.scss";
import { Button, Modal, Form } from "react-bootstrap";

const Inventory = ({ openInventory, handleOpenInventory }) => {
  const [searchbar, setSearchbar] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "searchbar") {
      setSearchbar(value);
    }
  };

  return (
    <Modal
      show={openInventory}
      centered
      backdrop="static"
      className="mobile-inventory-container"
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
          <h1>items</h1>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Inventory;
