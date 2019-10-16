import { action, observable } from 'mobx';
import { message } from 'antd';
import { oaAdminApi } from '../const/api';

export default class Admin {
  @observable adminList = [];

  @observable id = '';

  @observable pagination = {
    page: 1,
    pageSize: 10,
  };

  @observable showAddModal = false;

  @action.bound
  async getAllAdminList(param) {
    try {
      const res = await http.get(oaAdminApi.getAllAdminList);
      this.adminList = res.data.data;
      this.pagination = {
        ...this.pagination,
        current: param.page,
      };
    } catch (e) {
      message.error('获取全部管理员信息失败', e);
    }
  }

  @action.bound
  async deleteAdmin(record) {
    const param = {
      userName : record.username,
    };
    const res = await http.post(oaAdminApi.deleteAdminRole, param);
    const { status } = res.data;
    if (status === 0) {
      message.success('删除成功');
      this.getAllAdminList({
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
  openAddModal() {
    this.showAddModal = true;
  }

  @action.bound
  closeAddModal() {
    this.showAddModal = false;
  }

  @action.bound
  async handleAdd(values) {
    const params = {
      ...values,
    };
    const res = await http.post(oaAdminApi.addAdminRole, params);
    const { status } = res;
    if (status === 200) {
      this.getAllAdminList({
        page: 1,
        pageSize: 10,
      });
    }
    this.closeAddModal();
  }

  @action.bound
  reset() {
    this.adminList = [];
    this.pagination = {
      page: 1,
      pageSize: 10,
    };
  }
}
