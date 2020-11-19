// import React testing methods
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// add custom jest matchers from jest-dom
import '@testing-library/jest-dom/extend-expect'

// import the component to test
import App from './App';

test('renders the search button and therefore the App component renders', () => {
  render(<App />);
  const linkElement = screen.getByText(/Search/i);
  expect(linkElement).toBeInTheDocument();
});


test('loads and displays search result', async () => {

  render(<App />);

  // find input field for searching for shows
  const input = screen.getByPlaceholderText('Office')

  // type in "Office" to the input field
  userEvent.type(input, 'Office')

  // validate that the text changes
  expect(screen.getByPlaceholderText("Office")).toHaveValue('Office');

  // click the Search button to call API and get results
  fireEvent.click(screen.getByText('Search'))

  // await response and validate that some expected text is returned and is found on the DOM
  await waitFor(async () => {
    await expect(screen.getByText(/The Naked Office attempts/)).toBeInTheDocument()
  })
});
