import { useState } from "react";
import { Button } from "react-bootstrap";
import {
  MDBContainer,
  MDBCollapse,
  MDBNavbar,
  MDBNavbarToggler,
} from "mdb-react-ui-kit";

const FilterSearch = ({ gamesCopy }) => {
  const [showAnimated, setShowAnimated] = useState(false);

  return (
    <>
      <MDBNavbar
        className="lobbyButtons advancedSearch-container"
        onClick={() => setShowAnimated(!showAnimated)}
      >
        v Advanced Search v
      </MDBNavbar>

      <MDBCollapse show={showAnimated} className="advancedSearch-options">
        <div className="bg-light">hello</div>
        <div className="bg-light">hello</div>
        <div className="bg-light">hello</div>
        <div className="bg-light">hello</div>
        <div className="bg-light">hello</div>
      </MDBCollapse>
    </>
  );
};

export default FilterSearch;
