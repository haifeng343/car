/**
 * 
 * 数组对象 排序 
 * @param {string} e 第一排序字段
 * @param {string} [type='asc'] asc升序，desc倒叙
 * @param {string} [se=''] 第二排序字段
 * @returns
 */
const compareSort =(e:string,type:string ='asc',se:string = ''  )=>{
  if(type === 'asc'){
    return function (a:any, b:any) {
      if(e === 'licensedDate'){
        var value1:number = new Date(a[e]).getTime();
        var value2:number = new Date(b[e]).getTime();
        if(value1 === value2){
          return a[se] - b[se]
        }
        return value1 - value2;
      }else{
        var value1:number = a[e];
        var value2:number = b[e];
        return value1 - value2;
      }
    }
  }else{
    return function (a:any, b:any) {
      if(e === 'licensedDate'){
        var value1:number = new Date(a[e]).getTime();
        var value2:number = new Date(b[e]).getTime();
        if(value1 === value2){
          return a[se] - b[se]
        }
        return value2 - value1;
      }else{
        var value1:number = a[e];
        var value2:number = b[e];
        return value2 - value1;
      }
      
    }
  }
}
const objectDiff = (obj1:any, obj2:any)=>{
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }
  else {
    for (let key in obj1) {
      if (!obj2.hasOwnProperty(key)) {
        return false;
      }
      //类型相同
      if (typeof obj1[key] === typeof obj2[key]) {
        //同为引用类型
        if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
          const equal = objectDiff(obj1[key], obj2[key]);
          if (!equal) {
            return false;
          }
        }
        //同为基础数据类型
        if (typeof obj1[key] !== 'object' && typeof obj2[key] !== 'object' && obj1[key] !== obj2[key] && key !='advSort') {
          return false;
        }
      }
      else {
        return false;
      }
    }
  }
  return true;
}
export {compareSort, objectDiff}