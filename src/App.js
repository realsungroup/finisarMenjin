import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Table, Divider, Button, Input, message, Popconfirm } from 'antd';
import 'antd/dist/antd.css';
import { setItem } from '../src/util/localCache';
import {
  getData,
  getDataByVal,
  modRecord,
  modRecords,
  defaultLogin
} from '../src/util/api';
import exportJsonExcel from 'js-export-excel';
// import { NonsupportIE } from "nonsupport-ie-react";
const { Column, ColumnGroup } = Table;

const Search = Input.Search;

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      'selectedRows: ',
      selectedRows
    );
  },
  getCheckboxProps: record => ({
    name: record.name
  })
};
function onChange(pagination, filters, sorter) {
  // console.log("params", pagination, filters, sorter);
}

class App extends Component {
  componentDidMount() {
    this.GetQueryString();
    this.login();
  }

  //截取地址栏参数
  GetQueryString = name => {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  };

  //登陆
  login = async () => {
    const code = this.GetQueryString('Code');
    const pass = this.GetQueryString('Password');
    const response = await defaultLogin(code, pass);
    const result = response.OpResult;
    if (result === 'Y') {
      setItem('userInfo', JSON.stringify(response));
      message.success('登陆成功');
      this.loadTasks();
      this.setState({
        show: false
      });
    } else if (result === 'N') {
      const errorMsg = response.ErrorMsg;
      message.error(errorMsg);
    }
  };

  loadTasks = async () => {
    this.setState({ loading: true });
    try {
      const getOilDatalog = getData(595199561778);

      const getOilDataRes = await getOilDatalog;
      if (!getOilDataRes.error) {
        // const approveData = [];
        const predata = [];
        getOilDataRes.data.map(val => {
          predata.push(val);
        });
        await this.setState({
          data: predata,
          loading: false
        });
        this.getColumns();
      }

      // const getSubDatalog = getSubData(
      //   587042302970,
      //   587584630447,
      //   getOilDataRes.data[0].REC_ID
      // );
      // const subDataRes = await getSubDatalog;
    } catch (err) {
      alert(err.message);
      console.error(err.message);
    }
  };

  getTableData = async (
    options = Object.assign(this.state.pagination || {}, {
      key: ''
    }),
    cmswhere
  ) => {
    let res;
    const { resid, cmscolumns } = this.props;
    cmswhere = `${cmswhere ? cmswhere + ' and ' : ''} ${this.props.cmswhere}`;

    try {
      res = await getDataByVal(595199561778, options.key);

      if (!res.error) {
        // const approveData = [];
        const predata = [];
        res.data.map(val => {
          predata.push(val);
          predata['checked'] = true;
        });
        await this.setState({
          data: predata,
          loading: false
        });
      }
    } catch (err) {
      this.setState({ loading: false });

      return message.error(err.message);
    }

    // 开启了分页功能
    let pagination;
    if (this.props.pagination) {
      pagination = {
        ...this.state.pagination,
        ...{
          pageSize: options.pageSize,
          current: options.current + 1,
          total: res.total
        }
      };
    }
  };
  search = value => {
    const { pagination, key } = this.state;
    let o = {};
    if (this.props.pagination) {
      o = { current: 0, pageSize: pagination.pageSize };
    }
    this.getTableData(Object.assign(o, { key: value }));
  };
  rightconfirm = async () => {
    this.state.data.forEach(item => (item.C3_595192402751 = 'Y'));
    let res;
    try {
      res = await modRecords(595199561778, this.state.data);
    } catch (err) {
      return message.error(err.message);
    }
    if (!res.data.length) {
      return message.error(res.message);
    }
    message.success('操作成功');
    this.loadTasks();
  };

