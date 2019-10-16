import { message } from 'antd';
import md5 from 'md5';
import { action, observable } from 'mobx';
import { detailApi, tpltApi } from '../const/api';
import {} from '../const/map';

const INIT_COMP_DATA = {
  type: '',
  title: '',
  options: '',
  showOptions: '',
  columns: [],
  labelWidth: 8,
  width: 8,
  isSummary: false,
  isCondition: false,
  isConditionEdit: false,
  conditionLinkCode: '',
  required: false,
  placeholder: '',
};
export default class TpltCreate {
  @observable pageType = 'detail';

  @observable isJsonEdit = false;

  @observable tplt = {
    key: '',
    name: '',
    isConditionDepartment: false,
    conditionDepartment: '',
    groups: [
      {
        title: '基本信息',
        id: '基本信息',
        children: [],
      },
    ],
  };

  @observable tpltJson = {};

  @observable compModalVisible = false;

  @observable compModalType = 'add';

  @observable groupModalVisible = false;

  @observable groupModalType = 'add';

  @observable compModalData = {};

  @observable departList = [];

  checkChildrenGroup = (children) => {
    const tag = {};
    return children.every((item) => {
      const { title } = item;
      if (tag[title]) {
        message.error('小组内不可以设置重复名字');
        return false;
      }
      tag[title] = true;
      return true;
    });
  }

  checkTpltValue() {
    const { groups } = this.tplt;
    const tag = {};
    return groups.every((item) => {
      const { title, children } = item;
      if (tag[title]) {
        message.error('小组标题不可以重复');
        return false;
      }
      tag[title] = true;
      if (children.length) {
        return this.checkChildrenGroup(children);
      }
      return true;
    });
  }

  @action.bound
  getCompModalData() {
    const data = {};
    Object.keys(this.compModalData).forEach((key) => {
      data[key] = this.compModalData[key].value;
    });
    return data;
  }

  @action.bound
  setCompModalData(props, needFmt) {
    const params = { ...props };
    if (needFmt) {
      Object.keys(params).forEach((key) => {
        params[key] = {
          value: params[key],
        };
      });
    }
    this.compModalData = {
      ...this.compModalData,
      ...params,
    };
  }

  @action.bound
  initCompModalData() {
    this.setCompModalData(INIT_COMP_DATA, true);
  }

  @action.bound
  async getDepartList() {
    const res = await http.get(tpltApi.getAllDept);
    this.departList = res.data.data;
  }

  @action.bound
  setTpltJson(params) {
    this.tpltJson = params;
  }

  @action.bound
  setIsJsonEdit(val) {
    if (!val) {
      this.setTplt(this.tpltJson);
    }
    this.isJsonEdit = val;
  }

  @action.bound
  setIsConditionDepartment(val) {
    this.setTplt({ isConditionDepartment: val });
  }

  @action.bound
  setConditionDepartment(val) {
    const { target = '' } = val;
    const { value = '' } = target;
    this.setTplt({ conditionDepartment: value });
  }

  @action.bound
  async getDetail(id, version) {
    try {
      const res = await http.post(detailApi.getTpltDetail, {
        formKey: id,
        formVersion: version,
      });
      this.tplt = res.data.data.formModelJson;
    } catch (e) {
      message.error(e);
    }
  }

  @action.bound
  setPageType(type) {
    this.pageType = type;
  }

  @observable groupModalData = {
    name: '',
  };

  @observable currGroup = {
    index: 0,
    info: {},
  };

  @observable currComp = {
    index: 0,
    info: {},
  };

  @action.bound
  setCurrGroup(params) {
    this.currGroup = {
      ...this.currGroup,
      ...params,
    };
  }

  @action.bound
  setCurrComp(params) {
    this.currComp = {
      ...this.currComp,
      ...params,
    };
  }

  @action.bound
  async update(param) {
    if (this.isJsonEdit) {
      this.setTplt(this.tpltJson);
    }
    if (this.checkTpltValue()) {
      const { name, department } = this.tplt;
      const res = await http.post(tpltApi.update, {
        formDept: department,
        formKey: this.tplt.key,
        formName: name,
        formModelJson: this.tplt,
        updateType: param,
      });
      message.success('更新成功');
      return res;
    }
    return null;
  }

  @action.bound
  async create() {
    if (this.isJsonEdit) {
      this.setTplt(this.tpltJson);
    }
    if (this.checkTpltValue()) {
      const { name, department } = this.tplt;
      const mdkValue = `${department}${name}`;
      const md5Key = `m${md5(mdkValue)}`;
      const res = await http.post(tpltApi.create, {
        formDept: department,
        formKey: md5Key,
        formName: name,
        formModelJson: {
          ...this.tplt,
          key: md5Key,
        },
      });
      message.success('创建成功');
      return res;
    }
    return null;
  }

  @action.bound
  setCompModalVisible(value, type) {
    this.compModalVisible = value;
    this.compModalType = type || this.compModalType;
  }

  @action.bound
  setGroupModalVisible(value, type) {
    this.groupModalVisible = value;
    this.groupModalType = type || this.groupModalType;
  }

  @action.bound
  setTplt(params) {
    this.tplt = {
      ...this.tplt,
      ...params,
    };
  }

  @action.bound
  setGroupModalData(params) {
    this.groupModalData = {
      ...this.groupModalData,
      ...params,
    };
  }
}
