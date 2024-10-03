import { LottieOptions, useLottie } from "lottie-react";
import TypingJson from "../../assets/lotties/Typing-1.json";

const style = {
  height: 35,
};

const options: LottieOptions<"svg"> = {
  animationData: TypingJson,
  autoPlay: true,
  loop: true,
};

const Typing = () => {
  const lottieObj = useLottie(options, style);
  lottieObj.setSpeed(1.3);
  lottieObj.play();

  return lottieObj.View;
};
export default Typing;
