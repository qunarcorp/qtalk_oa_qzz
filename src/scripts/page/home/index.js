import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { observer, inject } from 'mobx-react';
import { Icon, Avatar } from 'antd';
import styles from './index.css';
import { Route, Link } from 'react-router-dom';
import { timeago, timeMoment } from './../../util/timeUtil';

@inject(state => ({
  user: state.store.user,
  homeData: state.store.homeData
}))

@observer
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { getMessage, getCounts, getTpls } = this.props.homeData;
    getMessage();
    getCounts();
    getTpls();
  }

  componentWillUnmount() {
    console.log('componentWillUnmountHome');
  }

  render() {
    const { userInfo } = this.props.user;
    const { counts, tplList, messageList } = this.props.homeData;
    return (
      <div className={styles.wrap}>
        <div className={styles.header}>
          <img src={userInfo.avatar}/>
          <div className={styles.user}>
            <p className={styles.user_qt}>{timeMoment()}, {userInfo.cname}, 祝你开心每一天!</p>
            <p className={styles.user_job}>{userInfo.mood}</p>
          </div>
          <div className={styles.count}>
            <p>待办</p>
            <Link to='/cooperate/unapproved'
                  className={styles.count_number}>{counts.approveCount + counts.extSysApproveCount}</Link>
          </div>
          <div className={styles.count}>
            <p>已办</p>
            <Link to='/cooperate/approved' className={styles.count_number}>{counts.approved}</Link>
          </div>
        </div>
        <div className={styles.cont}>
          <div className={styles.left}>
            {/* <div className=styles.list></div> */}
            <div className={styles.message}>
              <div className={styles.title}>动态</div>
              {
                messageList.map(item => (
                  <div className={styles.message_item}>
                    <div>
                      <Avatar src={item.whoAvatar} className={styles.title_avatar}/>
                      <b>{item.who}</b>
                      {` ${item.content} `}
                      <Link to={`/cooperate/detail/${item.flowID}`}>
                        {item.flowName}
                      </Link>
                    </div>
                    <div className={styles.message_time}>{timeago(item.updateTime)}</div>
                  </div>
                ))
              }
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.nav}>
              <div className={styles.title}>快速开始/便捷导航</div>
              <div className={styles.links}>
                <Link to='/cooperate/create' className={styles.dynamic_color}>发起申请</Link>
                <Link to='/cooperate/sponsor' className={styles.dynamic_color}>我的申请</Link>
                <Link to='/cooperate/unapproved' className={styles.dynamic_color}>待我审批</Link>
                <Link to='/cooperate/approved' className={styles.dynamic_color}>我已审批</Link>
                <Link to='/cooperate/notified' className={styles.dynamic_color}>知会我的</Link>
              </div>
            </div>
            <div className={styles.approve}>
              <div className={styles.title}>快速发起申请</div>
              <div className={styles.approve_cont}>
                {
                  tplList.map(item => (
                    <Link to={`/cooperate/create/${item.formKey}`}
                          className={styles.approve_item}>{item.formName}</Link>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
