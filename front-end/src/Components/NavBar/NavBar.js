import "./NavBar.scss";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Image } from "react-bootstrap";
import {
  MDBContainer,
  MDBCollapse,
  MDBNavbar,
  MDBNavbarToggler,
} from "mdb-react-ui-kit";

import DetectScreenSize from "../../CustomFunctions/DetectScreenSize";
import NavBarLowerResolution from "./NavBarLowerResolution";

import Logo from "../../Images/Logo.png";
import NavBarHigherResolution from "./NavBarHigherResolution";

const NavBar = ({ handleOpen, authenticated }) => {
  const navigate = useNavigate();
  const [screenSize, setScreenSize] = useState(0);

  useEffect(() => {
    const intervalFunctions = setInterval(() => {
      getScreenSize();
    }, 1000);

    return () => clearInterval(intervalFunctions);
  }, []);

  const getScreenSize = () => {
    return setScreenSize(DetectScreenSize().width);
  };

  return (
    <nav className="NavBar">
      <div id="worldWideChessHeader">
        <div
          className="worldWideChessHeader-navigation"
          onClick={() => {
            navigate("/");
          }}
        >
          <Image src={Logo} alt="Logo" id="mainlogoImg" />
          <h1>WORLD WIDE CHESS</h1>
        </div>
      </div>
      {screenSize < 600 ? (
        <NavBarLowerResolution handleOpen={handleOpen} />
      ) : (
        <NavBarHigherResolution handleOpen={handleOpen} />
      )}
    </nav>
  );
};

export default NavBar;
