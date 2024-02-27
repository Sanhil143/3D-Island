export default class Input{

  static mouseClick = null;
  static mouseMove = null;
  static mouseDown = null;
  static mouseUp = null;
  static mousePosition = {x:null, y:null, z:null};

  static keyUp = null;
  static keyDown = {};

  static init() {
    window.addEventListener('click',(e) => {this._mouseClick(e)});
    window.addEventListener('mousemove',(e) => {this._mouseMove(e)});
    window.addEventListener('mousedown',(e) => {this._mouseDown(e)});
    window.addEventListener('mouseup',(e) => {this._mouseUp(e)});
    window.addEventListener('keyup',(e) => {this._keyUp(e)});
    window.addEventListener('keydown',(e) => {this._keyDown(e)});
  }

  static _mouseMove(event){
    this.mouseMove = event;
    this.mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mousePosition.y = (event.clientY / window.innerHeight) * 2 + 1;
  }

  static _mouseClick(event){
    this.mouseClick = event;
  }

  static _mouseDown(event){
    this.mouseDown = event;
  }

  static _mouseUp(event){
    this.mouseUp = event;
    this.mouseDown = null;
  }

  static _keyDown(event){
    this.keyDown[event.keyCode] = event;
  }

  static _keyUp(event){
    this.keyUp = event;
    delete this.keyDown[event.keyCode];
  }

  static clear(){
    this.mouseClick = null;
    this.mouseMove = null;
    this.mouseUp = null;
    this.mousePosition = {x:null,y:null,z:null};
    this.keyUp = null;
  }

  constructor(){
    throw new Error("Cannot create object of this class");
  }
}