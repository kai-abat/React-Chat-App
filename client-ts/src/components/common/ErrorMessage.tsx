import { Stack } from "react-bootstrap";

const ErrorMessage = ({ message }: { message: string }) => {
  return <Stack className=" w-100 text-danger">{`* ${message}!!`}</Stack>;
};
export default ErrorMessage;
