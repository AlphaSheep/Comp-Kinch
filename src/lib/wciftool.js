export default function convertOfficialResultsToWCIFlike(results) {
  const { persons, personIDmap } = extractPersons(results)
  const events = extractEvents(results, personIDmap);
  let competition = {
    persons: persons,
    events: events
  };
  return competition;
}

function extractPersons(results) {
  let people = {};
  // We don't have a registrant ID, so we use the WCA ID as a 
  // temporary key, then generate registrant IDs as we need them.
  let registrantId = 1;
  for (let i in results) {
    let result = results[i];
    if (!people[result.wca_id]) {
      people[result.wca_id] = {
        name: result.name,
        registration: [result.event_id],
        registrantId: registrantId,
        wcaId: result.wca_id
      }
      registrantId++;
    } else {
      people[result.wca_id].registration = people[result.wca_id].registration.concat([result.event_id])
    }
  }
  return { 
    persons: Object.keys(people).map(id => people[id]), 
    personIDmap: people
  };
}

function extractEvents(results, personIDmap) {

  let events = {};
  for (let i in results) {
    const result = results[i];
    if (!events[result.event_id]) {
      events[result.event_id] = {
        id: result.event_id,
        rounds: {}
      };
    }
    let event = events[result.event_id];
    if (!event.rounds[result.round_type_id]) {
      event.rounds[result.round_type_id] = {
        format: result.round_type_id,
        results: []
      };
    }
    let roundResults = event.rounds[result.round_type_id].results;
    event.rounds[result.round_type_id].results = roundResults.concat(
      getResult(result, personIDmap));
  }  
  return eventAndRoundObjsToArrays(events);
}

function getResult(result, personIDmap) {
  return {
    personId: personIDmap[result.wca_id].registrantId,
    average: result.average,
    best: result.best,
  }
}

function eventAndRoundObjsToArrays(events) {
  events = Object.keys(events).map(id => events[id]);
  for (let i in events) {
    events[i].rounds = Object.keys(events[i].rounds).map(id => events[i].rounds[id])
  }
  return events;
}
