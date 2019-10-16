import React, { Component } from 'react';
import moment from 'moment';
import { observer, inject } from 'mobx-react';
import {
  Input, Form, Select, DatePicker, Checkbox, Dropdown,
} from 'antd';

import SelectQtalk from 'COMPONENT/selectQtalk';
import { allProcess } from 'CONST/manageMap';
import { disabledDate } from 'UTIL/moment';
import SelectDept from '../../../component/selectDept';

const FormItem = Form.Item;
const Option = Select.Option;

export const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

@inject(state => ({
  agent: state.store.agent,
}))
@observer
class EditableCell extends Component {
  optionsArray = [];

  // 全部选项的数组,用来解决全选问题
  optionsLength = undefined;

  // 全部选项数组的长度
  options = []; // 选项

  componentWillMount() {
    this.getOptions();
  }

  getOptions() {
    const { tpltList } = this.props.agent;
    tpltList.forEach((item) => {
      const { formName, formKey } = item;
      const strValue = JSON.stringify(item);
      this.optionsArray.push(strValue);
      this.options.push(
        <Option value={strValue} key={formKey}>
          {formName}
        </Option>,
      );
    });
    this.optionsLength = this.options.length;
  }

  changeSelectQtalkValue = (value, form, dataIndex) => {
    const { setFieldsValue } = form;
    setFieldsValue({
      [dataIndex]: value,
    });
  };

  changeSelectDeptValue = (value, form, dataIndex) => {
    const { setFieldsValue } = form;
    setFieldsValue({
      [dataIndex]: value,
    });
  };

  getInput = (form) => {
    const { inputType, dataIndex } = this.props;
    const { getFieldValue } = form;
    switch (inputType) {
      case 'datePicker':
        return (
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            placeholder="选择截止时间"
            disabledDate={disabledDate}
          />
        );
      case 'select':
        return (
          <Select mode="multiple" maxTagCount={2} style={{ width: '100%', height: '100%' }}>
            {this.options}
          </Select>
        );
      case 'selectQtalk':
        return (
          <SelectQtalk
            className="input_table_cell"
            mode="multiple"
            changeValue={value => this.changeSelectQtalkValue(value, form, dataIndex)
            }
            inputValue={getFieldValue(dataIndex)}
          />
        );
      case 'selectDepartment':
        return (
          <SelectDept
            className="input_table_cell"
            mode="multiple"
            changeValue={value => this.changeSelectDeptValue(value, form, dataIndex)
            }
            inputValue={getFieldValue(dataIndex)}
          />
        );
      case 'selectQtalkDefault':
        return (
          <SelectQtalk
            className="input_table_cell"
            changeValue={value => this.changeSelectQtalkValue(value, form, dataIndex)
            }
            inputValue={getFieldValue(dataIndex)}
          />
        );
      default:
        return <Input />;
    }
  };

  getflowModelsInit(record, dataIndex) {
    const flowModels = record[dataIndex];
    let flowModelsStr = [];
    const { str } = allProcess;
    flowModels.forEach((item) => {
      flowModelsStr.push(JSON.stringify(item));
    });
    flowModelsStr = flowModelsStr.indexOf(str) !== -1
      ? this.optionsArray
      : flowModelsStr;
    return flowModelsStr;
  }

  containAll(value) {
    const { str } = allProcess;
    return value.indexOf(str) !== -1;
  }

  removeArrayValue(array, value) {
    const index = array.indexOf(value);
    if (index > -1) {
      array.splice(index, 1);
    }
  }

  normalizeSelectValue = (value, preValue = []) => {
    // 上次有all 这次也有all 只取消value中全选选中状态
    if (this.containAll(preValue) && this.containAll(value)) {
      const { str } = allProcess;
      this.removeArrayValue(value, str);
      return value;
    }
    // 上次有all 这次没有all 清空整个数组
    if (this.containAll(preValue) && !this.containAll(value)) {
      return [];
    }
    // 上次没有all 这次有all 全选
    if (!this.containAll(preValue) && this.containAll(value)) {
      return this.optionsArray;
    }
    // 这次没有all 并且 当前只有全选没有
    if (!this.containAll(value) && value.length === this.optionsLength - 1) {
      return this.optionsArray;
    }
    return value;
  };

  getFormOptions(record, dataIndex) {
    const { inputType } = this.props;
    switch (inputType) {
      case 'datePicker':
        return {
          initialValue: moment(record[dataIndex], 'YYYY-MM-DD HH:mm:ss'),
        };
      case 'select':
        return {
          initialValue: this.getflowModelsInit(record, dataIndex),
          normalize: this.normalizeSelectValue,
        };
      case 'selectQtalk':
        return { initialValue: record[dataIndex].split(',') };
      default:
        return { initialValue: record[dataIndex] };
    }
  }

  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
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
                  {getFieldDecorator(
                    dataIndex,
                    this.getFormOptions(record, dataIndex),
                  )(this.getInput(form))}
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
}

export const Editablecomponents = {
  body: {
    row: EditableFormRow,
    cell: EditableCell,
  },
};
