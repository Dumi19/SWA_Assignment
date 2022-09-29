function commonData(place, type, unit, time) {
    const getPlace = () => place
    const getType = () => type
    const getUnit = () => unit
    const getTime = () => time
    return { getPlace, getType, getUnit, getTime }
  }
  
  function forecast({data, from, to, place, type, unit, time, precipitation_types, directions}) {
    if(data === undefined) data = commonData(place, type, unit, time)
    const getPrecipitationTypes = () => precipitation_types
    const getDirections = () => directions
    const getFrom = () => from
    const getTo = () => to
    return { getFrom, getTo, getPrecipitationTypes, getDirections, data}
  }
  
  function weatherData({data, value, type, unit, time, place}) {
    if(data === undefined) data = commonData(place, type, unit, time)
    const getValue = () => value
    return { getValue, data}
  }