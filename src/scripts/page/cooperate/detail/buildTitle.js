/* eslint-disable no-return-assign */
/* eslint-disable react/prop-types */
/*
 * @Author: lee.guo
 * @Date: 2019-03-27 19:28:05
 * @Last Modified by: lee.guo
 * @Last Modified time: 2019-03-27 19:39:21
 */

import React from 'react';
import DragM from 'dragm';

export default class BuildTitle extends React.Component {
  componentDidMount() {
    this.modalDom = document.getElementsByClassName(
      'ant-modal-wrap', // modal的class是ant-modal
    );
  }

  updateTransform = transformStr => this.modalDom[0].style.transform = transformStr;

  render() {
    const { title } = this.props;
    return (
      <DragM updateTransform={this.updateTransform}>
        <div>{title}</div>
      </DragM>
    );
  }
}
