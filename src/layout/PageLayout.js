import React from 'react';
import { Layout, PageHeader } from 'antd';

import './PageLayout.less';

const { Content } = Layout;

const PageLayout = ({ title, children }) => {
  return (
    <>
      <PageHeader title={title} />
      <Content className="page-content">{children}</Content>
    </>
  );
};

export default PageLayout;
