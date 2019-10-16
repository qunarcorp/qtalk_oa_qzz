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
  workgroup: state.store.workgroup
}))
@observer
export default class WorkGroup extends Component {
  constructor(props) {
    super(props);
    // this.columns = this.getTableColumns();
  }

  componentDidMount() {
    const { init } = this.props.workgroup;
    init();
  }

  getTableColumns() {
    const { save, edit, cancel, deleteItem } = this.props.workgroup;
    return [
      {
        title: "工作组",
        dataIndex: "name",
        editable: true,
        width: "25%",
        className: styles.column_break_word,
      },
      {
        title: "描述",
        dataIndex: "remarks",
        editable: true,
        width: "25%",
        className: styles.column_break_word,
      },
      {
        title: "工作组成员",
        dataIndex: "members",
        editable: true,
        width: "25%",
        className: styles.column_break_word,
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
    const { editingId } = this.props.workgroup;
    return record.id === editingId;
  };

  render() {
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
    } = this.props.workgroup;
    const columns = this.getTableColumns(editingId).map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => {
          let inputType;
          switch (col.dataIndex) {
            case "members":
              inputType = "selectQtalk";
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
        {showAddModal ? <AddModal /> : ""}
        <div className={styles.header_title}>工作组管理</div>
        <div className={styles.content}>
          <div className={styles.search}>
            <Input
              value={searchValue}
              onChange={changeSearchValue}
              className={styles.input_search}
              placeholder="请输入"
              onPressEnter={() =>
                getList({
                  page: 1,
                  size: 10,
                  search: searchValue,
                  members: "",
                  name: ""
                })
              }
            />
            <Button
              type="primary"
              className={styles.button_search}
              onClick={() =>
                getList({
                  page: 1,
                  size: 10,
                  search: searchValue,
                  members: "",
                  name: ""
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
                  search: searchValue,
                  members: "",
                  name: ""
                });
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}
