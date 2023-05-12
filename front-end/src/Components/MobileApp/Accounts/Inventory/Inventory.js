import { useState } from "react";
import "./Inventory.scss";
import { Button, Modal, Form } from "react-bootstrap";

const Inventory = ({ openInventory }) => {
  const [searchbar, setSearchbar] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "searchbar") {
      setSearchbar(value);
    }
  };

  return (
    <Modal show={openInventory}>
      <div className="lobby-searchbar-container">
        <Form.Group controlId="lobby-searchbar">
          <Form.Control
            type="text"
            name="searchbar"
            placeholder="Search Item Name..."
            onChange={handleChange}
            value={searchbar}
          />
        </Form.Group>
      </div>
    </Modal>
  );
};

export default Inventory;
