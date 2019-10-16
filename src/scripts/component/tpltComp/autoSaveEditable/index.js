import React, { Component, Fragment } from 'react';
import { Table, Popconfirm, Form, Button } from 'antd';
import NP from 'number-precision';

import autobind from 'autobind-decorator';
import styles from './index.css';
import getCompMap from '../getCompMap';

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends Component {
  state = {
    editing: false,
  };

  componentDidMount() {
    if (this.props.editable) {
      // 不兼容IE
      document.addEventListener('click', this.handleClickOutside, true);
    }
  }

  componentWillUnmount() {
    if (this.props.editable) {
      document.removeEventListener('click', this.handleClickOutside, true);
    }
  }

  @autobind
  toggleEdit(disabled) {
    // disabled 时禁止编辑
    if (disabled) {
      return;
    }
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing && this.input) {
        this.input.focus();
      }
    });
  }

  handleClickOutside = e => {
    // antd 将datePicker展开组件和select option组件挂载在body,需要查找类名手动筛
    if (
      e.target.classList.contains('ant-select-dropdown-menu-item') ||
      e.target.classList.contains('ant-calendar-date')
    ) {
      return;
    }
    const { editing } = this.state;
    if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
      this.save();
    }
  };

  save = () => {
    const { record, handleSave, componentType, dataIndex } = this.props;
    this.form.validateFields((error, values) => {
      if (error) {
        return;
      }
      // 文件上传和图片上传不需要切换editing状态
      if (componentType !== 'uploadImg' && componentType !== 'upload') {
        this.toggleEdit();
      }
      // values包含一直可编辑的上传图片
      handleSave({ ...record, [dataIndex]:values[dataIndex] });
    });
  };

  render() {
    const { editing } = this.state;
    let {
      // 给默认值
      componentType = 'input',
      col,
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      disabled,
      ...restProps
    } = this.props;
    componentType = componentType || 'input';
    return (
      <td ref={node => (this.cell = node)} {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {form => {
              this.form = form;
              return editing ||
                componentType === 'uploadImg' ||
                componentType === 'upload' ? (
                <FormItem style={{ margin: 0, width: '100%' }}>
                  {form.getFieldDecorator(dataIndex)(
                    getCompMap[componentType].apply(this, col),
                  )}
                </FormItem>
              ) : (
                <div
                  className={disabled ? '' : 'editable-cell-value-wrap'}
                  style={{ paddingRight: 24 }}
                  onClick={() => this.toggleEdit(disabled)}
                >
                  {restProps.children}
                </div>
              );
            }}
          </EditableContext.Consumer>
        ) : (
          restProps.children
        )}
      </td>
    );
  }
}

class EditableTable extends Component {
  constructor(props) {
    super(props);
    this.count = 0;
    this.state = {
      addBool: false,
    };
  }

  @autobind
  delete(key) {
    this.props.onChange(this.props.value.filter(item => item.key !== key));
  }

  @autobind
  addRow(e, addResult) {
    const key = ++this.count;
    let newRow = {
      key,
    };
    if (addResult) {
      newRow = { ...newRow, ...addResult };
    } else {
      this.props.columns.forEach(col => {
        newRow[col.dataIndex] = '';
      });
    }
    const value = this.props.value || [];
    this.props.onChange([...value, newRow]);
  }

  add(tableColumns) {
    const { addBool } = this.state;
    if (addBool) {
      return;
    }
    this.setState({
      addBool: true,
    });

    const { value } = this.props;
    const needAddArr = tableColumns.filter(item => item.add === '需要');

    const keyArr = needAddArr.map(item => item.dataIndex);
    const resultObj = {};
    value.forEach(item => {
      Object.keys(item).forEach(key => {
        if (keyArr.includes(key)) {
          const pre = resultObj[key] || 0;
          resultObj[key] = NP.plus(pre, Number(item[key], 10));
        }
      });
    });
    Object.keys(resultObj).forEach(
      key => (resultObj[key] = `${resultObj[key]} (总计)`),
    );
    this.addRow('', resultObj);
  }

  handleSave = row => {
    const newData = [...this.props.value];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.props.onChange(newData);
  };

  @autobind
  getOperateCell(text, record) {
    return (
      <Popconfirm
        title="确定要删除吗？"
        onConfirm={() => this.delete(record.key)}
      >
        <a>删除</a>
      </Popconfirm>
    );
  }

  render() {
    const { value, columns = [], disabled } = this.props;
    const components = {
        body: {
          row: EditableFormRow,
          cell: EditableCell,
        },
      },
      colLength = columns.length;
    let tableColumns = disabled
      ? [...columns]
      : [
          ...columns,
          {
            title: '操作',
            dataIndex: 'operation',
            render: this.getOperateCell,
          },
        ];
    tableColumns = tableColumns.map(col => {
      if (!col.editable) {
        // 给列动态设置宽度,采取均分
        col.width = Math.floor(100 / colLength) + '%';
        return col;
      }
      col.width = Math.floor(100 / (colLength + 1)) + '%';
      return {
        ...col,
        onCell: record => ({
          disabled,
          record,
          col,
          ...col,
          handleSave: this.handleSave,
        }),
      };
    });

    return (
      <Fragment>
        <Table
          components={components}
          pagination={false}
          dataSource={value}
          columns={tableColumns}
          rowClassName="editable-row"
        />
        {!disabled && (
          <div className={styles.button_group}>
            <Button onClick={this.addRow} type="primary">
              添加一行
            </Button>
            <Button
              className={styles.add}
              onClick={() => this.add(tableColumns)}
            >
              累和
            </Button>
          </div>
        )}
      </Fragment>
    );
  }
}

export default EditableTable;
