import { Avatar, Button, Icon, Modal, Row, Timeline } from 'antd';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import styles from './index.css';
import PropTypes from 'prop-types';

@inject(state => ({
  detail: state.store.detailData,
  user: state.store.user,
}))
@observer
export default class Log extends Component {
  static propTypes = {
    detail: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { detail, notify } = this.props.detail;
    const { userInfo } = this.props.user;
    const {
      approveLogs,
      approveUsers,
      approveUsersAvatar,
      approveNodeName,
    } = detail;
    const { showPicture, imgSrc, closeModal } = this.props.detail;
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
        <Row className={styles.log}>
          <div className={styles.form_title}>{'审批日志'}
            <Button
              style={{ marginLeft: '10px' }}
              type="dashed"
              onClick={showPicture}
            >
              查看流程图
            </Button>
          </div>
          <Timeline>
            {approveLogs.map((log, index) => (
              <Timeline.Item
                key={index}
                dot={<Icon type="check-circle" theme="outlined" />}
              >
                <p className={styles.break_word}>
                  <Avatar
                    src={log.approveUserAvatar}
                    style={{ marginRight: '10px' }}
                  />
                  {`${log.nodeName}(${log.approveUserId})`}
                  <span style={{
                    marginLeft: '30px',
                    color: '#999',
                  }}>
                  {log.approveTime}
                </span>
                </p>
                <pre className={styles.memo}>{log.memo}</pre>
              </Timeline.Item>
            ))}
            <Timeline.Item
              dot={
                approveUsers ? null : (
                  <Icon type="check-circle" theme="outlined" />
                )
              }
            >
              <p className={styles.break_word}>
                <Avatar
                  src={approveUsersAvatar}
                  style={{ marginRight: '10px' }}
                />
                {approveUsers
                  ? `${approveNodeName}(${approveUsers})`
                  : approveNodeName}
                {approveUsers && detail.applyUserId === userInfo.qtalk ? (
                  <Button
                    style={{ marginLeft: '10px' }}
                    type="dashed"
                    onClick={notify.bind(this)}
                  >
                    催一下
                  </Button>
                ) : null}
              </p>
            </Timeline.Item>
          </Timeline>
        </Row>
      </div>
    );
  }
}
