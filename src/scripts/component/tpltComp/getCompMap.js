import {
  Checkbox, Input, Radio, Select, message,
} from 'antd';
import { isObservableArray } from 'mobx';

import SelectQtalk from 'COMPONENT/selectQtalk';
import { enToZh } from 'CONST/map';
import { FmtDatePicker, TplUpload, TplUploadImg } from 'COMPONENT/tpltComp';
import SelectDept from '../selectDept';

const { TextArea } = Input;
const { Option } = Select;

const CheckboxGroup = Checkbox.Group;

const RadioGroup = Radio.Group;

function getInput() {
  return <Input ref={node => (this.input = node)} style={{ width: '100%' }} />;
}

function getTextArea() {
  return <TextArea ref={node => (this.input = node)} style={{ width: '100%' }} />;
}

function getSelection() {
  const { options = [], needMap } = this.props;
  if (isObservableArray(options) || Array.isArray(options)) {
    return (
      <Select style={{ width: '100%', height: '100%' }} ref={node => (this.input = node)}>
        {options.map(item => <Option value={item}>{needMap ? enToZh[item] : item}</Option>)}
      </Select>
    );
  }
  message.error('模板错误, 请联系管理员检查模板！');
  return (
    <Select style={{ width: '100%', height: '100%' }} ref={node => (this.input = node)} />
  );
}

function getDatePicker() {
  return <FmtDatePicker comRef={node => (this.input = node)} />;
}

function getUploadImg() {
  const { save = () => {} } = this;
  const { disabled = false, dataIndex = '', record = {} } = this.props;
  const fieldList = record && record.hasOwnProperty(dataIndex) ? record[dataIndex] : '';
  // 此处不能设置value,form会重写该值
  return <TplUploadImg handleSave={save} disabled={disabled} fieldList={fieldList} />;
}

function getUpload() {
  // 不走editing,自己维护自动保存
  const { save = () => {} } = this;
  const { disabled = false, dataIndex = '', record = {} } = this.props;
  const fieldList = record && record.hasOwnProperty(dataIndex) ? record[dataIndex] : '';
  return <TplUpload handleSave={save} disabled={disabled} fieldList={fieldList} />;
}

function checkEmpty(options) {
  return isObservableArray(options) ? options.length : Object.keys(options).length;
}

function getRadio() {
  const { options = {} } = this.props;
  return (
    <RadioGroup style={{ width: '100%' }}>
      {checkEmpty(options) ? (
        options.map((item, index) => (
          <Radio key={index} value={item} ref={node => (this.input = node)}>
            {item}
          </Radio>
        ))
      ) : (
        <Radio key="nothing" value="没有选项" ref={node => (this.input = node)}>
          没有选项
        </Radio>
      )}
    </RadioGroup>
  );
}

function getCheckBox() {
  const { options = {} } = this.props;
  return (
    <CheckboxGroup style={{ width: '100%' }}>
      {checkEmpty(options) ? (
        options.map((item, index) => (
          <Checkbox key={index} value={item} ref={node => (this.input = node)}>
            {item}
          </Checkbox>
        ))
      ) : (
        <Checkbox key="nothing" value="没有选项" ref={node => (this.input = node)}>
          没有选项
        </Checkbox>
      )}
    </CheckboxGroup>
  );
}

function getSelectQtalk() {
  return <SelectQtalk comRef={node => (this.input = node)} />;
}

function getSelectDepartment() {
  return <SelectDept comRef={node => (this.input = node)} />;
}

const getCompMap = {
  select: getSelection,
  selectQtalk: getSelectQtalk,
  input: getInput,
  textArea: getTextArea,
  datePicker: getDatePicker,
  uploadImg: getUploadImg,
  upload: getUpload,
  radio: getRadio,
  checkBox: getCheckBox,
  selectDepartment: getSelectDepartment,
};

export default getCompMap;
