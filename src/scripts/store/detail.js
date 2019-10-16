import { observable, action } from 'mobx';
import { message } from 'antd';
import { detailApi, sponsorApi } from '../const/api';

export default class Detail {
  @observable step = 0;

  @observable drawerVisible = false;

  @observable transferUser = '';

  @observable isTransferVisible = false;

  @observable isMemoVisible = false;

  @observable memoType = '';

  @observable memo = '';

  @observable id = '';

  @observable processKeys = '';

  @observable pageType = 'create';

  @observable department = '全部部门';

  @observable departList = [];

  @observable formMark = '';

  @observable tplt = '';

  @observable tpltList = [];

  @observable extSysTpltList = [];

  @observable detail = {
    approveUsers: '',
    canRevokeOrBack: '',
    approveLogs: [],
  };

  @observable tpltDetail = {};

  @observable editNodeName = [];

  @observable formData = {};

  @observable record = {};

  @observable imgSrc = '';

  @observable currentButton = 'agree';

  @action.bound
  setMemoVisible(val, type, error, formData) {
    this.formData = formData;
    if (error && type === 'agree') {
      Object.values(error).map(errorChild1 => Object.values(errorChild1).map(errorChild2 => Object.values(errorChild2).map(errorChild3 => errorChild3.map(errorChild4 => message.error(`${errorChild4.message} : ${errorChild4.field}`),),),),);
    } else {
      this.isMemoVisible = val;
      this.memoType = type || '';
      if (!val) {
        this.setMemo('');
      }
    }
  }

  @action.bound
  setListMemoVisible(val, type, record) {
    this.record = record;
    this.isMemoVisible = val;
    this.memoType = type || '';
    if (!val) {
      this.setMemo('');
    }
  }

  @action.bound
  setMemo(val) {
    this.memo = val;
  }

  @action.bound
  setDrawerVisible(val) {
    this.drawerVisible = val;
  }

  @action.bound
  setIsTransferVisible(val) {
    this.isTransferVisible = val;
  }

  @action.bound
  setTransferUser(val) {
    this.transferUser = val;
  }

  @action.bound
  getExtSysTpltDetail(tplt, processKeys) {
    this.extSysTpltList.map((item) => {
      if (item.oid === tplt && item.processKeys === processKeys) {
        this.tpltDetail = {
          name: item.title,
          redirectUrl: item.redirectUrl,
        };
      }
      return true;
    });
  }

  @action.bound
  async getTpltDetail(key) {
    try {
      const res = await http.post(detailApi.getTpltDetail, {
        formKey: key,
      });
      this.tpltDetail = res.data.data.formModelJson;
      this.editNodeName = res.data.data.editNodeName;
    } catch (e) {
      message.error(e);
    }
  }

  @action.bound
  async countersign(history) {
    const formData = {
      ...this.formData,
      summary: Detail.getSummay(this.tpltDetail, this.formData),
    };
    try {
      await http.post(detailApi.countersign, {
        flowId: this.id,
        forwardUserId: this.transferUser,
        memo: this.memo,
        formDatas: formData,
      });
      this.setMemo('');
      message.success('加签成功');
      history.push('/cooperate/unapproved');
    } catch (e) {
      message.error(e);
    }
  }

  @action.bound
  async hold(history) {
    const formData = {
      ...this.formData,
      summary: Detail.getSummay(this.tpltDetail, this.formData),
    };
    try {
      await http.post(detailApi.hold, {
        flowId: this.id,
        memo: this.memo,
        formDatas: formData,
      });
      message.success('已转交');
      this.setMemo('');
      history.push('/cooperate/unapproved');
    } catch (e) {
      message.error(e);
    }
  }

  @action.bound
  async transfer(history) {
    const formData = {
      ...this.formData,
      summary: Detail.getSummay(this.tpltDetail, this.formData),
    };
    try {
      await http.post(detailApi.transfer, {
        flowId: this.id,
        forwardUserId: this.transferUser,
        memo: this.memo,
        formDatas: formData,
      });
      message.success('已转交');
      this.setMemo('');
      history.push('/cooperate/unapproved');
    } catch (e) {
      message.error(e);
    }
  }

  @action.bound
  async agree(history) {
    const formData = {
      ...this.formData,
      summary: Detail.getSummay(this.tpltDetail, this.formData),
    };
    try {
      await http.post(detailApi.agree, {
        flowId: this.id,
        memo: this.memo,
        formDatas: formData,
      });
      message.success('已通过');
      history.push('/cooperate/unapproved');
    } catch (e) {
      message.error(e);
    }
  }

  @action.bound
  async reject(history) {
    const formData = {
      ...this.formData,
      summary: Detail.getSummay(this.tpltDetail, this.formData),
    };
    try {
      await http.post(detailApi.reject, {
        flowId: this.id,
        memo: this.memo,
        formDatas: formData,
      });
      message.success('已拒绝');
      history.push('/cooperate/unapproved');
    } catch (e) {
      message.error(e);
    }
  }

