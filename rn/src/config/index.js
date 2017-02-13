// reactnative中babel的require()也是静态的,所以这里只能这样同时引入prod和dev,不同于react中babel的require()
import prod from './prod';
import dev from './dev';

// 根据不同环境引入对应的config
export default !__DEV__ ? prod : dev;
