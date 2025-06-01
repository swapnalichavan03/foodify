import {createRef} from 'react';
import {NavigationContainerRef, ParamListBase} from '@react-navigation/native';

export const navigationRef = createRef<NavigationContainerRef<ParamListBase>>();

type NavigateParams<T extends keyof ParamListBase> =
  undefined extends ParamListBase[T]
    ? [screen: T] | [screen: T, params: ParamListBase[T]]
    : [screen: T, params: ParamListBase[T]];

export const appNavigation = {
  navigate<T extends keyof ParamListBase>(...args: NavigateParams<T>) {
    if (navigationRef.current?.isReady()) {
      navigationRef.current.navigate(...(args as any));
    } else {
      console.warn('Navigation attempted before navigator was ready.');
    }
  },

  goBack: () => {
    if (navigationRef.current?.canGoBack()) {
      navigationRef.current.goBack();
    } else {
      console.warn('Attempted to go back when no screens were in the stack.');
    }
  },

  reset: (state: any) => {
    navigationRef.current?.reset(state);
  },

  getCurrentRoute: () => {
    return navigationRef.current?.getCurrentRoute();
  },
};
