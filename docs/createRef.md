## CreateRef

React，Vue 等前端框架的出现之前 Web 页面交互完全依靠频繁的 Dom 操作实现，在那个刀耕火种的年代 Jquery 作为一个便捷的实现 Dom 操作的库便走上了神坛，成为了 Web 开发工程师必备技能。幸运的是 Web 2.0 时代，React 和 Vue 等前端框架利用组件状态管理避免了频繁的直接的 Dom 操作，增加了代码可读性。但 React 依然为我们提供了便捷的获取 Dom 的方法。在 React 典型的数据流里，props 是父组件控制子组件唯一的方式，要去修改一个子组件，我们通过改变 props 来使子组件重新渲染。
但是在有一些场景中我们可以直接更改子组件而不通过常规的数据流，React ref 就是在这种情况下产生的。

#### 在什么时候需要它

根据官方文档，定义了三种情况下我们可能使用它。

* 管理焦点，文本选择，或媒体播放。
* 触发命令动画
* 与第三方 DOM 库集成。

😄 话不多了，回顾一下 `ref` 的几种用法。

#### 字符串定义

> 这个方案已经不被`react`官方推荐，而且会在未来的版本中移除

```jsx
// 在 render 函数里面
<input type="text" defaultValue="First" ref="first" />;

// 获取 ref
this.refs.first;
```

#### 使用回调函数

```jsx
// 在 render 函数里面
<input
  type="text"
  defaultValue="Second"
  ref={input => (this.second = input)}
/>;
// 获取 ref
this.second;
```

#### React.createRef()

>在react 16.3 中，可以使用新的 `React.createRef()` 函数，创建 Ref 更加容易

```jsx
// 在 class 中声明
third = React.createRef();
// 或者在 constructor 中声明
this.third = React.createRef();

// 在 render 函数中:
<input type="text" defaultValue="Third" ref={this.third} />;

// 获取 ref
this.third.current;

// 获取 input 的 value 
this.third.current.value;
```

#### 如何在 HOC 中传递 ref

首先尝试一下在 HOC 中传递 ref；

```jsx
import React, { Component } from 'react';
import PropTypes from "prop-types";
import logo from './logo.svg';
import './App.css';

class FormSection extends Component {
  static propTypes = {
    fourth: PropTypes.shape({ value: PropTypes.instanceOf(HTMLInputElement) })
  };

  render() {
    return <input type="text" defaultValue="hoc" ref={this.props.ref} />;
  }
}

// HOC 工厂函数
function HOCFactory(WrappedComponent) {
  return class HOC extends Component {
    render() {
      return <WrappedComponent {...this.props}/>
    }
  }
}


class App extends Component {

  handleSubmit = e => {
    e.preventDefault();
    console.log(this.refs.hoc);
  };

  render() {
    const HOCInstance = HOCFactory(FormSection);
    return (
      <form onSubmit={e => this.handleSubmit(e)}>
        <HOCInstance ref="hoc" />
        <button>Submit</button>
      </form>
    );
  }
}

export default App;
```

提交后`ref`并没有绑定到我们想要的组件上，而是被指向了`HOC`这个组件，其实如果我们了解`HOC`的原理的话，这个问题我们应该很清楚就明白了。`React ref`是一个特殊的属性，它会在在组件 `componentDidMount` 和 `componentDidUpdate` 之前被触发。也就是说 `ref` 是不能作为 `props` 传递的，因为它会在组件一加载时就会触发回调函数。

#### 解决方案

使用`React.createRef()` 在`HOC` 组件中绕开`ref`属性

```jsx
...
class FormSection extends Component {
    ...
  render() {
    return <input type="text" defaultValue="hoc" ref={this.props.myRef} />;
  }
}

function HOCFactory(WrappedComponent) {
...
}

class App extends Component {

  hocRef = React.createRef();

  handleSubmit = e => {
    e.preventDefault();
    console.log(this.hocRef);
  };

  render() {
    const HOCInstance = HOCFactory(FormSection);
    return (
      <form onSubmit={e => this.handleSubmit(e)}>
        {/* 通过在父组件中使用自定义的属性，从而使得属性能够传递下去。如果使用 ref 属性，将在父组件加载时就会触发回调，导致 this.hocRef 指向父组件*/}
        <HOCInstance myRef={this.hocRef} />
        <button>Submit</button>
      </form>
    );
  }
}
```

同理我们在现有的 React 版本(@16.2.0以下)里，也可以通过回调函数在父组件中绕开 ref 属性的方式获取子组件的实例。

```jsx
...
class FormSection extends Component {
    ...
  render() {
    return <input type="text" defaultValue="hoc" ref={this.props.myRef} />;
  }
}

function HOCFactory(WrappedComponent) {
...
}

class App extends Component {

  handleSubmit = e => {
    e.preventDefault();
    console.log(this.hocRef);
  };

  render() {
    const HOCInstance = HOCFactory(FormSection);
    return (
      <form onSubmit={e => this.handleSubmit(e)}>
        <HOCInstance myRef={el => this.hocRef = el} />
        <button>Submit</button>
      </form>
    );
  }
}
```

