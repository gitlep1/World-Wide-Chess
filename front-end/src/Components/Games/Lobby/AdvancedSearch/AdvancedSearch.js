import "./AdvancedSearch.scss";
import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

const FilterSearch = ({
  screenVersion,
  singleGames,
  setSingleGamesCopy,
  multiGames,
  setMultiGamesCopy,
  socket,
  token,
}) => {
  const [minRating, setMinRating] = useState("");
  const [maxRating, setMaxRating] = useState("");
  const [roomsWithPasswords, setRoomsWithPasswords] = useState(false);
  const [fullRooms, setFullRooms] = useState(false);
  const [allowSpecs, setAllowSpecs] = useState(false);

  const [singleGamesError, setSingleGamesError] = useState("");
  const [multiGamesError, setMultiGamesError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "minRating") {
      setMinRating(value);
    } else if (name === "maxRating") {
      setMaxRating(value);
    } else if (name === "roomsWithPasswords") {
      setRoomsWithPasswords(!roomsWithPasswords);
    } else if (name === "fullRooms") {
      setFullRooms(!fullRooms);
    } else if (name === "allowSpecs") {
      setAllowSpecs(!allowSpecs);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    socket.off("get-single-games");
    socket.off("get-multi-games");

    let singleGamesList;
    let multiGamesList;

    if (allowSpecs) {
      singleGamesList = singleGames.filter((game) => game.allow_specs);
      
      multiGamesList = multiGames.filter((game) => game.allow_specs);
    }

    if (roomsWithPasswords) {
      singleGamesList = singleGames.filter((game) => game.room_password);
      
      multiGamesList = multiGames.filter((game) => game.room_password);
    }

    if (fullRooms) {
      singleGamesList = singleGames.filter((game) => game.in_progress);
      
      multiGamesList = multiGames.filter((game) => game.in_progress);
    }
    
    setSingleGamesCopy(singleGamesList);
    setMultiGamesCopy(multiGamesList);
  };

  const handleRevertSearch = async () => {
    const singlePlayerGamesRequest = axios
      .get(`${API}/single-games`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .catch((err) => {
        setSingleGamesError(err);
      });

    const multiPlayerGamesRequest = axios
      .get(`${API}/multi-games`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .catch((err) => {
        setMultiGamesError(err);
      });

    const [singlePlayerGamesResponse, multiPlayerGamesResponse] =
      await axios.all([singlePlayerGamesRequest, multiPlayerGamesRequest]);

    const singlePlayerGames = singlePlayerGamesResponse.data.payload;
    const multiPlayerGames = multiPlayerGamesResponse.data.payload;

    setSingleGamesCopy(singlePlayerGames);
    setMultiGamesCopy(multiPlayerGames);

    socket.emit("get-single-games");
    socket.emit("get-multi-games");
  };

  return (
    <div className={`${screenVersion}-advanced-search-container`}>
      <div id="advanced-search-title">Advanced Search</div>

      <Form onSubmit={handleSubmit} className="advanced-search-form">
        <div className="advanced-search-specs-container">
          Spectators?
          <Form.Check
            name="allowSpecs"
            type="switch"
            className="custom-switch"
            value="specs"
            checked={allowSpecs}
            onChange={handleChange}
          />
        </div>
        <div className="advanced-search-password-container">
          Password?
          <Form.Check
            name="roomsWithPasswords"
            type="switch"
            className="custom-switch"
            value="password"
            checked={roomsWithPasswords}
            onChange={handleChange}
          />
        </div>
        <div className="advanced-search-full-container">
          Full?
          <Form.Check
            name="fullRooms"
            type="switch"
            className="custom-switch"
            value="full"
            checked={fullRooms}
            onChange={handleChange}
          />
        </div>
        <div className="advanced-search-rating-container">
          <span className="advanced-search-rating-title">Rating</span>
          <div className="rating-number-container">
            <Form.Group controlId="rating-min">
              <Form.Control
                type="number"
                name="minRating"
                placeholder="min ..."
                onChange={handleChange}
                value={minRating}
              />
            </Form.Group>
            <div id="rating-divider"></div>
            <Form.Group controlId="rating-max">
              <Form.Control
                type="number"
                name="maxRating"
                placeholder="max ..."
                onChange={handleChange}
                value={maxRating}
              />
            </Form.Group>
          </div>
        </div>

        <div className="advanced-search-button-container">
          <Button
            variant="dark"
            type="submit"
            className="advanced-search-button"
          >
            Search
          </Button>

          <Button
            variant="dark"
            className="advanced-search-button"
            onClick={handleRevertSearch}
          >
            Revert
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default FilterSearch;
