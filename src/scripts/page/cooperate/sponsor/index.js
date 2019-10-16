import {
  Avatar,
  Button,
  DatePicker,
  Input,
  Modal,
  Radio,
  Select,
  Table,
  Popover,
  Badge,
  Tabs,
} from 'antd';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import styles from './index.css';
import MemoModal from '../detail/memoModal';
import {
  APPLY_STATU_CLASSNAMES_MAP,
  APPLY_STATU_MAP,
  APPLY_OA_MAP,
  OA_STATUS_MAP,
} from '../../../const/map';

const { TabPane } = Tabs;

const PAGE_MAP = {
  sponsor: '我发起的',
  approved: '我已审批的',
  unapproved: '待我审批的',
  notified: '知会我的',
};
@inject(state => ({
  history: state.history,
  qtalk: state.store.user.qtalk,
  isLogin: state.store.user.isLogin,
  userInfo: state.store.user.userInfo,
  sponsor: state.store.coopSponsorData,
  detail: state.store.detailData,
  listData: state.store.coopSponsorData.listData,
}))
@withRouter
@observer
export default class CoopSponsor extends Component {
  static propTypes = {
    qtalk: PropTypes.string.isRequired,
    sponsor: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    detail: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      columns: this.getOAColumns(),
    };
  }

  componentDidMount() {
    const {
      setPageType,
      getCounts,
      getFlowTypeList,
      getExtSysProcessKeys,
      getList,
      OAType,
    } = this.props.sponsor;
    setPageType(this.props.location.pathname.split('cooperate/')[1]);

    getCounts();

    getFlowTypeList();
    getExtSysProcessKeys();
    getList(
      {
        page: 1,
        size: 10,
      },
      OAType,
    );
  }

  componentWillUnmount() {
    this.props.sponsor.reset();
  }

  getOAColumns() {
    const { showPicture } = this.props.sponsor;
    const { detail } = this.props;
    const { setListMemoVisible } = detail;
    return [
      {
        title: '',
        dataIndex: 'flowOrder.title',
        width: '5%',
        render: (text, record) => {
          const { flowOrder = {} } = record;
          const { applyUserAvatar = '' } = flowOrder;
          return <Avatar src={applyUserAvatar} />;
        },
      },
      {
        title: '审批标题',
        dataIndex: 'flowOrder.headline',
        width: '20%',
        className: styles.column_display,
        render: text => <span>{text}</span>,
      },
      {
        title: '审批摘要',
        dataIndex: 'flowOrder.abstracts',
        width: '30%',
        className: styles.column_display,
        render: (text, record) => {
          const { formDatas = {} } = record;
          const { summary = '' } = formDatas;
          return summary
            ? summary.map((item, index) => <p key={index}>{item || '无'}</p>)
            : null;
        },
      },
      {
        title: '发起/完成时间',
        dataIndex: 'flowOrder.flowTime',
        width: '20%',
        className: styles.column_display,
        render: text => (!text ? '' : text)
          .split('//')
          .map((item, index) => (item ? (
            <p>{index === 0 ? `发起：${item}` : `完成：${item}`}</p>
          ) : null)),
      },
      {
        title: '状态',
        dataIndex: 'flowOrder.applyStatus',
        width: '10%',
        render: (text, record) => {
          const { flowOrder = {} } = record;
          const { nextApproveUsers = '' } = flowOrder;
          return (
            <div>
              {nextApproveUsers ? (
                <Popover
                  content={(
                    <div>
                      <p className={styles[APPLY_STATU_CLASSNAMES_MAP[text]]}>
                        审批人：
                        {nextApproveUsers}
                      </p>
                    </div>
                  )}
                >
                  <span className={styles[APPLY_STATU_CLASSNAMES_MAP[text]]}>
                    {APPLY_STATU_MAP[text]}
                  </span>
                </Popover>
              ) : (
                <span className={styles[APPLY_STATU_CLASSNAMES_MAP[text]]}>
                  {APPLY_STATU_MAP[text]}
                </span>
              )}
            </div>
          );
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: '10%',
        render: (text, record, index) => {
          const { flowOrder = {} } = record;
          const { qtalk } = this.props;
          const {
            id = '',
            applyStatus = '',
            applyUserId = [],
            approvedUsers = '',
          } = flowOrder;
          return (
            <div key={index} className={styles.operation_div}>
              <div>
                <Button
                  type="dashed"
                  size="small"
                  onClick={() => showPicture(record)}
                >
                  流程图
                </Button>
              </div>
              <div>
                <Link to={`/cooperate/detail/${id}`}>
                  <Button type="primary" size="small">
                    详情
                  </Button>
                </Link>
              </div>
              {applyStatus === 1
              && applyUserId.includes(qtalk)
              && approvedUsers.toString().replace(',', '').length === 0 ? (
                <div>
                  <Button
                    type="danger"
                    size="small"
                    onClick={() => setListMemoVisible(true, 'revokeRecord', record)
                    }
                  >
                    撤销
                  </Button>
                </div>
                ) : null}
            </div>
          );
        },
      },
    ];
  }

  getExtSysColumns() {
    return [
      {
        title: '系统标识',
        dataIndex: 'processKeys',
        width: '15%',
        className: styles.column_display,
      },
      {
        title: '审批标题',
        dataIndex: 'title',
        width: '20%',
        className: styles.column_display,
        render: text => <span>{text}</span>,
      },
      {
        title: '发起人',
        dataIndex: 'applyUser',
        width: '15%',
        className: styles.column_display,
        render: text => <span>{text}</span>,
      },
      {
        title: '发起时间',
        dataIndex: 'applyTime',
        width: '20%',
        className: styles.column_display,
      },
      {
        title: '审批人',
        dataIndex: 'approveUsers',
        width: '20%',
        className: styles.column_display,
        render: text => <span className={styles.process}>{text}</span>,
      },
      {
        title: '操作',
        dataIndex: 'redirectUrl',
        width: '10%',
        render: (text, record, index) => (
          <div key={index}>
            <a href={text} rel="noopener noreferrer" target="_blank">详情</a>
          </div>
        ),
      },
    ];
  }

  changeColumns(OAType) {
    const OA = this.getOAColumns();
    const ExtSys = this.getExtSysColumns();
    this.setState({
      columns: OAType === 'OA' ? OA : ExtSys,
    });
  }

  render() {
    const { listData } = this.props;

    const { columns } = this.state;

    const {
      counts,
      pagination,
      pageType,
      OAType,
      setOAType,
      getList,
      searchParams,
      flowTypeList,
      extSysProcessKeys,
      moreSearchVisible,
      toggleMoreSearch,
      updateSearchParams,
      imgSrc,
      closeModal,
      clearListData,
    } = this.props.sponsor;
    let statusList = Object.keys(APPLY_STATU_MAP)
      .sort(a => (a == '4' ? -1 : 1))
      .map(key => ({
        key: Number(key),
        text: APPLY_STATU_MAP[key],
      }));
    if (pageType === 'approved') {
      statusList = statusList.filter(item => item.key !== 3);
    }
    const Search = Input.Search;

    const Option = Select.Option;

    const RadioButton = Radio.Button;

    const RadioGroup = Radio.Group;

    const { RangePicker } = DatePicker;
    return (
      <div>
        <Modal
          visible={imgSrc}
          title={null}
          footer={null}
          wrapClassName="modal_wrap"
          closable={false}
          centered
          onCancel={closeModal}
          style={{ width: '1000px' }}
        >
          <img className={styles.activiti_img} src={imgSrc} alt="流程图" />
        </Modal>
        <div className={styles.header_title}>
          {' '}
          {PAGE_MAP[pageType]}
          {' '}
        </div>
        {pageType === 'sponsor' ? (
          <div className={styles.count}>
            <div className={styles.count_item}>
              <div className={styles.count_item_title}>未发起</div>
              <div className={styles.count_item_result}>
                {counts.draftCount}
                个草稿
              </div>
            </div>
            <div className={styles.count_item}>
              <div className={styles.count_item_title}>审批中</div>
              <div className={styles.count_item_result}>
                {counts.approvalCount}
                个流程
              </div>
            </div>
            <div className={styles.count_item}>
              <div className={styles.count_item_title}>已完结</div>
              <div className={styles.count_item_result}>
                {counts.offCount}
                个流程
              </div>
            </div>
          </div>
        ) : null}
        <div className={styles.list}>
          {pageType === 'unapproved' ? (
            <Tabs
              activeKey={OA_STATUS_MAP[OAType]}
              onChange={(e) => {
                clearListData();
                this.changeColumns(APPLY_OA_MAP[e]);
                setOAType(APPLY_OA_MAP[e]);
                getList({ page: 0 }, APPLY_OA_MAP[e]);
              }}
              tabBarExtraContent={(
                <div
                  style={{ position: 'absolute', left: '44px', top: '-9px' }}
                >
                  <Badge count={counts.oaUnApproveCount} />
                  <span style={{ 'padding-left': '87px' }}>
                    <Badge count={counts.extSysUnApproveCount} />
                  </span>
                </div>
)}
            >
              <TabPane tab="OA" key="0" />
              <TabPane tab="审批中心" key="1" />
            </Tabs>
          ) : null}
          <div className={styles.search}>
            <Search
              value={searchParams.key}
              onChange={(e) => {
                updateSearchParams({
                  key: e.target.value,
                });
              }}
              onSearch={() => {
                getList(
                  {
                    page: 0,
                  },
                  OAType,
                );
              }}
              placeholder="请输入关键字"
              style={{
                width: 400,
                marginRight: '10px',
              }}
            />
            <Button
              type="primary"
              style={{ marginRight: '10px' }}
              onClick={() => {
                getList(
                  {
                    page: 0,
                  },
                  OAType,
                );
              }}
            >
              搜索
            </Button>
            <Button style={{ border: 0 }} onClick={() => toggleMoreSearch()}>
              {moreSearchVisible ? '关闭高级搜索' : '展开高级搜索'}
            </Button>
          </div>
          {moreSearchVisible ? (
            <div className={styles.more_search}>
              <span>提交审批时间:</span>
              <RangePicker
                allowClear={false}
                value={[
                  moment(searchParams.submitBeginTime),
                  moment(searchParams.submitEndTime),
                ]}
                style={{ margin: '0 10px 10px 10px' }}
                onChange={(val, str) => {
                  updateSearchParams({
                    submitBeginTime: str[0],
                    submitEndTime: str[1],
                  });
                }}
              />
              <br />
              {pageType !== 'unapproved' ? (
                <span>
                  <span>完成审批时间:</span>
                  <RangePicker
                    allowClear={false}
                    value={[
                      moment(searchParams.finishBeginTime),
                      moment(searchParams.finishEndTime),
                    ]}
                    style={{ marginLeft: '10px' }}
                    onChange={(val, str) => {
                      updateSearchParams({
                        finishBeginTime: str[0],
                        finishEndTime: str[1],
                      });
                    }}
                  />
                </span>
              ) : null}
              {pageType !== 'sponsor' ? (
                <div>
                  <span>审批单发起人:</span>
                  <Input
                    value={searchParams.userId}
                    onChange={(e) => {
                      updateSearchParams({
                        userId: e.target.value,
                      });
                    }}
                    placeholder="请输入关键字"
                    style={{
                      width: 200,
                      margin: '10px',
                    }}
                  />
                </div>
              ) : null}
            </div>
          ) : null}
          <div className={styles.filter}>
            <span style={{ marginRight: '10px' }}>{OAType === 'OA' ? '审批类型' : '系统标识'}</span>
            <Select
              defaultValue="全部"
              style={{
                width: 200,
                marginRight: '10px',
              }}
              value={searchParams.flowType}
              onChange={(val) => {
                updateSearchParams({
                  flowType: val,
                });
                getList(
                  {
                    page: 0,
                  },
                  OAType,
                );
              }}
            >
              {OAType === 'OA' ? flowTypeList.map((item, index) => (
                <Option key={index} value={item.formKey}>
                  {item.formName}
                </Option>
              )) : extSysProcessKeys.map((item, index) => (
                <Option key={index} value={item}>
                  {item}
                </Option>
              ))}
            </Select>
            {pageType !== 'unapproved' && pageType !== 'notified' ? (
              <RadioGroup
                value={searchParams.status}
                onChange={(e) => {
                  updateSearchParams({
                    status: e.target.value,
                  });
                  getList(
                    {
                      page: 0,
                    },
                    OAType,
                  );
                }}
              >
                {statusList.map((item, index) => (
                  <RadioButton key={index} value={item.key}>
                    {item.text}
                  </RadioButton>
                ))}
              </RadioGroup>
            ) : null}
          </div>
          <Table
            rowKey="id"
            dataSource={listData}
            pagination={pagination}
            columns={columns}
            onChange={(pagination) => {
              getList(
                {
                  page: pagination.current,
                  size: pagination.pageSize,
                },
                OAType,
              );
            }}
          />
        </div>
        <MemoModal />
      </div>
    );
  }
}
