const DetectScreenSize = () => {
  const width = window.outerWidth;
  const height = window.outerHeight;

  return { width, height };
};

export default DetectScreenSize;
