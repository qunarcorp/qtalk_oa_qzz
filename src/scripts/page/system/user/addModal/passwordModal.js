import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { Modal } from 'antd';
import PasswordForm from '../addForm/passwordForm';


@inject(state => ({
  oaUser: state.store.oaUser,
}))
@observer
export default class PasswordModal extends Component {
  render() {
    const { oaUser } = this.props;
    const { showEditPasswordModal, closeEditPasswordModal, oaUserInfo } = oaUser;
    const { userName } = oaUserInfo;
    return (
      <Modal
        title={`更改用户密码--${userName}`}
        visible={showEditPasswordModal}
        onCancel={closeEditPasswordModal}
        footer={null}
      >
        <PasswordForm />
      </Modal>
    );
  }
}
