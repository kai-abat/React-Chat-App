import { Outlet } from "react-router-dom";
import Layout from "./Layout";
import NaviBar from "./NaviBar";

const LayoutMain = () => {
  return (
    <Layout>
      <Layout.NavBar>
        <NaviBar />
      </Layout.NavBar>
      <Layout.Body>
        <Outlet />
      </Layout.Body>
      <Layout.Footer>This is the footer</Layout.Footer>
    </Layout>
  );
};
export default LayoutMain;
