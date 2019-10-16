/*
 * @Author: lee.guo
 * @Date: 2019-04-26 15:10:15
 * @Last Modified by: lee.guo
 * @Last Modified time: 2019-04-26 20:53:00
 */
/* eslint-disable indent */
import {
 Button, Checkbox, Col, Form, Input, Popover, Radio, Row, Select,
} from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { isObservableArray } from 'mobx';
import SelectQtalk from '../selectQtalk';
import OrderNo from '../orderNo';

import {
 EditableTable, FmtDatePicker, TplUpload, TplUploadImg,
} from '../tpltComp';
import styles from './index.css';

const FormItem = Form.Item;
const ButtonGroup = Button.Group;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

export default class Tplt extends Component {
 static propTypes = {
  form: PropTypes.objectOf(PropTypes.object).isRequired,
  isCreate: PropTypes.bool.isRequired,
  onEditComp: PropTypes.func.isRequired,
  onDelComp: PropTypes.func.isRequired,
  model: PropTypes.objectOf(PropTypes.object).isRequired,
  readOnly: PropTypes.bool.isRequired,
  onAddComp: PropTypes.func.isRequired,
  onEditGroup: PropTypes.func.isRequired,
  onDelGroup: PropTypes.func.isRequired,
  editNodeName: PropTypes.arrayOf(PropTypes.object).isRequired,
  pageType: PropTypes.string.isRequired,
  formDatas: PropTypes.objectOf(PropTypes.object).isRequired,
 };

 constructor(props) {
  super(props);
  this.state = {};
 }

 getDisabledUploadComp = (info, showMessage) => {
  isObservableArray(showMessage);
  return (
    <div className={styles.disabled_item_span}>
      {isObservableArray(showMessage)
     ? showMessage.map(item => (
       <div>
         <a
           href={info.type === 'upload' ? item.url : item.thumbUrl}
           target="_blank"
           rel="noopener noreferrer"
         >
           {item.name}
         </a>
       </div>
       ))
     : showMessage}
    </div>
  );
 };

 getDisabledComp = (info, showMessage) => {
  isObservableArray(showMessage);
  return (
    <div className={styles.disabled_item_span}>
      {isObservableArray(showMessage)
     ? showMessage.join(', ')
     : showMessage.split('\n').map(item => <div>{item}</div>)}
    </div>
  );
 };

 getSelectOption = info => (info.options ? (
   info.options.map(item => (
     <Select.Option key={item} value={item}>
       {item}
     </Select.Option>
   ))
  ) : (
    <Select.Option value="0">默认</Select.Option>
  ));

 getRadioOption = info => (info.options ? (
   info.options.map(item => (
     <Radio key={item} value={item}>
       {item}
     </Radio>
   ))
  ) : (
    <Radio value="0">默认</Radio>
  ));

 getCheckoutOption = info => (info.options
   ? info.options.map(item => ({
      label: item,
      value: item,
     }))
   : []);

