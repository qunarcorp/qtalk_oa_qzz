const string2TimeStamp = datatimeStr => new Date(datatimeStr.substring(0, 19).replace(/-/g, '/')).getTime();

/**
 * 时间字符串转为 xx秒前  xx天前...
 * */
const timeago = (dateTimeStamp) => {
  // dateTimeStamp是一个时间毫秒，注意时间戳是秒的形式，在这个毫秒的基础上除以1000，就是十位数的时间戳。13位数的都是时间毫秒。
  let result = '';
  dateTimeStamp = string2TimeStamp(dateTimeStamp);
  const minute = 1000 * 60; // 把分，时，天，周，半个月，一个月用毫秒表示
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  // const halfamonth = day * 15;
  const month = day * 30;
  const now = new Date().getTime(); // 获取当前时间毫秒
  const diffValue = now - dateTimeStamp; // 时间差

  if (diffValue < 0) {
    return;
  }
  const minC = diffValue / minute; // 计算时间差的分，时，天，周，月
  const hourC = diffValue / hour;
  const dayC = diffValue / day;
  const weekC = diffValue / week;
  const monthC = diffValue / month;
  if (monthC >= 1 && monthC <= 3) {
    result = ` ${parseInt(monthC)}月前`;
  } else if (weekC >= 1 && weekC <= 3) {
    result = ` ${parseInt(weekC)}周前`;
  } else if (dayC >= 1 && dayC <= 6) {
    result = ` ${parseInt(dayC)}天前`;
  } else if (hourC >= 1 && hourC <= 23) {
    result = ` ${parseInt(hourC)}小时前`;
  } else if (minC >= 1 && minC <= 59) {
    result = ` ${parseInt(minC)}分钟前`;
  } else if (diffValue >= 0 && diffValue <= minute) {
    result = '刚刚';
  } else {
    const datetime = new Date();
    datetime.setTime(dateTimeStamp);
    const Nyear = datetime.getFullYear();
    const Nmonth = datetime.getMonth() + 1 < 10 ? `0${datetime.getMonth() + 1}` : datetime.getMonth() + 1;
    const Ndate = datetime.getDate() < 10 ? `0${datetime.getDate()}` : datetime.getDate();
    // const Nhour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
    // const Nminute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
    // const Nsecond = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
    result = `${Nyear}-${Nmonth}-${Ndate}`;
  }
  return result;
};

const timeMoment = () => {
  const hour = new Date().getHours();
  if (hour < 6) {
    return '凌晨好 ';
  }
  if (hour < 11) {
    return '早安';
  }
  if (hour < 12) {
    return '上午好 ';
  }
  if (hour < 14) {
    return '中午好 ';
  }
  if (hour < 17) {
    return '下午好 ';
  }
  if (hour < 19) {
    return '傍晚好 ';
  }
  if (hour < 22) {
    return '晚上好 ';
  }
  return '夜里好 ';
};

export { string2TimeStamp, timeago, timeMoment };