  @action.bound
  async revoke(history) {
    const formData = {
      ...this.formData,
      summary: Detail.getSummay(this.tpltDetail, this.formData),
    };
    try {
      await http.post(detailApi.revoke, {
        flowId: this.id,
        memo: this.memo,
        formDatas: formData,
      });
      message.success('已撤销');
      history.push('/cooperate/sponsor');
    } catch (e) {
      message.error(e);
    }
  }

  @action.bound
  async revokeRecord(history) {
    try {
      await http.post(detailApi.revoke, {
        flowId: this.record.flowOrder.id,
        memo: this.memo,
      });
      message.success('已撤销');
      history.go(0);
    } catch (e) {
      message.error(e);
    }
  }

  @action.bound
  async showPicture() {
    try {
      const res = await http.post(sponsorApi.viewProcessPic, {
        flowId: this.id,
        forwardUserId: '',
        memo: '',
      });
      const {
        data: { data },
      } = res;
      this.imgSrc = data;
    } catch (e) {
      message.error('当前流程图不支持查看');
    }
  }

  @action.bound
  closeModal() {
    this.imgSrc = '';
  }

  @action.bound
  async notify() {
    try {
      await http.post(detailApi.notify, {
        flowId: this.id,
      });
      message.success('催他啦~');
    } catch (e) {
      message.error(e);
    }
  }

  @action.bound
  async getDetail(id) {
    this.id = id;
    const res = await http.post(detailApi.getDetail, {
      flowId: id,
    });
    const { data } = res.data;
    this.detail = data;
    this.tpltDetail = data.formModelJson;
    this.editNodeName = data.editNodeName;
    return data;
  }

  @action.bound
  setPageType(type) {
    this.pageType = type;
  }

  @action.bound
  async getCounts() {
    const res = await http.get(detailApi.getCounts);
    this.counts = res.data.data;
  }

  @action.bound
  async getDepartList() {
    const res = await http.get(detailApi.getDepartList);
    this.departList = res.data.data;
  }

  @action.bound
  async getTpltList() {
    const res = await http.post(detailApi.getTpltList, {
      dept: this.department,
    });
    this.tpltList = res.data.data;
  }

  @action.bound
  async getExtSysTpltList() {
    const res = await http.post(detailApi.getExtSysTpltList);
    this.extSysTpltList = res.data.data;
  }

  @action.bound
  async submit(dataParam) {
    const data = {
      ...dataParam,
      summary: Detail.getSummay(this.tpltDetail, dataParam),
    };
    try {
      await http.post(detailApi.submit, {
        flowKey: this.tplt,
        formDatas: data,
      });
      this.nextStep();
    } catch (e) {
      message.error(e);
    }
  }

  @action.bound
  static getSummay(tplt, data) {
    const res = [];
    tplt.groups.forEach((group) => {
      group.children.forEach((child) => {
        if (child.isSummary) {
          res.push(
            `${child.title}: ${
              data[group.title][child.title]
                ? data[group.title][child.title]
                : '无'
            }`,
          );
        }
      });
    });
    return res;
  }

  @action.bound
  async nextStep() {
    const { redirectUrl = '' } = this.tpltDetail;
    if (this.step < 1 && this.formMark === 'extSys') {
      await this.openExtSysFormUrl(redirectUrl);
    } else {
      this.step = this.step + 1;
    }
  }

  @action.bound
  async openExtSysFormUrl(redirectUrl) {
    try {
      window.open(redirectUrl);
    } catch (e) {
      message.error('打开外部表单模版失败', e);
    }
  }

  @action.bound
  setStep(step) {
    this.step = step;
  }

  @action.bound
  setDepart(department) {
    this.department = department;
    this.getTpltList();
    this.getExtSysTpltList();
  }

  @action.bound
  async setTplt(tplt) {
    const tpltMark = tplt.split(',');
    if (Array.isArray(tpltMark) && tpltMark.length === 3) {
      this.tplt = tpltMark[0];
      this.processKeys = tpltMark[1];
      this.formMark = tpltMark[2];
    } else if (Array.isArray(tpltMark) && tpltMark.length === 2) {
      this.tplt = tpltMark[0];
      this.formMark = tpltMark[1];
    } else {
      this.tplt = tplt;
    }
    if (this.pageType === 'create' && this.tplt) {
      if (this.formMark === 'extSys') {
        await this.getExtSysTpltDetail(this.tplt, this.processKeys);
      } else {
        await this.getTpltDetail(this.tplt);
      }
    }
  }

  @action.bound
  reset() {
    this.step = 0;
    this.detail = {
      approveUsers: '',
      approveLogs: [],
      canRevokeOrBack: '',
    };
    this.department = '';
    this.tplt = '';
    this.processKeys = '';
    this.formMark = '';
    this.tpltList = [];
    this.extSysTpltList = [];
    this.tpltDetail = {};
    this.editNodeName = [];
  }

  @action.bound
  changeCurrentButton(who) {
    this.currentButton = who;
  }
}
