import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MDBContainer,
  MDBCollapse,
  MDBNavbar,
  MDBNavbarToggler,
} from "mdb-react-ui-kit";

const NavBarLowerResolution = ({ handleOpen }) => {
  const navigate = useNavigate();
  const [showAnimated, setShowAnimated] = useState(false);
  return (
    <>
      <MDBNavbar dark bgColor="dark">
        <MDBContainer fluid>
          <MDBNavbarToggler
            type="button"
            className="second-button"
            data-target="#navbarToggleExternalContent"
            aria-controls="navbarToggleExternalContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={() => setShowAnimated(!showAnimated)}
          >
            <div className={`animated-icon2 ${showAnimated && "open"}`}>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </MDBNavbarToggler>
        </MDBContainer>
      </MDBNavbar>

      <MDBCollapse show={showAnimated}>
        <div className="bg-light shadow-3 burgerMenu-body">
          <div
            id="navbarLink-lobby-container"
            onClick={() => {
              navigate("/Lobby");
            }}
          >
            Lobby
          </div>

          <div
            id="navbarLink-leaderboard-container"
            onClick={() => {
              navigate("/Leaderboard");
            }}
          >
            Leaderboard
          </div>

          <div
            id="navbarLink-shop-container"
            onClick={() => {
              navigate("/Shop");
            }}
          >
            Shop
          </div>

          <div
            onClick={() => {
              handleOpen();
            }}
            id="navbarLink-account-container"
          >
            Account
          </div>
        </div>
      </MDBCollapse>
    </>
  );
};

export default NavBarLowerResolution;
