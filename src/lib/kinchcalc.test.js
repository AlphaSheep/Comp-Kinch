import getKinchTableFromWCIF from './kinchcalc';


const FIRST_PERSON = {
  name: "First Person",
  registration: {},
  registrantId: 1,
  wcaId: "2123EXMP01"
};
const SOMEONE_ELSE = {
  name: "Someone Else",
  registration: {},
  registrantId: 2,
  wcaId: "2042ELSE01"
}
const EXTRA_PERSON = {
  name: "Extra Person",
  registration: {},
  registrantId: 3,
  wcaId: "2000EXTR01"
}
const NOT_REGISTERED = {
  name: "Not Registered",
  registration: null,
  registrantId: 4,
  wcaId: "2000NORG01"
}



const BASE_EXAMPLE_WCIF_ONE_EVENT = {
  persons: [
    FIRST_PERSON,
    SOMEONE_ELSE
  ],
  events: [
    {
      id: '333',
      rounds: [
        {
          format: 'f',
          results: [
            {
              personId: 1,
              average: 80,
              best: 123
            },
            {
              personId: 2,
              average: 60,
              best: 456
            }
          ]
        }
      ]
    }
  ]
}

const BASE_EXAMPLE_WCIF_TWO_EVENTS = {
  persons: [
    FIRST_PERSON,
    SOMEONE_ELSE,
    EXTRA_PERSON
  ],
  events: [
    {
      id: '333',
      rounds: [
        {
          format: 'f',
          results: [
            {
              personId: 1,
              average: 80,
              best: 123
            },
            {
              personId: 2,
              average: 60,
              best: 456
            }
          ]
        }
      ]
    },
    {
      id: '222',
      rounds: [
        {
          format: 'f',
          results: [
            {
              personId: 1,
              average: 90,
              best: 123
            },
            {
              personId: 3,
              average: 60,
              best: 456
            }
          ]
        }
      ]
    }
  ]
}

test("competition with one event", () => {
  const data = BASE_EXAMPLE_WCIF_ONE_EVENT;

  const { has_result, complete, results_table, columns } = getKinchTableFromWCIF(data);
  
  expect(has_result).toBe(true);
  expect(complete).toBe(true);
  expect(columns).toEqual(["rank", "name", "total", "333"]);
  expect(results_table.length).toBe(2);

  expect(results_table[0]['333']).toBe(100);
  expect(results_table[0]['total']).toBe(100);
  expect(results_table[0]['name']).toBe(SOMEONE_ELSE.name);  
  expect(results_table[0]['rank']).toBe(1);
  expect(results_table[1]['333']).toBeCloseTo(75);
  expect(results_table[1]['total']).toBeCloseTo(75);
  expect(results_table[1]['name']).toBe(FIRST_PERSON.name);
  expect(results_table[1]['rank']).toBe(2);
}) 

test("person with who did not compete gets zero", () => {
  const data = BASE_EXAMPLE_WCIF_ONE_EVENT;
  data.persons[2] = EXTRA_PERSON;

  const { has_result, complete, results_table, columns } = getKinchTableFromWCIF(data);
  
  expect(has_result).toBe(true);
  expect(complete).toBe(true);
  expect(results_table.length).toBe(3);
  expect(results_table[2]['333']).toBeCloseTo(0);
  expect(results_table[2]['total']).toBeCloseTo(0);
}) 


test("person with no registration is left out", () => {
  const data = BASE_EXAMPLE_WCIF_ONE_EVENT;
  data.persons[2] = NOT_REGISTERED;

  const { has_result, complete, results_table, columns } = getKinchTableFromWCIF(data);
  
console.log(results_table);

  expect(has_result).toBe(true);
  expect(complete).toBe(true);
  expect(results_table.length).toBe(2);
}) 

test("competition with two events", () => {
  const data = BASE_EXAMPLE_WCIF_TWO_EVENTS;

  const { has_result, complete, results_table, columns } = getKinchTableFromWCIF(data);

  expect(has_result).toBe(true);
  expect(complete).toBe(true);
  expect(results_table.length).toBe(3);
  expect(columns).toEqual(["rank", "name", "total", "222", "333"]);

})