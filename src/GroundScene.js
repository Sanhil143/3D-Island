import World from "./World";
import Input from "./inputs/Events";
import * as Three from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Water } from "three/examples/jsm/objects/Water";

export default class GroundScene extends World {
  constructor({ canvas }) {
    super({ canvas });
    this.boundaryBox = new Three.Box3();
  }
  setup() {
    this.clock = new Three.Clock();
    this.modelMixer = null;

    const cloudTexture = [
      "./bluecloud_ft.png",
      "./bluecloud_bk.png",
      "./bluecloud_up.png",
      "./bluecloud_dn.png",
      "./bluecloud_rt.png",
      "./bluecloud_lf.png",
    ];
    const skyBox = new Three.CubeTextureLoader().load(cloudTexture);
    this.scene.background = skyBox;

    const gltfLoader = new GLTFLoader();
    gltfLoader.load("marooners_isle.glb", (obj) => {
      this.model = obj.scene;
      this.modelMixer = new Three.AnimationMixer(this.model);
      const clips = obj.animations;
      const clip = Three.AnimationClip.findByName(clips, "Take 001");
      const action = this.modelMixer.clipAction(clip);
      action.play();
      this.model.position.y = 1;
      this.scene.add(this.model);
      this.boundaryBox = new Three.Box3().setFromObject(this.model);
      console.log("boundary", this.boundaryBox);
      const boundingBoxHelper = new Three.Box3Helper(
        this.boundaryBox,
        0xffff00
      );
      this.scene.add(boundingBoxHelper);
      // model-boundaries
      this.boundaries = {
        minX: this.boundaryBox.min.x,
        maxX: this.boundaryBox.max.x,
        minY: this.boundaryBox.min.y,
        maxY: this.boundaryBox.max.y,
        minZ: this.boundaryBox.min.z,
        maxZ: this.boundaryBox.max.z,
      };
    });

    const grass = new Three.TextureLoader().load(
      "MicrosoftTeams-image (13).png"
    );
    grass.wrapS = Three.RepeatWrapping;
    grass.wrapT = Three.RepeatWrapping;
    const grassSize = 1000 * 1;
    grass.repeat.set(grassSize, grassSize);
    const groundGeometry = new Three.PlaneGeometry(10, 10);
    const groundMaterial = new Three.MeshStandardMaterial({
      side: Three.DoubleSide,
      map: grass,
    });
    const ground = new Three.Mesh(groundGeometry, groundMaterial);
    ground.rotateX(Math.PI * 0.5);
    // this.scene.add(ground);

    const waterGeometry = new Three.PlaneGeometry(10000, 10000);
    this.water = new Water(waterGeometry, {
      textureHeight: 512,
      textureWidth: 512,
      waterNormals: new Three.TextureLoader().load(
        "waterTExture.png",
        (texture) => {
          texture.wrapS = texture.wrapT = Three.RepeatWrapping;
        }
      ),
      sunDirection: this.pointLight.position,
      sunColor: "skyblue",
      waterColor: "skyblue",
      distortionScale: 4,
      // side:Three.DoubleSide
    });
    this.water.position.set(0, -0.5, 0);
    this.water.rotation.x = -Math.PI * 0.5;
    this.scene.add(this.water);

    this.loadModel("Animated Woman.glb");
  }

  //Player object
  loadModel(modelPath) {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(modelPath, (obj) => {
      console.log(obj);
      this.player = obj.scene;
      this.player.position.set(-3, 1.02, 2);
      this.camera.position.set(
        this.player.position.x - 2.172,
        this.player.position.y + 1.941,
        this.player.position.z - 2.3721
      );
      this.scene.add(this.player);

      this.mixer = new Three.AnimationMixer(this.player);
      this.clips = obj.animations;
      this.animation = {
        idle: this.mixer.clipAction(this.clips[4]),
        walk: this.mixer.clipAction(this.clips[22]),
        run: this.mixer.clipAction(this.clips[16]),
      };
      this.animation.idle.play();
    });
  }

  updatePlayerPosition(newPosition) {
    if (this.boundaryBox.isEmpty()) return;
    if (newPosition.x < this.boundaries.minX) {
      newPosition.x = this.boundaries.minX;
    } else if (newPosition.x > this.boundaries.maxX) {
      newPosition.x = this.boundaries.maxX;
    }

    if (newPosition.y < this.boundaries.minY) {
      newPosition.y = this.boundaries.minY;
    } else if (newPosition.y > this.boundaries.maxY) {
      newPosition.y = this.boundaries.maxY;
    }

    if (newPosition.z < this.boundaries.minZ) {
      newPosition.z = this.boundaries.minZ;
    } else if (newPosition.z > this.boundaries.maxZ) {
      newPosition.z = this.boundaries.maxZ;
    }

    // Update model position
    this.player.position.copy(newPosition);
  }

  update() {
    let delta = this.clock.getDelta();
    if (this.mixer) {
      this.mixer.update(delta);
      this.orbitControls.target = this.player.position
        .clone()
        .add({ x: 0, y: 2, z: 0 });
      this.player.rotation.set(
        0,
        this.orbitControls.getAzimuthalAngle() + Math.PI,
        0
      );
    }
    if (this.modelMixer) {
      this.modelMixer.update(delta);
    }

    this.water.material.uniforms["time"].value += 0.005;

    if (this.player) {
      this.updatePlayerPosition(this.player.position);
    }

    if (Input.keyUp) {
      if (Input.keyUp.keyCode == 38 || Input.keyUp.keyCode == 82) {
        if (!this.animation.idle.isRunning()) {
          this.animation.idle.play();
          this.animation.run.stop();
          this.animation.walk.stop();
        }
        Input.keyUp = null;
      }
    }

    if (Object.keys(Input.keyDown).length > 0) {
      if (Input.keyDown[38]) {
        if (!this.animation.walk.isRunning()) {
          this.animation.walk.play();
          this.animation.run.stop();
          this.animation.idle.stop();
        }
        this.player.translateZ(0.04);
        this.camera.translateZ(-0.04);
      } else if (Input.keyDown[82]) {
        if (!this.animation.run.isRunning()) {
          this.animation.run.play();
          this.animation.idle.stop();
          this.animation.walk.stop();
        }
        this.player.translateZ(0.1);
        this.camera.translateZ(-0.1);
      }
    }
  }
}
