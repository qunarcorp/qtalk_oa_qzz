import {
  Button, Col, Form, Icon, Popover, Row, Select, Steps,
} from 'antd';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Tplt from '../../../component/tplt';
import styles from './index.css';
import Log from './log';
import MemoModal from './memoModal';

const { Step } = Steps;

@inject(state => ({
  history: state.history,
  isLogin: state.store.user.isLogin,
  user: state.store.user,
  detail: state.store.detailData,
  editNodeName: state.store.editNodeName,
}))
@withRouter
@observer
class Detail extends Component {
 static propTypes = {
   detail: PropTypes.object.isRequired,
   form: PropTypes.object.isRequired,
   match: PropTypes.object.isRequired,
   history: PropTypes.object.isRequired,
   user: PropTypes.object.isRequired,
   currentButton: PropTypes.string.isRequired,
 };

 async componentDidMount() {
   const { detail, form, match } = this.props;
   const {
     getDepartList, setPageType, getDetail, setStep, setDepart, setTplt,
   } = detail;
   getDepartList();
   setDepart('全部部门');
   form.validateFields();
   if (location.hash === '#/cooperate/create') {
     setPageType('create');
     setStep(0);
   } else if (location.hash.indexOf('#/cooperate/create') > -1) {
     const { id } = match.params;
     setPageType('create');
     setTplt(id);
     setStep(1);
   } else {
     const { id } = match.params;
     setPageType('detail');
     setStep(1);
     const { formDatas } = await getDetail(id);
     form.setFieldsValue(formDatas);
   }
 }

 componentWillUnmount() {
   const { detail } = this.props;
   detail.reset();
 }

 getStep1View = () => {
   const { Option } = Select;
   const { detail } = this.props;
   const {
     tpltList,
     extSysTpltList,
     setTplt,
   } = detail;
   return (
     <div>
       {/* <div className={styles.step1_item}> */}
       {/* <span>模板所属部门:</span> */}
       {/* <Select */}
       {/* value={department} */}
       {/* style={{ width: 400, marginLeft: '10px' }} */}
       {/* onChange={val => setDepart(val)} */}
       {/* > */}
       {/* <Option value="all_department">全部部门(非申请人部门)</Option> */}
       {/* {departList.map(item => ( */}
       {/* <Option key={item} value={item}> */}
       {/* {item} */}
       {/* </Option> */}
       {/* ))} */}
       {/* </Select> */}
       {/* </div> */}
       <div className={styles.step1_notice}>
         <span>提示：流程模版支持关键字搜索</span>
       </div>
       <div className={styles.step1_item}>
         <span>选择流程模板:</span>
         <Select
           showSearch
           style={{ width: 400, marginLeft: '10px' }}
           filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
           onChange={val => setTplt(val)}
         >
           {tpltList.map(item => (
             <Option key={`${item.formKey},${item.formMark}`} value={`${item.formKey},${item.formMark}`}>
               {item.formName}
             </Option>
           ))}
           {extSysTpltList.map(item => (
             <Option key={`${item.oid},${item.processKeys},${item.formMark}`} value={`${item.oid},${item.processKeys},${item.formMark}`}>
               {item.title}
             </Option>
           ))}
         </Select>
       </div>
     </div>
   );
 };

