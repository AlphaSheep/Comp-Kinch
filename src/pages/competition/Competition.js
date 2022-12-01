import React, { useState } from 'react';
import PageLayout from '../../layout/PageLayout';
import { useParams } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';

import ResultsTable from '../../components/results-table/ResultsTable'

const Competition = () => {
  const { compid } = useParams();
  const [ compTitle, setCompTitle ] = useState(<span> <LoadingOutlined /> &nbsp; Loading competition data</span>)

  return (
    <PageLayout title={compTitle}>
      <ResultsTable compid={compid} setCompTitle={setCompTitle}/>
    </PageLayout>
  );
};

export default Competition;
