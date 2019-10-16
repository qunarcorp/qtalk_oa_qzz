import Container from 'COMPONENT/container/index';
import ErrorBoundary from 'COMPONENT/errorBoundary';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { Router, Route } from 'react-router-dom';
import { ROUTER_MAP } from 'ROUTER';

const LogicRoute = ({ component: Component, logicData, isLogin, ...rest }) => (
  <ErrorBoundary>
    <Route {...rest} render={props => <Component {...props} />} />
  </ErrorBoundary>
);

@inject(state => ({
  history: state.history,
  router: state.router,
  name: state.store.name,
  commonData: state.store.commonData,
  user: state.store.user,
  isLogin: state.store.user.isLogin,
}))
@observer
class App extends Component {
  async componentDidMount() {
    if (!location.href.includes('#/login')) {
      await this.props.user.getUser();
      this.props.commonData.getNavList(
        this.props.user.userInfo.currentAuthority,
      );
    }
  }

  render() {
    const { isLogin } = this.props;
    return (
      <Router history={this.props.history}>
        {location.href.includes('#/login') ?
          (<div>
            {Object.keys(ROUTER_MAP)
              .map(key => {
                const item = ROUTER_MAP[key];
                const { path, exact, component } = item;
                return (
                  <LogicRoute
                    key={path}
                    logicData={item}
                    isLogin={isLogin}
                    exact={exact}
                    path={path}
                    component={component}
                  />
                );
              })}
          </div>)
          : (<Container>
            {Object.keys(ROUTER_MAP)
              .map(key => {
                const item = ROUTER_MAP[key];
                const { path, exact, component } = item;
                return (
                  <LogicRoute
                    key={path}
                    logicData={item}
                    isLogin={isLogin}
                    exact={exact}
                    path={path}
                    component={component}
                  />
                );
              })}
          </Container>)}
      </Router>
    );
  }
}

export default App;
