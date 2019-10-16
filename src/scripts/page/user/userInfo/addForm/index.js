import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { Avatar, Button, Form, Input } from 'antd';
import styles from './index.css';

const FormItem = Form.Item;

@inject(state => ({
  oaUser: state.store.oaUser,
}))
@observer
class UpdateForm extends Component {
  componentDidMount() {
    const { oaUser } = this.props;
    const { oaUserInfo } = oaUser;
    oaUserInfo && this.props.form.setFieldsValue(oaUserInfo);
  }

  handleSubmit = (e) => {
    const { handleUpdateSelf } = this.props.oaUser;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        handleUpdateSelf(values);
      }
    });
  };

  render() {
    const { oaUser } = this.props;
    const { closeEditSelfModal } = oaUser;
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
    return (
      <Form layout="horizontal" onSubmit={this.handleSubmit}>
        <FormItem label="用户名" {...formItemLayout}>
          {getFieldDecorator('userName')(
            <Input disabled={true} />,
          )}
        </FormItem>
        <FormItem label="中文名" {...formItemLayout}>
          {getFieldDecorator('cname')(
            <Input disabled={true} />,
          )}
        </FormItem>
        <FormItem label="手机号" {...formItemLayout}>
          {getFieldDecorator('phone', requiredRules)(
            <Input />,
          )}
        </FormItem>
        <FormItem label="邮箱" {...formItemLayout}>
          {getFieldDecorator('email', requiredRules)(
            <Input />,
          )}
        </FormItem>
        <FormItem label="签名" {...formItemLayout}>
          {getFieldDecorator('mood')(
            <Input />,
          )}
        </FormItem>
        <FormItem>
          <div className={styles.button_box}>
            <Button onClick={closeEditSelfModal}>取消</Button>
            <Button htmlType="submit" type="primary" className={styles.margin_left}>保存</Button>
          </div>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(UpdateForm);
