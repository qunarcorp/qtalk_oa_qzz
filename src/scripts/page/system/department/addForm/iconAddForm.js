import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { Button, Form, Input, TreeSelect, Popconfirm } from 'antd';
import styles from './index.css';
import SelectQtalk from '../../../../component/selectQtalk';

const FormItem = Form.Item;
const { TreeNode } = TreeSelect;

@inject(state => ({
  department: state.store.department,
  departmentInfo: state.store.department.departmentInfo,
  addDeptInfo: state.store.department.addDeptInfo,
}))
@observer
class IconAddForm extends Component {
  componentDidMount() {
    const { addDeptInfo } = this.props;
    addDeptInfo && this.props.form.setFieldsValue(addDeptInfo);
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
    const { handleAddOrUpdate } = this.props.department;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        handleAddOrUpdate(values);
      }
    });
  };

  render() {
    const { department } = this.props;
    const { departmentTree, addOrUpdate, deleteDept, addDeptInfo, departmentInfo, addReset } = department;
    const { getFieldDecorator } = this.props.form;
    const { deep = 0 } = (addOrUpdate === 'add') ? addDeptInfo : departmentInfo;
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
    const requiredRulesDeptDeep = {
      rules: [
        {
          required: deep === 1,
          message: '该字段必填,请输入',
        },
      ],
    };
    return (
      <Form layout="horizontal" onSubmit={this.handleSubmit}>
        <FormItem label="部门名称" {...formItemLayout}>
          {getFieldDecorator('name', requiredRules)(
            <Input />,
          )}
        </FormItem>
        <FormItem label="父部门" {...formItemLayout}>
          {getFieldDecorator('pid', requiredRules)(
            <TreeSelect
              className={styles.disabled_display}
              disabled={true}
              showSearch
              treeNodeFilterProp="title"
            >
              {this.getDeptTreeSelect(departmentTree)}
            </TreeSelect>,
          )}
        </FormItem>
        <FormItem label="部门层级" {...formItemLayout}>
          {getFieldDecorator('deep', requiredRules)(
            <Input disabled={true} className={styles.disabled_display} />,
          )}
        </FormItem>
        <FormItem label="部门领导" {...formItemLayout}>
          {getFieldDecorator('leaders', requiredRulesDeptDeep)(
            <SelectQtalk />,
          )}
        </FormItem>
        <FormItem label="部门VP" {...formItemLayout}>
          {getFieldDecorator('vp')(
            <SelectQtalk />,
          )}
        </FormItem>
        <FormItem label="部门hrbp" {...formItemLayout}>
          {getFieldDecorator('hrbps', requiredRulesDeptDeep)(
            <SelectQtalk />,
          )}
        </FormItem>
        <FormItem>
          <Button htmlType="submit" type="primary" className={styles.margin_left}>
            {addOrUpdate === 'add' ? '新增' : '更新'}
          </Button>
          {addOrUpdate === 'add'
            ? (
              <Button className={styles.margin_left} onClick={() => addReset()}>
                取消
              </Button>
            ) : null}
          {addOrUpdate === 'update'
            ? (
              <Popconfirm title="确定删除?" onConfirm={() => deleteDept()}>
                <Button className={styles.margin_left}>删除</Button>
              </Popconfirm>) : null
          }
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(IconAddForm);
