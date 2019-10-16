import { observable, action, runInAction, autorun } from 'mobx';
import { homeApi, sponsorApi } from 'CONST/api';
import { APPLY_QUERY_TYPE_MAP } from 'CONST/map';
import { message } from 'antd';

export default class Home {
  @observable counts = {
    approveCount: 0,
    approved: 0,
    newOAApproveCount: 0,
  };
  // @observable mesWS = null;
  @observable messageList = [];
  @observable tplList = [];

  @action.bound
  async getMessage() {
    const res = await http.post(homeApi.getMessage, {});
    this.messageList = res.data.data.content;
    
    // this.mesWS.onopen = () => {
    //     console.log('open');
    //     // let paramsStr = JSON.stringify({
    //     //     jobName: this.name,
    //     //     taskId: row.taskId,
    //     //     logIndex: 0
    //     // });
    //     // this.mesWS.send(paramsStr);
    // };
    // this.mesWS.onmessage = (e) => {
    //     let res = JSON.parse(e.data);
    //     console.log(res, 'onmessage');
    // };
    // this.mesWS.onclose = () => {
    //     console.log("close");
    // }
  }

  @action.bound
  leave() {
    // if (this.mesWS) {
    //     this.mesWS.close();
    // }
    // this.mesWS = null;
  }

  @action.bound
  async getCounts() {
    const res = await http.post(homeApi.getCounts);
    this.counts = res.data.data;
  }

  @action.bound
  async getTpls() {
    const res = await http.post(homeApi.getTpls);
    this.tplList = res.data.data;
  }
}
