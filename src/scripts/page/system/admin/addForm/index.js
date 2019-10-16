import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { Button, Checkbox, Form, Radio } from 'antd';
import styles from './index.css';
import SelectQtalk from '../../../../component/selectQtalk';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

@inject(state => ({
  admin: state.store.admin,
}))
@observer
class AddForm extends Component {

  handleSubmit = (e) => {
    const { handleAdd } = this.props.admin;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        handleAdd(values);
      }
    });
  };

  render() {
    const { admin } = this.props;
    const { closeAddModal } = admin;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };
    const requiredRules = {
      rules: [
        {
          required: true,
          message: '该字段必填,请输入',
        },
      ],
    };
    const checkBoxOptions = [
      { label: '系统管理员', value: 'SYSTEM_ADMIN' },
      { label: '流程管理员', value: 'ACTIVITI_ADMIN' },
    ];
    return (
      <Form layout="horizontal" onSubmit={this.handleSubmit}>
        <FormItem label="选择用户" {...formItemLayout}>
          {getFieldDecorator('userName', requiredRules)(
            <SelectQtalk
              placeholder="请输入并选择"
            />,
          )}
        </FormItem>
        <FormItem label="选择角色" {...formItemLayout}>
          {getFieldDecorator('roles')(
            <Checkbox.Group options={checkBoxOptions} />,
          )}
        </FormItem>
        <FormItem>
          <div className={styles.button_box}>
            <Button onClick={closeAddModal}>取消</Button>
            <Button htmlType="submit" type="primary" className={styles.margin_left}>保存</Button>
          </div>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(AddForm);
