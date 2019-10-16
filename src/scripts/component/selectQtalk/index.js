import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';
import styles from './index.css';
import { oaUserApi } from '../../const/api';
/**
 * SelectQtalk 组件 : input框可以进行模糊搜索
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
 * <SelectQtalk
 *  changeValue={this.changeValue}
 *  inputValue={getFieldValue('qtalk')}
 *  placeholder='请输入被代理人'
 * />
 */

export default class SelectQtalk extends React.Component {
  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.fetchQtalk = debounce(this.fetchQtalk, 400);
  }

  state = {
    data: [],
    fetching: false,
  };

  async fetchQtalk(value) {
    if (!value) {
      return;
    }
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ data: [], fetching: true });
    const params = {
      key: value,
    };
    const res = await http.post(oaUserApi.searchUserList, params);
    if (fetchId !== this.lastFetchId) {
      return;
    }
    const { data } = res.data;
    this.setState({ data, fetching: false });
  }

  handleChange = (value) => {
    const { changeValue = '', onChange = '' } = this.props;
    this.setState({
      data: [],
      fetching: false,
    });
    changeValue ? changeValue(value) : onChange(value);
    // changeValue(value);
  };

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
    const Option = Select.Option;
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
        onSearch={value => this.fetchQtalk(value)}
        onChange={this.handleChange}
        className={styles[className]}
        disabled={disabled}
      >
        {data.map(d => (
          <Option key={d.value} title={`${d.value} ${d.label}`}>
            {`${d.value} ${
              d.label
            }`}
          </Option>
        ))}
      </Select>
    );
  }
}
