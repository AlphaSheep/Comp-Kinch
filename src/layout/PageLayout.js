import React from 'react';
import { Layout, Typography } from 'antd';

import './PageLayout.less';

const { Content } = Layout;
const { Title } = Typography;

const PageLayout = ({ title, children }) => {
  return (
    <>
      <div className="page-header">
        <Title level={4} style={{ margin: '16px 24px' }}>{title}</Title>
      </div>
      <Content className="page-content">{children}</Content>
    </>
  );
};

export default PageLayout;
