/*
BrewTheory
Copyright (C) 2022  Joshua Farr

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import App from './components/App';
import Home from './components/screens/Home';
import Brewhouse from './components/screens/Brewhouse';
import Recipes from './components/screens/Recipes';
import Tools from './components/screens/ConversionTools';

// Security - Override & Disable eval
// ESLint will warn about any use of eval(), even this one
// eslint-disable-next-line
window.eval = global.eval = function() {
  throw new Error('Sorry, this app does not support window.eval().');
};

const container = document.getElementById('root');
if (container !== null) {
  const root = createRoot(container);
  root.render(
    <>
      <CssBaseline enableColorScheme />
      <HashRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="recipes" element={<Recipes />} />
            <Route path="brewhouse" element={<Brewhouse />} />
            <Route path="tools" element={<Tools />} />
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </HashRouter>
    </>
  );
}
