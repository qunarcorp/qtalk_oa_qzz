// import { parseUrl } from '../lib/util';
import { message } from 'antd';
import { commonApi, userApi, qtalkApi } from 'CONST/api';
import { action, observable } from 'mobx';

// @withRouter
export default class User {
  @observable checkUserVisible = false;
  @observable checkUser = '';
  @observable isCheckUserVisible = false;
  // 先去cookie中请求userCode，再checkLogin，两道检验，防止前端cookie人为修改
  @observable userInfo = {
    currentAuthority: [],
  };
  @observable isLogin = false;
  @observable qtalk = '';

  constructor() {}

  @action.bound
  async login(params) {
    try {
      await http.post(userApi.login, params);
      message.success('登录成功');
      this.isLogin = true;
      location.href = '#/home/work';
      location.reload(true);
    } catch (e) {
      message.error(e);
    }
  }

  @action.bound
  async getUser() {
    try {
      this.isLogin = true;
      const res = await http.get(userApi.getUser);
      this.userInfo = res.data.data;
      this.qtalk = this.userInfo.qtalk;
    } catch (e) {
    }
  }

  @action.bound
  async logout() {
    const data = await http.get(commonApi.logout);
    if (data) {
      this.isLogin = false;
      location.href = '#/login';
      window.location.reload(true);
    }
  }

  @action.bound
  async addQtalkMucUser(){
    const data = await http.post(qtalkApi.addQtalkMucUser, {});
    if (data) {
      message.info('请在Qtalk查看对话，谢谢~');
    } else {
    }
  }

  @action.bound
  async setCheckUserVisible() {
    this.isCheckUserVisible = !this.isCheckUserVisible;
  }

  @action.bound
  async checkUserFn(val) {
    if (this.checkUser === '') {
      message.error('请选择用户');
      return;
    }
    try {
      const res = await http.post(userApi.changeUser, {
        qtalk: this.checkUser,
        password: '',
      });
      this.userInfo = res.data.data;
    } catch (e) {
      message.error(e);
    }
    this.isCheckUserVisible = false;
    location.href = 'index.html';
    location.reload();
  }

  @action.bound
  async setCheckUser(val) {
    this.checkUser = val;
  }
}
