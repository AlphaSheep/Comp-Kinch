import React from 'react';
import { useLocation } from 'react-router-dom';
import PageLayout from '../../layout/PageLayout';
import CompetitionListContainer from '../../components/competition-list/CompetitionList'

const Home = () => {

  let location = useLocation();
  if (location.pathname !== '/') {
    return null;
  }

  return (
    <PageLayout title="Home">
      <>
        <CompetitionListContainer></CompetitionListContainer>
      </>      
    </PageLayout>
  );
};

export default Home;
