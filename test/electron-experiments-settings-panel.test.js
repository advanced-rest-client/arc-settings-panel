import { fixture, assert } from '@open-wc/testing';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import '@advanced-rest-client/arc-local-store-preferences/arc-local-store-preferences.js';
import '../electron-experiments-settings-panel.js';

describe('<electron-experiments-settings-panel>', function() {
  async function manualFixture() {
    return await fixture(`<electron-experiments-settings-panel manual></electron-experiments-settings-panel>`);
  }

  async function autoFixture() {
    return await fixture(`<electron-experiments-settings-panel></electron-experiments-settings-panel>`);
  }

  let store;
  before(() => {
    store = document.createElement('arc-local-store-preferences');
    document.body.appendChild(store);
  });

  after(() => {
    document.body.removeChild(store);
  });

  describe('Basic', () => {
    let element;
    beforeEach(async () => {
      element = await manualFixture();
    });

    [
      ['popup menu', 0, 'popupMenuExperimentEnabled'],
      ['SSL validation', 1, 'validateCertificates'],
      ['native request', 2, 'nativeTransport'],
      ['drag and drop', 3, 'draggableEnabled']
    ].forEach((item) => {
      it(`Toggles ${item[0]}`, function() {
        const node = element.shadowRoot.querySelectorAll('anypoint-item')[item[1]];
        MockInteractions.tap(node);
        assert.isTrue(element[item[2]]);
      });
    });
  });

  describe('Auto reading settings', () => {
    beforeEach(() => {
      store.clear();
    });

    it('Dispatches settings-read', (done) => {
      window.addEventListener('settings-read', function f() {
        window.removeEventListener('settings-read', f);
        done();
      });
      autoFixture();
    });
  });

  describe('_settingsChanged()', () => {
    let element;
    beforeEach(async () => {
      element = await manualFixture();
    });

    function fire(name, value) {
      const ev = new CustomEvent('settings-changed', {
        cancelable: false,
        composed: true,
        bubbles: true,
        detail: {
          name,
          value
        }
      });
      document.body.dispatchEvent(ev);
    }
    [
      ['popupMenuExperimentEnabled', true],
      ['validateCertificates', true],
      ['nativeTransport', true],
      ['draggableEnabled', true]
    ].forEach((item) => {
      it(`Updates value for ${item[0]}`, function() {
        fire(item[0], item[1]);
        assert.strictEqual(element[item[0]], item[1]);
      });
    });
  });

  describe('_processValues()', () => {
    let element;
    beforeEach(async () => {
      element = await manualFixture();
    });

    [
      ['popupMenuExperimentEnabled', undefined, false],
      ['popupMenuExperimentEnabled', true, true],
      ['popupMenuExperimentEnabled', 'false', false],
      ['validateCertificates', undefined, false],
      ['validateCertificates', true, true],
      ['validateCertificates', 'false', false],
      ['nativeTransport', undefined, false],
      ['nativeTransport', true, true],
      ['nativeTransport', 'false', false],
      ['draggableEnabled', undefined, false],
      ['draggableEnabled', true, true],
      ['draggableEnabled', 'false', false]
    ].forEach((item) => {
      it(`Sets value of ${item[0]} when ${item[1]}`, () => {
        const values = {};
        values[item[0]] = item[1];
        element._processValues(values);
        assert.equal(values[item[0]], item[2]);
      });
    });
  });

  describe('_setSettings()', () => {
    let element;
    beforeEach(async () => {
      element = await manualFixture();
    });

    [
      ['popupMenuExperimentEnabled', true],
      ['validateCertificates', true],
      ['nativeTransport', true],
      ['draggableEnabled', true]
    ].forEach((item) => {
      it(`Sets value of ${item[0]}`, () => {
        const values = {};
        values[item[0]] = item[1];
        element._setSettings(values);
        assert.equal(element[item[0]], item[1]);
      });
    });
  });
})
