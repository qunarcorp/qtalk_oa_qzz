import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { Form, Input, DatePicker, Button, Select } from "antd";

import styles from "./index.css";
import SelectQtalk from "COMPONENT/selectQtalk";
import { disabledDate } from "UTIL/moment";

const Option = Select.Option;

@inject(state => ({
  agent: state.store.agent
}))
@observer
class AddForm extends Component {
  handleSubmit = e => {
    const { handleAdd } = this.props.agent;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        handleAdd(values);
      }
    });
  };

  changeQtalkValue = value => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({
      qtalk: value,
    });
  };

  changeAgentValue = value => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({
      agent: value,
    });
  };

  getOptions() {
    const { tpltList } = this.props.agent;
    const options = [];
    tpltList.forEach(item => {
      const { formName, formKey } = item;
      options.push(<Option key={formKey} value={formKey}>{formName}</Option>);
    });
    return options;
  }

  getSelect = () => {
    return (
      <Select mode="multiple" optionFilterProp="children">
        {this.getOptions()}
      </Select>
    );
  };

  render() {
    const FormItem = Form.Item;
    const { closeModal } = this.props.agent;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };
    return (
      <Form layout="horizontal" onSubmit={this.handleSubmit}>
        <FormItem label="被代理人" {...formItemLayout}>
          {getFieldDecorator("qtalk")(
            <SelectQtalk
              placeholder="请输入被代理人"
              changeValue={this.changeQtalkValue}
              inputValue={getFieldValue("qtalk")}
            />
          )}
        </FormItem>
        <FormItem label="代理人" {...formItemLayout}>
          {getFieldDecorator("agent")(
            <SelectQtalk
              placeholder="请输入代理人"
              changeValue={this.changeAgentValue}
              inputValue={getFieldValue("agent")}
            />
          )}
        </FormItem>
        <FormItem label="代理流程" {...formItemLayout}>
          {getFieldDecorator("processID")(this.getSelect())}
        </FormItem>
        <FormItem label="备注" {...formItemLayout}>
          {getFieldDecorator("remarks")(<Input />)}
        </FormItem>
        <FormItem label="截止时间" {...formItemLayout}>
          {getFieldDecorator("deadline")(
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="选择截止时间"
              disabledDate={disabledDate}
            />
          )}
        </FormItem>
        <FormItem>
          <div className={styles.button_box}>
            <Button onClick={closeModal}>取消</Button>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.margin_left}
            >
              保存
            </Button>
          </div>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(AddForm);
