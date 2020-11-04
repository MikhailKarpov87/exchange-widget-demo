import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from '../App';
import { FXRatesSourceURL, defaultPocketValue } from '../commons/constants';
import { rates, createRatesResponse } from './fixtures/rates';
import { Simulate } from 'react-dom/test-utils';

const server = setupServer(
  rest.get(FXRatesSourceURL, (req, res, ctx) => {
    const base = req.url.searchParams.get('base');
    const response = createRatesResponse(base);
    return res(ctx.json(response));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const makeExchange = async (currencyType, amount) => {
  await waitFor(() => {
    Simulate.change(screen.getByTestId(`${currencyType}-input`).querySelector('input'), { target: { value: amount } });
  });

  await waitFor(async () => {
    fireEvent.click(screen.getByTestId('exchange-button'));
  });
};

test('should render currency select menu', async () => {
  render(<App />);
  await waitFor(() => {
    screen.getByTestId('currency-select');
  });

  await waitFor(() => {
    expect(screen.getByTestId('currency-select')).toBeInTheDocument();
  });
});

test('should render base currency input', async () => {
  render(<App />);
  await waitFor(() => {
    screen.getByTestId('baseCurrency-input');
  });

  await waitFor(() => {
    expect(screen.getByTestId('baseCurrency-input')).toBeInTheDocument();
  });
});

test('should render quote currency input', async () => {
  render(<App />);
  await waitFor(() => {
    screen.getByTestId('quoteCurrency-input');
  });

  await waitFor(() => {
    expect(screen.getByTestId('baseCurrency-input')).toBeInTheDocument();
  });
});

test('should render correct default rate in select', async () => {
  render(<App />);
  await waitFor(() => {
    screen.getAllByText((_, node) => node.textContent.includes(`€1 = £${rates.GBP}`));
  });

  await waitFor(() => {
    expect(screen.getAllByText((_, node) => node.textContent.includes(`€1 = £${rates.GBP}`))[0]).toBeInTheDocument();
  });
});

test('should render inverse rate text', async () => {
  render(<App />);
  await waitFor(() => {
    screen.getAllByTestId('inverse-rate-text');
  });

  await waitFor(() => {
    expect(screen.getAllByTestId('inverse-rate-text')[1].innerHTML).toMatch(/£1 = €/);
  });
});

test('should show rates fetching alert when Rates service unavailable', async () => {
  server.use(
    rest.get(FXRatesSourceURL, (req, res, ctx) => {
      return res(ctx.status(503));
    })
  );

  render(<App />);

  await waitFor(() => {
    screen.getByRole('alert');
  });

  await waitFor(() => {
    expect(screen.getAllByRole('alert')[0].innerHTML).toMatch(/Can't get rates/);
  });
});

test('should show alert on exchange button click with empty values', async () => {
  render(<App />);

  await waitFor(() => {
    fireEvent.click(screen.getByTestId('exchange-button'));
  });

  await waitFor(() => {
    screen.getByRole('alert');
  });

  await waitFor(() => {
    expect(screen.getByRole('alert').innerHTML).toEqual('Enter valid value!');
  });
});

test('should show alert on exchange button click when value > pocket', async () => {
  render(<App />);

  const exchangeValue = (defaultPocketValue + 0.01).toFixed(2);

  await makeExchange('baseCurrency', exchangeValue);

  await waitFor(() => {
    expect(screen.getByRole('alert').innerHTML).toMatch(/Not enough funds/);
  });
});

test('should show success alert on exchange button click when value < pocket', async () => {
  render(<App />);
  const exchangeValue = (defaultPocketValue * 0.333).toFixed(2);

  await makeExchange('baseCurrency', exchangeValue);

  await waitFor(() => {
    expect(screen.getByRole('alert').innerHTML).toMatch(/Exchange done!/);
  });
});

test('should update pockets values after exchange', async () => {
  render(<App />);

  const exchangeValue = '10';

  await waitFor(() => {
    screen.getAllByText(/You have/);
  });

  await makeExchange('baseCurrency', exchangeValue);

  await waitFor(() => {
    const baseCurrencyPocketText = screen.getAllByText(/You have/)[0].innerHTML;
    const quoteCurrencyPocketText = screen.getAllByText(/You have/)[1].innerHTML;

    expect(baseCurrencyPocketText).toEqual('You have €40.00');
    expect(quoteCurrencyPocketText).toEqual('You have £58.90');
  });
});

test('should switch currency on next currency click', async () => {
  render(<App />);
  const nextCurrencyName = 'USD';

  await waitFor(() => {
    fireEvent.click(screen.getAllByTestId('next-currency')[0]);
  });

  await waitFor(() => {
    expect(screen.getByLabelText(nextCurrencyName)).toBeInTheDocument();
  });
});

test('should not switch currency on previous currency click', async () => {
  render(<App />);
  const currencyName = 'EUR';

  await waitFor(() => {
    fireEvent.click(screen.getAllByTestId('previous-currency')[0]);
  });

  await waitFor(() => {
    expect(screen.getAllByTestId('previous-currency')[0]).toBeDisabled();
    expect(screen.getByLabelText(currencyName)).toBeInTheDocument();
  });
});
