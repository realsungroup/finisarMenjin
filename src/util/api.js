import appConfig, { dataType } from '../util/http.cofig';
import http, { dealNextExtractData } from '../util/http';

const { path } = appConfig;
const { baseUrl, baseUrl8055, baseUrlEnterprise } = path;
const GET = 'GET';
const POST = 'POST';

// 获取数据
export const getData = resid => {
  const url = baseUrl + path.getData;
  const params = {
    resid
  };
  return dealNextExtractData(http(url, GET, params, dataType.HostTableDataEM));
};

export const getDataByVal = (resid,key) => {
  const url = baseUrl + path.getData;
  const params = {
    resid,
    key
  };
  return dealNextExtractData(http(url, GET, params, dataType.HostTableDataEM));
};

// 获取数据
export const getSubData = (resid,subresid,hostrecid) => {
  const url = baseUrl + path.getSubData;
  const params = {
    resid,subresid,hostrecid
  };
  return dealNextExtractData(http(url, GET, params, dataType.AttachTableDataEM));
};

// 默认登录
export const defaultLogin = async (code, password) => {
  let url = baseUrl + path.login;
  const params = {
    Code: code,
    Password: password
  };
  return http(url, POST, params, dataType.LoginDefaultEM);
};
// 获取工作台应用
export const getWorkbenchApps = () => {
  const url = baseUrl + path.getWorkbenchApps;
  const params = {};
  return dealNextExtractData(http(url, GET, params, dataType.HostTableDataEM));
};

// 获取所有可选应用
export const getAllOptionalApps = () => {
  const url = baseUrl + path.getAllOptionalApps;
  const params = {
    parentresid: 582415453008,
    getresourcedata: 1
  };
  return dealNextExtractData(http(url, GET, params, dataType.HostTableDataEM));
};

// 添加工作台应用
export const addWorkbenchApps = payload => {
  const url = baseUrl + path.saveData;
  return dealNextExtractData(http(url, POST, payload, dataType.AddMultiDataEM));
};

// 删除工作台应用
export const removeWorkbenchApps = payload => {
  const url = baseUrl + path.saveData;
  return dealNextExtractData(
    http(url, POST, payload, dataType.DeleteOneDataEM)
  );
};

// 获取待处理数据和历史记录数据
export const getTasks = (resid, cmswhere, key) => {
  const url = baseUrl + path.getData;
  const params = {
    resid,
    cmswhere
  };

  if (key) {
    params.key = key;
  }

  return dealNextExtractData(http(url, GET, params, dataType.HostTableDataEM));
};

// 修改记录
export const modRecord = (resid, data) => {
  const url = baseUrl + appConfig.path.saveData;
  const params = {
    resid,
    data
  };
  return dealNextExtractData(http(url, POST, params, dataType.FixOneDataEM));
};

// 修改多条记录
export const modRecords = (resid, data) => {
  const url = baseUrl + appConfig.path.saveData;
  const params = {
    resid,
    data
  };
  return dealNextExtractData(http(url, POST, params, dataType.FixMoreDataEM));
};

// 获取模板组件的配置信息
export const getModuleComponentConfig = (resid, cmswhere) => {
  const url = baseUrl + path.getData;
  const params = {
    resid,
    cmswhere
  };
  return dealNextExtractData(http(url, GET, params, dataType.HostTableDataEM));
};
