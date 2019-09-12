import { fixture, assert } from '@open-wc/testing';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import '@advanced-rest-client/arc-local-store-preferences/arc-local-store-preferences.js';
import '../privacy-settings-panel.js';

describe('<privacy-settings-panel>', function() {
  async function manualFixture() {
    return await fixture(`<privacy-settings-panel manual></privacy-settings-panel>`);
  }

  async function autoFixture() {
    return await fixture(`<privacy-settings-panel></privacy-settings-panel>`);
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
    it('Toggles telemetry', async () => {
      const element = await manualFixture();
      const node = element.shadowRoot.querySelectorAll('anypoint-item')[0];
      MockInteractions.tap(node);
      assert.isTrue(element.telemetry);
    });

    it('Clicking privancy policy sends an event', async () => {
      const element = await manualFixture();
      const node = element.shadowRoot.querySelectorAll('anypoint-item')[1];
      let called = false;
      element.addEventListener('open-external-url', (e) => {
        e.preventDefault();
        called = true;
      });
      MockInteractions.tap(node);
      assert.isTrue(called);
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
      ['telemetry', true]
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
      ['telemetry', undefined, true],
      ['telemetry', true, true],
      ['telemetry', false, false],
      ['telemetry', 'false', false]
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
      ['telemetry', true],
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
