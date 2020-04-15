import { useCallback } from 'react';

const useBooleanSetters = (setter: Function) => {
  const enable = useCallback(() => setter(true), [setter]);
  const disable = useCallback(() => setter(false), [setter]);
  return [enable, disable];
};

export default useBooleanSetters;
