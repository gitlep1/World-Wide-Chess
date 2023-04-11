const controlWidth = (screenSize) => {
  switch (screenSize) {
    case screenSize <= 360:
      return 340;
    case screenSize <= 380:
      return 360;
    case screenSize <= 400:
      return 380;
    case screenSize <= 420:
      return 400;
    case screenSize <= 440:
      return 420;
    case screenSize <= 460:
      return 440;
    case screenSize <= 480:
      return 460;
    case screenSize <= 500:
      return 480;
    case screenSize <= 520:
      return 500;
    case screenSize <= 540:
      return 520;
    case screenSize <= 560:
      return 540;
    case screenSize <= 580:
      return 560;
    case screenSize <= 600:
      return 580;
    case screenSize <= 620:
      return 600;
    case screenSize <= 640:
      return 620;
    case screenSize <= 660:
      return 640;
    case screenSize <= 680:
      return 660;
    case screenSize <= 700:
      return 680;
    case screenSize <= 720:
      return 700;
    case screenSize <= 740:
      return 720;
    case screenSize <= 760:
      return 740;
    case screenSize <= 780:
      return 760;
    case screenSize <= 800:
      return 780;
    case screenSize <= 820:
      return 800;
    case screenSize <= 840:
      return 820;
    case screenSize <= 860:
      return 840;
    case screenSize <= 880:
      return 860;
    case screenSize <= 900:
      return 880;
    case screenSize <= 920:
      return 900;
    case screenSize <= 940:
      return 920;
    case screenSize <= 960:
      return 940;
    case screenSize <= 980:
      return 960;
    case screenSize <= 1000:
      return 980;
    case screenSize <= 1020:
      return 1000;
    case screenSize <= 1040:
      return 1020;
    case screenSize <= 1060:
      return 1040;
    case screenSize <= 1080:
      return 1060;
    case screenSize <= 1100:
      return 1080;
    case screenSize <= 1120:
      return 1100;
    case screenSize <= 1140:
      return 1120;
    case screenSize <= 1160:
      return 1140;
    case screenSize <= 1180:
      return 1160;
    case screenSize <= 1200:
      return 1180;
    case screenSize <= 1220:
      return 1200;
    case screenSize <= 1240:
      return 1220;
    case screenSize <= 1260:
      return 1240;
    case screenSize <= 1280:
      return 1260;
    case screenSize <= 1300:
      return 1280;
    case screenSize <= 1320:
      return 1300;
    case screenSize <= 1340:
      return 1320;
    case screenSize <= 1360:
      return 1340;
    case screenSize <= 1380:
      return 1360;
    case screenSize < 1400:
      return 1380;
    default:
      return screenSize - 20;
  }
};

export default controlWidth;
