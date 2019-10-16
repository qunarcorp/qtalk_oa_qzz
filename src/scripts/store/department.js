import { observable, action } from 'mobx';
import { message } from 'antd';
import { departmentApi } from '../const/api';

export default class Department {
  @observable departmentTree = [];

  @observable departmentInfo = '';

  @observable id = '';

  @observable addDeptInfo = '';

  @observable addOrUpdate = 'add';

  @observable clickAddIcon = false;

  @action.bound
  async getDeptTrees() {
    const res = await http.get(departmentApi.getDeptTree);
    this.departmentTree = res.data.data;
  }

  @action.bound
  async getDeptInfo(params) {
    const { id } = params;
    const res = await http.post(departmentApi.getDepartmentInfo, {
      id: id,
    });
    this.departmentInfo = res.data.data;
  }

  @action.bound
  async handleAddOrUpdate(values) {
    const params = this.addOrUpdate === 'add' ? {
      ...values,
    } : {
      ...values,
      id : this.id,
    };
    const res = await http.post(this.addOrUpdate === 'add' ? departmentApi.addDept : departmentApi.updateDept, params);
    const { status } = res;
    if (status === 200) {
      this.getDeptTrees();
      message.success('操作成功');
      this.clickAddIcon = false;
    }
  }

  @action.bound
  async deleteDept() {
    const res = await http.post(departmentApi.deleteDept, {
      id: this.id,
    });
    const { status } = res.data;
    if (status === 0) {
      message.success('删除成功');
      this.getDeptTrees();
      this.departmentInfo = '';
    }
  }

  @action.bound
  setAddOrUpdate(param) {
    this.addOrUpdate = param;
  }

  @action.bound
  openIconAddForm() {
    this.clickAddIcon = true;
    this.addOrUpdate = 'add';
  }

  @action.bound
  setClickAddIcon(param) {
    if (param && !this.departmentInfo) {
      message.error('请选中父部门');
    } else {
      this.clickAddIcon = param;
    }
  }

  @action.bound
  addReset() {
    this.clickAddIcon = false;
    this.addOrUpdate = 'update';
  }

  @action.bound
  setId(param) {
    this.id = param;
  }

  @action.bound
  setAddDeptInfo() {
    this.addDeptInfo = {
      pid: this.departmentInfo.id,
      deep: this.departmentInfo.deep + 1,
    };
    this.departmentInfo = '';
  }

  @action.bound
  reset() {
    this.departmentTree = [];
    this.addOrUpdate = 'add';
    this.departmentInfo = '';
    this.id = '';
    this.addDeptInfo = '';
    this.clickAddIcon = false;
  }
}
