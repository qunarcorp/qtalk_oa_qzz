import { observable, action } from "mobx";

import { workGroupApi } from "CONST/api";

export default class WorkGroup {
  @observable
  pagination = {
    page: 1,
    pageSize: 10
  };
  @observable
  dataSource = [];
  @observable
  editingId = "";
  @observable
  showAddModal = false;
  @observable
  searchValue = '';

  @action.bound
  init() {
    this.searchValue = '';
    this.getList({
      page: 1,
      size: 10,
      search: "",
      members: "",
      name: ""
    });
  }

  @action.bound
  showModal() {
    this.showAddModal = true;
  }

  @action.bound
  closeModal() {
    this.showAddModal = false;
  }

  @action.bound
  changeSearchValue(e) {
    this.searchValue = e.target.value;
  }

  @action.bound
  async getList(param) {
    let params = {
      direction: "",
      sort: "",
      page: this.pagination.current,
      size: this.pagination.pageSize,
      ...param
    };
    const res = await http.post(workGroupApi.getWorkGroupList, params),
      d = res.data.data;
    const content = d.content;
    this.dataSource = content;
    this.pagination = {
      ...this.pagination,
      current: param.page,
      total: d.total
      // total: 50
    };
  }

  @action.bound
  edit(id) {
    this.editingId = id;
  }

  @action.bound
  cancel = () => {
    this.editingId = "";
  };

  @action.bound
  async save(form, id) {
    //row 更新的值
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.dataSource];
      const index = newData.findIndex(item => id === item.id);
      if (index > -1) {
        // item 旧值
        const item = newData[index];
        let params = {
          ...item,
          ...row,
          members: row["members"].join(",")
        };
        newData.splice(index, 1, params);
        this.dataSource = newData;
        this.editingId = "";
        http.post(workGroupApi.updateWorkGroup, params);
      } else {
        // TODO 请求处理还没有做
        newData.push(row);
        this.dataSource = newData;
        this.editingId = "";
      }
    });
  }

  @action.bound
  async deleteItem(id) {
    const dataSource = this.dataSource;
    const index = dataSource.findIndex(item => id === item.id);
    if (index > -1) {
      const params = dataSource[index];
      const res = await http.post(workGroupApi.deleteWorkGroup, params);
      const { status } = res;
      if (status === 200) {
        this.getList({
          page: this.pagination.current,
          size: this.pagination.pageSize,
          search: this.searchValue,
          members: "",
          name: ""
        });
      }
    }
  }

  @action.bound
  async handleAdd(values) {
    this.closeModal();
    const { members } = values;
    let params = {
      ...values,
      members: members.join(",")
    };
    const res = await http.post(workGroupApi.addWorkGroup, params);
    const { status } = res;
    if (status === 200) {
      this.getList({
        page: this.pagination.current,
        size: this.pagination.pageSize,
        search: "", 
        members: "",
        name: ""
      });
    }
  }
}
