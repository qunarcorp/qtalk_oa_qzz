import { observable, action } from 'mobx';
import { message } from 'antd';
import { processApi } from '../const/api';
import { statusMap } from '../const/manageMap';

export default class Model {
  @observable
  pagination = {
    page: 1,
    pageSize: 10,
  };

  @observable modelList = [];

  @observable imgSrc = '';

  @observable newModelUrl = '';

  imgSrcMap = {};

  @observable searchValue = '';

  @action.bound
  async getModelList(param) {
    const params = {
      ...this.pagination,
      ...param,
    };
    try {
      const res = await http.post(processApi.getModelList, params);
      const d = res.data.data;
      this.modelList = d.content;
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
  async deployModel(record, history) {
    try {
      const { id } = record;
      const params = { id };
      const res = await http.post(processApi.deployModel, params);
      const { status } = res.data;
      if (status === 0) {
        message.success('部署成功');
        history.push('/manage/process');
      }
    } catch (e) {
      message.error('部署失败', e);
    }
  }

  @action.bound
  async addNewModel() {
    try {
      const res = await http.post(processApi.addNewModel);
      const { data } = res.data;
      this.newModelUrl = data;
    } catch (e) {
      message.error('创建新流程模型失败', e);
    }
    window.open(this.newModelUrl);
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
  async deleteModel({ id }) {
    try {
      const params = { id };
      const res = await http.post(processApi.deleteModel, params);
      const { status } = res.data;
      if (status === 0) {
        this.getModelList({
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
    this.modelList = newData;
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
