import React from 'react';

class EventName extends React.Component {
  constructor (props) {
    super(props)

    const eventNameMap = {
      "222": "2x2x2 Cube",
      "333": "3x3x3 Cube",
      "444": "4x4x4 Cube",
      "555": "5x5x5 Cube",
      "666": "6x6x6 Cube",
      "777": "7x7x7 Cube",
      "333bf": "3x3x3 Blindfolded",
      "333fm": "3x3x3 Fewest Moves",
      "333oh": "3x3x3 One-Handed",
      "clock": "Clock",
      "minx": "Megaminx",
      "pyram": "Pyraminx",
      "skewb": "Skewb",
      "sq1": "Square-1",
      "444bf": "4x4x4 Blindfolded",
      "555bf": "5x5x5 Blindfolded",
      "333mbf": "3x3x3 Multi-Blind",
      "333ft": "3x3x3 With Feet"
    };

    this.eventName = eventNameMap[props.eventid];
  }

  render() {
    return <div className="event-name">
      <div>
        <span className={`cubing-icon event-${this.props.eventid}`}></span>
      </div>      
    </div>
  }
}

export default EventName