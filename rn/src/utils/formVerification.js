import rules from './rules';
import { es5 } from 'mo2js';

export default (inputs, verifications) => {
  let msg;

  es5.each(verifications, function (verification, key) {
    let { rules: vRules, msgs } = verification;

    es5.each(vRules, function (rule, i) {
      if (!rules[rule](inputs[key])) {
        msg = msgs[i];
        return false;
      }
    });

    if (msg) return false;
  })

  return msg;
};