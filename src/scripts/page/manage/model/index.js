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
import PropTypes from 'prop-types';
import styles from './index.css';
import { processApi } from '../../../const/api';
import { statusMap } from '../../../const/manageMap';

@inject(state => ({
  model: state.store.model,
  history: state.history,
}))
@observer
export default class Model extends Component {
  static propTypes = {
    history: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { getModelList } = this.props.model;
    getModelList({
      page: 1,
      size: 10,
    });
  }
  getModelTableColumns() {
    const { showPicture, deleteModel, deployModel } = this.props.model;
    const { history } = this.props;
    return [
      {
        title: '流程模型ID',
        dataIndex: 'id',
      },
      {
        title: '流程模型名称',
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
        title: '模型更新时间',
        dataIndex: 'lastUpdateTime',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record, index) => {
          const { imgName } = record;
          return (
            <div>
              <a href={`/editor?modelId=${record.id}`} target="_blank" rel="noopener noreferrer">编辑</a>
              <Divider type="vertical" />
              <a href={`/models/${record.id}/downloadModel`}>下载</a>
              <Divider type="vertical" />
              <Popconfirm
                title="确定部署?"
                onConfirm={() => deployModel(record, history)}
              >
                <a>部署</a>
              </Popconfirm>
              <Divider type="vertical" />
              <Popconfirm
                title="确定删除?"
                onConfirm={() => deleteModel(record)}
              >
                <a>删除</a>
              </Popconfirm>
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
      modelList,
      pagination,
      getModelList,
      imgSrc,
      closeModal,
      searchValue,
      changeSearchValue,
      addNewModel,
    } = this.props.model;
    const uploadProps = {
      action: processApi.uploadModel,
      onChange(info) {
        if (info.file.status !== 'uploading') {
        }
        if (info.file.status === 'done') {
          getModelList({
            page: 1,
            size: 10,
          });
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };
    const columns = this.getModelTableColumns();
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
        <div className={styles.header_title}>流程设计管理</div>
        <div className={styles.content}>
          <div className={styles.search}>
            <Input
              value={searchValue}
              onChange={changeSearchValue}
              className={styles.input_search}
              placeholder="请输入"
              onPressEnter={() =>
                getModelList({
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
                getModelList({
                  page: 1,
                  size: 10,
                  k: searchValue,
                  search: searchValue,
                  members: '',
                  name: '',
                })
              }
            >
              搜索
            </Button>
          </div>
          <div className={styles.deploy_content}>
            <span className={styles.deploy_title}>上传新流程模型:</span>
            <Upload {...uploadProps}>
              <Button>
                <Icon type="upload" />
                点击上传文件
              </Button>
            </Upload>
          </div>
          <div className={styles.table_title}>
            <span>流程模型列表</span>
            <Button
              className={styles.button_add}
              onClick={() => addNewModel()}
            >
              绘制新流程
            </Button>
          </div>
          <Table
            rowKey="id"
            pagination={pagination}
            dataSource={modelList}
            columns={columns}
            onChange={(pagination) => {
              getModelList({
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
