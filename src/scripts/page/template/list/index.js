import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Input, Button, Table, Tag, Popconfirm, Divider } from 'antd';
import styles from './index.css';
import { Link, withRouter } from 'react-router-dom';
import { FLOW_STATUS_MAP } from '../../../const/map';

const Search = Input.Search;

@inject(state => ({
  history: state.history,
  user: state.store.user,
  tpltList: state.store.tpltList,
  list: state.store.list
}))
@withRouter
@observer
class TemplateList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { getList } = this.props.tpltList;
    getList({
      page: 1,
      size: 10,
    });
  }

  render() {
    const { activate } = FLOW_STATUS_MAP;
    const { updateStatus } = this.props.tpltList;
    const columns = [{
      title: '模板名称',
      dataIndex: 'formName',
    }, {
      title: '模板key',
      dataIndex: 'formKey',
    }, {
      title: '版本号',
      dataIndex: 'formVersion',
    }, {
      title: '模版状态',
      dataIndex: 'flowStatus',
      render: text =>
        text == activate ? (
          <Tag color="green">激活</Tag>
        ) : (
          <Tag color="orange">挂起</Tag>
        )
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record, index) => {
        const { flowStatus } = record;
        const textStatus = flowStatus == activate ? '挂起' : '激活';
        return (
          <div>
            <Popconfirm
              title={`确定${textStatus}?`}
              onConfirm={() => updateStatus(record, index)}
            >
              <a>{textStatus}</a>
            </Popconfirm>
            <Divider type="vertical"/>
            <Link to={`/template/list/edit/${record.formKey}/${record.formVersion}`}>查看详情</Link>
          </div>
        );
      },
    },
    ];
    const {
      getList, updateSearchParams, listData,
      searchParams, pagination
    } = this.props.tpltList;
    return (
      <div className={styles.list}>
        <div className={styles.search}>
          <Search
            value={searchParams.formName}
            onChange={e => {
              updateSearchParams({
                formName: e.target.value,
              });
            }}
            onPressEnter={() => {
              getList({
                page: 0,
              });
            }}
            placeholder="请输入关键字"
            style={{
              width: 400,
              marginRight: '10px',
            }}
          />
          <Button
            type="primary"
            style={{ marginRight: '10px' }}
            onClick={() => {
              getList({
                page: 0,
              });
            }}
          >
            搜索
          </Button>
        </div>
        <Table
          rowKey="id"
          pagination={pagination}
          dataSource={listData}
          columns={columns}
          onChange={(pagination) => {
            getList({
              page: pagination.current,
              size: pagination.pageSize,
            });
          }}
        />
      </div>);
  }
}

export default TemplateList;
