import { fixture, assert, nextFrame, aTimeout } from '@open-wc/testing';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import * as sinon from 'sinon';
import '@advanced-rest-client/arc-local-store-preferences/arc-local-store-preferences.js';
import '../data-settings-panel.js';

describe('<data-settings-panel>', function() {
  async function manualFixture() {
    return await fixture(`<data-settings-panel manual></data-settings-panel>`);
  }

  async function autoFixture() {
    return await fixture(`<data-settings-panel></data-settings-panel>`);
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
      ['history data', 0, 'historyEnabled'],
      ['fast search', 1, 'fastSearch'],
    ].forEach((item) => {
      it(`Toggles ${item[0]}`, function() {
        const node = element.shadowRoot.querySelectorAll('anypoint-item.clickable')[item[1]];
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
      ['historyEnabled', true],
      ['fastSearch', true],
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
      ['historyEnabled', undefined, true],
      ['historyEnabled', true, true],
      ['historyEnabled', false, false],
      ['historyEnabled', 'false', false],
      ['fastSearch', undefined, false],
      ['fastSearch', true, true],
      ['fastSearch', false, false],
      ['fastSearch', 'false', false]
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
      ['historyEnabled', true],
      ['historyEnabled', false],
      ['fastSearch', true],
      ['fastSearch', false],
    ].forEach((item) => {
      it(`Sets value of ${item[0]}`, () => {
        const values = {};
        values[item[0]] = item[1];
        element._setSettings(values);
        assert.equal(element[item[0]], item[1]);
      });
    });
  });

  describe('_deleteAllClick()', () => {
    let element;
    beforeEach(async () => {
      element = await manualFixture();
      element.page = 2;
      await nextFrame();
    });

    it('Opens the dialog', () => {
      element._deleteAllClick();
      const node = element.shadowRoot.querySelector('anypoint-dialog');
      assert.isTrue(node.opened);
    });
  });

  describe('_onClearDialogResult()', () => {
    let element;
    beforeEach(async () => {
      element = await manualFixture();
      element.page = 2;
      await nextFrame();
    });

    it('does nothing when dialog is not confirmed', () => {
      const spy = sinon.spy(element, 'deleteDatabases');
      element._onClearDialogResult({
        detail: {
          confirmed: false
        }
      });
      assert.isFalse(spy.called);
    });

    it('Calls deleteDatabases()', () => {
      let called = false;
      element.deleteDatabases = () => called = true;
      element._onClearDialogResult({
        detail: {
          confirmed: true
        }
      });
      assert.isTrue(called);
    });
  });

  describe('_exportAllFile()', () => {
    let element;
    beforeEach(async () => {
      element = await manualFixture();
      element.page = 1;
      await nextFrame();
    });

    it('Calls selectAll() on export panel', (done) => {
      element.addEventListener('arc-data-export', function f(e) {
        element.removeEventListener('arc-data-export', f);
        e.preventDefault();
        e.detail.result = Promise.resolve();
        const { data } = e.detail;
        assert.isTrue(data.saved, 'saved is set');
        assert.isTrue(data.history, 'history is set');
        assert.isTrue(data.cookies, 'cookies is set');
        assert.isTrue(data.auth, 'auth is set');
        assert.isTrue(data.websocket, 'auth is set');
        assert.isTrue(data.variables, 'auth is set');
        assert.isTrue(data['url-history'], 'auth is set');
        assert.isTrue(data['host-rules'], 'auth is set');
        done();
      });
      element._exportAllFile();
    });

    it('Calls startExport() on export panel', async () => {
      element.addEventListener('arc-data-export', function f(e) {
        element.removeEventListener('arc-data-export', f);
        e.preventDefault();
        e.detail.result = Promise.resolve();
      });
      element._exportAllFile();
      const node = element.shadowRoot.querySelectorAll('export-form')[1];
      const spy = sinon.spy(node, 'startExport');
      await aTimeout();
      assert.isTrue(spy.called);
    });
  });

  describe('deleteDatabases()', () => {
    let element;
    beforeEach(async () => {
      element = await manualFixture();
      element.page = 2;
      await nextFrame();
    });

    it('Adds projects when saved is set', () => {
      let models;
      element.addEventListener('destroy-model', function f(e) {
        element.removeEventListener('destroy-model', f);
        e.preventDefault();
        models = e.detail.models;
        e.detail.result = [Promise.resolve()];
      });
      const ckb = element.shadowRoot.querySelector('[name="saved"]');
      ckb.checked = true;
      element.deleteDatabases();
      assert.notEqual(models.indexOf('legacy-projects'), -1);
    });

    it('Adds variables-environments when variables is set', () => {
      let models;
      element.addEventListener('destroy-model', function f(e) {
        element.removeEventListener('destroy-model', f);
        e.preventDefault();
        models = e.detail.models;
        e.detail.result = [Promise.resolve()];
      });
      const ckb = element.shadowRoot.querySelector('[name="variables"]');
      ckb.checked = true;
      element.deleteDatabases();
      assert.notEqual(models.indexOf('variables-environments'), -1);
    });

    it('renders rest-apis menu', async () => {
      element.restApis = true;
      await nextFrame();
      const node = element.shadowRoot.querySelector('anypoint-checkbox[name="rest-apis"]');
      assert.ok(node);
    });
  });
})
