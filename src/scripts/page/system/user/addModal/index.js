import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { Modal } from 'antd';
import AddForm from '../addForm';


@inject(state => ({
  oaUser: state.store.oaUser,
}))
@observer
export default class AddModal extends Component {
  render() {
    const { oaUser } = this.props;
    const { showAddModal, closeAddModal, editOAUser } = oaUser;
    return (
      <Modal
        title={editOAUser ? '编辑用户' : '添加用户'}
        visible={showAddModal}
        onCancel={closeAddModal}
        footer={null}
      >
        <AddForm />
      </Modal>
    );
  }
}
