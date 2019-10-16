import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router';
import React, { Component } from 'react';
import { Avatar, Button, Icon, Upload } from 'antd';
import styles from './index.css';
import UpdateModal from './addModal';

@inject(state => ({
  oaUser: state.store.oaUser,
}))
@withRouter
@observer
export default class OAUserSelf extends Component {
  componentDidMount() {
    const { oaUser } = this.props;
    const { getOAUserInfoSelf } = oaUser;
    getOAUserInfoSelf();
  }

  componentWillUnmount() {
    const { oaUser } = this.props;
    oaUser.reset();
  }

  handleAvatarChange() {
    location.reload();
  }

  render() {
    const { oaUser } = this.props;
    const { showEditSelfModal, openEditSelfModal, oaUserInfo } = oaUser;
    return (
      <div>
        {showEditSelfModal ? <UpdateModal /> : ''}
        <div className={styles.header_title}>个人信息</div>
        <div className={styles.content}>
          <div className={styles.content_left}>
            <Avatar shape="square" size={170} icon="user" src={oaUserInfo.avatar} />
            <div className={styles.avatar_upload}>
              <Upload action="/oaUser/updateAvatar" showUploadList={false} onChange={this.handleAvatarChange}>
                <Button>
                  <Icon type="upload" />
                  点击上传头像
                </Button>
              </Upload>
            </div>
          </div>
          <div className={styles.content_right}>
            <div className={styles.user_column}>
              <span className={styles.user_column_label}>用户名</span>{oaUserInfo.userName}
            </div>
            <div className={styles.user_column}>
              <span className={styles.user_column_label}>中文名</span>{oaUserInfo.cname}
            </div>
            <div className={styles.user_column}>
              <span className={styles.user_column_label}>直接主管</span>{oaUserInfo.leader}
            </div>
            <div className={styles.user_column}>
              <span className={styles.user_column_label}>部门</span>{oaUserInfo.deptStr}
            </div>
            <div className={styles.user_column}>
              <span className={styles.user_column_label}>手机号</span>{oaUserInfo.phone}
            </div>
            <div className={styles.user_column}>
              <span className={styles.user_column_label}>邮箱</span>{oaUserInfo.email}
            </div>
            <div className={styles.user_column}>
              <span className={styles.user_column_label}>个人签名</span>{oaUserInfo.mood}
            </div>
            <Button className={styles.button_add} type="primary" onClick={openEditSelfModal}>
              编辑信息
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
