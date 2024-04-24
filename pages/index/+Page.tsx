import React from "react";

import { HomeContainer } from "./Home.styled";
import { Header } from "../../components";
import { DefaultPageContainer } from "../../helpers";

const Home = () => {
  return (
    <DefaultPageContainer>
      <HomeContainer>
        <Header />
        <div>content</div>
      </HomeContainer>
    </DefaultPageContainer>
  );
};

export default Home;
