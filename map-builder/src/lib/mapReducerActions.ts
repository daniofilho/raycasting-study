export default (reducerActions: any, dispatch: Function) => {
  const actions: any = {};

  Object.keys(reducerActions).forEach((key) => {
    actions[key] = (params: any) => {
      dispatch({ type: key, params });
    };
  });

  return actions;
};
