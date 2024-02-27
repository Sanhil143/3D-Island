import GroundScene from "./src/GroundScene";
import "./style.css";

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("app");
  new GroundScene({ canvas });
});
