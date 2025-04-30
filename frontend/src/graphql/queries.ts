import { gql } from '@apollo/client';

export const GET_BALANCE_BY_DATE_RANGE = gql`
  query GetBalanceByDateRange($startDate: DateTime!, $endDate: DateTime!) {
    getBalanceByDateRange(startDate: $startDate, endDate: $endDate) {
      _id
      timestamp
      generation
      demand
      imports
      exports
      balance
      details {
        renewable
        nonRenewable
        storage
        nuclear
        hydro
        wind
        solar
        thermal
      }
    }
  }
`;

export const FETCH_BALANCE_BY_DATE_RANGE = gql`
  mutation FetchBalanceByDateRange($startDate: DateTime!, $endDate: DateTime!) {
    fetchBalanceByDateRange(startDate: $startDate, endDate: $endDate) {
      _id
      timestamp
      generation
      demand
      imports
      exports
      balance
      details {
        renewable
        nonRenewable
        storage
        nuclear
        hydro
        wind
        solar
        thermal
      }
    }
  }
`; 