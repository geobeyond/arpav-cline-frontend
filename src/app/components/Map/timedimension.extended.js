import 'leaflet-timedimension';
import L from 'leaflet';
// import moment from 'moment';
// @ts-ignore
L.Control.TimeDimension = L.Control.TimeDimension.extend({
  _getDisplayDateFormat: function (date) {
    Object.keys(this._map._layers).forEach(layerId => {
      let x = this._map._layers[layerId];
      if (x && x._url && x._url.includes('/thredds/wms/', '')) {
        if (!x._url.includes(this._map.selected_path)) this._map.removeLayer(x);
        else this._map.setupFrontLayer(x, this._map);
      }
    });
    setTimeout(()=>{
        if(document.getElementsByClassName(
            'leaflet-bar-timecontrol',
          )[0].style.display !== 'none'){
            const url = new URL(window.location.href);
            if(url.searchParams.size > 2){
                if(url.searchParams.has('year')){
                    //url.searchParams.set('year', date.getFullYear().toString());
                } else {
                    url.searchParams.append('year', date.getFullYear().toString());
                }
                window.history.pushState(null, '', url.toString());
            }
        }
    }, 1000);
    // @ts-ignore
    return date.getFullYear();
  },
});

L.TimeDimension = L.TimeDimension.extend({
    prepareNextTimes: function(numSteps, howmany, loop){
        numSteps = 1; 

        var newIndex = this._currentTimeIndex;
        var currentIndex = newIndex;
        if (this._loadingTimeIndex > -1) {
            newIndex = this._loadingTimeIndex;
        }
        // assure synced layers have a buffer/cache of at least howmany elements
        for (var i = 0, len = this._syncedLayers.length; i < len; i++) {
            if (this._syncedLayers[i].setMinimumForwardCache) {
                this._syncedLayers[i].setMinimumForwardCache(howmany);
            }
        }
        var count = howmany;
        var upperLimit = this._upperLimit || this._availableTimes.length - 1;
        var lowerLimit = this._lowerLimit || 0;
        while (count > 0) {
            newIndex = newIndex + numSteps;
            if (newIndex > upperLimit) {
                if (!!loop) {
                    newIndex = lowerLimit;
                } else {
                    break;
                }
            }
            if (newIndex < lowerLimit) {
                if (!!loop) {
                    newIndex = upperLimit;
                } else {
                    break;
                }
            }
            if (currentIndex === newIndex) {
                //we looped around the timeline
                //no need to load further, the next times are already loading
                break;
            }
            
            count--;
        }
        }
});

L.TimeDimension.Layer.WMS.include({
  _getNearestTime: function(time){
    // override function to get the nearest time in the available times array
    // This is needed because the default function does not work properly with
    // time steps greater than one second
    if (this._layers.hasOwnProperty(time)) {
      return time;
  }
  if (this._availableTimes.length === 0) {
      return time;
  }
  var index = 0;
  var len = this._availableTimes.length;
  for (; index < len; index++) {
      if (time < this._availableTimes[index]) {
          break;
      }
  }
  if (index > 0 ){
    index-=1;
  }
 
  if (time !== this._availableTimes[index]) {
      
      
  }
  return this._availableTimes[index];
  }
});



L.TimeDimension.Util.parseTimesExpression =  function(times, overwritePeriod) {
    var result = [];
    if (!times) {
        return result;
    }
    if (typeof times == 'string' || times instanceof String) {
        var timeRanges = times.split(",");
        var timeRange;
        var timeValue;
        for (var i=0, l=timeRanges.length; i<l; i++){
            timeRange = timeRanges[i];
            if (timeRange.split("/").length === 3) {
                result = result.concat(this.parseAndExplodeTimeRange(timeRange, overwritePeriod));
            } else {
                timeValue = Date.parse(timeRange.trim());
                if (!isNaN(timeValue)) {
                    result.push(timeValue);
                }
            }
        }
    } else {
        result = times;
    }
    return result.sort(function(a, b) {
        return a - b;
    });
}