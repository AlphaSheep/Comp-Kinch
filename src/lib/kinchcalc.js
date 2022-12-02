const ALLOW_SINGLE_EVENTS = ["333fm", "333bf", "444bf", "555bf", "333mbf"];
const MULTI_EVENT = "333mbf";

export default function get_kinch_table_from_wcif(competition) {

  const kinch = calculateKinchTable(competition);
  const { has_result, complete } = checkHasCompleteResults(kinch);
  const people = getPeopleNameMap(competition.persons)  
  const columns = ["rank", "name", "total", ...Object.keys(kinch)];
  const results_table = buildResultsTable(kinch, people);

  return {
    has_result: has_result,
    complete: complete,
    results_table: results_table,
    columns: columns
  }
}

function buildResultsTable(kinch, people) {
  let results_table = [];
  for (let i in people) {
    let item = {
      "rank": null,
      "name": people[i]
    };
    let score = 0;
    for (let j in kinch) {
      item[j] = kinch[j][i] ? kinch[j][i] : 0;
      score += item[j];
    }
    item["total"] = score / Object.keys(kinch).length;
    item["key"] = i;
    results_table = results_table.concat(item)
  }

  results_table = sortResultsAndAddRank(results_table);

  return results_table;
}

function calculateKinchTable(competition) {
  const events = competition.events;
  let kinch = {};

  for (let i in events) {
    const event = events[i];
    let results;
    if (ALLOW_SINGLE_EVENTS.includes(event.id)) {
      results = extractSingleOrAverageResults(event);
    } else {
      results = extractResults(event);
    }
    kinch[event.id] = calcKinchForEvent(results);
  }
  return kinch;
}

function sortResultsAndAddRank(results) {
  results.sort((a,b) => b.total - a.total);
  for (let i in results) {
    results[i]["rank"] = Number(i)+1;
  }
  return results;
}

function getPeopleNameMap(people) {
  let namemap = {}
  for (let i in people) {
    const person = people[i];
    if (person.registration) {
      namemap[person.registrantId] = person.name;
    }
  }
  return namemap;
}

function checkHasCompleteResults(results) {
  let has_result = false;
  let complete = true;
  for (let event in results) {   
    if (Object.keys(results[event]).length == 0) {
      complete = false;
    } else {
      has_result = true;
    }
  }

  return {
    has_result: has_result,
    complete: complete
  };
}

function extractResults(event, resultType='average') {
  const rounds = event.rounds;
  let results = {};
  for (let i in rounds) {
    const round = rounds[i];    
    for (let j in round.results) {
      const resultObj = round.results[j];
      const oldResult = results[resultObj.personId]
      let newResult = resultObj[resultType]

      if (event.id === MULTI_EVENT && newResult > 0) {
        newResult = interpretMultiResult(newResult);
      }

      if (oldResult < newResult || newResult <= 0) {
        results[resultObj.personId] = oldResult;
      } else {
        results[resultObj.personId] = newResult;
      }
    }
  }
  return results
}

function extractSingleOrAverageResults(event) {
  const average = extractResults(event, 'average');
  const single = extractResults(event, 'best');
  return [single, average];
}

function calcKinchForEvent(results) {

  if (Array.isArray(results)) {
    const single = calcKinchForEventNoCompare(results[0]);
    const average = calcKinchForEventNoCompare(results[1]);
    let result = single;
    for (let i in result) {
      if (average[i] > result[i]) {
        result[i] = average[i];
      }
    }
    return result;
  } else {
    return calcKinchForEventNoCompare(results)
  }
}

function calcKinchForEventNoCompare(results) {
  const record = getBestResult(results);
  let kinch = {...results}

  for (let personId in results) {
    kinch[personId] = record / results[personId] * 100;
  }
  return kinch;
}

function getBestResult(results) {
  const values = Object.values(results)
  return Math.min(...(values.filter(value => value)));
}

function interpretMultiResult(result) {
  const points = 99 - Math.floor(result/1e7);
  const time = Math.floor(result/100 - (99-points)*1e5);
  return (1/(points + ((3600 - time) / 3600)));
}
