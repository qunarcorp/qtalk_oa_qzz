import { Input } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';

/**
 * OrderNo 组件 : 规矩规则自动生成流水号
 * @param {String} format  流水号格式
 * eg. OAyyyyMMddHHmmss{6}:
 *     OA 是固定字符
 *     yyyyMMddHHmmss 时间格式(可选部分)
 *     {6} 代表随机数个数
 * @param {object} form 表单
 * @param {String} name input的name
 * @param {String} parentName input的父级name
 * @example
 * <OrderNo
 *  format={'OAyyyyMMddHHmmss{6}'}
 * />
 */

export default class OrderNo extends React.Component {
  constructor(props) {
    super(props);
    this.setOrderNo();
  }

 setOrderNo = () => {
   const datetime = new Date();
   const Nmonth = datetime.getMonth() + 1 < 10 ? `0${datetime.getMonth() + 1}` : datetime.getMonth() + 1;
   const Ndate = datetime.getDate() < 10 ? `0${datetime.getDate()}` : datetime.getDate();
   const Nhour = datetime.getHours() < 10 ? `0${datetime.getHours()}` : datetime.getHours();
   const Nminute = datetime.getMinutes() < 10 ? `0${datetime.getMinutes()}` : datetime.getMinutes();
   const Nsecond = datetime.getSeconds() < 10 ? `0${datetime.getSeconds()}` : datetime.getSeconds();
   let { format = 'OAyyyyMMddHHmmss{6}' } = this.props;
   const pattern = /{\w*}/;
   let endOfNum = format.match(pattern) ? format.match(pattern)[0] : '{0}';
   endOfNum = endOfNum.replace('{', '').replace('}', '');
   endOfNum = 10 ** (endOfNum - 1);
   const randmonNum = parseInt((Math.random() + 1) * endOfNum, 10);
   format = format
     .replace('yyyy', datetime.getFullYear())
     .replace('MM', Nmonth)
     .replace('dd', Ndate)
     .replace('HH', Nhour)
     .replace('mm', Nminute)
     .replace('ss', Nsecond)
     .replace(/{\w*}/, randmonNum);
   this.state = { value: format };
 };

 render() {
   const { form, name, parentName } = this.props;
   const { value } = this.state;
   const { getFieldDecorator } = form;
   return getFieldDecorator(`${parentName}.${name}`, {
     validateTrigger: ['onChange', 'onBlur'],
     rules: [
       {
         required: true,
         message: '流水号错误, 请点击右上角Qtalk咨询反馈信息',
       },
     ],
     initialValue: value,
   })(<Input disabled />);
 }
}

OrderNo.propTypes = {
  format: PropTypes.string.isRequired,
  form: PropTypes.objectOf(PropTypes.object).isRequired,
  name: PropTypes.string.isRequired,
  parentName: PropTypes.string.isRequired,
};
