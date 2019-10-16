import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import { Modal } from 'antd';

import AddForm from "../addForm"; 
@inject(state => ({
  workgroup: state.store.workgroup
}))
@observer
export default class addModal extends Component {
  render() {
    const { showAddModal, closeModal } = this.props.workgroup;
    return (
      <Modal
      title="添加"
      visible={showAddModal}
      onCancel={closeModal}
      footer={null}
    >
    <AddForm />
    </Modal>
    )
  }
}