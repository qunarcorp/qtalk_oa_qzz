import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { Modal } from 'antd';
import IconAddForm from '../addForm/iconAddForm';


@inject(state => ({
  department: state.store.department,
}))
@observer
export default class IconAddModal extends Component {
  render() {
    const { department } = this.props;
    const { clickAddIcon, addReset } = department;
    return (
      <Modal
        title="添加新部门"
        visible={clickAddIcon}
        onCancel={addReset}
        footer={null}
      >
        <IconAddForm />
      </Modal>
    );
  }
}
