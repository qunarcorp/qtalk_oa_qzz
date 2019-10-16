import { Button, Col, Form, Input, Row, Select, Switch, Popover, Radio } from 'antd';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/zh-cn';
import { withRouter } from 'react-router-dom';
import Tplt from '../../../component/tplt';
import CompModal from './compModal';
import GroupModal from './groupModal';
import styles from './index.css';

const INIT_TPLT = {
  key: '',
  name: '',
  department: '平台事业部',
  isConditionDepartment: false,
  conditionDepartment: '',
  groups: [
    {
      title: '基本信息',
      id: '基本信息',
      children: [],
    },
  ],
};
const RadioGroup = Radio.Group;

// const { Option } = Select;
@inject(state => ({
  user: state.store.user,
  tpltData: state.store.tpltCreate,
}))
@withRouter
@observer
class CreateTemplate extends Component {
  static propTypes = {
    tpltData: PropTypes.objectOf(PropTypes.object).isRequired,
    match: PropTypes.objectOf(PropTypes.object).isRequired,
    form: PropTypes.objectOf(PropTypes.object).isRequired,
    history: PropTypes.objectOf(PropTypes.object).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { tpltData, match, form } = this.props;
    const { setPageType, getDetail, getDepartList } = tpltData;
    getDepartList();
    if (location.hash.includes('#/template/detail/create')) {
      const { id } = match.params;
      if (id !== 'new') {
        getDetail(id);
      }
      setPageType('create');
    } else if (location.hash.includes('#/template/list/edit')) {
      const { id } = match.params;
      const { version } = match.params;
      setPageType('detail');
      getDetail(id, version);
    } else {
      const { id } = match.params;
      setPageType('detail');
      getDetail(id);
    }
    form.validateFields();
  }

  componentWillReceiveProps(props) {
    const { match, tpltData } = props;
    const { id } = match.params;
    const newId = match.params.id;
    const { setTplt, getDetail } = tpltData;
    if (id !== newId) {
      if (newId === 'new') {
        setTplt(INIT_TPLT);
      } else {
        getDetail(newId);
      }
    }
  }

  componentWillUnmount() {
    const { tpltData } = this.props;
    const { setTplt, setIsJsonEdit, setTpltJson } = tpltData;
    setTplt(INIT_TPLT);
    setTpltJson(INIT_TPLT);
    setIsJsonEdit(false);
  }

  onDelComp(index, info, parentIndex) {
    const { tpltData } = this.props;
    const { tplt, setTplt } = tpltData;
    const groups = [...tplt.groups];
    groups[parentIndex].children.splice(index, 1);
    setTplt({ groups });
  }

  onEditGroup(info, index) {
    const { tpltData } = this.props;
    const {
      setCurrGroup,
      setGroupModalData,
      setGroupModalVisible,
    } = tpltData;
    setCurrGroup({
      index,
      info
    });
    setGroupModalData({ name: info.title });
    setGroupModalVisible(true, 'edit');
  }

  onEditComp(index, info, parentIndex, parent) {
    const { tpltData } = this.props;
    const {
      setCurrGroup,
      setCurrComp,
      setCompModalData,
      setCompModalVisible,
    } = tpltData;
    setCurrGroup({
      index: parentIndex,
      info: parent,
    });
    setCurrComp({
      index,
      info
    });
    setCompModalData(
      {
        ...info,
        options: info.options ? info.options.join('\n') : '',
        showOptions: info.showOptions ? info.showOptions.join('\n') : '',
        conditionLinkCode: info.conditionLinkCode ? info.conditionLinkCode.join('\n') : '',
      },
      true,
    );
    setCompModalVisible(true, 'edit');
  }

  onDelGroup(info, index) {
    const { tpltData } = this.props;
    const { tplt, setTplt, setGroupModalVisible } = tpltData;
    const groups = [...tplt.groups];
    groups.splice(index, 1);
    setTplt({ groups });
    setGroupModalVisible(false);
  }

  updateAll = async () => {
    const { tpltData } = this.props;
    const { update } = tpltData;
    const updateType = 'all';
    update(updateType);
  };

  // updateOnlyForm = async () => {
  //   const { tpltData } = this.props;
  //   const { update } = tpltData;
  //   const updateType = 'onlyForm';
  //   update(updateType);
  // };

