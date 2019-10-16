import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Input, InputNumber, Popconfirm, Form, Button } from 'antd';

import getCompMap from '../getCompMap';

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableTable extends Component {
  constructor(props) {
    super(props);
    const { onChange, value } = this.props;
    this.count = 0;
    this.state = {
      editingKey: '',
    };
    onChange(
      value.map(item => ({
        ...item,
        key: ++this.count,
      })),
    );
  }


  getOperateCell(text, record) {
    const editable = this.isEditing(record);
    return (
      <div>
        {editable ? (
          <span>
            <EditableContext.Consumer>
              {(form) => (
                <a
                  href="javascript:;"
                  onClick={() => this.save(form, record.key)}
                  style={{ marginRight: 8 }}
                >
                  保存
                </a>
              )}
            </EditableContext.Consumer>
            <Popconfirm
              title="确定要取消吗？"
              onConfirm={() => this.cancel(record.key)}
            >
              <a>取消</a>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <a onClick={() => this.edit(record.key)} style={{ marginRight: 8 }}>
              编辑
            </a>
            <Popconfirm
              title="确定要删除吗？"
              onConfirm={() => this.delete(record.key)}
            >
              <a>删除</a>
            </Popconfirm>
          </span>
        )}
      </div>
    );
  }

  EditableCell() {
    const {
      componentType,
      editing,
      dataIndex,
      title,
      record,
      index,
      ...restProps
    } = this.props;
    return (
      <EditableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    initialValue: record[dataIndex],
                  })(getCompMap[componentType].apply(this))}
                </FormItem>
              ) : (
                restProps.children
              )}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }

  isEditing(record) {
    return record.key === this.state.editingKey;
  }
  edit(key) {
    this.setState({ editingKey: key });
  }
  delete(key) {
    this.props.onChange(this.props.value.filter(item => item.key !== key));
  }
  add() {
    const key = ++this.count;
    let newRow = {
      key,
    };
    this.props.columns.forEach(col => {
      newRow[col.dataIndex] = '';
    });
    this.props.onChange([...this.props.value, newRow]);
    this.setState({ editingKey: key });
  }
  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      // value 表单value数值
      const newData = [...this.props.value];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ editingKey: '' });
        // 调用表单onChange方法
        this.props.onChange(newData);
      } else {
        newData.push(row);
        this.setState({ editingKey: '' });
        this.props.onChange(newData);
      }
    });
  }
  cancel() {
    this.setState({ editingKey: '' });
  }
  render() {
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    let columns = this.props.disabled
      ? [...this.props.columns]
      : [
          ...this.props.columns,
          {
            title: '操作',
            dataIndex: 'operation',
            render: this.getOperateCell.bind(this),
          },
        ];
    columns = columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          ...col,
          editing: this.isEditing(record),
        }),
      };
    });
    return (
      <div>
        <Table
          components={components}
          pagination={false}
          dataSource={this.props.value}
          columns={columns}
          rowClassName="editable-row"
        />
        {this.props.disabled ? null : (
          <Button
            onClick={this.add.bind(this)}
            type="primary"
            style={{ marginTop: 16 }}
          >
            添加一行
          </Button>
        )}
      </div>
    );
  }
}
EditableTable.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func,
  columns: PropTypes.array,
  disabled: PropTypes.bool,
};
// warning: `getFieldDecorator` will override `value`：defaultProps不可设置value, 但是不想改
EditableTable.defaultProps = {
  value: [],
  onChange: () => {},
  columns: [],
  disabled: false,
};
export default EditableTable;
