import { FC } from "react";
import HeroPage from "./HeroPage";
import BrandsSection from "./BrandsSection";

const MainPage: FC = () => {
  return (
    <div style={{ 
      margin: 0, 
      padding: 0, 
      width: '100%',
      overflowX: 'hidden' // Prevent horizontal scroll
    }}>
      {/* Hero section - takes full viewport */}
      <HeroPage />
      
      {/* Companies section - appears on scroll */}
      <BrandsSection />
      
      {/* Add other sections here */}
    </div>
  );
};
export default MainPage;








