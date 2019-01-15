## Componet Vs PureComponet

`PureComponet` 是 React 15.3 之后新特性，顾名思义，`pure` 是纯的意思，取代其前身 `PureRenderMixin`, `PureComponet` 是优化 `React` 应用重要的方法之一，易于实施，只要把继承从 `Component` 换成 `PureComponent` 即可，可以减少不必要的 `render` 操作次数，从而提高性能，而且可以减少 `shouldComponentUpdate` 函数，节省代码量。

#### 源码对比

`Component` 与 `PureComponent` 是由 [ReactBaseClasses](./React-src/ReactBaseClasses.ts) 提供，`PureComponet` 会比 `Component` 多一个 `isPureReactComponent` 属性；检测组件更新 `checkShouldComponentUpdate`

```js

function checkShouldComponentUpdate(workInProgress, ctor, oldProps, newProps, oldState, newState, nextContext) {
  // 当前渲染组件的实例
  const instance = workInProgress.stateNode;
  
  if (typeof instance.shouldComponentUpdate === 'function') {
    const shouldUpdate = instance.shouldComponentUpdate(newProps, newState, nextContext );
    return shouldUpdate;
  }

  // 
  if (ctor.prototype && ctor.prototype.isPureReactComponent) {
    return (
      !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState)
    );
  }

  return true;
}
```

