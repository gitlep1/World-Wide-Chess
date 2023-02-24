// animal themed pieces \\
import blackWolfKing from "../../../../Images/Themes/Pieces/Animals/blackWolfKing.png";
import whiteWolfKing from "../../../../Images/Themes/Pieces/Animals/whiteWolfKing.png";
import blackWolfQueen from "../../../../Images/Themes/Pieces/Animals/blackWolfQueen.png";
import whiteWolfQueen from "../../../../Images/Themes/Pieces/Animals/whiteWolfQueen.png";

let animalPieceTheme = {
  wK: () => {
    return <img src={whiteWolfKing} alt="white king" />;
  },
  bK: () => {
    return <img src={blackWolfKing} alt="black king" />;
  },
  wQ: () => {
    return <img src={whiteWolfQueen} alt="white queen" />;
  },
  bQ: () => {
    return <img src={blackWolfQueen} alt="black queen" />;
  },
};

export { animalPieceTheme };
