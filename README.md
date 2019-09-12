[![Published on NPM](https://img.shields.io/npm/v/@advanced-rest-client/arc-settings-panel.svg)](https://www.npmjs.com/package/@advanced-rest-client/arc-settings-panel)

[![Build Status](https://travis-ci.org/advanced-rest-client/arc-settings-panel.svg?branch=stage)](https://travis-ci.org/advanced-rest-client/arc-settings-panel)

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/advanced-rest-client/arc-settings-panel)

## &lt;arc-settings-panel&gt;

Settings panel for Advanced REST Client.

Since version 3 this repository contains all settings panel instead of separate repositories.

## Usage

### Installation
```
npm install --save @advanced-rest-client/arc-settings-panel
```

### In a LitElement

```js
import { LitElement, html } from 'lit-element';
import '@advanced-rest-client/arc-settings-panel/arc-settings-panel.js';

class SampleElement extends LitElement {
  get styles() {
    return css`
      arc-menu {
        height: 500px;
      }
    `;
  }

  render() {
    return html`
    <arc-settings-panel
      ?compatibility="${compatibility}"
      ?outlined="${outlined}"
      ?restApis="${restApis}"
      ?systemVariablesDisabled="${systemVariablesDisabled}"
      ?hasExperiments="${hasExperiments}"
    ></arc-settings-panel>
    `;
  }
}
customElements.define('sample-element', SampleElement);
```

### Data source

The element dispatches `settings-read` when it needs the settings to be read.
The event should be handled by the application and set settings on `result` property
of the event detail. The result can be a promise.

The event has to be cancelled or otherwise the element will ignore it.

```javascript
element.addEventListener('settings-read', (e) => {
  e.preventDefault();
  e.detail.result = Promise.resolve({ ... });
});
```

### Settings change event

The element dispatches cancellable `settings-changed` custom event with
`name` and `value` properties set on the detail object. The application should handle the event and
store the settings data.

The element listens for the same event and if the event is non-cancellable then it updates
property value on current panel, if applicable.

## Development

```sh
git clone https://github.com/advanced-rest-client/arc-settings-panel
cd arc-settings-panel
npm install
```

### Running the demo locally

```sh
npm start
```

### Running the tests

```sh
npm test
```

## API components

This components is a part of [API components ecosystem](https://elements.advancedrestclient.com/)
