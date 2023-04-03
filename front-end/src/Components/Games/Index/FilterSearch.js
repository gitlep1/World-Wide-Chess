import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { MDBCollapse, MDBNavbar } from "mdb-react-ui-kit";

const FilterSearch = ({ gamesCopy }) => {
  const [showAnimated, setShowAnimated] = useState(false);
  const [search, setSearch] = useState("");
  const [minEloRating, setMinEloRating] = useState();
  const [maxEloRating, setMaxEloRating] = useState();
  const [fullRooms, setFullRooms] = useState(false);
  const [roomsWithPasswords, setRoomsWithPasswords] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e;

    if (name === "searchbar") {
      setSearch(value);
    } else if (name === "minElo") {
      setMinEloRating(value);
    } else if (name === "maxElo") {
      setMaxEloRating(value);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <MDBNavbar
        className="lobbyButtons advancedSearch-container"
        onClick={() => setShowAnimated(!showAnimated)}
      >
        <div className="advancedSearch-title">
          <span className="advancedSearchArrows">
            {showAnimated ? "↑" : "↓"}
          </span>{" "}
          Advanced Search
          <span className="advancedSearchArrows">
            {showAnimated ? "↑" : "↓"}
          </span>
        </div>
      </MDBNavbar>

      <MDBCollapse
        show={showAnimated}
        className="advancedSearch-options-container"
      >
        <Form onSubmit={handleSubmit} className="advancedSearch-options">
          <div className="bg-dark">single or multi</div>
          <div className="bg-light">
            Room Name:
            <Form.Group controlId="advancedSearch-searchbar">
              <Form.Control
                type="text"
                name="searchbar"
                placeholder="Room Name ..."
                onChange={handleChange}
                value={search}
              />
            </Form.Group>
          </div>
          <div className="bg-dark">placeholder3</div>
          <div className="bg-light">
            password?
            <Form.Check
              type="switch"
              id="custom-switch"
              checked={roomsWithPasswords}
              onChange={() => {
                setRoomsWithPasswords(!roomsWithPasswords);
              }}
            />
          </div>
          <div className="bg-dark advancedSearch-eloRating-container">
            <span className="advancedSearch-eloRating-title">Elo Rating:</span>
            <Form.Group controlId="advancedSearch-eloRating">
              <div className="advancedSearch-eloRating">
                <Form.Control
                  type="number"
                  name="minElo"
                  placeholder="min ..."
                  onChange={handleChange}
                  value={minEloRating}
                  className="min-elo-rating"
                />
                -
                <Form.Control
                  type="number"
                  name="maxElo"
                  placeholder="max ..."
                  onChange={handleChange}
                  value={maxEloRating}
                  className="max-elo-rating"
                />
              </div>
            </Form.Group>
          </div>
          <div className="bg-light">
            full?
            <Form.Check
              type="switch"
              id="custom-switch"
              checked={fullRooms}
              onChange={() => {
                setFullRooms(!fullRooms);
              }}
            />
          </div>

          <div className="advancedSearch-buttons">
            <Button variant="dark">Search</Button>
          </div>
        </Form>
      </MDBCollapse>
    </>
  );
};

export default FilterSearch;
