import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { Modal } from 'antd';
import AddForm from '../addForm';


@inject(state => ({
  admin: state.store.admin,
}))
@observer
export default class AddModal extends Component {
  render() {
    const { admin } = this.props;
    const { showAddModal, closeAddModal } = admin;
    return (
      <Modal
        title="添加管理员"
        visible={showAddModal}
        onCancel={closeAddModal}
        footer={null}
      >
        <AddForm />
      </Modal>
    );
  }
}
