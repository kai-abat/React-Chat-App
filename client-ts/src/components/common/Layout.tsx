import { ReactNode } from "react";
import { Container, Stack } from "react-bootstrap";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <Container className="new-main-container">
      {/* <Stack className="container-content">{children}</Stack> */}
      {children}
    </Container>
  );
};

const NavBar = ({ children }: { children: ReactNode }) => {
  return <Stack className="layout-navbar">{children}</Stack>;
};

const Body = ({ children }: { children: ReactNode }) => {
  return (
    <Stack direction="horizontal" className="layout-body h-100" gap={3}>
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
    <Stack className={`layout-content ${!isGrow && "flex-grow-0"}`} gap={3}>
      {children}
    </Stack>
  );
};

const Footer = ({ children }: { children: ReactNode }) => {
  return <Stack className="layout-footer">{children}</Stack>;
};

Layout.NavBar = NavBar;
Layout.Body = Body;
Layout.Content = Content;
Layout.Footer = Footer;

export default Layout;
