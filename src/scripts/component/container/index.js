import {
  Avatar, Dropdown, Icon, Layout, Menu, Modal,
} from 'antd';
import autobind from 'autobind-decorator';
import SelectQtalk from 'COMPONENT/selectQtalk';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { navList } from 'STORE/localData.js';
import styles from './main.css';

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

@inject(state => ({
  history: state.history,
  router: state.router,
  pathname: state.router.location.pathname,
  navList: state.store.commonData.navList,
  getNavList: state.store.commonData.getNavList,
  isLogin: state.store.user.isLogin,
  login: state.store.user.login,
  logout: state.store.user.logout,
  userInfo: state.store.user.userInfo,
  setCheckUserVisible: state.store.user.setCheckUserVisible,
  isCheckUserVisible: state.store.user.isCheckUserVisible,
  checkUser: state.store.user.checkUser,
  checkUserFn: state.store.user.checkUserFn,
  setCheckUser: state.store.user.setCheckUser,
  addQtalkMucUser: state.store.user.addQtalkMucUser,
}))
@observer
class Container extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    selectTab: '',
    navHash: '',
    bread: '',
    selectedKeys: this.setIniSelectedKeys(),
    defaultOpenKeys: this.setIniDefaOpenKeys(),
  };

  setIniSelectedKeys() {
    const {
      location: { pathname = '/home/work' },
    } = this.props.history;
    const arr = pathname.split('/');
    return [`/${arr[1]}`, `/${arr[1]}/${arr[2]}`];
  }

  setIniDefaOpenKeys() {
    const {
      location: { pathname = '/home/work' },
    } = this.props.history;
    const arr = pathname.split('/');
    return arr[1] ? [`/${arr[1]}`] : ['/cooperate', '/home'];
  }

  componentWillMount() {
    this.initBread();
  }

  componentDidMount() {
    this.props.history.listen(this.syncUrl2Navi);
  }

  @autobind
  syncUrl2Navi(location) {
    const { pathname } = location;
    const arr = pathname.split('/');
    // selectedKeys数组第二项解释: key值匹配只取路径前两项,解释见 localData文件.
    const selectedKeys = [`/${arr[1]}`, `/${arr[1]}/${arr[2]}`];
    this.setState({
      selectedKeys,
    });
  }

  componentDidUpdate() {}

  componentWillReceiveProps(nextProps) {
    if (this.props.pathname !== nextProps.pathname) {
    }
  }

  initBread() {
    const hash = this.props.router.location.hash.slice(1);
    const firstClass = `/${hash.split('/')[1]}`;
    let bread = '';

    if (firstClass === '/home') {
      return {};
    }
    navList
      && navList.forEach((item) => {
        if (!item) {
          return;
        }
        if (firstClass === item.url) {
          bread += item.name;
          item.children.forEach((child) => {
            if (child && child.url === hash) {
              console.log(child.key);
              bread += ` / ${child.name}`;
            }
          });
        }
      });
    this.setState({
      navHash: hash,
      bread,
    });
    return {};
  }

  switchTab({ key, name }, childName) {
    this.initBread();
    this.setState({
      selectTab: key,
      bread: name ? `${name} / ${childName}` : childName,
    });
  }

  render() {
    const {
      navList,
      userInfo,
      logout,
      setCheckUserVisible,
      isCheckUserVisible,
      checkUser,
      checkUserFn,
      setCheckUser,
    } = this.props;
    const {
      selectTab, bread, selectedKeys, defaultOpenKeys,
    } = this.state;
    let isSystem = false;
    userInfo.currentAuthority.slice().forEach((item) => {
      if (item.roleType === 'SYSTEM_ADMIN') {
        isSystem = true;
      }
    });
    const menu = (
      <Menu>
        {isSystem ? (
          <Menu.Item onClick={setCheckUserVisible}>
            <Icon type="branches" className={styles.logout_icon} />
            切换用户
          </Menu.Item>
        ) : (
          ''
        )}
        <Menu.Item onClick={logout}>
          <Icon type="logout" className={styles.logout_icon} />
          退出登录
        </Menu.Item>
      </Menu>
    );
    return (
      <Layout style={{ height: '100vh' }}>
        <Header className={styles.header}>
          <Link
            to="/"
            onClick={this.switchTab.bind(this)}
            className={styles.homeTitle}
          >
            OA
          </Link>
          <div className={styles.menu} />
          <Dropdown overlay={menu}>
            <div className={styles.login}>
              <Avatar src={userInfo.avatar} alt="头像" className={styles.img} />
              <span>{userInfo.cname}</span>
              <span id="qsso-login" style={{ display: 'none' }}>
                登录
              </span>
            </div>
          </Dropdown>
        </Header>
        {this.props.router.location.hash === '#/home' ? (
          this.props.children
        ) : (
          <Layout>
            <Sider width={200} className={styles.sider}>
              {navList.length ? (
                <Menu
                  mode="inline"
                  theme="dark"
                  style={{ height: '100%', borderRight: 0 }}
                  selectedKeys={selectedKeys}
                  defaultOpenKeys={defaultOpenKeys}
                >
                  {navList.map((item) => {
                    if (item.children) {
                      return (
                        <SubMenu
                          key={item.key}
                          title={(
                            <span>
                              <Icon type={item.icon} />
                              <span>{item.name}</span>
                            </span>
)}
                        >
                          {item.children.map(child => (
                            <Menu.Item
                              key={child.key}
                              onClick={this.switchTab.bind(
                                this,
                                item,
                                child.name,
                              )}
                            >
                              <Link to={child.url}>{child.name}</Link>
                            </Menu.Item>
                          ))}
                        </SubMenu>
                      );
                    }
                    return (
                      <Menu.Item
                        key={item.key}
                        onClick={this.switchTab.bind(this, '', item.name)}
                      >
                        <div>
                          <Icon type={item.icon} />
                          <span>
                            <Link
                              to={item.url}
                              className={
                                  selectTab == item.key ? '' : styles.nav_item
                                }
                            >
                              {item.name}
                            </Link>
                          </span>
                        </div>
                      </Menu.Item>
                    );
                  })}
                </Menu>
              ) : null}
            </Sider>
            <Layout className={styles.body}>
              <div className={styles.cont_title}>
                <div className={styles.bread}>{bread}</div>
              </div>
              <Content className={styles.content}>
                {this.props.children}
              </Content>
            </Layout>
          </Layout>
        )}
        <Modal
          title="切换用户"
          visible={isCheckUserVisible}
          onOk={() => checkUserFn()}
          onCancel={() => {
            setCheckUserVisible(false);
          }}
        >
          <SelectQtalk
            changeValue={setCheckUser}
            inputValue={checkUser}
            placeholder="请输入切换用户"
            className="input_table_cell"
          />
        </Modal>
      </Layout>
    );
  }
}
export default withRouter(Container);
