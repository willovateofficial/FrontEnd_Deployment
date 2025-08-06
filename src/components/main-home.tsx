import React from "react";
import Benefits from "./Benefits";
import Hero from "./Hero";
import PlansPage from "./PlansPage";
import WhyChooseUs from "./WhyChooseUs";
import HowItWorks from "./HowItWorks";
import FAQ from "./faq";

const MainHome = () => {
  return (
    <div className="bg-white">
      <Hero />
      <HowItWorks />
      <WhyChooseUs />
      <Benefits />
      <PlansPage />
      <FAQ />
    </div>
  );
};

export default MainHome;
