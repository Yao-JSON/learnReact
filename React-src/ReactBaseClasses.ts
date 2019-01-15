
const emptyObject: object = {};

interface Updater {
  isMounted(): Boolean;
  enqueueForceUpdate(): void;
  enqueueReplaceState(): void;
  enqueueSetState(): void;
}

class Component {
  props: Object;
  context: Object;
  refs: Object;
  updater: Updater;
  isReactComponent: Boolean;

  constructor(props, context, updater) {
    this.props = props;
    this.context = context;
    this.refs = emptyObject;
    this.updater = updater;
    this.isReactComponent = true;
  }

  setState:() => {

  }
  
}
