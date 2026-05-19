import { Outlet } from "react-router-dom";
import useWindowSize from "../../hooks/useWindowSize";

const MainLayout = () => {
  const { width } = useWindowSize();
  const isMobile = width !== undefined && width < 768;

  if (isMobile) {
    return (
      <div className="mobile-wrapper">
        <main className="mobile-content">
          <Outlet />
        </main>
      </div>
    );
  } else {
    return (
      <div className="desktop-wrapper">
        <main className="desktop-content">
          <Outlet />
        </main>
      </div>
    );
  }
};
export default MainLayout;
