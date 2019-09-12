import { fixture, assert } from '@open-wc/testing';
import * as sinon from 'sinon/pkg/sinon-esm.js';
import '@advanced-rest-client/arc-local-store-preferences/arc-local-store-preferences.js';
import '../view-settings-panel.js';

describe('<view-settings-panel>', function() {
  async function manualFixture() {
    return await fixture(`<view-settings-panel manual></view-settings-panel>`);
  }

  async function autoFixture() {
    return await fixture(`<view-settings-panel></view-settings-panel>`);
  }

  let store;
  before(() => {
    store = document.createElement('arc-local-store-preferences');
    document.body.appendChild(store);
  });

  after(() => {
    document.body.removeChild(store);
  });

  describe('openThemesPanel', () => {
    let element;
    beforeEach(async () => {
      element = await manualFixture();
    });

    it('Dispatchs "navigate" event', () => {
      const spy = sinon.spy();
      element.addEventListener('navigate', spy);
      element.openThemesPanel();
      assert.isTrue(spy.called);
    });

    it('Event is cancelable', () => {
      const spy = sinon.spy();
      element.addEventListener('navigate', spy);
      element.openThemesPanel();
      assert.isTrue(spy.getCall(0).args[0].cancelable);
    });

    it('Event is composed', () => {
      const spy = sinon.spy();
      element.addEventListener('navigate', spy);
      element.openThemesPanel();
      assert.isTrue(spy.getCall(0).args[0].composed);
    });

    it('Event bubbles', () => {
      const spy = sinon.spy();
      element.addEventListener('navigate', spy);
      element.openThemesPanel();
      assert.isTrue(spy.getCall(0).args[0].bubbles);
    });

    it('Event\'s detail has base', () => {
      const spy = sinon.spy();
      element.addEventListener('navigate', spy);
      element.openThemesPanel();
      assert.equal(spy.getCall(0).args[0].detail.base, 'themes-panel');
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
      ['viewListType', 'compact']
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
      ['viewListType', 123, '123'],
      ['viewListType', 'default', 'default']
    ].forEach((item) => {
      it(`Sets value of ${item[0]} when ${item[1]}`, () => {
        const values = {};
        values[item[0]] = item[1];
        element._processValues(values);
        assert.equal(values[item[0]], item[2]);
      });
    });
  });
})
