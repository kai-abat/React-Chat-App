import { SvgProps } from "../../types/SvgPropTypes";

export function SvgComponent(props: SvgProps) {
  const defaultSize = "2rem";
  const defaultColor = "#FFFFFF";
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width ? props.width : defaultSize}
      height={
        props.height ? props.height : props.width ? props.width : defaultSize
      }
      viewBox="0 0 20 20"
      color={props.color ? props.color : defaultColor}
    >
      <path fill="currentColor" d={props.path}></path>
    </svg>
  );
}