 getFormByTplt = () => {
   const { detail, user, form } = this.props;
   const {
     pageType,
     tpltDetail,
     setMemoVisible,
     editNodeName,
     detail: { formDatas = {} },
     currentButton,
   } = detail;
   const { userInfo } = user;
   const isApproveUser = Boolean(detail.detail.approveUsers) && detail.detail.approveUsers.includes(userInfo.qtalk);
   const canRevoke = detail.detail.canRevokeOrBack !== null && detail.detail.canRevokeOrBack.includes('canRevoke');
   const readOnly = pageType !== 'create';
   return (
     <Form
       className="ant-advanced-search-form"
       onSubmit={this.handleSubmit}
       labelAlign={pageType === 'detail' ? 'left' : 'right'}
       colon={pageType === 'create'}
       hideRequiredMark={pageType !== 'create'}
     >
       <Tplt
         model={tpltDetail}
         readOnly={readOnly}
         form={form}
         editNodeName={editNodeName}
         pageType={pageType}
         formDatas={formDatas}
       />
       <Row>
         {pageType === 'create' ? (
           <Col span={24} style={{ textAlign: 'right' }}>
             <Button type="primary" htmlType="submit">
        提交
             </Button>
             <Button style={{ marginLeft: 8 }} onClick={this.cancle}>
        取消
             </Button>
           </Col>
         ) : null}
         {isApproveUser ? (
           <Col span={24} style={{ textAlign: 'right' }}>
             <Button
               type={currentButton === 'agree' || currentButton === '' ? 'primary' : ''}
               onClick={() => form.validateFields((error, formData) => setMemoVisible(true, 'agree', error, formData))
        }
             >
        通过
             </Button>
             <Popover
               content={(
                 <div>
                   <p>拒绝之后流程将终止</p>
                 </div>
               )}
               title="提示"
             >
               <Button
                 type={currentButton === 'reject' ? 'primary' : ''}
                 style={{ marginLeft: 8 }}
                 onClick={() => form.validateFields((error, formData) => setMemoVisible(true, 'reject', error, formData))}
               >
         拒绝
               </Button>
             </Popover>
             <Popover
               content={(
                 <div>
                   <p>流程暂存至本人待办</p>
                 </div>
)}
               title="提示"
             >
               <Button
                 type={currentButton === 'hold' ? 'primary' : ''}
                 style={{ marginLeft: 8 }}
                 onClick={() => form.validateFields((error, formData) => setMemoVisible(true, 'hold', error, formData))}
               >
         暂存
               </Button>
             </Popover>
             <Popover
               content={(
                 <div>
                   <p>流程转移到移交人节点；移交人审批后，</p>
                   <p>流程继续下一节点，不会返回当前审批人</p>
                 </div>
                )}
               title="提示"
             >
               <Button
                 type={currentButton === 'transfer' ? 'primary' : ''}
                 style={{ marginLeft: 8 }}
                 onClick={() => form.validateFields((error, formData) => setMemoVisible(true, 'transfer', error, formData))}
               >
         移交
               </Button>
             </Popover>
             <Popover
               content={(
                 <div>
                   <p>流程转向加签人节点，加签人审批通过后，</p>
                   <p>流程会回到当前审批人节点以继续审批</p>
                 </div>
                )}
               title="提示"
             >
               <Button
                 type={currentButton === 'countersign' ? 'primary' : ''}
                 style={{ marginLeft: 8 }}
                 onClick={() => form.validateFields((error, formData) => setMemoVisible(true, 'countersign', error, formData))}
               >
         加签
               </Button>
             </Popover>
           </Col>
         ) : null}
         {canRevoke ? (
           <Col span={24} style={{ textAlign: 'right' }}>
             <Popover
               content={(
                 <div>
                   <p>仅未被审批流程可撤销，撤销后流程终止</p>
                 </div>
               )}
               title="提示"
             >
               <Button
                 style={{ marginTop: 8, marginRight: 215 }}
                 onClick={() => form.validateFields((error, formData) => setMemoVisible(true, 'revoke', error, formData))
         }
               >
         撤销
               </Button>
             </Popover>
           </Col>
         ) : null}
       </Row>
     </Form>
   );
 };

 getStep3View() {
   const { history } = this.props;

   return (
     <div className={styles.step3}>
       <Icon
         type="check-circle"
         theme="twoTone"
         twoToneColor="#52c41a"
         style={{
           color: '#52c41a',
           fontSize: '60px',
         }}
       />
       <p>提交成功</p>
       <p>流程已转至下一审批人</p>
       <Button type="primary" onClick={this.cancle}>
     再来一单
       </Button>
       <Button
         onClick={() => {
           history.push('/cooperate/sponsor');
         }}
         style={{
           marginLeft: '20px',
         }}
       >
     我的申请
       </Button>
     </div>
   );
 }

 handleSubmit = (e) => {
   const { form, detail } = this.props;
   e.preventDefault();
   form.validateFields((err, values) => {
     if (!err) {
       detail.submit(values);
     }
   });
 };

 cancle = () => {
   const { form, detail } = this.props;
   form.resetFields();
   detail.setStep(0);
 };

 async transfer() {
   const { detail, history } = this.props;
   await detail.transfer();
   detail.setIsTransferVisible(false);
   history.push('/home/work');
 }

 render() {
   const { detail } = this.props;
   const {
     step, nextStep, pageType, tpltDetail, tplt,
   } = detail;
   const steps = [
     {
       title: '选择模板',
       content: this.getStep1View(),
     },
     {
       title: '填写表单',
       content: this.getFormByTplt(),
     },
     {
       title: '完成',
       content: this.getStep3View(),
     },
   ];
   return (
     <div>
       <div className="u_header_title">
         {pageType === 'create'
           ? `发起申请${tpltDetail.name ? `-${tpltDetail.name}` : ''}`
           : `审批详情-${tpltDetail.name}`}
         {pageType === 'detail' ? (
           <p className={styles.base_info}>
             <span>
        提单人：
               {detail.detail.applyUserName}
             </span>
             <span>
               <Popover
                 content={
          detail.detail.applyUserFullDept
            ? detail.detail.applyUserFullDept
            : detail.detail.applyUserDept
         }
                 title=""
                 trigger="hover"
               >
         提单部门：
                 {detail.detail.applyUserDept}
               </Popover>
             </span>
             <span>
        提单时间：
               {detail.detail.applyTime}
             </span>
           </p>
         ) : null}
       </div>
       <div className={styles.content}>
         {pageType === 'create' ? (
           <Steps current={step} style={{ marginBottom: '50px' }}>
             {steps.map(item => (
               <Step key={item.title} title={item.title} />
             ))}
           </Steps>
         ) : null}
         <div className="steps-content" style={{ margin: '0px 0 50px 0' }}>
           {steps[step].content}
         </div>
         <div className="steps-action" style={{ textAlign: 'center' }}>
           {step < 1 ? (
             <Button type="primary" disabled={!tplt} onClick={nextStep}>
        下一步
             </Button>
           ) : null}
         </div>
         {pageType === 'detail' ? <Log /> : null}
       </div>
       <MemoModal />
     </div>
   );
 }
}

export default Form.create({})(Detail);
