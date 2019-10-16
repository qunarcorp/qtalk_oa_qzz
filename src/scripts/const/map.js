/*
 * @Author: lee.guo
 * @Date: 2019-04-26 14:41:09
 * @Last Modified by: lee.guo
 * @Last Modified time: 2019-04-26 14:42:12
 */
export const PAUSE_MAP = {
  true: '启动',
  false: '暂停',
};
export const PLAN_STATUS_MAP = {
  21: '有效',
  22: '处于暂停时段',
  23: '暂停推广',
  24: '推广计划预算不足',
  25: '账户预算不足',
};

export const PROMOTE_STEP_MAP = {
  PLAN: { key: 0, text: '创建推广计划' },
  UNIT: { key: 1, text: '制作单元' },
  KEYWORD: { key: 2, text: '添加关键词' },
  IDEA: { key: 3, text: '添加创意' },
};

export const APPLY_STATU_MAP = {
  0: '审批完成',
  1: '审批中',
  2: '已撤销',
  3: '未发起',
  4: '全部',
  5: '拒绝',
};

export const APPLY_OA_MAP = {
  0: 'OA',
  1: 'extSys',
};

export const OA_STATUS_MAP = {
  OA: '0',
  extSys: '1',
};

export const APPLY_STATU_CLASSNAMES_MAP = {
  0: 'agree',
  1: 'process',
  2: 'normal',
  3: 'normal',
  4: 'normal',
  5: 'reject',
};
export const APPLY_QUERY_TYPE_MAP = {
  sponsor: 0,
  approved: 1,
  unapproved: 2,
  notified: 3,
};

export const TPLT_COMPONENT_LIST = [
  {
    value: 'select',
    text: '下拉菜单',
    needOpt: true,
    needplaho: true,
  },
  {
    value: 'input',
    text: '单行文本',
    needplaho: true,
  },
  {
    value: 'textarea',
    text: '多行文本',
    needplaho: true,
  },
  {
    value: 'datePicker',
    text: '日期选择器',
    needplaho: true,
  },
  {
    value: 'radio',
    text: '单选框',
    needOpt: true,
    needplaho: true,
  },
  {
    value: 'checkbox',
    text: '复选框',
    needOpt: true,
    needplaho: true,
  },
  {
    value: 'upload',
    text: '上传文件',
  },
  {
    value: 'table',
    text: '表格',
  },
  {
    value: 'uploadImg',
    text: '上传图片',
  },
  {
    value: 'selectQtalk',
    text: 'Qtalk自动补全',
    needplaho: true,
  },
  {
    value: 'notice',
    text: '表单提示',
  },
  {
    value: 'orderNo',
    text: '流水号',
  },
];

export const FLOW_STATUS_MAP = {
  suspend: 0,
  activate: 1,
};

export const enToZh = {
  select: '下拉菜单',
  input: '单行文本',
  textArea: '多行文本',
  datePicker: '日期选择器',
  selectQtalk: 'qtalk自动补全',
  uploadImg: '上传图片',
  upload: '上传文件',
  radio: '单选框',
  checkBox: '复选框',
  notice: '表单提示',
};

/**
 * title, dataIndex, editable(必须设置), componentType
 * needAdd, options, placeholder, needMap
 */
export const TABLE_COLUMNS = [
  {
    title: '列名',
    dataIndex: 'title',
    editable: true,
    componentType: 'input',
    needAdd: false,
    width: '20%',
  },
  {
    title: '类型',
    dataIndex: 'componentType',
    editable: true,
    componentType: 'select',
    needAdd: false,
    // enToZh 需进行转换
    needMap: true,
    options: [
      'select',
      'input',
      'textArea',
      'selectQtalk',
      'datePicker',
      'uploadImg',
      'upload',
      'radio',
      'checkBox',
      'notice',
    ],
    width: '20%',
  },
  {
    title: '累加',
    dataIndex: 'add',
    editable: true,
    componentType: 'radio',
    needMap: false,
    options: ['需要', '不需要'],
    width: '20%',
  },
  {
    title: '选项内容',
    dataIndex: 'options',
    editable: true,
    componentType: 'textArea',
    placeholder: '填写选项,按行分割',
    width: '20%',
  },
];
