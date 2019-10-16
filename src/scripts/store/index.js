import { observable } from 'mobx';
import User from './user';
import CommonData from './commonData';
import Home from './home';
import Detail from './detail';
import CoopSponsor from './coopSponsor';
import Agent from './agent';
import TpltCreate from './tpltCreate';
import TpltList from './tpltList';
import WorkGroup from './workgroup';
import Process from './process';
import Model from './model';
import Department from './department';
import OAUser from './oaUser';
import Admin from './admin';

export default class Store {
    @observable commonData = new CommonData();
    @observable user = new User();

    @observable homeData = new Home();
    @observable coopSponsorData = new CoopSponsor();
    @observable detailData = new Detail();

    @observable agent = new Agent();
    @observable workgroup = new WorkGroup();
    @observable process = new Process();
    @observable model = new Model();

    @observable tpltCreate = new TpltCreate();
    @observable tpltList = new TpltList();

    @observable department = new Department();
    @observable oaUser = new OAUser();
    @observable admin = new Admin();
}
