import { observable, action } from 'mobx';
import { processApi } from '../const/api';
import { statusMap } from '../const/manageMap';

export default class Process {
  @observable
  pagination = {
    page: 1,
    pageSize: 10,
  };

  @observable deploymentList = [];

  @observable imgSrc = '';

  imgSrcMap = {};

  @observable searchValue = '';

  @action.bound
  async getDeploymentList(param) {
    const params = {
      ...this.pagination,
      ...param,
    };
    try {
      const res = await http.post(processApi.getProcessList, params);
      const d = res.data.data;
      this.deploymentList = d.content;
      this.pagination = {
        ...this.pagination,
        current: param.page,
        k: this.searchValue,
        total: d.total,
      };
    } catch (e) {
      console.log(e);
    }
  }

  @action.bound
  async showPicture(record, index) {
    try {
      const key = `imgSrc${index}`;
      if (this.imgSrcMap.hasOwnProperty(key)) {
        this.imgSrc = this.imgSrcMap[key];
        return;
      }
      const { deploymentId } = record;
      const params = { deploymentId };
      const res = await http.post(processApi.viewProcessPic, params);
      const {
        data: { data }
      } = res;
      this.imgSrc = data;
      this.imgSrcMap[key] = data;
    } catch (e) {
      console.log(e);
    }
  }

  @action.bound
  async deleteProcess({ deploymentId }) {
    try {
      const params = { deploymentId };
      const res = await http.post(processApi.deleteProcess, params);
      const { status } = res.data;
      if (status === 0) {
        this.getList({
          page: this.pagination.current,
          size: this.pagination.pageSize,
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  @action.bound
  updateState(record, index) {
    const { status, deploymentId } = record;
    const { activate, suspend } = statusMap;
    const newStatus = status === activate ? suspend : activate;
    const params = {
      deploymentId,
      status: newStatus,
    };
    http.post(processApi.updateProcess, params);
    const newData = [...this.deploymentList];
    newData[index].status = newStatus;
    this.deploymentList = newData;
  }

  @action.bound
  closeModal() {
    this.imgSrc = '';
  }

  @action.bound
  changeSearchValue(e) {
    this.searchValue = e.target.value;
  }
}
