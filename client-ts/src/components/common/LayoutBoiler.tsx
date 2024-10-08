import { ReactNode } from "react";
import { Container, Stack } from "react-bootstrap";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <Container className="new-main-container">
      <Stack className="container-content">{children}</Stack>
    </Container>
  );
};

const NavBar = ({ children }: { children: ReactNode }) => {
  return <Stack>{children}</Stack>;
};

const Body = ({ children }: { children: ReactNode }) => {
  return (
    <Stack direction="horizontal" className="h-100" gap={3}>
      {children}
    </Stack>
  );
};

const Content = ({
  children,
  isGrow = true,
}: {
  children: ReactNode;
  isGrow?: boolean;
}) => {
  return (
    <Stack className={`body1 ${!isGrow && "flex-grow-0"}`} gap={3}>
      {children}
    </Stack>
  );
};

const Footer = ({ children }: { children: ReactNode }) => {
  return <Stack>{children}</Stack>;
};

Layout.NavBar = NavBar;
Layout.Body = Body;
Layout.Content = Content;
Layout.Footer = Footer;

export default Layout;
