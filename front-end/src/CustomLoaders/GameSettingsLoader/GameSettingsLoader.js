import "./GameSettingsLoader.scss";

const GameSettingsLoader = () => {
  return (
    <div className="game-settings-loader-container">
      <div className="game-settings-loader">
        loading game settings
        <span id="loaderDot1"> .</span>
        <span id="loaderDot2"> .</span>
        <span id="loaderDot3"> .</span>
      </div>
    </div>
  );
};

export default GameSettingsLoader;
