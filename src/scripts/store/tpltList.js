import { observable, action, runInAction, autorun } from 'mobx';
import { tpltApi, detailApi} from 'CONST/api';
import { FLOW_STATUS_MAP } from 'CONST/map';
import { message } from 'antd';

export default class TpltList {
    @observable listData = [];
    @observable pagination = {
        current: 0,
        pageSize: 10
    };
    @observable searchParams = {
        formName: ''
    };

    @action.bound
    async getList(param) {
        let getParams = {
            ...this.searchParams,
            page: this.pagination.page,
            size: this.pagination.pageSize,
            ...param
        };
        const res = await http.post(tpltApi.getList, getParams),
              d = res.data.data;
        this.listData = d.content;
        this.pagination = {
            ...this.pagination,
            current: param.page,
            total: d.totalElements
        }
    }
    @action.bound
    updateSearchParams(changedParams) {
        this.searchParams = {
            ...this.searchParams,
            ...changedParams
        }
    }

    @action.bound
    updateStatus(record, index) {
        const { flowStatus, id } = record;
        const { activate, suspend } = FLOW_STATUS_MAP;
        const newStatus = flowStatus == activate ? suspend : activate;
        const params = {
            id,
        flowStatus: newStatus
        };
        http.post(tpltApi.updateStatus, params);
        const newData = [...this.listData];
        newData[index].flowStatus = newStatus;
        this.listData = newData;
    }
}
