const users = [
    {
      id: '410544b2-4001-4271-9855-fec4b6a6442a',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      password: 'hashedpassword1',
    },
    {
      id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa',
      name: 'Bob Smith',
      email: 'bob@example.com',
      password: 'hashedpassword2',
    },
    {
      id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
      name: 'Charlie Davis',
      email: 'charlie@example.com',
      password: 'hashedpassword3',
    },
  ];
  
  const stocks = [
    {
      id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      symbol: 'AAPL',
    },
    {
      id: 'b2c3d4e5-f678-9012-bcde-234567890abc',
      symbol: 'GOOGL',
    },
    {
      id: 'c3d4e5f6-7890-1234-cdef-34567890abcd',
      symbol: 'TSLA',
    },
    {
      id: 'd4e5f678-9012-3456-def0-4567890abcde',
      symbol: 'AMZN',
    },
    {
      id: 'e5f67890-1234-5678-ef01-567890abcdef',
      symbol: 'MSFT',
    },
  ];
  
  const watchlist = [
    {
      id: '1a2b3c4d-5e6f-7890-abcd-1234567890ef',
      user_id: users[0].id,
      stock_id: stocks[0].id, // Alice watches AAPL
    },
    {
      id: '2b3c4d5e-6f78-9012-bcde-234567890abc',
      user_id: users[0].id,
      stock_id: stocks[1].id, // Alice watches GOOGL
    },
    {
      id: '3c4d5e6f-7890-1234-cdef-34567890abcd',
      user_id: users[1].id,
      stock_id: stocks[2].id, // Bob watches TSLA
    },
    {
      id: '4d5e6f78-9012-3456-def0-4567890abcde',
      user_id: users[2].id,
      stock_id: stocks[4].id, // Charlie watches MSFT
    },
    {
      id: '5e6f7890-1234-5678-ef01-567890abcdef',
      user_id: users[2].id,
      stock_id: stocks[3].id, // Charlie watches AMZN
    },
  ];
  
  export { users, stocks, watchlist };
  