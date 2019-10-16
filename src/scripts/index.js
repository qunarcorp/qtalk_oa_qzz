import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "mobx-react";
import { RouterStore, syncHistoryWithStore } from "mobx-react-router";
import zhCN from "antd/lib/locale-provider/zh_CN";
import { ConfigProvider } from "antd";
import { createHashHistory } from "history";
// import createHashHistory from "history/createHashHistory";
import "../styles/index.scss";

import ajax from "./util/ajaxConfig";
import App from "PAGE/app";
import ViewStore from "./store/index";
import utils from "./util/params.js";
import ErrorBoundary from "COMPONENT/errorBoundary";

import "../styles/index.scss";
const hashHistory = createHashHistory();
const routingStore = new RouterStore();
const history = syncHistoryWithStore(hashHistory, routingStore);

window.http = ajax;
window.utils = utils;
const stores = {
  history,
  router: routingStore,
  store: new ViewStore()
};

ReactDOM.render(
  <ErrorBoundary>
    <Provider {...stores}>
      <ConfigProvider locale={zhCN}>
        <App />
      </ConfigProvider>
    </Provider>
  </ErrorBoundary>,
  document.getElementById("app")
);

// hot-reload
if (module.hot) {
  module.hot.accept();
}
