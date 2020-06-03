export interface IFilterMap {
  id: string;
  type: number;
  field: string | string[];
  multi?: boolean;
  defaultValue: any;
  title: string;
  unit?: string;
  step?: number;
  optionList?: IFilterOption[];
  tick?: string[];
  min?: number;
  max?: number;
}

export interface IFilterOption {
  label: string;
  value: any;
  icon?: string;
  color?: string;
  active: boolean;
}

const _filterMap: IFilterMap[] = [
  {
    id: 'autoType',
    type: 2,
    multi: false,
    field: 'autoType',
    defaultValue: 0,
    title: '车型',
    optionList: [
      {
        label: '轿车',
        value: 1,
        icon: '/assets/image/jiaoche.png',
        active: false
      },
      {
        label: 'SUV',
        value: 2,
        icon: '/assets/image/suv.png',
        active: false
      },
      {
        label: 'MPV',
        value: 3,
        icon: '/assets/image/mpv.png',
        active: false
      },
      {
        label: '跑车',
        value: 4,
        icon: '/assets/image/paoche.png',
        active: false
      },
      {
        label: '面包车',
        value: 7,
        icon: '/assets/image/mianbaoche.png',
        active: false
      },
      {
        label: '皮卡',
        value: 8,
        icon: '/assets/image/pika.png',
        active: false
      }
    ]
  },
  {
    id: 'sortType',
    type: 1,
    multi: false,
    defaultValue: 0,
    field: 'sortType',
    title: '车源偏好',
    optionList: [
      {
        label: '价格最低',
        value: 1,
        active: false
      },
      {
        label: '里程最少',
        value: 2,
        active: false
      },
      {
        label: '车龄最小',
        value: 3,
        active: false
      }
    ]
  },
  {
    id: 'gearbox',
    type: 1,
    multi: false,
    defaultValue: 0,
    field: 'gearbox',
    title: '变速箱',
    optionList: [
      {
        label: '手动',
        value: 1,
        active: false
      },
      {
        label: '自动',
        value: 2,
        active: false
      }
    ]
  },
  {
    id: 'drive',
    type: 1,
    multi: false,
    defaultValue: 0,
    field: 'drive',
    title: '驱动',
    optionList: [
      {
        label: '四驱',
        value: 3,
        active: false
      }
    ]
  },
  {
    id: 'age',
    type: 3,
    multi: false,
    defaultValue: [0, 6],
    field: ['minAge', 'maxAge'],
    title: '车龄',
    step: 1,
    unit: '年',
    min: 0,
    max: 6,
    tick: ['0', '1', '2', '3', '4', '5', '不限']
  },
  {
    id: 'mileage',
    type: 3,
    multi: false,
    defaultValue: [0, 14],
    field: ['minMileage', 'maxMileage'],
    title: '里程',
    step: 1,
    unit: '万公里',
    min: 0,
    max: 14,
    tick: ['0', '2', '4', '6', '8', '10', '12', '不限']
  },
  {
    id: 'displacement',
    type: 3,
    multi: false,
    defaultValue: [0, 4],
    field: ['minDisplacement', 'maxDisplacement'],
    title: '排量',
    step: 0.1,
    unit: 'T/L',
    min: 0,
    max: 4,
    tick: ['0', '1', '2', '3', '不限']
  },
  {
    id: 'fuelType',
    type: 1,
    multi: false,
    defaultValue: 0,
    field: 'fuelType',
    title: '燃料类型',
    optionList: [
      {
        label: '汽油',
        value: 1,
        active: false
      },
      {
        label: '柴油',
        value: 2,
        active: false
      },
      {
        label: '电动',
        value: 3,
        active: false
      },
      {
        label: '油电混合',
        value: 4,
        active: false
      }
    ]
  },
  {
    id: 'emission',
    type: 4,
    multi: false,
    defaultValue: 0,
    field: 'emission',
    title: '排放',
    optionList: [
      {
        label: '国三及以上',
        value: 3,
        active: false
      },
      {
        label: '国四及以上',
        value: 4,
        active: false
      },
      {
        label: '国五及以上',
        value: 5,
        active: false
      },
      // {
      //   label: '国六',
      //   value: 6,
      //   active: false
      // }
    ]
  },
  {
    id: 'countryType',
    type: 1,
    multi: false,
    defaultValue: 0,
    field: 'countryType',
    title: '国别',
    optionList: [
      {
        label: '国产',
        value: 3,
        active: false
      },
      {
        label: '德国',
        value: 4,
        active: false
      },
      {
        label: '日本',
        value: 5,
        active: false
      },
      {
        label: '美国',
        value: 2,
        active: false
      },
      {
        label: '韩国',
        value: 6,
        active: false
      },
      {
        label: '法国',
        value: 1,
        active: false
      }
    ]
  },
  {
    id: 'carColor',
    type: 1,
    multi: false,
    defaultValue: 0,
    field: 'carColor',
    title: '颜色',
    optionList: [
      {
        label: '黑色',
        value: 1,
        color: '#000000',
        active: false
      },
      {
        label: '白色',
        value: 2,
        color: '#FFFFFF',
        active: false
      },
      {
        label: '银灰色',
        value: 3,
        color: '#9B9B9B',
        active: false
      },
      {
        label: '红色',
        value: 6,
        color: '#E9001D',
        active: false
      },
      {
        label: '橙色',
        value: 10,
        color: '#F5A623',
        active: false
      },
      {
        label: '蓝色',
        value: 7,
        color: '#0077DC',
        active: false
      }
    ]
  },
  {
    id: 'starConfig',
    type: 1,
    multi: true,
    defaultValue: [],
    field: 'starConfig',
    title: '亮点',
    unit:'多选',
    optionList: [
      {
        label: '准新车',
        value: 1,
        active: false
      },
      {
        label: '新上',
        value: 2,
        active: false
      },
      {
        label: '超值',
        value: 3,
        active: false
      },
      {
        label: '严选车',
        value: 4,
        active: false
      },
      {
        label: '倒车影像',
        value: 5,
        active: false
      },
      {
        label: '全景天窗',
        value: 6,
        active: false
      },
      {
        label: '智能钥匙',
        value: 7,
        active: false
      }
    ]
  }
];

const filterMap = JSON.stringify(_filterMap);

export default filterMap;
