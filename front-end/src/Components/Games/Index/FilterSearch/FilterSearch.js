import "./FilterSearch.scss";
import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { MDBCollapse, MDBNavbar } from "mdb-react-ui-kit";

const FilterSearch = ({ gamesCopy }) => {
  const [showAnimated, setShowAnimated] = useState(true);
  const [minEloRating, setMinEloRating] = useState();
  const [maxEloRating, setMaxEloRating] = useState();
  const [fullRooms, setFullRooms] = useState(false);
  const [roomsWithPasswords, setRoomsWithPasswords] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "minElo") {
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
            {showAnimated ? "↓" : "↑"}
          </span>{" "}
          Advanced Search
          <span className="advancedSearchArrows">
            {showAnimated ? "↓" : "↑"}
          </span>
        </div>
      </MDBNavbar>

      {/* {showAnimated ? ( */}
      <MDBCollapse
        show={showAnimated}
        className="advancedSearch-options-container"
      >
        <Form onSubmit={handleSubmit} className="advancedSearch-options">
          <div className="bg-dark advancedSearch-singleOrMulti">
            <div className="singleOrMultiButtons">
              <Form.Check
                label="Single Player"
                name="group1"
                type="radio"
                id="radio-1"
              />
              <Form.Check
                label="Multi Player"
                name="group1"
                type="radio"
                id="radio-2"
              />
            </div>
          </div>
          <div className="bg-light renameLaterTwo">placeholder 2</div>
          <div className="bg-dark renameLaterThree">placeholder3</div>
          <div className="bg-light advancedSearch-roomPassword-container">
            password?
            <Form.Check
              type="switch"
              className="custom-switch"
              checked={roomsWithPasswords}
              onChange={() => {
                setRoomsWithPasswords(!roomsWithPasswords);
              }}
            />
          </div>
          <div className="bg-dark advancedSearch-eloRating-container">
            <span className="advancedSearch-eloRating-title">Elo Rating:</span>
            <Form.Group controlId="eloRating-min">
              <div className="advancedSearch-eloRating-min">
                <Form.Control
                  type="number"
                  name="minElo"
                  placeholder="min ..."
                  onChange={handleChange}
                  value={minEloRating}
                  className="min-elo-rating"
                />
              </div>
            </Form.Group>
            -
            <Form.Group controlId="eloRating-max">
              <div className="advancedSearch-eloRating-max">
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
          <div className="bg-light advancedSearch-roomFull-container">
            full?
            <Form.Check
              type="switch"
              className="custom-switch"
              checked={fullRooms}
              onChange={() => {
                setFullRooms(!fullRooms);
              }}
            />
          </div>

          <div className="advancedSearch-buttons">
            <Button variant="dark" type="submit">
              Search
            </Button>
          </div>
        </Form>
      </MDBCollapse>
      {/* ) : null} */}
    </>
  );
};

export default FilterSearch;
