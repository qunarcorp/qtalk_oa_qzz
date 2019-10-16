/*
 * @Author: lee.guo
 * @Date: 2019-03-27 19:27:33
 * @Last Modified by: lee.guo
 * @Last Modified time: 2019-04-08 19:11:35
 */

import { Input, Modal } from 'antd';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SelectQtalk from '../../../component/selectQtalk';
import BuildTitle from './buildTitle';

const { TextArea } = Input;

@inject(state => ({
  history: state.history,
  detail: state.store.detailData,
}))
@observer
export default class MemoModal extends Component {
 static propTypes = {
   detail: PropTypes.func.isRequired,
   history: PropTypes.func.isRequired,
 };

 constructor(props) {
   super(props);
   this.state = {};
 }

 render() {
   const { detail, history } = this.props;
   const {
     isMemoVisible,
     memo,
     setMemoVisible,
     memoType,
     setMemo,
     agree,
     reject,
     hold,
     setTransferUser,
     transferUser,
     countersign,
     transfer,
     revoke,
     revokeRecord,
     changeCurrentButton,
   } = detail;

   const antModalMask = {
     position: 'fixed',
     top: 0,
     right: 0,
     bottom: 0,
     left: 0,
     'z-index': 1000,
     height: '100%',
     'background-color': 'rgba(0, 0, 0, 0.40)',
     filter: 'alpha(opacity=50)',
   };

   changeCurrentButton(memoType);

   let title = '';
   let fn;
   let selectUserView = '';
   if (memoType === 'transfer') {
     title = '选择移交人';
     fn = transfer;
     selectUserView = true;
   }

   if (memoType === 'hold') {
     title = '暂存原因';
     fn = hold;
     selectUserView = false;
   }
   if (memoType === 'countersign') {
     title = '选择加签人';
     fn = countersign;
     selectUserView = true;
   }

   if (memoType === 'revoke') {
     title = '撤销原因';
     fn = revoke;
     selectUserView = false;
   }

   if (memoType === 'reject') {
     title = '拒绝原因';
     fn = reject;
     selectUserView = false;
   }

   if (memoType === 'revokeRecord') {
     title = '撤销原因';
     fn = revokeRecord;
     selectUserView = false;
   }

   if (memoType === 'agree') {
     title = '审批通过备注';
     fn = agree;
     selectUserView = false;
   }
   title = <BuildTitle visible={isMemoVisible} title={title} />;

   return (
     <Modal
       title={title}
       visible={isMemoVisible}
       maskStyle={antModalMask}
       centered
       onOk={() => {
         fn(history);
         setMemoVisible(false);
       }}
       onCancel={() => {
         setMemoVisible(false);
       }}
     >
       {selectUserView ? (
         <div>
           <span style={{ marginRight: '10px' }}>Qtalk用户:</span>
           <SelectQtalk
             changeValue={setTransferUser}
             inputValue={transferUser}
             placeholder="请选择"
             className="input_memo_modal"
           />
           <span style={{ marginRight: '10px' }}>审批意见:</span>
           <TextArea
             style={{
               width: '385px',
               marginTop: '15px',
               marginLeft: '6px',
             }}
             value={memo}
             onChange={(e) => {
               setMemo(e.target.value);
             }}
           />
         </div>
       ) : (
         <TextArea
           value={memo}
           onChange={(e) => {
             setMemo(e.target.value);
           }}
         />
       )}
     </Modal>
   );
 }
}
