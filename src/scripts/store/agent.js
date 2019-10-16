import { observable, action } from 'mobx';

import { agentApi, detailApi } from 'CONST/api';
import { allProcess } from 'CONST/manageMap';

export default class Agent {
  @observable
  pagination = {
    page: 1,
    pageSize: 10
  };
  @observable dataSource = [];
  // @observable editingKey = '';
  @observable editingId = '';
  @observable tpltList = [];
  @observable showAddModal = false;
  @observable searchValue = '';

  @action.bound
  init() {
    this.searchValue = '';
    this.getTpltList();
    this.getList({
      page: 1,
      size: 10,
      k: ''
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
      direction: '',
      sort: '',
      page: this.pagination.current,
      size: this.pagination.pageSize,
      ...param
    };
    const res = await http.post(agentApi.getAgentList, params),
      d = res.data.data;
    this.dataSource = d.content;
    this.pagination = {
      ...this.pagination,
      current: param.page,
      total: d.total
      // total: 50
    };
  }

  @action.bound
  async getTpltList() {
    const { obj } = allProcess;
    const params = {};
    const res = await http.post(detailApi.getTpltList, params),
      d = res.data.data;
    d.unshift(obj);
    this.tpltList = d;
  }

  @action.bound
  edit(id) {
    this.editingId = id;
  }

  @action.bound
  cancel = () => {
    this.editingId = '';
  };

  formatProcessID(newFlowModels) {
    let processID = '';
    newFlowModels.forEach(item => {
      const { formKey = '' } = item;
      processID = processID ? processID + ',' + formKey : formKey;
    });
    return processID;
  }

  formatFlowModels(flowModels) {
    const { str, obj } = allProcess;
    if (flowModels.indexOf(str) !== -1) {
      return [obj];
    }
    let newFlowModels = [];
    flowModels.forEach(item => {
      newFlowModels.push(JSON.parse(item));
    });
    return newFlowModels;
  }

  @action.bound
  async save(form, id) {
    //row 更新的值
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.dataSource];
      const index = newData.findIndex(item => id === item.id);
      const { flowModels = [] } = row;
      let newFlowModels = this.formatFlowModels(flowModels);
      if (index > -1) {
        // item 旧值
        const item = newData[index];
        let params = {
          ...item,
          ...row,
          flowModels: newFlowModels,
          deadline: row['deadline'].format('YYYY-MM-DD HH:mm:ss'),
          processID: this.formatProcessID(newFlowModels)
        };
        newData.splice(index, 1, params);
        this.dataSource = newData;
        this.editingId = '';
        http.post(agentApi.updateAgent, params);
      } else {
        // TODO 请求处理还没有做
        newData.push(row);
        this.dataSource = newData;
        this.editingId = '';
      }
    });
  }

  @action.bound
  async deleteItem(id) {
    const dataSource = this.dataSource;
    const index = dataSource.findIndex(item => id === item.id);
    if (index > -1) {
      const params = dataSource[index];
      const res = await http.post(agentApi.deleteAgent, params);
      const { status } = res;
      if (status === 200) {
        this.getList({
          page: this.pagination.current,
          size: this.pagination.pageSize,
          k: this.searchValue
        });
      }
    }
  }

  @action.bound
  async handleAdd(values) {
    this.closeModal();
    let params = {
      ...values,
      deadline: values['deadline'].format('YYYY-MM-DD HH:mm:ss'),
      processID: values['processID'].join(',')
    };
    const res = await http.post(agentApi.addAgent, params);
    const { status } = res;
    if (status === 200) {
      this.getList({
        page: this.pagination.current,
        size: this.pagination.pageSize,
        k: ''
      });
    }
  }
}

