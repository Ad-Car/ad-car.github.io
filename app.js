let existingIntervals = false
let earthworks
let fileContent
let activeLayer = document.getElementById('visible-layer')

const map = L.map('map').setView([52.561928, -1.464854],7)

L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', { attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors' }).addTo(map);


map.addEventListener('click', function() {
	existingIntervals? existingIntervals = false : existingIntervals = true
	earthworks.remove()
	earthworks = L.geoJSON(JSON.parse(fileContent),{style:styleClientLinears, onEachFeature:processClientLinears}).addTo(map)
	if(existingIntervals) {
		activeLayer.innerHTML=''
		activeLayer.insertAdjacentHTML('beforeend', 'Earthworks classified by existing interval')}
	else {
		activeLayer.innerHTML=''
		activeLayer.insertAdjacentHTML('beforeend', 'Earthworks classified by proposed interval')}
})

document.getElementById('input').addEventListener('change', function(e) {
	let file = document.getElementById('input').files[0];
	(async () => {
		fileContent = await file.text();
		earthworks = L.geoJSON(JSON.parse(fileContent),{style:styleClientLinears, onEachFeature:processClientLinears}).addTo(map)
		map.fitBounds(earthworks.getBounds())
		activeLayer.insertAdjacentHTML('beforeend', 'Earthworks classified by proposed interval');
	})()
});

function styleClientLinears(json) {

	let att = json.properties

	if(!existingIntervals) {
	if(att.FIF >= 1 && att.FIF <=3) return {color:'#ff860d'}
	if(att.FIF >= 4 && att.FIF <=7) return {color:'#5983b0'}
	if(att.FIF >= 8 && att.FIF <=9) return {color:'#81aca6'}
	if(att.FIF === 10) return {color:'#3faf46'}
	} else {
	if(att.PIRP >= 1 && att.PIRP <=3) return {color:'#ff860d'}
	if(att.PIRP >= 4 && att.PIRP <=7) return {color:'#5983b0'}
	if(att.PIRP >= 8 && att.PIRP <=9) return {color:'#81aca6'}
	if(att.PIRP === 10) return {color:'#3faf46'}
	}
}

function processClientLinears(json, lyr) {
	let att = json.properties
	lyr.bindTooltip(att.id+": "+att.PIRP+" > "+att.PSRF+ " [" +att.FIF+"]", {direction:"top"})
}

