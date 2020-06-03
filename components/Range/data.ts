export default class RangeComponentData {
  leftX = 0;
  rightX = 0;
  containerWidth = 0;
  blockHalfWidth = 0;
  blockWidth = 0;
  containerLeft = 0;
  stepWidth = 0;
  isLoaded = false;
  rightStyle = '';
  leftStyle = '';
  distanceStyle = '';
  inited = false;
  tickWidth = 0;
  leftIcon = 'uniE953';
  rightIcon = 'uniE954';
  tickList: { label: string; pos: number }[] = [];
}
