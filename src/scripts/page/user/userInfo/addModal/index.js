import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { Modal } from 'antd';
import UpdateForm from '../addForm';


@inject(state => ({
  oaUser: state.store.oaUser,
}))
@observer
export default class UpdateModal extends Component {
  render() {
    const { oaUser } = this.props;
    const { showEditSelfModal, closeEditSelfModal } = oaUser;
    return (
      <Modal
        title="修改用户信息"
        visible={showEditSelfModal}
        onCancel={closeEditSelfModal}
        footer={null}
      >
        <UpdateForm />
      </Modal>
    );
  }
}
