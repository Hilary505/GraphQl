export const getProfileQuery = `
  query {
    user {
      login
      email
      firstName
      lastName
      campus
      auditRatio
      attrs
      
      level: transactions(
        where: { type: { _eq: "level" } }
        order_by: { createdAt: desc }
        limit: 1
      ) {
        amount
      }
       xpHistory: transactions(
        where: { 
          _and: [
            { eventId: { _eq: 75 } },
            { type: { _eq: "xp" } }
          ]
        }
        order_by: { createdAt: asc }
      ) {
        amount
        createdAt
      }
      totalXP: transactions(
        where: { eventId: { _eq: 75 } },
        order_by: { createdAt: asc }
      ) {
        object {
          name
          attrs
          type
        }
        amount
        createdAt
        eventId
        path
        type
      }
      xpTimeline: transactions(
        where: { type: { _eq: "xp" } }
        order_by: { createdAt: asc }
      ) {
        amount
        createdAt
      }

      skillTypes: transactions_aggregate(
        distinct_on: [type]
        where: { type: { _nin: ["xp", "level", "up", "down"] } }
        order_by: [{ type: asc }, { amount: desc }]
      ) {
        nodes {
          type
          amount
        }
      }
    }
 
    goItems: object(
    where: {_or: [{type: {_eq: "project"}, attrs: {_contains: {language: "Go"}}}, {type: {_eq: "piscine"}, name: {_ilike: "%Go%"}}]}
    distinct_on: [name]
  ) {
    name
    type
  }
  jsItems: object(
    where: {_or: [{type: {_eq: "project"}, attrs: {_contains: {language: "JavaScript"}}}, {type: {_eq: "piscine"}, name: {_ilike: "%JS%"}}]}
    distinct_on: [name]
  ) {
    name
    type
  }
  rustItems: object(
    where: {_or: [{type: {_eq: "project"}, attrs: {_contains: {language: "rust"}}}, {type: {_eq: "piscine"}, name: {_ilike: "%Rust%"}}]}
    distinct_on: [name]
  ) {
    name
    type
  }
  }
`;