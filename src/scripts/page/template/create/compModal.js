/*
 * @Author: lee.guo
 * @Date: 2019-04-26 14:44:17
 * @Last Modified by: lee.guo
 * @Last Modified time: 2019-04-26 16:51:14
 */
import {
  Button, Col, Form, Input, Modal, Radio, Row, Slider, Switch,
} from 'antd';
import { isObservableArray } from 'mobx';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { EditableTable } from '../../../component/tpltComp';
import { TABLE_COLUMNS, TPLT_COMPONENT_LIST } from '../../../const/map';
import styles from './index.css';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const needOptList = TPLT_COMPONENT_LIST.filter(item => item.needOpt).map(item => item.value);
const needplahoList = TPLT_COMPONENT_LIST.filter(item => item.needplaho).map(item => item.value);
@inject(state => ({
  tpltData: state.store.tpltCreate,
}))
@withRouter
@observer
class CompModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { tpltData } = this.props;
    tpltData.initCompModalData();
  }

  componentDidUpdate() {
    const textL = this.textLeft;
    const textR = this.textRight;
    if (typeof textL !== 'undefined' && typeof textR !== 'undefined') {
      if (textL.textAreaRef !== null && textR.textAreaRef !== null) {
        textL.textAreaRef.onscroll = textL.textAreaRef.onscroll
          ? textL.textAreaRef.onscroll
          : () => {
            textR.textAreaRef.scrollTop = textL.textAreaRef.scrollTop;
          };
        textR.textAreaRef.onscroll = textR.textAreaRef.onscroll
          ? textR.textAreaRef.onscroll
          : () => {
            textL.textAreaRef.scrollTop = textR.textAreaRef.scrollTop;
          };
      }
    }
  }

  componentWillUnmount() {}

 getFormOptions = () => ({
   rules: [{ required: true, message: '请输入' }],
 });

 getFormShowOptions = () => ({
   rules: [{ required: false, message: '请输入' }],
 });

 //  hasErrors(fieldsError) {
 //    return Object.keys(fieldsError).some(field => fieldsError[field]);
 //  }

 handleOk = (e) => {
   const { tpltData, form } = this.props;
   const {
     tplt,
     currComp,
     initCompModalData,
     getCompModalData,
     setTplt,
     setCompModalVisible,
     currGroup,
     compModalType,
   } = tpltData;
   e.preventDefault();
   const compModalData = getCompModalData();
   form.validateFields((err, values) => {
     if (!err) {
       const groups = [...tplt.groups];
       const { columns = [] } = values;
       columns.forEach((item, index) => {
         const { options = '', showOptions = '', conditionLinkCode = '' } = item;
         if (!isObservableArray(options)) {
           columns[index].options = options.split('\n').filter(optionsItem => !!optionsItem);
         }
         if (!isObservableArray(showOptions)) {
           columns[index].showOptions = showOptions.split('\n').filter(optionsItem => !!optionsItem);
         }
         if (!isObservableArray(conditionLinkCode)) {
           columns[index].conditionLinkCode = conditionLinkCode
             .split('\n')
             .filter(conditionLinkCodeItem => !!conditionLinkCodeItem);
         }
       });
       if (compModalType === 'add') {
         groups[currGroup.index].children.push({
           ...values,
           options: values.options ? values.options.split('\n').filter(item => !!item) : [],
           showOptions: values.showOptions ? values.showOptions.split('\n').filter(item => !!item) : [],
           conditionLinkCode: values.conditionLinkCode
             ? values.conditionLinkCode.split('\n').filter(item => !!item)
             : [],
           columns,
         });
       } else {
         groups[currGroup.index].children[currComp.index] = {
           ...compModalData,
           options: compModalData.options
             ? compModalData.options.split('\n').filter(item => !!item)
             : [],
           showOptions: compModalData.showOptions
             ? compModalData.showOptions.split('\n').filter(item => !!item)
             : [],
           conditionLinkCode: compModalData.conditionLinkCode
             ? compModalData.conditionLinkCode.split('\n').filter(item => !!item)
             : [],
         };
       }
       setTplt({ groups });
       setCompModalVisible(false);
       initCompModalData();
     }
   });
 };

 render() {
   const { tpltData, form } = this.props;
   const {
     compModalVisible,
     getCompModalData,
     initCompModalData,
     setCompModalVisible,
     compModalType,
   } = tpltData;
   const { getFieldDecorator } = form;
   const compModalData = getCompModalData();
   const formItemLayout = {
     labelCol: {
       xs: { span: 24 },
       sm: { span: 4 },
     },
     wrapperCol: {
       xs: { span: 24 },
       sm: { span: 20 },
     },
   };
   return (
     <Modal
       title={compModalType === 'add' ? '添加组件' : '编辑组件'}
       visible={compModalVisible}
       onCancel={() => {
         setCompModalVisible(false);
         initCompModalData();
       }}
       width="50%"
       footer={null}
     >
       <Form className="ant-advanced-search-form" onSubmit={this.handleOk} labelAlign="left">
         <FormItem {...formItemLayout} className={styles.form_item} label="名称">
           {getFieldDecorator('title', this.getFormOptions())(<Input />)}
         </FormItem>
         <FormItem {...formItemLayout} className={styles.form_item} label="label宽度">
           {getFieldDecorator('labelWidth')(
             <Slider
               max={24}
               min={1}
               marks={{
                 4: '4',
                 8: '8',
                 12: '12',
                 24: '24',
               }}
             />,
           )}
         </FormItem>
         <FormItem {...formItemLayout} className={styles.form_item} label="宽度">
           {getFieldDecorator('width')(
             <Slider
               max={24}
               min={1}
               marks={{
                 4: '4',
                 8: '8',
                 12: '12',
                 24: '24',
               }}
             />,
           )}
         </FormItem>
         <FormItem {...formItemLayout} className={styles.form_item} label="摘要项">
           {getFieldDecorator('isSummary', { valuePropName: 'checked' })(
             <Switch checkedChildren="是" unCheckedChildren="否" />,
           )}
         </FormItem>
         <FormItem {...formItemLayout} className={styles.form_item} label="必填项">
           {getFieldDecorator('required', { valuePropName: 'checked' })(
             <Switch checkedChildren="是" unCheckedChildren="否" />,
           )}
         </FormItem>
         <FormItem {...formItemLayout} className={styles.form_item} label="流程分支条件">
           {getFieldDecorator('isCondition', { valuePropName: 'checked' })(
             <Switch checkedChildren="是" unCheckedChildren="否" />,
           )}
         </FormItem>
         {compModalData.isCondition ? (
           <FormItem {...formItemLayout} className={styles.form_item} label="关联条件code">
             {getFieldDecorator('isConditionEdit', { valuePropName: 'checked' })(
               <Switch checkedChildren="是" unCheckedChildren="否" />,
             )}
           </FormItem>
         ) : null}
         <FormItem {...formItemLayout} className={styles.form_item} label="类型">
           {getFieldDecorator('type', this.getFormOptions())(
             <RadioGroup>
               {TPLT_COMPONENT_LIST.map(comp => (
                 <Radio value={comp.value}>{comp.text}</Radio>
               ))}
             </RadioGroup>,
           )}
         </FormItem>
         {needOptList.includes(compModalData.type) ? (
           <FormItem {...formItemLayout} className={styles.form_item} label="选项">
             <div className={styles.textFloat}>
               {getFieldDecorator('showOptions', this.getFormShowOptions())(
                 <TextArea
                   ref={(c) => {
                     this.textLeft = c;
                   }}
                   placeholder="填写浏览器展示选项，按行分隔"
                   autosize={{ minRows: 4, maxRows: 4 }}
                 />,
               )}
             </div>
             <div className={styles.textFloat}>
               {getFieldDecorator('options', this.getFormOptions())(
                 <TextArea
                   ref={(c) => {
                     this.textRight = c;
                   }}
                   placeholder="填写实际传值选项，按行分隔"
                   autosize={{ minRows: 4, maxRows: 4 }}
                 />,
               )}
             </div>
           </FormItem>
         ) : null}
         {compModalData.type === 'table' ? (
           <FormItem {...formItemLayout} className={styles.form_item} label="表格配置">
             {getFieldDecorator('columns')(<EditableTable columns={TABLE_COLUMNS} />)}
           </FormItem>
         ) : null}
         {needplahoList.includes(compModalData.type) ? (
           <FormItem {...formItemLayout} className={styles.form_item} label="默认显示">
             {getFieldDecorator('placeholder')(<Input placeholder="请输入默认提示信息" />)}
           </FormItem>
         ) : null}
         {compModalData.type === 'orderNo' ? (
           <FormItem {...formItemLayout} className={styles.form_item} label="流水号格式">
             {getFieldDecorator('format')(
               <Input placeholder="自定义 + 时间格式(yyyyMMddHHmmss) + 随机数个数({6}),默认为OAyyyyMMddHHmmss{6}" />,
             )}
           </FormItem>
         ) : null}
         {(compModalData.isCondition && compModalData.type === 'table')
     || (compModalData.isCondition && compModalData.isConditionEdit) ? (
       <FormItem {...formItemLayout} className={styles.form_item} label="关联条件code">
         <div className={styles.textCondition}>
           {getFieldDecorator('conditionLinkCode', this.getFormOptions())(
             <TextArea
               placeholder="手动配置关联code，按照'code---条件表达式'的格式填写，并按行分隔(条件字段为表格或时必需手动配置条件表达式)"
               autosize={{ minRows: 4, maxRows: 4 }}
             />,
           )}
         </div>
       </FormItem>
           ) : null}
         <Row gutter={24}>
           <Col span={24} style={{ textAlign: 'right' }}>
             <Button type="primary" htmlType="submit">
        保存
             </Button>
             <Button
               style={{ marginLeft: 8 }}
               onClick={() => {
                 setCompModalVisible(false);
               }}
             >
        取消
             </Button>
           </Col>
         </Row>
       </Form>
     </Modal>
   );
 }
}

export default (CompModal = Form.create({
  onFieldsChange(props, changedFields) {
    props.onFormChange(changedFields);
  },
  mapPropsToFields(props) {
    const data = props.formData;
    return {
      title: Form.createFormField(data.title),
      labelWidth: Form.createFormField(data.labelWidth),
      width: Form.createFormField(data.width),
      type: Form.createFormField(data.type),
      options: Form.createFormField(data.options),
      columns: Form.createFormField(data.columns),
      placeholder: Form.createFormField(data.placeholder),
      format: Form.createFormField(data.format),
      isSummary: Form.createFormField(data.isSummary),
      isCondition: Form.createFormField(data.isCondition),
      isConditionEdit: Form.createFormField(data.isConditionEdit),
      conditionLinkCode: Form.createFormField(data.conditionLinkCode),
      required: Form.createFormField(data.required),
      showOptions: Form.createFormField(data.showOptions),
    };
  },
  onValuesChange(_, values) {},
})(CompModal));
