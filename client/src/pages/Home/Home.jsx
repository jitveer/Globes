import useWindowSize from "../../hooks/useWindowSize";
import MobileHomeLayout from "./Home_Mobile/MobileHomeLayout";
import DesktopHomeLayout from "./Home_Desktop/DesktopHomeLayout";
import SEO from "../../components/SEO";

const MOBILE_BREAKPOINT = 768;

const Home = () => {
  const { width } = useWindowSize();

  if (width === undefined) {
    return null;
  }

  const isMobile = width < MOBILE_BREAKPOINT;

  return (
    <div className="home-page-content">
      <SEO
        title="Home"
        description="Find your dream property with Globes Properties. We offer a wide range of real estate options in Bangalore."
        keywords="Globes Properties, real estate, buy home Bangalore, real estate agency"
      />
      {/* {isMobile ? (
        <div>
          <MobileHomeLayout />
        </div>
      ) : (
        <DesktopHomeLayout />
      )} */}
      <DesktopHomeLayout />
    </div>
  );
};

export default Home;