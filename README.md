# Getting Started with Create React App

This app allows users to search for a tv show and be returned a list of shows matching that description via a RESTful API call to http://www.tvmaze.com/api.  The user can then select a tv show from the list and be routed to an episodes page that shows the name and air date for a show's season.  The user can also change the show's season via a dynamic multi-select.

The app is powered by React and implements JS, SCSS, and semantic HTML.

The https encrypted production app is hosted via Netlify at https://search-shows-react-app.netlify.app/.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`


Launches the test runner in the interactive watch mode using React Testing Library.

The unit test checks whether the page successfully renders the component in the browser and also validates that programmatically searching for a show will make an asynchronous RESTful API call, return the requested data, and update the DOM.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