 getComp = (info, disabled, isCreate, parent) => {
  let comp = null;
  const { placeholder = '', format = 'OAyyyyMMddHHmmss{6}' } = info;
  const filterArr = ['upload', 'uploadImg', 'table', 'notice'];
  const { formDatas, form } = this.props;
  const { id } = parent;
  const showGroups = formDatas && formDatas[id] ? formDatas[id] : '暂无';
  const showMessage = showGroups !== '暂无' && showGroups[info.title] ? showGroups[info.title] : '暂无';
  if (disabled && filterArr.indexOf(info.type) === -1) {
   return this.getDisabledComp(info, showMessage);
  }
  if (disabled && (filterArr.indexOf(info.type) === 0 || filterArr.indexOf(info.type) === 1)) {
   return this.getDisabledUploadComp(info, showMessage);
  }
  switch (info.type) {
   case 'input':
    comp = (
      <Input
        className={styles.disabled_display}
        disabled={disabled}
        placeholder={disabled ? null : placeholder}
      />
    );
    break;
   case 'textarea':
    comp = (
      <TextArea
        className={styles.disabled_display}
        disabled={disabled}
        autosize={{ minRows: 2, maxRows: 6 }}
        placeholder={disabled ? null : placeholder}
      />
    );
    break;
   case 'select':
    comp = (
      <Select
        className={styles.disabled_display}
        placeholder={placeholder}
        disabled={disabled}
        showSearch={!disabled}
      >
        {info.showOptions && info.showOptions.length === info.options.length
       ? info.showOptions.map(item => (
         <Select.Option key={item} value={info.options[info.showOptions.indexOf(item)]}>
           {item}
         </Select.Option>
         ))
       : this.getSelectOption(info)}
      </Select>
    );
    break;
   case 'radio':
    comp = (
      <RadioGroup
        className={styles.disabled_checkbox_display}
        disabled={disabled}
        placeholder={placeholder}
      >
        {info.showOptions && info.showOptions.length === info.options.length
       ? info.showOptions.map(item => (
         <Radio key={item} value={info.options[info.showOptions.indexOf(item)]}>
           {item}
         </Radio>
         ))
       : this.getRadioOption(info)}
      </RadioGroup>
    );
    break;
   case 'checkbox':
    comp = (
      <CheckboxGroup
        className={styles.disabled_checkbox_display}
        disabled={disabled}
        options={
       info.showOptions && info.showOptions.length === info.options.length
        ? info.showOptions.map(item => ({
           label: item,
           value: info.options[info.showOptions.indexOf(item)],
          }))
        : this.getCheckoutOption(info)
      }
        placeholder={placeholder}
      />
    );
    break;
   case 'datePicker':
    comp = (
      <FmtDatePicker
        className={styles.disabled_display}
        disabled={disabled}
        placeholder={placeholder}
      />
    );
    break;
   case 'upload':
    comp = <TplUpload disabled={disabled} isCreate={isCreate} />;
    break;
   case 'uploadImg':
    comp = <TplUploadImg disabled={disabled} isCreate={isCreate} />;
    break;
   case 'table':
    comp = (
      <EditableTable
        disabled={disabled}
        columns={info.columns.map(col => ({
       ...col,
       dataIndex: col.title,
       editable: true,
      }))}
      />
    );
    break;
   case 'selectQtalk':
    comp = <SelectQtalk placeholder={placeholder} disabled={disabled} mode="multiple" />;
    break;
   case 'notice':
    comp = <div />;
    break;
   case 'orderNo':
    comp = <OrderNo parentName={id} name={info.title} form={form} format={format} />;
    break;
   default:
    comp = <Input className={styles.disabled_display} disabled={disabled} />;
    break;
  }
  return comp;
 };

 getFormOptions = (required) => {
  if (required) {
   return {
    rules: [{ required: true, message: '请输入' }],
   };
  }
  return {};
 };

