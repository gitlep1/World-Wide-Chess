import "./NavBar.scss";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Image } from "react-bootstrap";

import DetectScreenSize from "../../../CustomFunctions/DetectScreenSize";
import NavBarLowerResolution from "./NavBarLowerResolution";

import Logo from "../../../Images/Logo.png";
import NavBarHigherResolution from "./NavBarHigherResolution";

const NavBar = ({ handleOpen, authenticated }) => {
  const navigate = useNavigate();
  const [screenSize, setScreenSize] = useState(0);

  useEffect(() => {
    const intervalFunctions = setInterval(() => {
      getScreenSize();
    });

    return () => clearInterval(intervalFunctions);
  }, []);

  const getScreenSize = () => {
    return setScreenSize(DetectScreenSize().width);
  };

  return (
    <nav className="mobile-NavBar">
      <div id="mobile-NavBar-header">
        <div
          className="NavBar-header-navigation"
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
