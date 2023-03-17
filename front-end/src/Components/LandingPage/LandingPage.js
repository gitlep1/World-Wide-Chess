import { useState } from "react";
import { animated } from "@react-spring/web";
import { Button, Image } from "react-bootstrap";
import Logo from "../../Images/Logo.png";
import "./LandingPage.scss";

import Signup from "../Accounts/Signup/SignUp";
import Guest from "../Accounts/Guest/Guest";
import Signin from "../Accounts/Signin/SignIn";

const LandingPage = ({ handleUser, users }) => {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showGuest, setShowGuest] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  const handleClose = () => {
    if (showSignUp || showGuest || showSignIn) {
      setShowSignUp(false);
      setShowGuest(false);
      setShowSignIn(false);
    }
  };

  return (
    <section className="LandingPageContainer">
      <div className="LandingPageContent">
        <div className="logoAndTitle">
          <Image src={Logo} alt="Logo" />
          <h1>World Wide Chess</h1>
        </div>

        <div className="motto">
          <h3>
            WELCOME! <span>Go destroy your opponents in chess!</span>
          </h3>
        </div>

        <div className="landingPageButtons">
          <Button variant="primary" onClick={() => setShowSignUp(true)}>
            Sign Up
          </Button>

          <Button variant="dark" onClick={() => setShowGuest(true)}>
            Guest
          </Button>

          <Button variant="success" onClick={() => setShowSignIn(true)}>
            Sign In
          </Button>
        </div>
      </div>
      <Signup
        handleUser={handleUser}
        users={users}
        showSignUp={showSignUp}
        handleClose={handleClose}
      />
      <Guest showGuest={showGuest} handleClose={handleClose} />
      <Signin
        handleUser={handleUser}
        users={users}
        showSignIn={showSignIn}
        handleClose={handleClose}
      />
    </section>
  );
};

export default LandingPage;
