import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { Form, Input, DatePicker, Button, Select } from "antd";

import styles from "./index.css";
import SelectQtalk from "COMPONENT/selectQtalk";

const Option = Select.Option;

@inject(state => ({
  workgroup: state.store.workgroup
}))
@observer
class AddForm extends Component {
  handleSubmit = e => {
    const { handleAdd } = this.props.workgroup;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        handleAdd(values);
      }
    });
  };

  changeMembersValue = value => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({
      members: value
    });
  };

  render() {
    const FormItem = Form.Item;
    const { closeModal } = this.props.workgroup;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 }
    };
    return (
      <Form layout="horizontal" onSubmit={this.handleSubmit}>
        <FormItem label="工作组" {...formItemLayout}>
          {getFieldDecorator("name")(<Input placeholder="请输入工作组" />)}
        </FormItem>
        <FormItem label="描述" {...formItemLayout}>
          {getFieldDecorator("remarks")(<Input placeholder="请输入描述" />)}
        </FormItem>
        <FormItem label="工作组成员" {...formItemLayout}>
          {getFieldDecorator("members")(
            <SelectQtalk
              placeholder="请输入工作组成员"
              changeValue={this.changeMembersValue}
              inputValue={getFieldValue("members")}
              mode="multiple"
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
