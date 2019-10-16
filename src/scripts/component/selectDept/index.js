/*
 * @Author: lee.guo
 * @Date: 2018-12-21 14:54:33
 * @Last Modified by: lee.guo
 * @Last Modified time: 2018-12-21 15:09:56
 */

import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';
import * as PropType from 'prop-types';
import React from 'react';
import { deptApi } from '../../const/api';
import styles from './index.css';
/**
 * SelectDept 组件 : input框可以进行模糊搜索
 * @param {function} changeValue  表单项可省
 * 处理onchange事件
 * @param {string} inputValue 表单项可省
 * 对应select value字段
 * @param {string} placeholder 可省
 * default = '请输入'
 * @param {string} mode 可省
 * 可以设置mode值('multiple' | 'tags') 默认为 'default'
 * @param {string} className 可省 可以设置类名
 * default = .input_search{width: 400px; margin-right: 10px;}
 * 如果设置,需要将相应类写在当前文件夹下的index.css文件下
 * @param {boolean} disabled
 *
 * @example
 * <SelectDept
 *  changeValue={this.changeValue}
 *  inputValue={getFieldValue('dept')}
 *  placeholder='请输入被代理人'
 * />
 */

export default class SelectDept extends React.Component {
  static defaultProps: {
    changeValue: (...args: any[]) => any,
    onChange: () => any,
    inputValue: string,
    value: string,
  };

  static propTypes = {
    changeValue: PropType.func,
    onChange: PropType.func,
    inputValue: PropType.string,
    value: PropType.string,
    placeholder: PropType.string,
    mode: PropType.string,
    className: PropType.string,
    disabled: PropType.bool,
    comRef: PropType.string,
  };

  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.fetchDept = debounce(this.fetchDept, 400);
  }

  state = {
    data: [],
    fetching: false,
  };

  handleChange = (value) => {
    const { changeValue = '', onChange = '' } = this.props;
    this.setState({
      data: [],
      fetching: false,
    });
    changeValue ? changeValue(value) : onChange(value);
    // changeValue(value);
  };

  async fetchDept(value) {
    if (!value) {
      return;
    }

    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ data: [], fetching: true });
    const params = {
      kw: value,
    };
    const res = await http.post(deptApi.getDeptList, params);
    if (fetchId !== this.lastFetchId) {
      return;
    }
    const { data } = res.data;
    this.setState({ data, fetching: false });
  }

  render() {
    const { fetching, data } = this.state;
    const {
      inputValue = undefined,
      value = undefined,
      placeholder = '请输入',
      mode = 'default',
      className = 'input_search',
      disabled = false,
      comRef = 'input',
    } = this.props;
    const { Option } = Select;
    return (
      <Select
        ref={comRef}
        allowClear
        mode={mode}
        tokenSeparators={[',']}
        showSearch
        // defaultActiveFirstOption 为true时失去焦点会默认选中第一项
        defaultActiveFirstOption={false}
        // filterOption 为true时中文会折叠起来
        filterOption={false}
        showArrow={false}
        value={inputValue || value}
        placeholder={placeholder}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        onSearch={v => this.fetchDept(v)}
        onChange={this.handleChange}
        className={styles[className]}
        disabled={disabled}
      >
        {data.map(d => (
          <Option key={d.value} title={`${d.value} ${d.label}`}>
            {`${d.value} ${d.label}`}
          </Option>
        ))}
      </Select>
    );
  }
}
