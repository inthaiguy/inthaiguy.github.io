const googleSheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRbtuzLo29gaOYk7AYUM-DTnStDT-hpmsWz_0yHZeDVoHVzTaMeBpixNiZrxRNKVM_83C0pJ2eqPHqK/pub?gid=0&single=true&output=csv';
const routeState = {
    checkins: [],
    currentIndex: 0,
    markerLayer: null,
    map: null,
    planeMarker: null,
    playTimer: null,
    routeLine: null
};

function parseCsv(csvText) {
    const rows = [];
    let currentCell = '';
    let currentRow = [];
    let insideQuotes = false;

    for (let i = 0; i < csvText.length; i++) {
        const char = csvText[i];
        const nextChar = csvText[i + 1];

        if (char === '"' && nextChar === '"') {
            currentCell += '"';
            i++;
        } else if (char === '"') {
            insideQuotes = !insideQuotes;
        } else if (char === ',' && !insideQuotes) {
            currentRow.push(currentCell.trim());
            currentCell = '';
        } else if ((char === '\n' || char === '\r') && !insideQuotes) {
            if (char === '\r' && nextChar === '\n') {
                i++;
            }
            currentRow.push(currentCell.trim());
            if (currentRow.some(Boolean)) {
                rows.push(currentRow);
            }
            currentCell = '';
            currentRow = [];
        } else {
            currentCell += char;
        }
    }

    currentRow.push(currentCell.trim());
    if (currentRow.some(Boolean)) {
        rows.push(currentRow);
    }

    return rows;
}

function parseCheckinDate(value) {
    const normalized = value
        .replace(' at ', ' ')
        .replace(/^([A-Z][a-z]{2})-/, '$1 ')
        .replace(/(\d{1,2})(AM|PM)$/i, '$1 $2');
    const parsed = new Date(normalized);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function parseGps(value) {
    if (!value) {
        return null;
    }

    const parts = value.split(',').map(part => Number(part.trim()));
    if (parts.length !== 2 || parts.some(Number.isNaN)) {
        return null;
    }

    return parts;
}

function formatDate(date) {
    return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

function buildCheckins(rows) {
    return rows.slice(1)
        .map(row => {
            const date = parseCheckinDate(row[0]);
            const gps = parseGps(row[3]);

            if (!date || !gps) {
                return null;
            }

            return {
                date,
                location: row[1],
                place: row[2],
                latLng: gps
            };
        })
        .filter(Boolean)
        .sort((a, b) => a.date - b.date);
}

function renderPanel(checkins) {
    const first = checkins[0];
    const latest = checkins[checkins.length - 1];
    document.getElementById('stop-count').textContent = checkins.length;
    document.getElementById('first-date').textContent = formatDate(first.date);
    document.getElementById('latest-date').textContent = formatDate(latest.date);
    document.getElementById('summary').textContent = `A timestamped path through Foursquare check-ins, connected in the order they happened.`;

    const timeline = document.getElementById('timeline');
    timeline.max = checkins.length - 1;
    timeline.value = 0;
}

function markerIcon(className) {
    return L.divIcon({
        className,
        iconSize: [12, 12]
    });
}

function currentDotIcon() {
    return L.divIcon({
        className: 'current-dot-marker',
        iconSize: [16, 16],
        iconAnchor: [8, 8]
    });
}

function markerPopup(checkin) {
    return `<strong>${checkin.place}</strong><br>${checkin.location}<br>${checkin.date.toLocaleString()}`;
}

function markerIndexesFor(index) {
    const markerIndexes = new Set([0, index]);
    const interval = Math.max(1, Math.floor((index + 1) / 50));

    for (let i = 0; i <= index; i++) {
        if (i % interval === 0) {
            markerIndexes.add(i);
        }
    }

    return markerIndexes;
}

function renderStep(index, shouldPan = true) {
    const checkins = routeState.checkins;
    const safeIndex = Math.max(0, Math.min(index, checkins.length - 1));
    routeState.currentIndex = safeIndex;

    const current = checkins[safeIndex];
    const visiblePath = checkins.slice(0, safeIndex + 1).map(checkin => checkin.latLng);

    routeState.routeLine.setLatLngs(visiblePath);
    routeState.markerLayer.clearLayers();

    markerIndexesFor(safeIndex).forEach(markerIndex => {
        const checkin = checkins[markerIndex];
        const className = markerIndex === safeIndex ? 'stop-marker current-marker' : 'stop-marker';
        L.marker(checkin.latLng, { icon: markerIcon(className) })
            .bindPopup(markerPopup(checkin))
            .addTo(routeState.markerLayer);
    });

    routeState.planeMarker.setLatLng(current.latLng);
    routeState.planeMarker.bindPopup(`Current: ${current.place}`);

    document.getElementById('timeline').value = safeIndex;
    document.getElementById('summary').textContent = `Showing ${safeIndex + 1} of ${checkins.length} check-ins in date order.`;
    document.getElementById('current-stop').innerHTML = `<strong>${current.place}</strong><span>${current.location} · ${current.date.toLocaleString()}</span>`;

    if (shouldPan) {
        routeState.map.setView(current.latLng, routeState.map.getZoom(), { animate: false });
    }
}

function stopPlayback() {
    window.clearInterval(routeState.playTimer);
    routeState.playTimer = null;
    document.getElementById('play-pause').textContent = 'Play';
}

function startPlayback() {
    const playButton = document.getElementById('play-pause');
    playButton.textContent = 'Pause';

    if (routeState.currentIndex >= routeState.checkins.length - 1) {
        renderStep(0);
    }

    routeState.playTimer = window.setInterval(() => {
        if (routeState.currentIndex >= routeState.checkins.length - 1) {
            stopPlayback();
            return;
        }

        renderStep(routeState.currentIndex + 1);
    }, 350);
}

function setupTimelineControls() {
    const playButton = document.getElementById('play-pause');
    const timeline = document.getElementById('timeline');

    playButton.addEventListener('click', () => {
        if (routeState.playTimer) {
            stopPlayback();
        } else {
            startPlayback();
        }
    });

    timeline.addEventListener('input', event => {
        stopPlayback();
        renderStep(Number(event.target.value));
    });
}

function renderMap(checkins) {
    const map = L.map('map', {
        scrollWheelZoom: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);

    routeState.checkins = checkins;
    routeState.map = map;

    routeState.routeLine = L.polyline([], {
        className: 'flight-line',
        color: '#2563eb',
        dashArray: '12 12',
        opacity: 0.8,
        weight: 3
    }).addTo(map);

    routeState.markerLayer = L.layerGroup().addTo(map);
    routeState.planeMarker = L.marker(checkins[0].latLng, {
        icon: currentDotIcon()
    }).addTo(map);

    map.setView(checkins[0].latLng, 11);
    setupTimelineControls();
    renderStep(0, false);
}

async function loadTravels() {
    try {
        const response = await fetch(googleSheetUrl);
        if (!response.ok) {
            throw new Error(`CSV request failed: ${response.status}`);
        }

        const csv = await response.text();
        const checkins = buildCheckins(parseCsv(csv));
        if (!checkins.length) {
            throw new Error('No check-ins with GPS coordinates found');
        }

        renderPanel(checkins);
        renderMap(checkins);
    } catch (error) {
        console.error('Error loading travels:', error);
        document.getElementById('summary').textContent = 'Travel map unavailable.';
    }
}

document.addEventListener('DOMContentLoaded', loadTravels);
