import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { Table, Button, Divider, Popconfirm, Input } from "antd";

import {
  Editablecomponents,
  EditableContext
} from "../editableTableComponents";
import styles from "./index.css";
import AddModal from "./addModal";

@inject(state => ({
  agent: state.store.agent
}))
@observer
export default class Agent extends Component {
  componentDidMount() {
    const { init } = this.props.agent;
    init();
  }

  renderFlowModels(flowModels) {
    let processName = "";
    flowModels.forEach(item => {
      const { formName } = item;
      processName = processName ? processName + ", " + formName : formName;
    });
    return processName;
  }

  getTableColumns() {
    const { save, edit, cancel, deleteItem } = this.props.agent;
    return [
      {
        title: "被代理人",
        dataIndex: "qtalk",
        editable: true,
        width: "15%"
      },
      {
        title: "代理人",
        dataIndex: "agent",
        editable: true,
        width: "15%"
      },
      {
        title: "代理流程",
        dataIndex: "flowModels",
        editable: true,
        width: "20%",
        render: text => this.renderFlowModels(text)
      },
      {
        title: "备注",
        dataIndex: "remarks",
        editable: true,
        width: "15%"
      },
      {
        title: "截止时间",
        dataIndex: "deadline",
        editable: true,
        width: "15%"
      },
      {
        title: "操作",
        dataIndex: "operation",
        render: (text, record) => {
          const editable = this.isEditing(record);
          return (
            <div>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => (
                      <a
                        href="javascript:;"
                        onClick={() => save(form, record.id)}
                      >
                        保存
                      </a>
                    )}
                  </EditableContext.Consumer>
                  <Divider type="vertical" />
                  <Popconfirm
                    title="确定取消?"
                    onConfirm={() => cancel(record.id)}
                  >
                    <a>取消</a>
                  </Popconfirm>
                </span>
              ) : (
                <a href="javascript:;" onClick={() => edit(record.id)}>
                  编辑
                </a>
              )}
              <Divider type="vertical" />
              <Popconfirm
                title="确定删除?"
                onConfirm={() => deleteItem(record.id)}
              >
                <a>删除</a>
              </Popconfirm>
            </div>
          );
        }
      }
    ];
  }

  isEditing = record => {
    const { editingId } = this.props.agent;
    return record.id === editingId;
  };

  render() {
    // const columns = this.getTableColumns();
    //editingId 不可以删除
    const {
      dataSource,
      showAddModal,
      showModal,
      editingId,
      pagination,
      getList,
      searchValue,
      changeSearchValue
    } = this.props.agent;
    const columns = this.getTableColumns(editingId).map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => {
          let inputType;
          switch (col.dataIndex) {
            case "deadline":
              inputType = "datePicker";
              break;
            case "flowModels":
              inputType = "select";
              break;
            case "qtalk":
            case "agent":
              inputType = "selectQtalkDefault";
              break;
            default:
              inputType = "text";
          }
          return {
            ...col,
            record,
            inputType,
            editing: this.isEditing(record)
          };
        }
      };
    });
    return (
      <div>
        {showAddModal ? <AddModal /> : ''}
        <div className={styles.header_title}>代理人设置</div>
        <div className={styles.content}>
          <div className={styles.search}>
            <Input
              value={searchValue}
              onChange={changeSearchValue}
              className={styles.input_search}
              onPressEnter={() =>
                getList({
                  page: 1,
                  size: 10,
                  k: searchValue
                })
              }
              placeholder="请输入"
            />
            <Button
              type="primary"
              className={styles.button_search}
              onClick={() =>
                getList({
                  page: 1,
                  size: 10,
                  k: searchValue
                })
              }
            >
              搜索
            </Button>
            <Button className={styles.button_add} onClick={showModal}>
              添加
            </Button>
          </div>
          <div>
            <Table
              rowKey="id"
              components={Editablecomponents}
              columns={columns}
              dataSource={dataSource}
              pagination={pagination}
              onChange={pagination => {
                getList({
                  page: pagination.current,
                  size: pagination.pageSize,
                  k: searchValue
                });
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}
