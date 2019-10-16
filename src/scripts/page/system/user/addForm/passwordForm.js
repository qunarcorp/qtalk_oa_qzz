import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { Button, Form, Icon, Input } from 'antd';
import styles from './index.css';

const FormItem = Form.Item;
@inject(state => ({
  oaUser: state.store.oaUser,
}))
@observer
class PasswordForm extends Component {
  handleSubmit = (e) => {
    const { adminUpdatePassword } = this.props.oaUser;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        adminUpdatePassword(values);
      }
    });
  };

  render() {
    const { oaUser } = this.props;
    const { closeEditPasswordModal } = oaUser;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
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
    return (
      <Form layout="horizontal" onSubmit={this.handleSubmit}>
        <FormItem label="新密码" {...formItemLayout}>
          {getFieldDecorator('newPassword', requiredRules)(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="请输入新密码" />,
          )}
        </FormItem>
        <FormItem label="确认密码" {...formItemLayout}>
          {getFieldDecorator('confirmPassword', requiredRules)(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="请再次输入新密码" />,
          )}
        </FormItem>
        <FormItem>
          <div className={styles.button_box}>
            <Button onClick={closeEditPasswordModal}>取消</Button>
            <Button htmlType="submit" type="primary" className={styles.margin_left}>保存</Button>
          </div>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(PasswordForm);
