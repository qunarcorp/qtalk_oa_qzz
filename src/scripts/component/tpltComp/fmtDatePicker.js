import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { DatePicker } from 'antd';
import moment from 'moment';

class FmtDatePicker extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      placeholder = '', disabled = '', value = '', comRef = 'input', onChange,
    } = this.props;
    return (
      <DatePicker
        ref={comRef}
        placeholder={placeholder}
        disabled={disabled}
        value={value ? moment(value) : null}
        onChange={(val) => {
          const time = val ? val.format('YYYY-MM-DD') : '';
          onChange(time);
        }}
      />
    );
  }
}

export default FmtDatePicker;
