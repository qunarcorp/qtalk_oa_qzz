import React from "react";
import ReactDOM from "react-dom";
import "../styles/index.scss";
import Login from "PAGE/loginPage";
import ajax from "./util/ajaxConfig";
window.http = ajax;

ReactDOM.render(
    <Login />,
    document.getElementById("login")
  );
