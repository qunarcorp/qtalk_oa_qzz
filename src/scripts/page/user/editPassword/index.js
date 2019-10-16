import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router';
import React, { Component } from 'react';
import { Button, Form, Icon, Input } from 'antd';
import styles from './index.css';

const FormItem = Form.Item;

@inject(state => ({
  oaUser: state.store.oaUser,
}))
@withRouter
@observer
class EditPassword extends Component {
  handleSubmit = (e) => {
    const { handleEditPassword } = this.props.oaUser;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        handleEditPassword(values);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 4 },
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
      <div>
        <div className={styles.header_title}>密码修改</div>
        <div className={styles.content}>
          <Form layout="horizontal" onSubmit={this.handleSubmit}>
            <FormItem label="原密码" {...formItemLayout}>
              {getFieldDecorator('oldPassword', requiredRules)(
                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="请输入原密码" />,
              )}
            </FormItem>
            <FormItem label="新密码" {...formItemLayout}>
              {getFieldDecorator('newPassword', requiredRules)(
                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="请输入新密码" />,
              )}
            </FormItem>
            <FormItem label="确认新密码" {...formItemLayout}>
              {getFieldDecorator('confirmPassword', requiredRules)(
                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="请再次输入新密码" />,
              )}
            </FormItem>
            <FormItem>
              <div className={styles.button_place}>
                <Button htmlType="submit" type="primary" className={styles.button_add}>密码重置</Button>
              </div>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

export default Form.create()(EditPassword);
