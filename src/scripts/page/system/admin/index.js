import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import * as PropTypes from 'prop-types';
import {
  Avatar, Button, Divider, Input, Popconfirm, Table,
} from 'antd';
import styles from './index.css';
import AddModal from './addModal';

@inject(state => ({
  admin: state.store.admin,
  history: state.history,
}))
@withRouter
@observer
export default class Admin extends Component {
  static propTypes = {
    admin: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { admin } = this.props;
    const { getAllAdminList } = admin;
    getAllAdminList({
      page: 1,
      pageSize: 10,
    });
  }

  getAdminColumns() {
    const { admin, history } = this.props;
    const { deleteAdmin } = admin;
    return [
      {
        title: '用户名',
        dataIndex: 'username',
        width: '25%',
      },
      {
        title: '角色',
        dataIndex: 'roleName',
        width: '35%',
      },
      {
        title: '角色标识',
        dataIndex: 'role',
        width: '30%',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: '10%',
        render: (text, record) => (
          <div>
            <Popconfirm
              title="确定删除?"
              onConfirm={() => deleteAdmin(record, history)}
            >
              <a>删除</a>
            </Popconfirm>
          </div>
        ),
      },
    ];
  }

  render() {
    const { admin } = this.props;
    const {
      adminList, getAllAdminList,
      pagination, showAddModal, openAddModal,
    } = admin;
    const columns = this.getAdminColumns();
    return (
      <div>
        {showAddModal ? <AddModal /> : ''}
        <div className={styles.header_title}>用户管理</div>
        <div className={styles.content}>
          <div className={styles.table_title}>
            <span>管理员用户列表</span>
            <Button className={styles.button_add} onClick={openAddModal}>
              添加新管理员
            </Button>
          </div>
          <Table
            rowKey="id"
            pagination={pagination}
            dataSource={adminList}
            columns={columns}
            onChange={(pagination) => {
              getAllAdminList({
                page: pagination.current,
                pageSize: pagination.pageSize,
              });
            }}
          />
        </div>
      </div>
    );
  }
}
