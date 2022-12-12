import React from 'react';
import { Layout, Menu, Divider } from 'antd';
import { Link } from 'react-router-dom';
import { HomeOutlined, QuestionCircleOutlined, GithubOutlined } from '@ant-design/icons';
import './MainLayout.less';
import { ThemeButton, ThemeContext } from '../theme/themes';


const { Footer, Sider } = Layout;

const rootRoutes = ['/', '/about'];
const aboutSubRoutes = ['/about/me', '/about/company'];

export default class MainLayout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: true
    };
  }

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  render() {
    const { collapsed } = this.state;
    const { children } = this.props;

    const menuItems = [
      {
        key: "home",
        label: <Link to="/">Home</Link>,
        icon: <HomeOutlined />
      },
      {
        key: "about",
        label: <Link to="/about">About</Link>,
        icon: <QuestionCircleOutlined />
      }
    ]

    return (      
      <ThemeContext.Consumer>
        {({ theme }) => <Layout className={theme} hasSider>
            <Sider className='sider' collapsible collapsed={collapsed} onCollapse={this.onCollapse} collapsedWidth="48">
              <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={[
                  aboutSubRoutes.includes(window.location.pathname)
                    ? '1'
                    : rootRoutes.indexOf(window.location.pathname).toString(),
                ]}
                items={menuItems}
              />       
            </Sider>
            <Layout>
              {children}
              <Footer>
                <ThemeButton />
                <Divider type="vertical" />
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/AlphaSheep/Comp-Kinch"
                >
                  <GithubOutlined /> &nbsp;
                  GitHub
                </a>     
              </Footer>
            </Layout>
          </Layout>}
      </ThemeContext.Consumer>
    );
  }
}
