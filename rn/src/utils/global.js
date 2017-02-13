import { AsyncStorage } from 'react-native';
import Storage from 'react-native-storage';

// 本地缓存
global.storage = new Storage({
  storageBackend: AsyncStorage,
  defaultExpires: null
})