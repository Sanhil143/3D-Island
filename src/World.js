import * as Three from "three";
import dat from 'dat.gui';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {TransformControls} from 'three/examples/jsm/controls/TransformControls';
import Input from "./inputs/Events";

export default class World{
  constructor({canvas}){
    this.canvas = canvas;

    this.init();
    this.render();
  }

  init(){
    this.scene = new Three.Scene()
    this.camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight , 0.1 , 1000);
    this.camera.position.set(0,2,5)
    this.renderer = new Three.WebGLRenderer({canvas : this.canvas});

    this.setUpLights();
    this.resize();
    this.setUpControls();
    this.setUpGui();

    this.setup();
    Input.init();
  }

  render(){
    // console.log(this.camera.position);
    this.orbitControls.update()
    this.renderer.render(this.scene,this.camera);
    this.update();
    requestAnimationFrame(() => this.render());
  }

  resize(){
    this.camera.aspect = (window.innerWidth / window.innerHeight);
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  setUpControls(){
    this.orbitControls = new OrbitControls(this.camera,this.renderer.domElement)
    this.orbitControls.maxPolarAngle = Math.PI * 0.49;
    this.orbitControls.maxDistance = 50;
    this.orbitControls.minDistance = 3
  }

  setUpLights(){
    this.ambientLight = new Three.AmbientLight(0xffffff, 0.1);
    this.scene.add(this.ambientLight);

    this.pointLight = new Three.PointLight(0xffffff, 1.0);
    // this.pointLight.position.y = 5
    this.scene.add(this.pointLight);

    this.pointTransformControl = new TransformControls(this.camera,this.renderer.domElement);
    this.pointTransformControl.addEventListener('dragging-changed',() => {
      this.orbitControls.enabled = !this.orbitControls.enabled;
    })
    this.pointTransformControl.attach(this.pointLight);
    this.scene.add(this.pointTransformControl)
  }

  setUpGui(){
    this.gui = new dat.GUI();
    let ambientFolder = this.gui.addFolder('ambientLight');
    ambientFolder.add(this.ambientLight,'intensity',0,1);

    let pointFolder = this.gui.addFolder('pointLight');
    pointFolder.add(this.pointLight,'intensity',0,100)
    pointFolder.add(this.pointTransformControl, 'visible')
  }

}
