import "./LandingPage.scss";
import { useState, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";
import { Button, Image } from "react-bootstrap";

import Logo from "../../Images/Logo.png";
import Signup from "./Signup/SignUp";
import Guest from "./Guest/Guest";
import Signin from "./Signin/SignIn";

const LandingPage = ({ handleUser, users }) => {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showGuest, setShowGuest] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  useEffect(() => {
    handleSpringAnimations();
  }, []); // eslint-disable-line

  const handleClose = () => {
    if (showSignUp || showGuest || showSignIn) {
      setShowSignUp(false);
      setShowGuest(false);
      setShowSignIn(false);
    }
  };

  const [springButtonOne, apiOne] = useSpring(() => ({
    from: {
      y: -1000,
    },
    to: {
      y: 0,
    },
    delay: 2500,
  }));

  const [springButtonTwo, apiTwo] = useSpring(() => ({
    from: {
      y: -1000,
    },
    to: {
      y: 0,
    },
    delay: 3500,
  }));

  const [springButtonThree, apiThree] = useSpring(() => ({
    from: {
      y: -1000,
    },
    to: {
      y: 0,
    },
    delay: 4500,
  }));

  const [springLogoAndTitle, apiLogoAndTitle] = useSpring(() => ({
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
    delay: 1000,
  }));

  const [springMotto, apiMotto] = useSpring(() => ({
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
    delay: 2000,
  }));

  const handleSpringAnimations = () => {
    apiLogoAndTitle.start();
    apiMotto.start();
    apiOne.start();
    setTimeout(() => {
      apiTwo.start();
    }, 1000);
    setTimeout(() => {
      apiThree.start();
    }, 2000);
  };

  return (
    <section className="LandingPageContainer">
      <div className="LandingPageContent">
        <animated.div style={{ ...springLogoAndTitle }}>
          <div className="logoAndTitle">
            <Image src={Logo} alt="Logo" />
            <h1>World Wide Chess</h1>
          </div>
        </animated.div>

        <animated.div style={{ ...springMotto }}>
          <div className="motto">
            <h3>
              WELCOME! <span>Go destroy your opponents in chess!</span>
            </h3>
          </div>
        </animated.div>

        <div className="landingPageButtons">
          <animated.div
            className="landingPage-spring-buttons"
            onClick={handleSpringAnimations}
            style={{
              ...springButtonOne,
            }}
          >
            <Button variant="primary" onClick={() => setShowSignUp(true)}>
              Sign Up
            </Button>
          </animated.div>

          <animated.div
            className="landingPage-spring-buttons"
            onClick={handleSpringAnimations}
            style={{
              ...springButtonTwo,
            }}
          >
            <Button variant="dark" onClick={() => setShowGuest(true)}>
              Guest
            </Button>
          </animated.div>

          <animated.div
            className="landingPage-spring-buttons"
            onClick={handleSpringAnimations}
            style={{
              ...springButtonThree,
            }}
          >
            <Button variant="success" onClick={() => setShowSignIn(true)}>
              Sign In
            </Button>
          </animated.div>
        </div>
      </div>
      <Signup
        handleUser={handleUser}
        users={users}
        showSignUp={showSignUp}
        handleClose={handleClose}
      />
      {showGuest ? (
        <Guest showGuest={showGuest} handleUser={handleUser} />
      ) : null}
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
