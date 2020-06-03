const formatterMap = new Map();

const registerFormatter = (
  formatterName: string,
  formatter: (data: any) => IFormatResult[]
) => {
  if (formatterMap.has(formatterName)) {
    formatterMap.delete(formatterName);
  }
  formatterMap.set(formatterName, formatter);
};

const doFormatData = (
  data: any,
  formatterName: string
): IFormatResult[] => {
  if (!formatterMap.has(formatterName)) {
    throw new Error(`不存在的formatter${formatterName}!请检查参数`);
  }

  const formatter = formatterMap.get(formatterName);

  return formatter(data);
};

export { registerFormatter, doFormatData };
