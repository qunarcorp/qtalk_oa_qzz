import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import * as PropTypes from 'prop-types';
import {
  Avatar, Button, Divider, Input, Popconfirm, Table,
} from 'antd';
import styles from './index.css';
import AddModal from './addModal';
import PasswordModal from './addModal/passwordModal';

@inject(state => ({
  oaUser: state.store.oaUser,
  history: state.history,
}))
@withRouter
@observer
export default class OAUser extends Component {
  static propTypes = {
    oaUser: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { oaUser } = this.props;
    const { getAllUserList, searchValue } = oaUser;
    getAllUserList({
      page: 1,
      pageSize: 10,
      key: !searchValue ? '' : searchValue,
    });
  }

  componentWillUnmount() {
    const { oaUser } = this.props;
    const { reset } = oaUser;
    reset();
  }

  getUserColumns() {
    const { oaUser, history } = this.props;
    const { deleteUser, openEditModal, openEditPasswordModal } = oaUser;
    return [
      {
        title: '',
        dataIndex: 'avatar',
        width: '5%',
        render: text => <Avatar src={text} />,
      },
      {
        title: '用户名',
        dataIndex: 'userName',
        width: '10%',
      },
      {
        title: '中文名',
        dataIndex: 'cname',
        width: '10%',
      },
      {
        title: '部门',
        dataIndex: 'deptStr',
        width: '15%',
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        width: '10%',
      },
      {
        title: '直属领导',
        dataIndex: 'leader',
        width: '10%',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: '10%',
        render: (text, record) => (
          <div>
            <a onClick={() => openEditModal(record)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={() => openEditPasswordModal(record)}>修改密码</a>
            <Divider type="vertical" />
            <Popconfirm
              title="确定删除?"
              onConfirm={() => deleteUser(record, history)}
            >
              <a>删除</a>
            </Popconfirm>
          </div>
        ),
      },
    ];
  }

  render() {
    const { oaUser } = this.props;
    const {
      oaUserList, getAllUserList, searchValue, showEditPasswordModal,
      changeSearchValue, pagination, showAddModal, openAddModal,
    } = oaUser;
    const columns = this.getUserColumns();
    return (
      <div>
        {showEditPasswordModal ? <PasswordModal /> : ''}
        {showAddModal ? <AddModal /> : ''}
        <div className={styles.header_title}>用户管理</div>
        <div className={styles.content}>
          <div>
            <Input
              value={searchValue}
              onChange={changeSearchValue}
              className={styles.input_search}
              placeholder="请输入"
              onPressEnter={() => getAllUserList({
                page: 1,
                pageSize: 10,
                key: searchValue,
              })}
            />
            <Button
              type="primary"
              onClick={() => {
                getAllUserList({
                  page: 1,
                  pageSize: 10,
                  key: searchValue,
                });
              }}
            >
              搜索
            </Button>
          </div>
          <div className={styles.table_title}>
            <span>OA用户列表</span>
            <Button className={styles.button_add} onClick={openAddModal}>
              添加新用户
            </Button>
          </div>
          <Table
            rowKey="id"
            pagination={pagination}
            dataSource={oaUserList}
            columns={columns}
            onChange={(pagination) => {
              getAllUserList({
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
