import { fixture, assert } from '@open-wc/testing';
import '@advanced-rest-client/arc-local-store-preferences/arc-local-store-preferences.js';
import '../privacy-settings-panel.js';

describe('ArcSettingsBase', function() {
  async function basicFixture() {
    return await fixture(`<privacy-settings-panel manual></privacy-settings-panel>`);
  }

  let store;
  before(() => {
    store = document.createElement('arc-local-store-preferences');
    document.body.appendChild(store);
  });

  after(() => {
    document.body.removeChild(store);
  });

  describe('_boolValue()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('returns value when boolean passed', () => {
      const result = element._boolValue(false);
      assert.isFalse(result);
    });

    it('returns value when "false"', () => {
      const result = element._boolValue('false');
      assert.isFalse(result);
    });

    it('returns value when "true"', () => {
      const result = element._boolValue('true');
      assert.isTrue(result);
    });

    it('returns true for any other string', () => {
      const result = element._boolValue('test');
      assert.isTrue(result);
    });

    it('returns true for positive number', () => {
      const result = element._boolValue(1);
      assert.isTrue(result);
    });

    it('returns false for 0', () => {
      const result = element._boolValue(0);
      assert.isFalse(result);
    });
  });

  describe('_numValue()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('parses string to a number', () => {
      const result = element._numValue('5');
      assert.equal(result, 5);
    });

    it('returns 0 on string', () => {
      const result = element._numValue('aaaaa');
      assert.equal(result, 0);
    });
  });

  describe('_readPropertyValue()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('returns default value if current is undefined', () => {
      const def = { default: 5 };
      const result = element._readPropertyValue(def);
      assert.equal(result, 5);
    });

    it('returns string value', () => {
      const def = { default: 5, type: String };
      const result = element._readPropertyValue(def, 'test');
      assert.equal(result, 'test');
    });

    it('returns number value', () => {
      const def = { default: 5, type: String };
      const result = element._readPropertyValue(def, 10);
      assert.equal(result, 10);
    });

    it('returns number value from a string', () => {
      const def = { default: 5, type: String };
      const result = element._readPropertyValue(def, '10');
      assert.equal(result, 10);
    });

    it('returns boolean value', () => {
      const def = { default: true, type: Boolean };
      const result = element._readPropertyValue(def, false);
      assert.isFalse(result);
    });

    it('returns boolean value from a string', () => {
      const def = { default: true, type: Boolean };
      const result = element._readPropertyValue(def, 'false');
      assert.isFalse(result);
    });
  });

  describe('back()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('sets page to 0', () => {
      element.page = 1;
      element.back();
      assert.equal(element.page, 0);
    });
  });
})
