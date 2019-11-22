import Model from "./Model";
import Geometry from "./Geometry";
import Material from "./Material";
import Light from "./Light";
// import toggleFloor from "./Floor";
import toggleButton from "./toggleButton";


var renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas'), antialias: true });
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

const maxWidth = window.innerWidth;
const maxHeight = window.innerHeight;
renderer.setSize(maxWidth, maxHeight);

// init camera
let camera1 = new THREE.PerspectiveCamera(35, maxWidth / maxHeight, 300, 10000);
let camera2 = new THREE.OrthographicCamera(-1500, 1500, 1500, -1500, 0.1, 10000);

// camera.position.set(0, 0, 0);

// init scene
let scene = new THREE.Scene();

// add lights
let light1 = Light.setLight("Ambient-Light", 0xffffff, 0.3);
scene.add(light1);
let light2 = Light.setLight("Point-Light", 0xffffff, 0.3); // distance: 600
scene.add(light2);

// init floor
// let floor = new THREE.PlaneGeometry(10000, 10000, 100, 100);
// let floorMaterial = new THREE.MeshLambertMaterial({ color: 0xF3FFE2 });
// let floorMesh = new THREE.Mesh(floor, floorMaterial);
// floorMesh.name = "floor";

// first render
fullRender();

function clearObjectFromScene(scene, name) {
	const selectedObject = scene.getObjectByName(name);
	scene.remove(selectedObject);
	if (selectedObject) {
		if (selectedObject.geometry) {
			selectedObject.geometry.dispose();
		}

		if (selectedObject.material) {
			selectedObject.material.dispose();
		}
	}
}

function fullRender() {

	let model = Model.getModel();

	let scale = model.scale;
	let detail = model.detail;
	let metalness = model.metalness;
	let roughness = model.roughness;
	let objectColor = model.objectColor;
	let emissiveColor = model.emissiveColor;
	let specularColor = model.specularColor;
	let intensity = model.intensity;
	let offsetX = model.offsetX;
	let offsetY = model.offsetY;
	let hemisphereLight = model.hemisphereLight;
    let spotLight = model.spotLight;
	let floor = model.spotLight;

	// console.log(`previous ShapeName: ${ model.previousShapeName }`)
	clearObjectFromScene(scene, model.previousShapeName);
	
	// console.log(`shape before change: ${ Model.shapeName() }`);
	let geometry = Geometry.setShape(Model.shapeName(), scale, detail);
	model.previousShapeName = Model.shapeName();

	let material = Material.setMaterial(Model.materialName(), objectColor, emissiveColor, intensity, metalness, roughness);
	material.needsUpdate = true;
	// console.log(`material after change: ${materialName}`)

	let mesh;

	if (material.isLineDashedMaterial) {
		mesh = new THREE.Line(geometry, material);
		mesh.computeLineDistances();
	} else if (material.isLineBasicMaterial) {
		mesh = new THREE.Line(geometry, material);
	} else {
		mesh = new THREE.Mesh(geometry, material);
	}

	mesh.position.set(0, -50, -500);
	mesh.name = Model.shapeName();

	// add light
	Light.controlHemisphereLight(scene, hemisphereLight, emissiveColor, specularColor, intensity);

	// toggle Floor
	clearObjectFromScene(scene, "floor");
	let floorMesh = null;
	if (Model.checkFloor()) {
		let floor = new THREE.PlaneGeometry(10000, 10000, 100, 100);
		let floorMaterial = new THREE.MeshLambertMaterial({ color: 0xd3d3d3 });
		floorMesh = new THREE.Mesh(floor, floorMaterial);
		floorMesh.name = "floor";
		floorMesh.rotation.x = -90 * Math.PI / 180;
		floorMesh.position.y = -150;
	}

	Light.controlShadows(scene, Model.checkFloor(), mesh);


	if (Model.checkFloor()) {
		floorMesh.receiveShadow = true;
		scene.add(floorMesh);
	}
	mesh.castShadow = true;
	scene.add(mesh);
	// add spotlight
	// let spotLight = new THREE.SpotLight(0xffffff, 2.0, 30); // distance
	// spotLight.name = "Spot Light";
	// spotLight.target = mesh;
	// requestAnimationFrame(render); // keep

	// let delta = 0;
	// function render() {
	// 	delta += 0.01;
	// 	camera2.lookAt(spotLight.position);

	// 	camera2.position.x = Math.sin(delta) * 5000;
	// 	camera2.position.z = Math.cos(delta) * 5000;
	// 	renderer.render(scene, camera2);
	// 	requestAnimationFrame(render);
	// }

	requestAnimationFrame(render); 
	function render() {
		mesh.rotation.x += 0.005;
		mesh.rotation.y += 0.005;
		renderer.render(scene, camera1);
		requestAnimationFrame(render);
	}
}

let selectShape = document.getElementById("shape");
selectShape.addEventListener('change', () => {
	fullRender();
});

let selectMaterial = document.getElementById("material");
selectMaterial.addEventListener('change', () => {
	fullRender();
});


let scaleSlider = document.getElementById("scale");
scaleSlider.oninput = function () {
	Model.getModel().scale = parseInt(this.value);
	fullRender();
}

let detailSlider = document.getElementById("detail");
detailSlider.oninput = function () {
	Model.getModel().detail = this.value;
	fullRender();
}

let metalnessSlider = document.getElementById("metalness");
metalnessSlider.oninput = function () {
	Model.getModel().metalness = this.value * 0.1 / 10;
	fullRender();
}

let roughnessSlider = document.getElementById("roughness");
roughnessSlider.oninput = function () {
	Model.getModel().roughness = this.value * 0.1 / 10;
	fullRender();
}

let intensitySlider = document.getElementById("intensity");
intensitySlider.oninput = function () {
	Model.getModel().intensity = this.value * 0.1 / 10;
	fullRender();
}

let objectColor = document.getElementById("object-color");
objectColor.addEventListener('input', () => {
	Model.getModel().objectColor = objectColor.value;
	fullRender();
})

let emissiveColor = document.getElementById("emissive-color");
emissiveColor.addEventListener('input', () => {
	Model.getModel().emissiveColor = emissiveColor.value;
	fullRender();
})

let specularColor = document.getElementById("specular-color");
specularColor.addEventListener('input', () => {
	Model.getModel().specularColor = specularColor.value;
	fullRender();
})


let toggleHemisphereLight = document.getElementById("Hemisphere-Light");
toggleHemisphereLight.addEventListener("click", () => {
	//let light = new THREE.HemisphereLight(0xffffff, 0x0808dd, 0.1);
	Model.getModel().hemisphereLight = toggleHemisphereLight.checked;
	fullRender();
});

let floorSwitch = document.getElementById("floor");
floorSwitch.addEventListener("change", () => {
	fullRender();
});


// let lightArr = document.getElementsByName("light");

// lightArr.forEach((light) => {
// 	light.addEventListener('change', () => {
// 		let lights = document.getElementsByName("light");
// 		let length = lights.length;
// 		for (let i = 0; i < length; i++) {
// 			let light = lights[i];
// 			Model.getModel().lightArr.set(light.id, light.checked);
// 		}
// 		fullRender();
// 	});
// })


// const changeValue = (field) => {
// 	document.getElementById(field).oninput = function() {
// 		let [field] = this.value;
// 		fullRender(field);
// 	}
// }

// update(field) {
// 	return e => this.setState({ [field]: e.target.value });
// }

