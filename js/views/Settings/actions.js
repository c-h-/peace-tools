import ActionTypes from '../../redux/action_types.json';

export function updateSetting(key, value) {
  return {
    type: ActionTypes.UPDATE_SETTING,
    payload: {
      key,
      value,
    },
  };
}
