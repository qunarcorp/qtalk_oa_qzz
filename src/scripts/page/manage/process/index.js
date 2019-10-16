import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import {
  Table,
  Divider,
  Popconfirm,
  Upload,
  Button,
  Icon,
  message,
  Tag,
  Modal,
  Input,
} from 'antd';

import styles from './index.css';
import { processApi } from '../../../const/api';
import { statusMap } from '../../../const/manageMap';

@inject(state => ({
  process: state.store.process,
}))
@observer
export default class Process extends Component {
  componentDidMount() {
    const { getDeploymentList } = this.props.process;
    getDeploymentList({
      page: 1,
      size: 10,
    });
  }
  getDeployTableColumns() {
    const { showPicture, deleteProcess, updateState } = this.props.process;
    const { activate } = statusMap;
    return [
      {
        title: '流程部署ID',
        dataIndex: 'deploymentId',
      },
      {
        title: '流程名字',
        dataIndex: 'name',
      },
      {
        title: '流程KEY',
        dataIndex: 'key',
      },
      {
        title: '流程版本',
        dataIndex: 'version',
      },
      {
        title: '流程部署时间',
        dataIndex: 'deployDateTime',
      },
      {
        title: '实例数量',
        dataIndex: 'flowCount',
      },
      {
        title: '任务数量',
        dataIndex: 'flowUnFinishedCount',
      },
      {
        title: '流程状态',
        dataIndex: 'status',
        render: text =>
          text === activate ? (
            <Tag color="green">激活</Tag>
          ) : (
            <Tag color="orange">挂起</Tag>
          ),
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record, index) => {
          const { status, imgName } = record;
          const textStatus = status === activate ? '挂起' : '激活';
          return (
            <div>
              <Popconfirm
                title={`确定${textStatus}?`}
                onConfirm={() => updateState(record, index)}
              >
                <a>{textStatus}</a>
              </Popconfirm>
              <Divider type="vertical" />
              <Popconfirm
                title="确定删除?"
                onConfirm={() => deleteProcess(record)}
              >
                <a>删除</a>
              </Popconfirm>
              <Divider type="vertical" />
              <a href={`/models/${record.processDefinitionId}/downloadBpmnModel`}>下载</a>
              <Divider type="vertical" />
              {imgName ? (
                <a
                  href="javascript:;"
                  onClick={() => showPicture(record, index)}
                >
                  查看图片
                </a>
              ) : (
                ''
              )}
            </div>
          );
        },
      },
    ];
  }

  render() {
    const {
      deploymentList,
      pagination,
      getDeploymentList,
      imgSrc,
      closeModal,
      searchValue,
      changeSearchValue,
    } = this.props.process;
    const uploadProps = {
      action: processApi.deployProcess,
      onChange(info) {
        if (info.file.status !== 'uploading') {
        }
        if (info.file.status === 'done') {
          getDeploymentList({
            page: 1,
            size: 10,
          });
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };
    const columns = this.getDeployTableColumns();
    return (
      <div>
        <Modal
          visible={imgSrc}
          title={null}
          footer={null}
          wrapClassName="modal_wrap"
          closable={false}
          centered
          onCancel={closeModal}
        >
          <img className={styles.processImg} src={imgSrc} alt="流程图" />
        </Modal>
        <div className={styles.header_title}>流程部署管理</div>
        <div className={styles.content}>
          <div className={styles.search}>
            <Input
              value={searchValue}
              onChange={changeSearchValue}
              className={styles.input_search}
              placeholder="请输入"
              onPressEnter={() =>
                getDeploymentList({
                  page: 1,
                  size: 10,
                  search: searchValue,
                  k: searchValue,
                  members: '',
                  name: '',
                })
              }
            />
            <Button
              type="primary"
              className={styles.button_search}
              onClick={() =>
                getDeploymentList({
                  page: 1,
                  size: 10,
                  search: searchValue,
                  k: searchValue,
                  members: '',
                  name: '',
                })
              }
            >
              搜索
            </Button>
          </div>
          <div className={styles.deploy_content}>
            <span className={styles.deploy_title}>部署新流程:</span>
            <Upload {...uploadProps}>
              <Button>
                <Icon type="upload" />
                点击上传文件
              </Button>
            </Upload>
          </div>
          <div className={styles.table_title}>流程部署列表</div>
          <Table
            rowKey="deploymentId"
            pagination={pagination}
            dataSource={deploymentList}
            columns={columns}
            onChange={(pagination) => {
              getDeploymentList({
                page: pagination.current,
                size: pagination.pageSize,
              });
            }}
          />
        </div>
      </div>
    );
  }
}
