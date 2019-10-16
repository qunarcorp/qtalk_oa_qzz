export const commonApi = {
  logout: '/main/logout',
};

export const reportApi = {
  getAllFiles: '/mainAccount/query',
  addAccount: '/mainAccount/add',
  modifyAccount: '/mainAccount/update',
};

export const templateApi = {
  getAllFiles: '/template/query',
  addTemplate: '/template/add',
  modifyTemplate: '/template/update',
  delTemplate: '/template/delete',
  auditTemplate: '/template/audit',
  sensitiveword: '/sensitiveword/valid',
};
export const netApi = {
  getList: '/rateInfo/query',
  addNet: '/rateInfo/add',
  modifyNet: '/rateInfo/modify',
  delTemplate: '/template/delete',
  auditTemplate: '/template/audit',
  sensitiveword: '/sensitiveword/valid',
};
export const sponsorApi = {
  getList: '/flow/getMyFlows',
  getExtSysList: '/extSysUnapproveFlow/getUnapproveFlows',
  getExtSysProcessKeys: '/extSysUnapproveFlow/getProcessKeys',
  getCounts: '/flow/getFlowCount',
  getFlowTypeList: '/flowModel/getFlowModelsByDept',
  viewProcessPic: '/flow/getFlowTraceImage',
};
export const homeApi = {
  getCounts: '/flow/getApproveCount',
  getTpls: '/flowModel/getMyFlowModels',
  getMessage: '/notify/findByCurrentUser',
};
export const userApi = {
  login: '/login',
  getUser: '/currentUser',
  changeUser: '/changeUser',
  getDomains: '/getdomain',
};
export const tpltApi = {
  create: '/flowModel/addFlowMode',
  update: '/flowModel/updateFlowMode',
  getList: '/flowModel/getFlowModelsPageAble',
  getDetail: '/flowModel/getFlowModelByFormKey',
  updateStatus: '/flowModel/updateFlowModelStatus',
  getAllDept: '/flowModel/getAllDept',
};
export const detailApi = {
  getDepartList: '/flowModel/getFlowModelAllDept',
  getTpltList: '/flowModel/getFlowModelsByDept',
  getExtSysTpltList: '/extSysFlowModel/getExtSysFlowModels',
  getTpltDetail: '/flowModel/getFlowModelByFormKey',
  getDetail: '/flow/getFlowById',
  getNewOAFlowDetailUrlById: '/flow/getNewOAFlowDetailUrlById',
  getNewOAFormUrl: '/flowModel/getNewOAFormUrl',
  submit: '/flow/startFlow',
  agree: '/flow/consentFlow',
  transfer: '/flow/forwardFlow',
  countersign: '/flow/counterSignFlow',
  reject: '/flow/rejectFlow',
  revoke: '/flow/revokeFlow',
  notify: '/flow/notifyNextApproveUsers',
  hold: '/flow/hold',
};
export const agentApi = {
  getAgentList: '/agent/list',
  updateAgent: '/agent/update',
  deleteAgent: '/agent/delete',
  addAgent: '/agent/add',
};
export const qtalkApi = {
  getQtalkList: '/qunarit/search',
  addQtalkMucUser: '/qtalk/addMucUser',
};

export const deptApi = {
  getDeptList: '/dept/search',
};

export const workGroupApi = {
  getWorkGroupList: '/group/group',
  addWorkGroup: '/group/add',
  deleteWorkGroup: '/group/delete',
  updateWorkGroup: '/group/update',
};

export const processApi = {
  getProcessList: '/admin/processList',
  deleteProcess: '/admin/delete',
  viewProcessPic: '/admin/viewPicForURL',
  updateProcess: '/admin/updateState',
  deployProcess: '/admin/deploy',
  getModelList: '/models/getModelList',
  uploadModel: '/models/uploadBpmn',
  deleteModel: '/models/deleteModel',
  deployModel: '/models/deployModel',
  addNewModel: '/models/newModel',
};

export const departmentApi = {
  getDeptTree: '/department/getDeptTrees',
  getDepartmentInfo: '/department/getDeptInfo',
  addDept: '/department/addDepartment',
  updateDept: '/department/updateDepartment',
  deleteDept: '/department/deleteDepartment',
};

export const oaUserApi = {
  getAllUserList: '/oaUser/adminGetAllUserInfo',
  deleteUserById: '/oaUser/delOAUserById',
  addUser: '/oaUser/addOAUser',
  updateUser: '/oaUser/adminUpdateOAUser',
  adminUpdatePassword: '/oaUser/adminUpdatePassword',
  getUserInfoById: '/oaUser/adminGetUserInfo',
  searchUserList: '/oaUser/search',
  getUserInfo: '/oaUser/getUserInfo',
  updateUserInfoSelf: '/oaUser/updateOAUserSelf',
  updateSelfPassword: '/oaUser/updatePassword',
};

export const oaAdminApi = {
  getAllAdminList: '/role/getAllUserRole',
  addAdminRole: '/role/addRoles',
  deleteAdminRole: '/role/removeAllRoles',
};