 getFormItem(index, info, parentIndex, parent, readOnly, editNodeName, pageType) {
  const {
 form, isCreate, onEditComp, onDelComp,
} = this.props;
  const { getFieldDecorator } = form;
  const { labelWidth } = info;
  let { required } = info;
  let disabled = readOnly;
  // 判断当前可编辑节点是否是 required
  if (editNodeName) {
   editNodeName.map((editNode) => {
    if (editNode.column === info.title) {
     if (editNode.type === 'column') {
      switch (editNode.status) {
       case 'required':
        // 审批人可编辑必填项 申请人无需必填(必填请在模板中控制)
        required = pageType !== 'create';
        break;
       case 'editAll':
        // 申请人和审批人均可编辑
        disabled = false;
        break;
       case 'edit':
        // 禁用申请页面的审批人编辑项
        disabled = pageType === 'create';
        break;
       default:
        break;
      }
     }
    }
    return null;
   });
  }
  const content = (
    <ButtonGroup>
      <Button
        type="primary"
        icon="edit"
        onClick={() => {
      onEditComp(index, info, parentIndex, parent);
     }}
      />
      <Button
        type="primary"
        icon="delete"
        onClick={() => {
      onDelComp(index, info, parentIndex);
     }}
      />
    </ButtonGroup>
  );
  const label = isCreate ? (
    <Popover content={content} title="" trigger="hover">
      <span>{info.title}</span>
    </Popover>
  ) : (
    <span>{info.title}</span>
  );
  const noticeLabel = isCreate ? (
    <Popover content={content} title="" trigger="hover">
      <span className={styles.ant_form_item_label_notice_span}>{info.title}</span>
    </Popover>
  ) : (
    <span className={styles.ant_form_item_label_notice_span}>{info.title}</span>
  );
  const prop = `${parent.title}.${info.title}`;
  const compWidth = info.width || 8;
  const labelCol = labelWidth || Math.ceil((2 / compWidth) * 24);
  const isShowDisabledCompLabel = pageType === 'detail' && info.type !== 'table';

  return info.type !== 'notice' ? (
    <Col span={isShowDisabledCompLabel ? 12 : compWidth}>
      <FormItem
     // label={(pageType !== 'detail' && info.type !== 'table') ? label
     //   : (pageType !== 'create' && info.type === 'table' ? label
     //     : (required && !disabled ?
     //  <span className={styles.ant_form_item_label_span_required}>{info.title}</span>
     //       : <span className={styles.ant_form_item_label_span}>{info.title}</span>))}
        label={
      pageType !== 'detail' ? (
       label
      ) : (
        <span
          className={
         required && !disabled
          ? styles.ant_form_item_label_span_required
          : styles.ant_form_item_label_span
        }
        >
          {info.title}
        </span>
      )
     }
        className={styles.form_item}
        labelCol={{ span: isShowDisabledCompLabel ? 7 : labelCol }}
        wrapperCol={{ span: isShowDisabledCompLabel ? 15 : 24 - labelCol }}
      >
        {getFieldDecorator(prop, this.getFormOptions(required))(
      this.getComp(info, disabled, isCreate, parent, editNodeName),
     )}
      </FormItem>
    </Col>
  ) : (
    <Col span={24}>
      <FormItem
        label={
      pageType !== 'detail' ? (
       noticeLabel
      ) : (
        <span className={styles.ant_form_item_label_notice_span}>{info.title}</span>
      )
     }
        className={styles.form_item_notice}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 0 }}
      >
        <div />
      </FormItem>
    </Col>
  );
 }

 render() {
  const {
   model,
   readOnly,
   isCreate,
   onAddComp,
   onEditGroup,
   onDelGroup,
   editNodeName,
   pageType,
  } = this.props;
  return (
    <div className="tplt">
      {model.groups
     ? model.groups.map((item, index) => {
        // 判断当前节点是否可编辑
        let disabled = readOnly;
        if (editNodeName) {
         editNodeName.map((editNode) => {
          // 对组编辑项判断
          if (editNode.type === 'group') {
           if (editNode.column === item.title) {
            switch (editNode.status) {
             case 'editAll':
              // 申请人和审批人均可编辑
              disabled = false;
              break;
             case 'edit':
              // 禁用申请页面的审批人编辑项
              disabled = pageType === 'create';
              break;
             default:
              break;
            }
           }
          }
          return null;
         });
        }
        return (
          <div key={item.title} className={styles.form_part}>
            <Row gutter={24} className={styles.form_title}>
              <span style={{ padding: 0 }}>{item.title}</span>
              {isCreate ? (
                <span style={{ padding: 0, float: 'right' }}>
                  <Button
                    className="ant-btn-no-border"
                    icon="edit"
                    onClick={() => {
               onEditGroup(item, index);
              }}
                    type="dashed"
                  />
                  <Button
                    className="ant-btn-no-border"
                    icon="delete"
                    onClick={() => {
               onDelGroup(item, index);
              }}
                    type="dashed"
                  />
                </span>
           ) : null}
            </Row>
            <Row gutter={24} type="flex">
              {item.children.map((row, compIndex) => this.getFormItem(compIndex, row, index, item, disabled, editNodeName, pageType))}
              {isCreate ? (
                <Col span={2} style={{ padding: 0, textAlign: 'right' }}>
                  <Button
                    style={{
               fontSize: '20px',
               lineHeight: '40px',
               height: '40px',
               width: '40px',
              }}
                    icon="plus"
                    onClick={() => {
               onAddComp(item, index);
              }}
                    type="dashed"
                  />
                </Col>
           ) : null}
            </Row>
          </div>
        );
       })
     : null}
    </div>
  );
 }
}
