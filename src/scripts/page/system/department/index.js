import { inject, observer } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import React, { Component } from 'react';
import { Icon, Tree } from 'antd';
import styles from './index.css';
import AddForm from './addForm';
import IconAddModal from './addModal';

const { TreeNode } = Tree;

@inject(state => ({
  history: state.history,
  department: state.store.department,
  oaUser: state.store.oaUser,
  departmentInfo: state.store.department.departmentInfo,
  addDeptInfo: state.store.department.addDeptInfo,
}))
@withRouter
@observer
export default class Department extends Component {
  componentDidMount() {
    const { department } = this.props;
    const { getDeptTrees } = department;
    getDeptTrees();
  }

  componentWillUnmount() {
    const { department } = this.props;
    department.reset();
  }

  onSelect = (selectedKeys) => {
    const { department } = this.props;
    const { getDeptInfo, setAddOrUpdate, setId, clickAddIcon, setAddDeptInfo } = department;
    selectedKeys[0] && getDeptInfo({
      id: selectedKeys[0],
    });
    if (clickAddIcon) {
      setAddOrUpdate('add');
      setAddDeptInfo();
    } else {
      setAddOrUpdate('update');
      selectedKeys[0] && setId(selectedKeys[0]);
    }
  };

  onRightClick = (rightClickKeys) => {
    const { department } = this.props;
    const { setAddOrUpdate, setAddDeptInfo, setId, getDeptInfo } = department;
    getDeptInfo({
      id: rightClickKeys.node.props.eventKey,
    });
    setAddOrUpdate('add');
    setId('');
    setAddDeptInfo();
  };

  addDepartment = () => {
    const { department } = this.props;
    const { setClickAddIcon } = department;
    setClickAddIcon(true);
  };

  renderTreeNodes(data) {
    const { department, oaUser } = this.props;
    const { id } = department;
    const { setSearchValue } = oaUser;
    return (
      data && data.map((item) => {
        if (item.children) {
          return (
            <TreeNode
              title={`${item.name}（${item.allUsers.usersSize}人）`}
              key={item.id}
              dataRef={item}
              icon={item.id === id ? (
                <div className={styles.tree_node_icon}>
                  <Link to="/system/user"><Icon type="user" onClick={() => setSearchValue(item.name)} /></Link>
                  <a
                    onClick={values => this.addDepartment(values)}
                    className={styles.department_button}
                  >
                    <Icon type="plus" />
                  </a>
                </div>) : null}
            >
              {this.renderTreeNodes(item.children)}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            title={`${item.name}（${item.allUsers.usersSize}人）`}
            key={item.id}
            dataRef={item}
            icon={item.id === id ? (
              <div className={styles.tree_node_icon}>
                <Link to="/system/user" onClick={() => setSearchValue(item.name)}><Icon type="user" /></Link>
                <a
                  onClick={this.addDepartment}
                  className={styles.department_button}
                >
                  <Icon type="plus" />
                </a>
              </div>) : null
            }
          />);
      })
    );
  }

  render() {
    const { department, departmentInfo, addDeptInfo } = this.props;
    const { departmentTree, addOrUpdate, clickAddIcon } = department;
    return (
      <div>
        { clickAddIcon ? <IconAddModal /> : null}
        <div className={styles.header_title}>部门管理</div>
        <div className={styles.content_float}>
          <div className={styles.card_title}>公司架构</div>
          <Tree
            className={styles.tree_content}
            showLine
            showIcon
            onSelect={this.onSelect}
            onRightClick={this.onRightClick}
          >
            {this.renderTreeNodes(departmentTree)}
          </Tree>
        </div>
        <div className={styles.content_float}>
          <div className={styles.card_title}>部门详情</div>
          <AddForm
            departmentInfo={departmentInfo}
            addOrUpdate={addOrUpdate}
            addDeptInfo={addDeptInfo}
          />
        </div>
      </div>
    );
  }
}
