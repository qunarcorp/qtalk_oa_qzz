import { action, observable } from 'mobx';
import { message } from 'antd';
import { oaUserApi } from '../const/api';

export default class OAUser {
  @observable oaUserList = [];

  @observable oaUserInfo = '';

  @observable searchValue = '';

  @observable id = '';

  @observable pagination = {
    page: 1,
    pageSize: 10,
  };

  @observable showAddModal = false;

  @observable showEditSelfModal = false;

  @observable showEditPasswordModal = false;

  @observable editOAUser = false;

  @action.bound
  async getAllUserList(param) {
    const params = {
      ...this.pagination,
      ...param,
    };
    try {
      const res = await http.post(oaUserApi.getAllUserList, params);
      const d = res.data.data;
      this.oaUserList = d.content;
      this.pagination = {
        ...this.pagination,
        current: param.page,
        k: this.searchValue,
        total: d.total,
      };
    } catch (e) {
      message.error('获取全部用户信息失败', e);
    }
  }

  @action.bound
  async deleteUser(record) {
    const { id } = record;
    const param = { id };
    const res = await http.post(oaUserApi.deleteUserById, param);
    const { status } = res.data;
    if (status === 0) {
      message.success('删除成功');
      this.getAllUserList({
        page: 1,
        pageSize: 10,
      });
    }
  }

  @action.bound
  changeSearchValue(e) {
    this.searchValue = e.target.value;
  }

  @action.bound
  setSearchValue(e) {
    this.searchValue = (e === 'company' ? '' : e);
  }

  @action.bound
  openAddModal() {
    this.showAddModal = true;
  }

  @action.bound
  openEditSelfModal() {
    this.showEditSelfModal = true;
  }

  @action.bound
  closeAddModal() {
    this.showAddModal = false;
    this.id = '';
    this.oaUserInfo = '';
    this.editOAUser = false;
  }

  @action.bound
  closeEditSelfModal() {
    this.showEditSelfModal = false;
    this.getOAUserInfoSelf();
  }

  @action.bound
  closeEditPasswordModal() {
    this.showEditPasswordModal = false;
    this.id = '';
    this.oaUserInfo = '';
  }

  @action.bound
  async openEditModal(record) {
    const { id } = record;
    this.id = id;
    const res = await http.post(oaUserApi.getUserInfoById, {
      id: id,
    });
    this.oaUserInfo = res.data.data;
    this.showAddModal = true;
    this.editOAUser = true;
  }

  @action.bound
  async openEditPasswordModal(record) {
    const { id } = record;
    this.id = id;
    const res = await http.post(oaUserApi.getUserInfoById, {
      id: id,
    });
    this.oaUserInfo = res.data.data;
    this.showEditPasswordModal = true;
  }

  @action.bound
  async getOAUserInfoSelf() {
    try {
      const res = await http.get(oaUserApi.getUserInfo);
      this.oaUserInfo = res.data.data;
      const { id } = this.oaUserInfo;
      this.id = id;
    } catch (e) {
      message.error('获取用户信息失败');
    }
  }

  @action.bound
  async handleUpdateSelf(values) {
    const params = {
      id: this.id,
      ...values,
    };
    const res = await http.post(oaUserApi.updateUserInfoSelf, params);
    const { status } = res;
    if (status === 200) {
      this.getOAUserInfoSelf();
      message.success('更新用户信息成功');
      this.showEditSelfModal = false;
    }
  }

  @action.bound
  async handleEditPassword(values) {
    const res = await http.post(oaUserApi.updateSelfPassword, values);
    const { status } = res;
    if (status === 200) {
      message.success('更新密码成功');
      this.showEditPasswordModal = false;
    }
  }

  @action.bound
  async adminUpdatePassword(values) {
    const params = {
      id: this.id,
      ...values,
    };
    const res = await http.post(oaUserApi.adminUpdatePassword, params);
    const { status } = res;
    if (status === 200) {
      message.success('更新用户密码成功');
      this.showEditPasswordModal = false;
    }
  }

  @action.bound
  async handleAddOrUpdate(values) {
    const params = this.editOAUser ? {
      id: this.id,
      ...values,
    } : {
      ...values,
    };
    const res = await http.post(this.editOAUser ? oaUserApi.updateUser : oaUserApi.addUser, params);
    const { status } = res;
    if (status === 200) {
      this.getAllUserList({
        page: 1,
        pageSize: 10,
      });
    }
    this.closeAddModal();
  }

  @action.bound
  reset() {
    this.id = '';
    this.oaUserList = [];
    this.oaUserInfo = '';
    this.searchValue = '';
    this.pagination = {
      page: 1,
      pageSize: 10,
    };
  }
}
