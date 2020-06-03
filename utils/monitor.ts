const setDate = (date:any) => {
  let d = date.split(" ")[0];
  let dd = d.split("-");
  return dd[1] + '-' + dd[2]
}

const setDay = (time:number) => {
  return Math.floor(time / 24)
}
const setHour = (time:number) => {
  if ((Math.floor(time / 24)) === 0) {
    return time
  } else {
    return time % 24
  }
}
const startTimeName = (startTime:any) => {
  let date = startTime.split(" ")[0];
  let time = startTime.split(" ")[1];
  let m = date.split("-")[1]
  let d = date.split("-")[2]
  let h = time.split(":")[0]
  let min = time.split(":")[1]
  return m + '月' + d + '日' + h + '时' + min + '分'
}
const taskTime = (monitorTime:any, minutes:any):any => {
  if (monitorTime || monitorTime == 0 && !minutes && minutes != 0) {
    if (~~(monitorTime / 24) === 0) {
      return monitorTime + '小时'
    } else {
      return ~~(monitorTime / 24) + "天" + monitorTime % 24 + "小时"
    }
  }
  if (minutes || minutes == 0) {
    return minutes + '分钟'
  }
}

const checkDate = (date:any)=>{
  if(!date){
    return '--.--'
  }
  let d = date.split(" ")[0];
  let dateTime = d.split("-")[1] + "." +d.split("-")[2]
  return dateTime
}

const json2Form = (json:any) => {
  var str = [];
  for (var p in json) {
    if (typeof (json[p]) == 'object') {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(JSON.stringify(json[p])));
    } else {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
    }

  }
  return str.join("&");
}

const navigateToProgram = (plateform:string, carid:number|string, city:ICityId) => {
  if (plateform == 'gz') {
    let c = city.gz?city.gz.city_id :''
    let domain = city.gz?city.gz.domain :''
    if (carid&&c) {
      wx.navigateToMiniProgram({
        appId: 'wx2f40778ca2a8c6b0',
        path: 'pages/index/index?return_url='+encodeURIComponent('https://m.guazi.com/' + domain + '/' + carid + 'x')
      })
    } else {
      wx.navigateToMiniProgram({
        appId: 'wx2f40778ca2a8c6b0',
      })
    }
  }

  if (plateform == 'yx') {
    let c = city.yx?city.yx.cityid :''
    if (carid&&c) {
      wx.navigateToMiniProgram({
        appId: 'wx66d9d754ae654ee0',
        path: 'pages/carDetailNew/carDetailNew?carid=' + carid + '&cityid=' + c
      })
    } else {
      wx.navigateToMiniProgram({
        appId: 'wx66d9d754ae654ee0',
      })
    }
  }
  if (plateform == 'rr') {
    if (carid) {
      wx.navigateToMiniProgram({
        appId: 'wx2d80f009df8d7aaa',
        path: 'pages/detail/index?car_id=' + carid
      })
    } else {
      wx.navigateToMiniProgram({
        appId: 'wx2d80f009df8d7aaa',
      })
    }
  }
  
}

const jsonForm = (json:any) => {
  for (var p in json) {
    if (typeof (json[p]) == 'object') {
      json[p] = JSON.stringify(json[p])
    }
  }
  return json
}

export {
  setDate,
  setDay,
  setHour,
  startTimeName,
  taskTime,
  checkDate,
  json2Form,
  navigateToProgram,
  jsonForm
}