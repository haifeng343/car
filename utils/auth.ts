import { BehaviorSubject } from '../rx/rx';

const authSubject = new BehaviorSubject<boolean>(false);

export { authSubject };
