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

```js
React.forwardRef((props, ref) => React.ReactElement)
```

`React.forwardRef`的用法是，接受一个函数作为参数。实际上，可以将这个函数视为一个函数组件，它的第一个参数和函数组件一样，不同在于，它多了一个 `ref`。这意味着如果你在 `React.forwardRef`创建的组件上使用`ref`的话，它并不能直接被组件给消化掉，而是组件内部进行了转发，让需要消化它的组件去消化。
其实还可以换一种方式去理解，我们都知道`ref、key`等都是`react`的保留关键字，`ref`并不会出现在`props`中，它被特殊对待，换个名字不久可以了么？
以前我们获取`ref`是传递一个函数（不推荐使用字符串，这是一个历史遗留的问题，`ref` 会在某些情况下无法获取到正确的值。vuejs可以使用，不要搞混了）。但是这个过程很烦的，我们只需要把实例或者DOM赋值给对应的变量就行了，每次都写一下这个一样模板的代码，很烦人的好吗。“千呼万唤”中，React终于听到了。现在只需要`React.createRef`就可以简化这个过程了。

```jsx
class MyComponent extends React.Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
    }
    render() {
        return <div ref={this.myRef} />;
    }
}
```

回到上面的话题，现在我们用props来实现转发refs的功能。

```jsx
class Input extends React.Component {

  reder() {
    return (
      <label>Autofocus Input:</label>
      <input ref={this.props.forwardRef} type="text" />
    )
  }

}

function forwardRef(Component, ref) {
  return (<Component forwardRef={ref} />);
}

// 使用forwardRef
let input = React.createRef();

forwardRef(Input, input);

// 当组件绑定成功之后
 input.current.focus();
```

`React.createRef`返回的值中，`current`属性表示的就是对应的DOM或者组件实例。`forwardRef`并没有什么特殊的含义，就是一个简单的props。这个用法就像是状态提升一样。

#### StrictMode

StrictMode 于 v16.3 推出。顾名思义，即严格模式，可用于在开发环境下提醒组件内使用不推荐写法和即将废弃的 API（该版本废弃了三个生命周期钩子）。与 Fragment 相同，并不会被渲染成真实 DOM。官方文档严格模式里详细介绍了会在哪些情况下发出警告。对于我们开发者来说，及时弃用不被推荐的写法即可规避这些警告。

StrictMode是一个用以标记出应用中潜在问题的工具。就像Fragment，StrictMode不会渲染任何真实的UI。它为其后代元素触发额外的检查和警告。

>注意: 严格模式检查只在开发模式下运行，不会与生产模式冲突。

严格模式是一个新的方式来确保你的代码是按照最佳实践开发的。它实际是一个在React.StrictMode下的组件。它可以用在你的组件树的任何一部分上。

```jsx
import {StrictMode} from 'react'

class Application extends React.Component {
  render() {
    return (
      <StrictMode>
        <Context.Provider value={{background: 'black', color: 'white'}}>
          <Header />
          <Main />
          <Footer />
        </Context.Provider>
      </StrictMode>
    );
  }
}
```

如果一个在StricMode子树里的组件使用了componentWillMount方法，那么你会看到一个报错消息。