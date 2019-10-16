import { observable, action } from 'mobx';
import { navList } from './localData.js';

const SYSTEM_ROLE_TYPE = 'SYSTEM_ADMIN';
const ACTIVITY_ROLE_TYPW = 'ACTIVITI_ADMIN';
export default class CommonData {
  @observable menuList = [];

  @observable navList = [];

  @action.bound
  getNavList(authority) {
    let list = navList;
    if (authority.findIndex(item => item.roleType === SYSTEM_ROLE_TYPE) < 0) {
      list = list.filter(l => l.key !== '/manage');
    }
    if (authority.findIndex(item => item.roleType === ACTIVITY_ROLE_TYPW) < 0) {
      list = list.filter(l => l.key !== '/template');
    }
    if (authority.findIndex(item => item.roleType === ACTIVITY_ROLE_TYPW) < 0) {
      list = list.filter(l => l.key !== '/system');
    }
    this.navList = list;
  }
}
