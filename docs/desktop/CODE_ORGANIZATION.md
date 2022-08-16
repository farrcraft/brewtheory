# Code Organization

There are 3 separate app entry points:

- [](/src/main) - This is the main electron process and is responsible for creating the app's main browser window 
- [](/src/preload) - Provides a bridge between node engine capabilities/modules and the renderer process
- [](/src/renderer) - The portion of the application exposed in the browser window aka the electron renderer process

Importantly, for security the renderer process does not have access to node or any of its native modules.
It's roughly equivalent to running in a normal browser.  Hence the need for the preload script to act as a
bridge between the two worlds.  The preload execution environment is closer to web than it is to a node context.
Only a limited subset of Electron & some polyfilled node API's are exposed.

## React

All React components live in the [](/src/renderer/components) directory.

Component directories are further broken down:

- [views](/src/renderer/components/views) - partial sections that are used for composing screens
- [screens](/src/renderer/components/views) - entire top-level screens (pages) that are displayed in the app
- [common](/src/renderer/components/views) - generic ui stuff like inputs/toolbars/buttons/checkboxes

These directories can be further broken down by feature or type, e.g.:

- screens/Account/Signin/
- views/Workspace/Note
