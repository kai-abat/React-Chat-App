import { Outlet } from "react-router-dom";
import Layout from "./Layout";
import NaviBar from "./NaviBar";
import { Stack } from "react-bootstrap";

const LayoutMain = () => {
  return (
    <Layout>
      <Layout.NavBar>
        <NaviBar />
      </Layout.NavBar>
      <Layout.Body>
        <Outlet />
      </Layout.Body>
      <Layout.Footer>
        <Stack className="footer">
          <strong>
            {`GChat App Powered by MERN Stack. Copyright © ${new Date().getFullYear()}. Develop by Kai`}
          </strong>
        </Stack>
      </Layout.Footer>
    </Layout>
  );
};
export default LayoutMain;
