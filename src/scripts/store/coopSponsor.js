import { action, observable } from 'mobx';
import moment from 'moment';
import { message } from 'antd';
import { sponsorApi } from '../const/api';
import { APPLY_QUERY_TYPE_MAP } from '../const/map';

const nowDate = moment().format('YYYY-MM-DD');
export default class CoopSponsor {
  @observable pageType = 'approved';

  @observable OAType = 'OA';

  @observable counts = {
    draftCount: 0,
    approvalCount: 0,
    offCount: 0,
    revokeCount: 0,
    oaUnApproveCount: 0,
    extSysUnApproveCount: 0,
  };

  @observable listData = [];

  @observable flowTypeList = [];

  @observable extSysProcessKeys = [];

  @observable moreSearchVisible = false;

  @observable pagination = {
    page: 0,
    pageSize: 10,
  };

  @observable searchParams = {
    userId: '',
    finishBeginTime: nowDate,
    finishEndTime: nowDate,
    flowType: '',
    key: '',
    status: 4,
    submitBeginTime: nowDate,
    submitEndTime: nowDate,
  };

  @observable imgSrc = '';

  @action.bound
  reset() {
    this.moreSearchVisible = false;
    this.OAType = 'OA';
    this.pagination = {
      page: 0,
      pageSize: 10,
    };
    this.searchParams = {
      userId: '',
      finishBeginTime: nowDate,
      finishEndTime: nowDate,
      flowType: '',
      key: '',
      status: 4,
      submitBeginTime: nowDate,
      submitEndTime: nowDate,
    };
  }

  @action.bound
  setPageType(type) {
    this.pageType = type;
  }

  @action.bound
  setOAType(type) {
    this.OAType = type;
  }

  @action.bound
  async getCounts() {
    const res = await http.get(sponsorApi.getCounts);
    this.counts = res.data.data;
  }

  @action.bound
  async getFlowTypeList() {
    // 放到commonData里 只需取一次
    const res = await http.post(sponsorApi.getFlowTypeList, {
      dept: '',
    });
    this.flowTypeList = [
      {
        formKey: '',
        formName: '全部',
      },
      ...res.data.data,
    ];
  }

  @action.bound
  async getExtSysProcessKeys() {
    const res = await http.post(sponsorApi.getExtSysProcessKeys);
    this.extSysProcessKeys = [
      '全部',
      ...res.data.data,
    ];
  }

  @action.bound
  clearListData() {
    this.searchParams = {
      userId: '',
      finishBeginTime: nowDate,
      finishEndTime: nowDate,
      flowType: '',
      key: '',
      status: 4,
      submitBeginTime: nowDate,
      submitEndTime: nowDate,
    };
    this.listData = [];
  }
  @action.bound
  async getList(param, type) {
    let getParams = {
      ...this.searchParams,
      queryType: APPLY_QUERY_TYPE_MAP[this.pageType],
      page: this.pagination.current,
      size: this.pagination.pageSize,
      ...param,
    };
    if (this.moreSearchVisible && this.pageType === 'unapproved') {
      getParams = {
        ...getParams,
        finishBeginTime: '',
        finishEndTime: '',
      };
    }
    if (!this.moreSearchVisible) {
      getParams = {
        ...getParams,
        finishBeginTime: '',
        finishEndTime: '',
        submitBeginTime: '',
        submitEndTime: '',
      };
    }
    const res = (type === 'extSys' ? await http.post(sponsorApi.getExtSysList, getParams) : await http.post(sponsorApi.getList, getParams));
    const d = res.data.data;
    this.listData = d.content;
    this.pagination = {
      ...this.pagination,
      current: param.page,
      total: d.total,
    };
  }

  @action.bound
  updateSearchParams(changedParams) {
    this.searchParams = {
      ...this.searchParams,
      ...changedParams,
    };
  }

  @action.bound
  toggleMoreSearch() {
    this.moreSearchVisible = !this.moreSearchVisible;
  }

  @action.bound
  async showPicture(record) {
    try {
      const res = await http.post(sponsorApi.viewProcessPic, {
        flowId: record.flowOrder.id,
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
}
