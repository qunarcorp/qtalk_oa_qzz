import React, { Component } from 'react';
import {
  Form, Icon, Input, Button, message
} from 'antd';
import { userApi } from 'CONST/api';
import styles from './index.css';

const FormItem = Form.Item;
const InputGroup = Input.Group;

class Login extends Component {
  async login(params) {
    try {
      await http.post(userApi.login, params);
      this.isLogin = true;
      location.href = '#/home/work';
      location.reload(true);
      message.success('登录成功');
    } catch (e) {
      message.error(e);
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.login({
          qtalk: values.username + '@' + values.domains,
          password: values.password,
        });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.login}>
        <div style={{ fontSize: '30px' }}>QT OA</div>
        <p style={{ color: '#999' }}>流程管理系统</p>
        <div
          style={{
            color: '#1890ff',
            lineHeight: '40px',
            width: '140px',
            borderBottom: '3px solid #1890ff',
            margin: '20px auto',
          }}
        >
          账户密码登录
        </div>
        <Form onSubmit={this.handleSubmit.bind(this)} className={styles.login_form}>
          <InputGroup compact>
            <FormItem>
              {getFieldDecorator('username', {
              rules: [{ required: true, message: '请输入用户名!' }],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Username"               
                />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('domains', {
              rules: [{ required: true, message: '请输入域名!' }],
              })(
                <Input
                  prefix={<Icon type="home" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="请输入域名"
                  style={{ marginLeft: '15px' }}
                />,
              )}
            </FormItem>

          </InputGroup>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码!' }],
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="Password"
                style={{ width: '82%' ,marginLeft: '15px' }}
              />,
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(Login);
