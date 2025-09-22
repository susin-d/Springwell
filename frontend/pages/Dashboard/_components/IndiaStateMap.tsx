
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker as LeafletMarker, Popup } from 'react-leaflet';
import { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { MapLayer, Marker } from './InteractiveMap';

interface IndiaStateMapProps {
    activeLayer: MapLayer;
    highlightedLocation: string | null;
    markers: Marker[];
}

interface StateData {
    groundwater: number;
    rainfall: number;
    stress: number;
}


// Color scales (0: good, 1: warning, 2: critical)
const layerColors: Record<MapLayer, string[]> = {
    none: [],
    groundwater: ['fill-blue-500', 'fill-orange-400', 'fill-red-500'],
    rainfall: ['fill-orange-400', 'fill-cyan-400', 'fill-blue-500'],
    stress: ['fill-emerald-500', 'fill-yellow-400', 'fill-red-500'],
};

const statePaths: Record<string, string> = {
    'Andaman and Nicobar Islands': "M512.2,461.3l-1.3,4.3l-0.8,4.3l-0.3,2.5l0.3,2.2l1.3,3.8l0.5,3.3l-1,1.5l-0.8,2.3l0.5,2.5l-0.5,1.5l0.8,2.3l-0.5,1.5l0.5,2.5l-0.5,1.5l0.8,2.3l-0.5,1.5l0.5,2.5l-0.5,1.5l0.8,2.3l-0.5,1.5l0.5,2.5l-0.5,1.5l0.8,2.3l-0.5,1.5l0.5,2.5l-0.5,1.5l0.8,2.3l-0.5,1.5l0.5,2.5l-0.5,1.5l0.8,2.3l-0.5,1.5l0.5,2.5",
    'Andhra Pradesh': "M349.5,417.8l-1.1-5.2l-2.6-2.9l-2.8-0.3l-2.8,2.6l-3.2,1.6l-3.9,0.2l-3.3,2l-2.9-0.8l-2.3-2.6l-2.9,0.3l-3.9,2.6l-1.6,4.6l-2.6,3.6l-1.6,3.6l0.3,3.3l2.3,3.3l3.6,2.3l4.9,1.3l5.2,0.3l4.6-1.3l4.2-2.3l3.6-3.6l2.9-4.9l1.6-5.2l-0.3-4.6l-1.3-4.2",
    'Arunachal Pradesh': "M524.5,203.8l-4.9-1.3l-4.6,0.3l-4.2,2.3l-3.6,3.6l-2.9,4.9l-1.6,5.2l0.3,4.6l1.3,4.2l2.6,3.9l3.9,2.6l4.9,1.3l5.2,0.3l4.6-1.3l4.2-2.3l3.6-3.6l2.9-4.9l1.6-5.2l-0.3-4.6l-1.3-4.2l-2.6-3.9l-3.9-2.6l-4.9-1.3l-5.2-0.3l-4.6,1.3",
    'Assam': "M511.5,248.8l-3.9-2.6l-4.9-1.3l-5.2-0.3l-4.6,1.3l-4.2,2.3l-3.6,3.6l-2.9,4.9l-1.6,5.2l0.3,4.6l1.3,4.2l2.6,3.9l3.9,2.6l4.9,1.3l5.2,0.3l4.6-1.3l4.2-2.3l3.6-3.6l2.9-4.9l1.6-5.2l-0.3-4.6l-1.3-4.2l-2.6-3.9",
    'Bihar': "M439.5,263.8l-4.2,2.3l-3.6,3.6l-2.9,4.9l-1.6,5.2l0.3,4.6l1.3,4.2l2.6,3.9l3.9,2.6l4.9,1.3l5.2,0.3l4.6-1.3l4.2-2.3l3.6-3.6l2.9-4.9l-3.6-3.6l-2.9-4.9l-1.6-5.2",
    'Chandigarh': "M328,181 l 3,0 l 0,3 l -3,0 Z",
    'Chhattisgarh': "M392.5,337.8l-2.9,4.9l-1.6,5.2l0.3,4.6l1.3,4.2l2.6,3.9l3.9,2.6l4.9,1.3l5.2,0.3l4.6-1.3l4.2-2.3l3.6-3.6l2.9-4.9l-1.6-5.2l-0.3-4.6l-1.3-4.2l-2.6-3.9",
    'Dadra and Nagar Haveli and Daman and Diu': "M252,366 l 4,0 l 1,3 l -2,2 l-3,-1 Z",
    'Delhi': "M325,200 l 5,0 l 1,4 l -6,1 Z",
    'Goa': "M266.5,456.8l-0.3-4.6l-1.3-4.2l-2.6-3.9l-3.9-2.6l-4.9-1.3l-5.2-0.3l-4.6,1.3l4.2,2.3l3.6,3.6l2.9,4.9l1.6,5.2l0.3,4.6l1.3,4.2",
    'Gujarat': "M199.5,299.8l-2.6-3.9l-3.9-2.6l-4.9-1.3l-5.2-0.3l-4.6,1.3l-4.2,2.3l-3.6,3.6l-2.9,4.9l-1.6,5.2l0.3,4.6l1.3,4.2l2.6,3.9l3.9,2.6l4.9,1.3l5.2,0.3l4.6-1.3l4.2-2.3l3.6-3.6l2.9-4.9l1.6-5.2",
    'Haryana': "M312.5,198.8l-2.9,4.9l-1.6,5.2l0.3,4.6l1.3,4.2l2.6,3.9l3.9,2.6l4.9,1.3l5.2,0.3l4.6-1.3l4.2-2.3l3.6-3.6l-2.9-4.9l-1.6-5.2l-0.3-4.6",
    'Himachal Pradesh': "M331.5,152.8l-3.6,3.6l-2.9,4.9l-1.6,5.2l0.3,4.6l1.3,4.2l2.6,3.9l3.9,2.6l4.9,1.3l5.2,0.3l4.6-1.3l4.2-2.3l-3.6-3.6l-2.9-4.9l-1.6-5.2l-0.3-4.6l-1.3-4.2",
    'Jammu and Kashmir': "M308.5,116.8l-2.9-4.9l-1.6-5.2l0.3,4.6l1.3,4.2l2.6,3.9l3.9,2.6l4.9,1.3l5.2,0.3l4.6-1.3l4.2-2.3l3.6-3.6l2.9-4.9l1.6-5.2l-0.3-4.6l-1.3-4.2l-2.6-3.9l-3.9-2.6l-4.9-1.3l-5.2-0.3l-4.6,1.3",
    'Jharkhand': "M435.5,302.8l-3.9,2.6l4.9,1.3l5.2,0.3l4.6-1.3l4.2-2.3l3.6-3.6l2.9-4.9l1.6-5.2l-0.3-4.6l-1.3-4.2l-2.6-3.9l-3.9-2.6l-4.9-1.3",
    'Karnataka': "M294.5,450.8l-1.6,5.2l0.3,4.6l1.3,4.2l2.6,3.9l3.9,2.6l4.9,1.3l5.2,0.3l4.6-1.3l4.2-2.3l3.6-3.6l2.9-4.9l1.6-5.2l-0.3-4.6l-1.3-4.2l-2.6-3.9l-3.9-2.6l-4.9-1.3",
    'Kerala': "M299.5,528.8l0.3,4.6l1.3,4.2l2.6,3.9l3.9,2.6l4.9,1.3l5.2,0.3l4.6-1.3l4.2-2.3l3.6-3.6l-2.9-4.9l-1.6-5.2l-0.3-4.6l-1.3-4.2l-2.6-3.9l-3.9-2.6",
    'Ladakh': "M341.2,73.4l-1.1-5.2l-2.6-2.9l-2.8-0.3l-2.8,2.6l-3.2,1.6l-3.9,0.2l-3.3,2l-2.9-0.8l-2.3-2.6l-2.9,0.3l-3.9,2.6l-1.6,4.6l-2.6,3.6l-1.6,3.6l0.3,3.3l2.3,3.3l3.6,2.3l4.9,1.3l5.2,0.3l4.6-1.3l4.2-2.3l3.6-3.6l2.9-4.9l1.6-5.2",
    'Lakshadweep': "M202.2,501.3l-1.3,4.3l-0.8,4.3l-0.3,2.5l0.3,2.2l1.3,3.8l0.5,3.3l-1,1.5l-0.8,2.3l0.5,2.5",
    'Madhya Pradesh': "M320.5,304.8l-3.6,3.6l-2.9,4.9l-1.6,5.2l0.3,4.6l1.3,4.2l2.6,3.9l3.9,2.6l4.9,1.3l5.2,0.3l4.6-1.3l4.2-2.3l3.6-3.6l2.9-4.9l1.6-5.2l-0.3-4.6l-1.3-4.2l-2.6-3.9l-3.9-2.6",
    'Maharashtra': "M281.5,354.8l-2.9,4.9l-1.6,5.2l0.3,4.6l1.3,4.2l2.6,3.9l3.9,2.6l4.9,1.3l5.2,0.3l4.6-1.3l4.2-2.3l3.6-3.6l2.9-4.9l1.6-5.2l-0.3-4.6l-1.3-4.2l-2.6-3.9l-3.9-2.6l-4.9-1.3",
    'Manipur': "M529.5,273.8l-1.6,5.2l0.3,4.6l1.3,4.2l2.6,3.9l3.9,2.6l4.9,1.3l5.2,0.3l4.6-1.3l4.2-2.3l-3.6-3.6l-2.9-4.9l-1.6-5.2",
    'Meghalaya': "M495.5,250.8l-1.3-4.2l-2.6-3.9l-3.9-2.6l-4.9-1.3l-5.2-0.3l-4.6,1.3l-4.2,2.3l3.6,3.6l2.9,4.9l1.6,5.2l0.3,4.6l1.3,4.2",
    'Mizoram': "M518.5,291.8l-0.3-4.6l-1.3-4.2l-2.6-3.9l-3.9-2.6l-4.9-1.3l-5.2-0.3l-4.6,1.3l4.2,2.3l3.6,3.6l2.9,4.9l1.6,5.2l0.3,4.6l1.3,4.2",
    'Nagaland': "M534.5,243.8l-4.9-1.3l-5.2-0.3l-4.6,1.3l-4.2,2.3l3.6,3.6l2.9,4.9l1.6,5.2l0.3,4.6l1.3,4.2l2.6,3.9l3.9,2.6",
    'Odisha': "M420.5,356.8l-4.2,2.3l-3.6,3.6l-2.9,4.9l-1.6,5.2l0.3,4.6l1.3,4.2l2.6,3.9l3.9,2.6l4.9,1.3l5.2,0.3l4.6-1.3l4.2-2.3l3.6-3.6l2.9-4.9l-1.6-5.2",
    'Puducherry': "M346,499 l 3,1 l 1,3 l -3,1 Z",
    'Punjab': "M299.5,160.8l-3.6,3.6l-2.9,4.9l-1.6,5.2l0.3,4.6l1.3,4.2l2.6,3.9l3.9,2.6l4.9,1.3l5.2,0.3l4.6-1.3l4.2-2.3l-3.6-3.6l-2.9-4.9",
    'Rajasthan': "M259.5,240.8l-2.6-3.9l-3.9-2.6l-4.9-1.3l-5.2-0.3l-4.6,1.3l-4.2,2.3l-3.6,3.6l-2.9,4.9l-1.6,5.2l0.3,4.6l1.3,4.2l2.6,3.9l3.9,2.6l4.9,1.3l5.2,0.3l4.6-1.3l4.2-2.3l3.6-3.6l2.9-4.9l1.6-5.2l-0.3-4.6",
    'Sikkim': "M465.5,214.8l-2.9,4.9l-1.6,5.2l0.3,4.6l1.3,4.2l2.6,3.9l3.9,2.6l4.9,1.3l5.2,0.3l4.6-1.3l4.2-2.3l-3.6-3.6",
    'Tamil Nadu': "M324.5,508.8l-2.9,4.9l-1.6,5.2l0.3,4.6l1.3,4.2l2.6,3.9l3.9,2.6l4.9,1.3l5.2,0.3l4.6-1.3l4.2-2.3l3.6-3.6l2.9-4.9l1.6-5.2l-0.3-4.6l-1.3-4.2l-2.6-3.9l-3.9-2.6",
    'Telangana': "M328.5,392.8l-3.6,3.6l-2.9,4.9l-1.6,5.2l0.3,4.6l1.3,4.2l2.6,3.9l3.9,2.6l4.9,1.3l5.2,0.3l4.6-1.3l4.2-2.3l-3.6-3.6l-2.9-4.9l-1.6-5.2",
    'Tripura': "M512.5,283.8l-2.9,4.9l-1.6,5.2l0.3,4.6l1.3,4.2l2.6,3.9l3.9,2.6l4.9,1.3l5.2,0.3l4.6-1.3l4.2-2.3l-3.6-3.6",
    'Uttar Pradesh': "M360.5,237.8l-3.6,3.6l-2.9,4.9l-1.6,5.2l0.3,4.6l1.3,4.2l2.6,3.9l3.9,2.6l4.9,1.3l5.2,0.3l4.6-1.3l4.2-2.3l3.6-3.6l2.9-4.9l1.6-5.2l-0.3-4.6l-1.3-4.2",
    'Uttarakhand': "M352.5,178.8l-2.9,4.9l-1.6,5.2l0.3,4.6l1.3,4.2l2.6,3.9l3.9,2.6l4.9,1.3l5.2,0.3l4.6-1.3l4.2-2.3l-3.6-3.6l-2.9-4.9l-1.6-5.2",
    'West Bengal': "M460.5,288.8l-3.9,2.6l4.9,1.3l5.2,0.3l4.6-1.3l4.2-2.3l3.6-3.6l2.9-4.9l1.6-5.2l-0.3-4.6l-1.3-4.2l-2.6-3.9l-3.9-2.6l-4.9-1.3l-5.2-0.3l-4.6,1.3l-4.2,2.3",
};


export const IndiaStateMap: React.FC<IndiaStateMapProps> = ({ activeLayer, highlightedLocation, markers }) => {
    const [stateData, setStateData] = useState<Record<string, StateData>>({});
    const [geoJson, setGeoJson] = useState<any>(null);

    useEffect(() => {
        // Fetch GeoJSON for India states
        const fetchGeoJson = async () => {
            try {
                const response = await fetch('https://raw.githubusercontent.com/datameet/maps/master/india.json');
                if (response.ok) {
                    const data = await response.json();
                    setGeoJson(data);
                } else {
                    console.error('Failed to fetch GeoJSON');
                }
            } catch (error) {
                console.error('Error fetching GeoJSON:', error);
            }
        };

        // Fetch data from API
        const fetchData = async () => {
            try {
                const response = await fetch('https://indiawris.gov.in/wris/api/groundwater-data');
                if (response.ok) {
                    const data = await response.json();
                    setStateData(data);
                } else {
                    console.error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchGeoJson();
        fetchData();
    }, []);

    const getColor = (value: number) => {
        if (activeLayer === 'groundwater') return value === 0 ? '#10b981' : value === 1 ? '#f59e0b' : '#ef4444';
        if (activeLayer === 'rainfall') return value === 0 ? '#f59e0b' : value === 1 ? '#06b6d4' : '#3b82f6';
        if (activeLayer === 'stress') return value === 0 ? '#10b981' : value === 1 ? '#eab308' : '#ef4444';
        return '#64748b';
    };

    const style = (feature: any) => {
        const stateName = feature.properties.NAME_1 || feature.properties.name;
        const data = stateData[stateName];
        let fillColor = '#64748b';
        if (activeLayer !== 'none' && data) {
            const value = data[activeLayer];
            fillColor = getColor(value);
        }
        const isHighlighted = highlightedLocation && stateName && stateName.toLowerCase().includes(highlightedLocation.toLowerCase());
        return {
            fillColor,
            weight: isHighlighted ? 4 : 2,
            opacity: 1,
            color: isHighlighted ? '#06b6d4' : '#374151',
            fillOpacity: 0.7,
        };
    };

    console.log("IndiaStateMap rendering", { activeLayer, highlightedLocation });
    return (
        <MapContainer center={[20.5937, 78.9629]} zoom={5} className="w-full h-full">
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {geoJson && (
                <GeoJSON data={geoJson} style={style} />
            )}
            {markers.map((marker, index) => (
                <LeafletMarker key={index} position={[marker.lat, marker.lng]}>
                    <Popup>{marker.popup}</Popup>
                </LeafletMarker>
            ))}
        </MapContainer>
    );
};
