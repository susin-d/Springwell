
import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Map, Search, Layers, Droplets, TrendingDown, AlertTriangle } from 'lucide-react';
// FIX: Correctly import the now-exported IndiaStateMap component.
import { IndiaStateMap } from './IndiaStateMap';
import type { AiActionResponse } from '../../../services/geminiService';

export type MapLayer = 'none' | 'groundwater' | 'rainfall' | 'stress';

export interface Marker {
  lat: number;
  lng: number;
  popup: string;
}

export interface MapState {
  activeLayer: MapLayer;
  highlightedLocation: string | null;
  markers: Marker[];
}

interface InteractiveMapProps {
  mapState: MapState;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ mapState }) => {
  const [searchQuery, setSearchQuery] = useState('');
  // Internal state for UI interaction, synced with prop from dashboard
  const [currentMapState, setCurrentMapState] = useState<MapState>(mapState);

  useEffect(() => {
    setCurrentMapState(mapState);
    if (mapState.highlightedLocation) {
        setSearchQuery(mapState.highlightedLocation);
    }
  }, [mapState]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
        setCurrentMapState(prev => ({ ...prev, highlightedLocation: null }));
        return;
    };
    setCurrentMapState(prev => ({ ...prev, highlightedLocation: searchQuery }));
  };

  const setActiveLayer = (layer: MapLayer) => {
    setCurrentMapState(prev => ({...prev, activeLayer: layer}));
  }

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">Groundwater Interactive Map</h2>
        <p className="text-white/70">Visualize real-time groundwater data across India. Ask the AI to show you something!</p>
      </div>

      <Card className="p-2 flex-1 relative">
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-full max-w-md px-2">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search for a state to highlight..."
              className="h-12 pl-4 pr-12 shadow-lg bg-slate-900/70 backdrop-blur-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 hover:bg-white/20"
              onClick={handleSearch}
              aria-label="Search location"
            >
              <Search className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        <div className="h-full w-full bg-slate-900/50 rounded-lg flex items-center justify-center relative overflow-hidden">
          <IndiaStateMap
            activeLayer={currentMapState.activeLayer}
            highlightedLocation={currentMapState.highlightedLocation}
            markers={currentMapState.markers}
          />
          
          {currentMapState.activeLayer === 'none' && (
            <div className="text-center relative z-10 p-4 rounded-lg bg-black/30 pointer-events-none">
              <Map className="w-16 h-16 text-white/50 mx-auto mb-4" />
              <p className="text-white text-lg font-semibold">Interactive Map</p>
              <p className="text-white/60 text-sm">Select a layer to begin visualization</p>
            </div>
          )}
        </div>

        <Card className="absolute bottom-4 left-4 z-20 p-3 bg-slate-900/70 backdrop-blur-sm">
            <h4 className="text-sm font-semibold mb-2 flex items-center"><Layers className="w-4 h-4 mr-2" /> Map Layers</h4>
            <div className="flex flex-col space-y-2">
                <Button onClick={() => setActiveLayer('groundwater')} variant={currentMapState.activeLayer === 'groundwater' ? 'secondary' : 'ghost'} size="sm" className="justify-start"><TrendingDown className="w-4 h-4 mr-2" /> Groundwater</Button>
                <Button onClick={() => setActiveLayer('rainfall')} variant={currentMapState.activeLayer === 'rainfall' ? 'secondary' : 'ghost'} size="sm" className="justify-start"><Droplets className="w-4 h-4 mr-2" /> Rainfall</Button>
                <Button onClick={() => setActiveLayer('stress')} variant={currentMapState.activeLayer === 'stress' ? 'secondary' : 'ghost'} size="sm" className="justify-start"><AlertTriangle className="w-4 h-4 mr-2" /> Water Stress</Button>
                <Button onClick={() => setActiveLayer('none')} variant={currentMapState.activeLayer === 'none' ? 'secondary' : 'ghost'} size="sm" className="justify-start text-white/60">Clear Layer</Button>
            </div>
        </Card>
      </Card>
    </div>
  );
};
