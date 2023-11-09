import "./DisabledIcon.scss";

const DisabledIcon = () => {
  return (
    <svg
      id="disabledIconSVG"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="red" // color of the line
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" fill="none" />
      <line x1="4" y1="4" x2="20" y2="20" />
    </svg>
  );
};

export default DisabledIcon;
