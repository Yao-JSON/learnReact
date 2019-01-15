
const is = (x: any, y: any): Boolean => {
  return (x === y && (x !== 0 || 1 / x === 1 / y)) || (x !== x && y !== y)
}
const hasOwnProperty = Object.prototype.hasOwnProperty;

const shallowEqual = (objA: object, objB: object): Boolean => {
  if(is(objA, objB)) {
    return true;
  }

  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (let i = 0; i < keysA.length; i++) {
    if (
      !hasOwnProperty.call(objB, keysA[i]) ||
      !is(objA[keysA[i]], objB[keysA[i]])
    ) {
      return false;
    }
  }

  return true;
}

export default shallowEqual;

