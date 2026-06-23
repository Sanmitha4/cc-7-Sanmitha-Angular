class UIButton {
  callback = null;
  addEventListener(callback) {
    this.callback = callback;
  }
  click() {
    if (this.callback) {
      this.callback('Clicked', 'Button');
    }
  }
}

class SomeClass {
  name = 'angular';
  constructor(aButton) {
    this.aButton = aButton;
    this.printName=this.printName.bind(this); //bind id need only for functions created using function keyword not for arrow functions
    this.aButton.addEventListener(this.printName);
  }
  printName(prefix, suffix) {
    console.log('Hello world', prefix, ':', this.name, ':', suffix);
  }
}
const student = {
  name: 'sanmitha',
  dob: '24-1-2004',
};

const someObj = new SomeClass();
const printFc = someObj.printName;

someObj.printName('First');

const aButton = new UIButton();
//const someObj = new SomeClass();

printFc.apply(someObj, ['Second', 'Suffix']);
printFc.apply(student, ['Third']);
printFc.call(someObj, 'Second', 'Suffix');
