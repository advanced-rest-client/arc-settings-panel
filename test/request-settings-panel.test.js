import { fixture, assert, aTimeout, nextFrame } from '@open-wc/testing';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import '@advanced-rest-client/arc-local-store-preferences/arc-local-store-preferences.js';
import '../request-settings-panel.js';

describe('<request-settings-panel>', function() {
  async function manualFixture() {
    return await fixture(`<request-settings-panel manual></request-settings-panel>`);
  }

  async function autoFixture() {
    return await fixture(`<request-settings-panel></request-settings-panel>`);
  }

  async function noSysVarsFixture() {
    return await fixture(`<request-settings-panel systemvariablesdisabled manual></request-settings-panel>`);
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
      store.clear();
      element = await manualFixture();
    });

    it('Shows timeout settings page', function() {
      const node = element.shadowRoot.querySelector('anypoint-item[data-page="1"]');
      MockInteractions.tap(node);
      assert.equal(element.page, 1);
    });

    it('Shows OAuth2 redirect settings page', function() {
      const node = element.shadowRoot.querySelector('anypoint-item[data-page="2"]');
      MockInteractions.tap(node);
      assert.equal(element.page, 2);
    });

    [
      ['local variables', 2, 'appVariablesEnabled'],
      ['system variables', 3, 'systemVariablesEnabled'],
      ['redirects', 4, 'followRedirects'],
      ['Ignore content headers for GET', 5, 'ignoreContentOnGet'],
      ['Default request headers', 6, 'defaultHeaders']
    ].forEach((item) => {
      it(`Toggles ${item[0]}`, function() {
        const node = element.shadowRoot.querySelectorAll('anypoint-item')[item[1]];
        MockInteractions.tap(node);
        assert.isTrue(element[item[2]]);
      });
    });
  });

  describe('Disabled items', () => {
    it('Ignores input on disabled system variables', async () => {
      const element = await noSysVarsFixture();
      const node = element.shadowRoot.querySelectorAll('anypoint-item')[2];
      MockInteractions.tap(node);
      assert.isUndefined(element.systemVariablesEnabled);
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
      ['appVariablesEnabled', true],
      ['followRedirects', true],
      ['systemVariablesEnabled', true],
      ['requestDefaultTimeout', 10],
      ['ignoreContentOnGet', true],
      ['defaultHeaders', true]
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
      ['appVariablesEnabled', undefined, true],
      ['appVariablesEnabled', true, true],
      ['appVariablesEnabled', false, false],
      ['appVariablesEnabled', 'false', false],
      ['followRedirects', undefined, true],
      ['followRedirects', true, true],
      ['followRedirects', false, false],
      ['followRedirects', 'false', false],
      ['requestDefaultTimeout', undefined, 45],
      ['requestDefaultTimeout', 100, 100],
      ['requestDefaultTimeout', '120', 120],
      ['requestDefaultTimeout', '1200', 1],
      ['systemVariablesEnabled', undefined, true],
      ['systemVariablesEnabled', true, true],
      ['systemVariablesEnabled', false, false],
      ['systemVariablesEnabled', 'false', false],
      ['oauth2redirectUri', undefined, 'https://auth.advancedrestclient.com/oauth-popup.html'],
      ['oauth2redirectUri', 'https://auth.domain.com', 'https://auth.domain.com'],
      ['ignoreContentOnGet', undefined, false],
      ['ignoreContentOnGet', true, true],
      ['ignoreContentOnGet', false, false],
      ['ignoreContentOnGet', 'false', false],
      ['defaultHeaders', undefined, true],
      ['defaultHeaders', true, true],
      ['defaultHeaders', false, false],
      ['defaultHeaders', 'false', false],
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
      ['appVariablesEnabled', true],
      ['followRedirects', true],
      ['requestDefaultTimeout', true],
      ['systemVariablesEnabled', true],
      ['ignoreContentOnGet', true],
      ['appVariablesEnabled', false],
      ['followRedirects', false],
      ['requestDefaultTimeout', false],
      ['systemVariablesEnabled', false],
      ['oauth2redirectUri', 'https://auth.domain.com'],
      ['ignoreContentOnGet', false],
      ['defaultHeaders', false]
    ].forEach((item) => {
      it(`Sets value of ${item[0]}`, () => {
        const values = {};
        values[item[0]] = item[1];
        element._setSettings(values);
        assert.equal(element[item[0]], item[1]);
      });
    });
  });

  describe('Value change from the UI', () => {
    let element;
    beforeEach(async () => {
      store.clear();
      element = await manualFixture();
    });

    [
      'appVariablesEnabled',
      'followRedirects',
      'systemVariablesEnabled',
      'ignoreContentOnGet',
      'defaultHeaders'
    ].forEach((item) => {
      it(`changes value for ${item}`, async () => {
        const node = element.shadowRoot.querySelector(`anypoint-switch[name="${item}"]`);
        MockInteractions.tap(node);
        await aTimeout();
        assert.isTrue(element[item]);
      });
    });

    it('changes value for requestDefaultTimeout', async () => {
      element.page = 1;
      await nextFrame();
      const node = element.shadowRoot.querySelector(`anypoint-input[name="requestDefaultTimeout"]`);
      node.value = 'test';
      await aTimeout();
      assert.equal(element.requestDefaultTimeout, 'test');
    });

    it('changes value for oauth2redirectUri', async () => {
      element.page = 2;
      await nextFrame();
      const node = element.shadowRoot.querySelector(`anypoint-input[name="oauth2redirectUri"]`);
      node.value = 'https://api.domain.com';
      await aTimeout();
      assert.equal(element.oauth2redirectUri, 'https://api.domain.com');
    });
  });
})
