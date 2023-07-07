let existingIntervals = false
let earthworks
let fileContent
let activeLayer = document.getElementById('visible-layer')
let sidebar = document.querySelector('.sidebar')

const map = L.map('map').setView([52.561928, -1.464854],7)

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', { attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012' }).addTo(map);

sidebar.classList.add('hidden')

map.addEventListener('click', function() {
	existingIntervals? existingIntervals = false : existingIntervals = true
	earthworks.remove()
	earthworks = L.geoJSON(JSON.parse(fileContent),{style:styleClientLinears, onEachFeature:processClientLinears}).addTo(map)

	toggleLegend(existingIntervals)
})

document.getElementById('input').addEventListener('change', function(e) {
	let file = document.getElementById('input').files[0];
	(async () => {
		fileContent = await file.text();

		if(earthworks) earthworks.remove()

		earthworks = L.geoJSON(JSON.parse(fileContent),{style:styleClientLinears, onEachFeature:processClientLinears}).addTo(map)
		map.fitBounds(earthworks.getBounds());

		existingIntervals = false
		toggleLegend(existingIntervals)

		sidebar.classList.remove('hidden')
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

function toggleLegend(existingIntervals) {
  const status = existingIntervals ? "existing" : "proposed"
  activeLayer.innerText = `Earthworks classified by ${status} interval`;
}
