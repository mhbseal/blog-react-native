import {
  Dimensions,
  Platform,
} from 'react-native';

export default {
  window: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  headerHeight: Platform.OS === 'android' ? 44 : 64,
}