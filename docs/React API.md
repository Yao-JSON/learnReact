## React API

解析 ReactAPI

#### createElelemt

`React` 在预编译过程中会根据首字母是否大写，确定判断是否原生`html`标签还是`React`组件，执行`React.createElement`创建虚拟节点。

`createElement` 是由 `ReactElement.js` 提供的一个工厂函数，接受三个参数 `type`、`config`、`children`。创建并返回一个新的 `React element`(虚拟节点)，其中`type`参数可以是一个标签名(`div`,`span`)，也可以是一个  `React Componet`。


```js
  const RESERVED_PROPS = {
    key: true,
    ref: true,
    __self: true,
    __source: true,
  };

  const ReactElement = function(type, key, ref, self, source, owner, props) {
    const element = {
      $$typeof: REACT_ELEMENT_TYPE,
      type,
      key,
      ref,
      props,
      _owner: owner
    }

    return element;
  }

  const createElement = (type, config, children) => {
    let propName;
    // Reserved names are extracted
    const props = {};

    let key = null;
    let ref = null;
    let self = null;
    let source = null;

    if(config !== null) {
      for(propName in config) {
        if(!RESERVED_PROPS.hasOwnProperty(propName)) {
          props[propName] = config[propName];
        }
      }
    }

    const childrenLength = arguments.length - 2;

    if(childrenLength === 1) {
      props.children = children;
    } else {
      const childArray = Array(childrenLength);
       for (let i = 0; i < childrenLength; i++) {
        childArray[i] = arguments[i + 2];
      }
      props.children = childArray;
    }

    // resolve default props
    if(type &&  type.defaultProps) {
      const defaultProps = type.defaultProps;
      for (propName in defaultProps) {
        if(props[propName] === undefined) {
          props[propName] = defaultProps[propName];
        }
      }
    }

    return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props );
  }

```

#### createContext

`Context API`总是让人很迷惑。官方定义，`Creates a Context object. When React renders a component that subscribes to this Context object it will read the current context value from the closest matching Provider above it in the tree.` 这个`API`是官方的，但是官方又不希望开发者们使用这个`API`，说这个`API`会在以后发生改变。现在就是那个改变的时刻。新的`API`已经被`merge`了。 而且它看起来更加的“用户友好”了。尤其是你不使用`redux`,`mobx`的时候，可以选择新的`Context API`实现更加简单的状态管理。
新的`API`用起来非常的简单：`React.createContext()`，这样就创建了两个组件：

```js
import {createContext} from 'react';

const ThemeContext = createContext({
  background: 'yellow',
  color: 'white'
});
```

调用 `createContext` 方法会返回两个对象，一个是`Provider`，一个是`Consumer`。
`Provider`是一个特殊组件，它可以用来给予子树里的组件提供数据。一个例子：

```jsx
class Application extends React.Component {
  render() {
    <ThemeContext.Provider value={{background: 'black', color: 'white'}}>
      <Header />
      <Main />
      <Footer />
    </ThemeContext.Provider>
  }
}
```

上例展示了如何传递“theme” context的。当然这些值是可以动态的(比如，基于 state )
下一步就是使用`Consumer`。

```jsx
const Header = () => {
  <ThemeContext.Consumer>
    {(context) => {
      return (
        <div style={{background: context.background, color: context.color}}>
          Welcome!
        </div>
      );
    }}
  </ThemeContext.Consumer>
}
```

如果在 `render Consumer` 的时候没有嵌套一个 `Provider` 里面。那么就会使用 `createContext` 方法调用的时候设置的默认值。
注意：
* Consumer必须可以访问到同一个Context组件。如果你要创建一个新的context，用的是同样的入参，那么这个新建的context的数据是不可访问的。因此，可以把Context当做一个组件，它可以创建一次，然后可以export，可以import。
* 这个新的语法用了function as child模式（有时也叫做render prop模式）
* 新的API不再要求你声明contextProps了。

Context传递的数据和Context.Provider组件的value属性是一样的。对Provider数据的修改会引起所有的消费者（consumer）重绘。



#### forwardRef

`React.forwardRef`的用法是，接受一个函数作为参数。

```js
React.forwardRef((props, ref) => React.ReactElement)
```


