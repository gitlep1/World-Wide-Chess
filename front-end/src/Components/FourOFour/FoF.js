import "./FoF.scss";

const FoF = ({ screenVersion }) => {
  return (
    <section className={`${screenVersion}-FoF-container`}>
      <h1>ERROR: 404</h1>
      <h3>You shouldn't be here.</h3>
      <h5>Select any of the links on the navigation bar to go back.</h5>
    </section>
  );
};

export default FoF;
