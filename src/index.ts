const foo: boolean = false;

if (foo) {
  console.log('foo');
} else {
  console.log('bar');
}

function someFunction() {
  if (foo) {
    return 'foo';
  }
  return 'bar';
}