  getColumns = () => {
    this.setState({
      columns: [
        {
          title: '姓名',
          dataIndex: 'C3_595166693246',
          key: 'C3_595166693246',
          // filters: this.state.filter,
          filterMultiple: false,
          onFilter: (value, record) =>
            record.C3_595166693246.indexOf(value) === 0,
          sorter: (a, b) => a.C3_595166693246.length - b.C3_595166693246.length,
          render: text => <a href="javascript:;">{text}</a>
        },
        {
          title: '工号',
          dataIndex: 'C3_595166604634',
          key: 'C3_595166604634',

          filterMultiple: true,
          onFilter: (value, record) =>
            record.C3_595166604634.indexOf(value) === 0,
          sorter: (a, b) => a.C3_595166604634.length - b.C3_595166604634.length
        },
        {
          title: '部门',
          dataIndex: 'C3_595166712341',
          key: 'C3_595166712341',

          filterMultiple: true,
          onFilter: (value, record) =>
            record.C3_595166712341.indexOf(value) === 0,
          sorter: (a, b) => a.C3_595166712341.length - b.C3_595166712341.length
        },
        {
          title: '所属门权限组名称',
          dataIndex: 'C3_595166751093',
          key: 'C3_595166751093',

          filterMultiple: true,
          onFilter: (value, record) =>
            record.C3_595166751093.indexOf(value) === 0,
          sorter: (a, b) => a.C3_595166751093.length - b.C3_595166751093.length
        },
        {
          title: '管理员工号',
          dataIndex: 'C3_595166775274',
          key: 'C3_595166775274',

          filterMultiple: true,
          onFilter: (value, record) =>
            record.C3_595166775274.indexOf(value) === 0,
          sorter: (a, b) => a.C3_595166775274.length - b.C3_595166775274.length
        },
        {
          title: '管理员姓名',
          dataIndex: 'C3_595166794150',
          key: 'C3_595166794150',

          filterMultiple: true,
          onFilter: (value, record) =>
            record.C3_595166794150.indexOf(value) === 0,
          sorter: (a, b) => a.C3_595166794150.length - b.C3_595166794150.length
        },
        {
          title: '是否新增',
          dataIndex: 'C3_595168410919',
          key: 'C3_595168410919',

          filterMultiple: true,
          onFilter: (value, record) =>
            record.C3_595168410919.indexOf(value) === 0,
          sorter: (a, b) => {
            if (a.C3_595168410919 && b.C3_595168410919) {
              return a.C3_595168410919.length - b.C3_595168410919.length;
            }
          }
        },
        {
          title: '确认无误',
          dataIndex: 'C3_595192402751',
          key: 'C3_595192402751',

          filterMultiple: true,
          onFilter: (value, record) =>
            record.C3_595192402751.indexOf(value) === 0,
          sorter: (a, b) => a.C3_595192402751.length - b.C3_595192402751.length
        }
      ]
    });
  };
  export = () => {
    const sheetHeader = this.state.columns.map(column => column.title);
    const dataIndex = this.state.columns.map(column => column.dataIndex);

    const sheetData = this.state.data.map(record =>
      dataIndex.map(item => record[item])
    );

    const columnWidths = this.state.columns.map(() => 10);
    const option = {
      datas: [
        {
          sheetHeader,
          // sheetName: tableTitle,
          sheetData,
          columnWidths
        }
      ]
    };
    const toExcel = new exportJsonExcel(option);
    toExcel.saveExcel();
  };
  state = {
    data: [{}],
    columns: [{}],
    selectedRowKeys: [],
    loading: false,
    show: true
  };
  onSelectedRowKeysChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  confirm = async () => {
    const { selectedRowKeys, data } = this.state;

    if (!selectedRowKeys.length) {
      return message.error('请先勾选记录');
    }
    let filteredData = [];
    selectedRowKeys.forEach(key => {
      let item;
      if ((item = data.find(dataItem => dataItem.REC_ID === key))) {
        filteredData.push(item);
      }
    });

    filteredData = JSON.parse(JSON.stringify(filteredData));
    filteredData.forEach(item => (item['C3_595192402751'] = 'N'));
    let res;
    try {
      res = await modRecords(595199561778, filteredData);
    } catch (err) {
      return message.error(err.message);
    }

    if (!res.data.length) {
      return message.error('操作失败');
    }
    this.loadTasks();
    this.setState({ selectedRowKeys: [] });
    message.success('操作成功');
  };

  render() {
    const { data, columns, selectedRowKeys, loading, show } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectedRowKeysChange
    };
    return (
      // <NonsupportIE
      //   devMode
      //   reminder="app is not support IE, please use other modern browser."
      // >
      <div className="App">
        <div className="btns">
          <div style={{ float: 'left' }}>
            <Search
              style={{ width: 200 }}
              onSearch={this.search}
              enterButton
              disabled={show}
              // value={value}
              onChange={() => {}}
            />
          </div>
          <div style={{ float: 'right' }}>
            {show ? (
              <Button
                className="btn-approve"
                type="danger"
                disabled={show}
                // disabled={!hasSelected}
                // loading={loading}
              >
                确认有误
              </Button>
            ) : (
              <Popconfirm
                title="确认有误并发送邮件吗？"
                okText="确认"
                cancelText="取消"
                onCancel={this.cancel}
                onConfirm={this.confirm}
              >
                <Button
                  className="btn-approve"
                  type="danger"
                  disabled={show}
                  // disabled={!hasSelected}
                  // loading={loading}
                >
                  确认有误
                </Button>
              </Popconfirm>
            )}

            <Popconfirm
              title="确认全部无误并通过吗？"
              okText="确认"
              cancelText="取消"
              onCancel={this.cancel}
              onConfirm={this.rightconfirm}
            >
              {' '}
              <Button
                className="btn-reject"
                type="primary"
                disabled={show}
                // disabled={!hasSelected}
                // loading={loading}
              >
                全部无误
              </Button>{' '}
            </Popconfirm>

            <Button
              className="btn-export"
              type="primary"
              disabled={show}
              onClick={this.export}
              // disabled={!hasSelected}
              // loading={loading}
            >
              导出
            </Button>
          </div>
        </div>
        <div className="tab">
          <Table
            rowSelection={rowSelection}
            columns={columns}
            onChange={onChange}
            dataSource={data}
            rowKey={record => record.REC_ID}
            loading={loading}
          />
        </div>
      </div>

      // {/* </NonsupportIE> */}
    );
  }
}

export default App;
