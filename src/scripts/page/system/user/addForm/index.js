import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { Button, Form, Input, Radio, TreeSelect } from 'antd';
import styles from './index.css';
import SelectQtalk from '../../../../component/selectQtalk';

const FormItem = Form.Item;
const { TreeNode } = TreeSelect;
const RadioGroup = Radio.Group;

@inject(state => ({
  oaUser: state.store.oaUser,
  department: state.store.department,
}))
@observer
class AddForm extends Component {
  componentDidMount() {
    const { department, oaUser } = this.props;
    department.getDeptTrees();
    const { oaUserInfo } = oaUser;
    oaUserInfo && this.props.form.setFieldsValue(oaUserInfo);
  }

  getDeptTreeSelect(data) {
    return (
      data && data.map((item) => {
        if (item.children) {
          return (
            <TreeNode title={item.name} value={item.id} key={item.id}>
              {this.getDeptTreeSelect(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode title={item.name} value={item.id} key={item.id} />;
      })
    );
  }

  handleSubmit = (e) => {
    const { handleAddOrUpdate } = this.props.oaUser;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        handleAddOrUpdate(values);
      }
    });
  };

  render() {
    const { oaUser, department } = this.props;
    const { closeAddModal, editOAUser } = oaUser;
    const { departmentTree } = department;
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
          {getFieldDecorator('userName', requiredRules)(
            <Input disabled={editOAUser} />,
          )}
        </FormItem>
        <FormItem label="中文名" {...formItemLayout}>
          {getFieldDecorator('cname', requiredRules)(
            <Input />,
          )}
        </FormItem>
        <FormItem label="手机号" {...formItemLayout}>
          {getFieldDecorator('phone', requiredRules)(
            <Input />,
          )}
        </FormItem>
        <FormItem label="部门" {...formItemLayout}>
          {getFieldDecorator('deptId', requiredRules)(
            <TreeSelect
              showSearch
              treeNodeFilterProp="title"
            >
              {this.getDeptTreeSelect(departmentTree)}
            </TreeSelect>,
          )}
        </FormItem>
        <FormItem label="直属领导" {...formItemLayout}>
          {getFieldDecorator('leader', requiredRules)(
            <SelectQtalk
              placeholder="请输入并选择"
            />,
          )}
        </FormItem>
        <FormItem label="邮箱" {...formItemLayout}>
          {getFieldDecorator('email', requiredRules)(
            <Input />,
          )}
        </FormItem>
        <FormItem label="负责hr" {...formItemLayout}>
          {getFieldDecorator('hr')(
            <SelectQtalk
              placeholder="请输入并选择"
            />,
          )}
        </FormItem>
        <FormItem label="性别" {...formItemLayout}>
          {getFieldDecorator('gender')(
            <RadioGroup>
              <Radio value="1">男</Radio>
              <Radio value="0">女</Radio>
            </RadioGroup>,
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
