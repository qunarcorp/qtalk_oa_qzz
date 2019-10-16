import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Upload, Button, Icon, message } from 'antd';
import styles from './index.css';

class TplUploadImg extends Component {
  constructor(props) {
    super(props);
  }

  handleChange(info) {
    const { handleSave } = this.props;
    const { file, fileList } = info;
    if (file.response && file.response.status !== 0) {
      message.error(info.file.response.message);
      return;
    }
    const val = fileList.filter(file => file.response ? file.response.status === 0 : true)
      .map(file => {
        if (file.response) {
          file.thumbUrl = file.response.data.url;
        }
        return file;
      });
    this.props.onChange(val);
    if (handleSave) {
      handleSave(val);
    }
  }

  render() {
    const { value = '', fieldList = '', disabled = '' } = this.props;
    return (
      <div className={styles.upload}>
        <Upload
          showUploadList={
            { showRemoveIcon: !disabled }
          }
          listType='picture'
          disabled={disabled}
          action='/admin/upload'
          onChange={this.handleChange.bind(this)}
          fileList={value || fieldList}
          multiple={true}
        >
          <Button> <Icon type="upload"/>点击上传</Button>
        </Upload>
      </div>

    );
  }
}

export default TplUploadImg;
