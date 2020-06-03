import { BehaviorSubject, Subject } from '../rx/rx';

const SearchDataSubject = new Subject<IAnyObject>();

const SearchDataObject = new BehaviorSubject<boolean>(false);

const MonitorSearchDataSubject = new Subject<IAnyObject>();

export { SearchDataSubject, SearchDataObject, MonitorSearchDataSubject };
