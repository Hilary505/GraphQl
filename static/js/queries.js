export const getProfileQuery = `
  query {
  
    user {
      login
      email
      campus

       results(order_by: { grade: desc }, limit: 5) {
        object {
          name
        }
        grade
      }

      transactions(where: { type: { _eq: "xp" } }) {
        amount
      }

      events(where: { eventId: { _eq: 75 } }) {
        level
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

      upTransactions: transactions(where: { type: { _eq: "up" } }) {
        amount
      }

      downTransactions: transactions(where: { type: { _eq: "down" } }) {
        amount
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
  }
    
`;
