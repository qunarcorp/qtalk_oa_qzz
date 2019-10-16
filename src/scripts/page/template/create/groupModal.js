import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {observer, inject} from 'mobx-react';
import {Form, Input, Button, Row, Col, Select, Modal, Radio} from 'antd';
import styles from './index.css'

@inject(state => ({
    tpltData: state.store.tpltCreate
}))
@observer
export default class GroupModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentDidMount() {
    }
    componentWillUnmount() {}
    addGroup(params) {
        this.props.tpltData.setTplt({
            groups: [
                ...this.props.tpltData.tplt.groups,
                {
                    title: params.name,
                    id: params.name,
                    children: []
                }
            ]
        });
    }
    editGroup(params) {
        const { currGroup, tplt, setTplt } = this.props.tpltData;
        let groups = [...tplt.groups];
        groups[currGroup.index] = {
            ...groups[currGroup.index],
            title: params.name,
            id: params.name
        }
        setTplt({ groups });
    }
    render() {
        const { groupModalData, setGroupModalVisible,
                groupModalVisible, setGroupModalData, groupModalType} = this.props.tpltData;
        return (
            <Modal
             title={groupModalType === 'add' ? '添加分组' : '编辑分组'}
             visible={groupModalVisible}
             onOk={() => {
                 if (groupModalType === 'add') {
                     this.addGroup({ name: groupModalData.name });
                 } else {
                     this.editGroup({ name: groupModalData.name });
                 }
                  setGroupModalVisible(false);
                  setGroupModalData({})
             }}
             onCancel={() => {
                 setGroupModalVisible(false);
                 setGroupModalData({})
             }}
           >
               <span>分组名称:</span>
               <Input value={groupModalData.name}
                   style={{width: '300px', marginLeft: '15px'}}
                   onChange={(e) => {
                       setGroupModalData({
                           name: e.target.value
                       })
                   }}
               />
           </Modal>
        )
    }

}
