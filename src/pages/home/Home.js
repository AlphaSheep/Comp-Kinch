import React from 'react';
import PageLayout from '../../layout/PageLayout';
import CompetitionListContainer from '../../components/competition-list/CompetitionList'

class Home extends React.Component {
  componentDidMount() {
    document.title = "Competition KinchRanks: Overall rankings for WCA Competitions"
  }

  render() {
    return (
      <PageLayout title="Home">
      <>
        <CompetitionListContainer></CompetitionListContainer>
      </>      
      </PageLayout>
    );
  }
}

export default Home;
