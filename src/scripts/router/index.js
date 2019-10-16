import Home from '../page/home';
import Sponsor from '../page/cooperate/sponsor';
import Detail from '../page/cooperate/detail';
import CreateTemplate from '../page/template/create';
import TemplateList from '../page/template/list';
import Agent from '../page/manage/agent';
import WorkGroup from '../page/manage/workgroup';
import Process from '../page/manage/process';
import Model from '../page/manage/model';
import Department from '../page/system/department';
import OAUser from '../page/system/user';
import OAUserSelf from '../page/user/userInfo';
import EditPassword from '../page/user/editPassword';
import Login from '../page/loginPage';
import Admin from '../page/system/admin';

/**
 * 采取菜单项key值和location.pathname匹配方式设置菜单项高亮样式
 * src/store/localData.js文件夹下,key值设置第一项代表菜单第一项,第二项代表子菜单,以此类推
 *      例如 /cooperate/create
 * src/router/index.js 文件设置的 url 如果希望与菜单项匹配: 需要router文件夹下url设置的前m(子菜单项个数)项与菜单项key值进行完全一样.
 *      例如: create: {
            label: '发起申请',
            path: '/cooperate/create/:id?',
            component: Detail,
            exact: true,
            needLogin: false
        }
 */

export const ROUTER_MAP = {
  work: {
    label: '首页',
    path: '/home/work',
    component: Home,
    exact: true,
    needLogin: false,
  },
  home: {
    label: 'home',
    path: '/',
    component: Home,
    exact: true,
    needLogin: false,
  },
  sponsor: {
    label: '我发起的',
    path: '/cooperate/sponsor',
    component: Sponsor,
    exact: true,
    needLogin: false,
  },
  unapproved: {
    label: '待我审批的',
    path: '/cooperate/unapproved',
    component: Sponsor,
    exact: true,
    needLogin: false,
  },
  approved: {
    label: '我已审批的',
    path: '/cooperate/approved',
    component: Sponsor,
    exact: true,
    needLogin: false,
  },
  notified: {
    label: '知会我的',
    path: '/cooperate/notified',
    component: Sponsor,
    exact: true,
    needLogin: false,
  },
  detail: {
    label: '审批详情',
    path: '/cooperate/detail/:id',
    component: Detail,
    exact: true,
    needLogin: false,
  },
  create: {
    label: '发起申请',
    path: '/cooperate/create/:id?',
    component: Detail,
    exact: true,
    needLogin: false,
  },
  createTplt: {
    label: '创建模板',
    path: '/template/detail/create/:id',
    component: CreateTemplate,
    exact: true,
    needLogin: false,
  },
  tpltList: {
    label: '模板列表',
    path: '/template/list',
    component: TemplateList,
    exact: true,
    needLogin: false,
  },
  tpltDetail: {
    label: '模板详情',
    path: '/template/list/edit/:id/:version',
    component: CreateTemplate,
    exact: true,
    needLogin: false,
  },
  agent: {
    label: '代理人设置',
    path: '/manage/agent',
    component: Agent,
    exact: true,
    needLogin: false,
  },
  workgroup: {
    label: '工作组管理',
    path: '/manage/workgroup',
    component: WorkGroup,
    exact: true,
    needLogin: false,
  },
  process: {
    label: '流程部署管理',
    path: '/manage/process',
    component: Process,
    exact: true,
    needLogin: false,
  },
  model: {
    label: '流程设计',
    path: '/manage/model',
    component: Model,
    exact: true,
    needLogin: false,
  },
  department: {
    label: '部门管理',
    path: '/system/department/tree',
    component: Department,
    exact: true,
    needLogin: false,
  },
  user: {
    label: '用户管理',
    path: '/system/user',
    component: OAUser,
    exact: true,
    needLogin: false,
  },
  userSelf: {
    label: '用户信息',
    path: '/user/userInfo',
    component: OAUserSelf,
    exact: true,
    needLogin: false,
  },
  editPassword: {
    label: '密码修改',
    path: '/user/editPassword',
    component: EditPassword,
    exact: true,
    needLogin: false,
  },
  login: {
    label: '用户登录',
    path: '/login',
    component: Login,
    exact: true,
    needLogin: false,
  },
  admin: {
    label: '管理员管理',
    path: '/system/admin',
    component: Admin,
    exact: true,
    needLogin: false,
  },
};
