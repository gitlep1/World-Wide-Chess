import "./Homepage.scss";
import kingFistFight from "../../Images/kingsFistFight.jpeg";

const Homepage = () => {
  return (
    <section className="HomepageSection">
      <h1>WELCOME!</h1>
      <h2>Go destroy your opponents in chess!</h2>
      <section className="homePageSection2">
        <img src={kingFistFight} alt="homepage" />
      </section>
    </section>
  );
};

export default Homepage;