  copy = () => {
    const { history, match } = this.props;
    history.replace(
      `/template/detail/create/${match.params.id}`,
    );
  };

  save = async () => {
    const { tpltData } = this.props;
    const { create } = tpltData;
    await create();
  };

  render() {
    const { tpltData } = this.props;
    const conditionDepOptions = ['1', '2', '3', '4', '5'];
    const {
      tplt,
      setCompModalVisible,
      setCurrGroup,
      setGroupModalVisible,
      setTplt,
      setCompModalData,
      compModalData,
      pageType,
      isJsonEdit,
      setIsConditionDepartment,
      setConditionDepartment,
      setIsJsonEdit,
      setTpltJson,
      departList,
    } = tpltData;
    return (
      <div className={styles.create}>
        <div>
          <span>申请流程所属部门:</span>
          <Select
            disabled={pageType === 'detail'}
            style={{
              width: 200,
              margin: '0 15px'
            }}
            value={tplt.department}
            onChange={(val) => {
              setTplt({
                department: val,
              });
            }}
          >
            {departList.map(item => <Option key={item} value={item}>{item}</Option>)}
          </Select>
          <span>流程模板名称:</span>
          <Input
            value={tplt.name}
            disabled={pageType === 'detail'}
            style={{
              width: '200px',
              margin: '0 60px 0 15px'
            }}
            onChange={(e) => {
              const { value } = e.target;
              setTplt({
                name: value,
              });
            }}
          />
          {pageType === 'create' ? (
            <Button onClick={this.save} type="primary">
              保存模板
            </Button>
          ) : (
            <Button style={{ marginLeft: '10px' }} onClick={this.updateAll} type="primary">
              更新模版
            </Button>
          )}

          {pageType === 'detail' ? (
            <Button
              style={{ marginLeft: '10px' }}
              onClick={this.copy}
              type="primary"
            >
              复制模板
            </Button>
          ) : null}
        </div>
        <div style={{ marginTop: '15px' }}>
          <span className={styles.form_small_font}>模版view/json:</span>
          <Switch
            checked={isJsonEdit}
            onChange={setIsJsonEdit}
            className={styles.switch_button}
            checkedChildren="Json"
            unCheckedChildren="view"
          />
          <span className={styles.form_small_font}>申请人部门作为流程条件:</span>
          <Switch
            checked={tplt.isConditionDepartment}
            onChange={setIsConditionDepartment}
            className={styles.switch_button}
            checkedChildren="是"
            unCheckedChildren="否"
          />
          {tplt.isConditionDepartment ? (
            <span>
              <span className={styles.form_small_font}>条件部门级别:</span>
              <RadioGroup
                className={styles.switch_button}
                options={conditionDepOptions}
                onChange={setConditionDepartment}
                value={tplt.conditionDepartment}
              />
            </span>
          ) : null}
        </div>
        {isJsonEdit ? (
          <div style={{ marginTop: '15px' }}>
            <JSONInput
              id="a_unique_id"
              locale={locale}
              placeholder={tplt}
              onChange={(val) => {
                setTpltJson(val.jsObject);
              }}
              height="500px"
              width="100%"
            />
          </div>
        ) : (
          <div>
            <Form
              className={('ant-advanced-search-form', styles.form)}
            >
              <Tplt
                isCreate={true}
                model={tplt}
                readOnly={false}
                onAddComp={(info, index) => {
                  setCurrGroup({
                    index,
                    info
                  });
                  setCompModalVisible(true, 'add');
                }}
                onEditGroup={this.onEditGroup.bind(this)}
                onDelGroup={this.onDelGroup.bind(this)}
                onEditComp={this.onEditComp.bind(this)}
                onDelComp={this.onDelComp.bind(this)}
                form={this.props.form}
              />
            </Form>
            <Row gutter={24} justify="center" type="flex">
              <Col span={4}>
                <Button
                  onClick={() => {
                    setGroupModalVisible(true, 'add');
                  }}
                >
                  添加分组
                </Button>
              </Col>
            </Row>
          </div>
        )}
        <GroupModal/>
        <CompModal
          onFormChange={(values) => {
            // Object.keys(values).forEach(key => {
            //     values[key] = values[key].value;
            // })
            setCompModalData({ ...values }, false);
          }}
          formData={{ ...compModalData }}
        />
      </div>
    );
  }
}

export default (CreateTemplate = Form.create({})(CreateTemplate));
