import { Outlet, useLocation } from "react-router-dom";
import useWindowSize from "../../hooks/useWindowSize";
import WhatsAppButton from "../../components/WhatsAppButton";

const MainLayout = () => {
  const { width } = useWindowSize();
  const location = useLocation();
  const isMobile = width !== undefined && width < 768;
  const isPropertyDetails = location.pathname.startsWith("/property/");

  const content = <Outlet />;

  return (
    <>
      {isMobile ? (
        <div className="mobile-wrapper">
          <main className="mobile-content">{content}</main>
        </div>
      ) : (
        <div className="desktop-wrapper">
          <main className="desktop-content">{content}</main>
        </div>
      )}
      {!isPropertyDetails && <WhatsAppButton />}
    </>
  );
};
export default MainLayout;
