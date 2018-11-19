// imports
import { Random } from 'meteor/random'
import {_} from 'meteor/underscore'

let toasts = {};

export const showToast = (categoryTags, message, options) => {

  // normalise duration
  const duration = options&&options.duration?options.duration:5000;

  // normalise style
  const style = options&&options.style?options.style:undefined;

  // unique id
  const id = Random.id();

  const callback = () => {

    // call the optional callback if it is defined
    if (options&&_.isFunction(options.callback)) {
      options.callback();
    }

    // stop tracking the toast
    delete toasts[id];
  };

  // show the toast
  M.toast({html: message}, duration, style, callback);

  // track the toast
  toasts[id] = {categoryTags, message};
};

// close toasts by tags
const _closeToastsByTags = (tags) => {
  const toastsToClose = _.filter(toasts, (toast) => {

    // console.log('Checking toast:', toast);
    for (let tag of tags) {
      if (_.contains(toast.categoryTags, tag)) {
        return true;
      }
    }
    return false;
  });
  _.forEach(toastsToClose, (toast) => {

    // remove each toast matching the message of this  toast
    _.chain($('.toast'))
        .filter((qToast) => {
          if(qToast.innerText === toast.message) {
            return true;
          }
          return false;
        })
        .each((qToast) => {
          // Log.log(['debug', 'toast'], 'Remove toast:', toast.qToast);
          qToast.M_Toast.remove();
        });

    // stop tracking toast
    delete toast[toast.id];
  });
};

export const closeToastsByTags = _.throttle(_closeToastsByTags, 1000);

export default {
  show: showToast,
  closeTags: _closeToastsByTags
};
