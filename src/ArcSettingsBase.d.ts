/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/tools/tree/master/packages/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   src/ArcSettingsBase.js
 */


// tslint:disable:variable-name Describing an API that's defined elsewhere.
// tslint:disable:no-any describes the API as best we are able today

import {LitElement, html} from 'lit-element';

export {ArcSettingsBase};

declare namespace ArcComponents {

  /**
   * Base class for ARC settings panels.
   *
   * ## Processing initial settings
   *
   * The element should override two methods: `_processValues()` and
   * `_setSettings()`. Process values shouls process incomming data and set
   * defaults and proper data types (application storage may not respect data
   * types!). When this function is not provided the element will use data as they
   * arrive from settings provider. The `_setSettings()` function should be used
   * to set appropieate settings on the UI.
   *
   * ```javascript
   * _processValues(values) {
   *  if (values.myKey) {
   *    values.myKey = true;
   *  }
   *  return values;
   * }
   *
   * _setSettings(values) {
   *  this.myValue = values.myKey;
   * }
   * ```
   *
   * ## Updating settings
   *
   * To update settings using `updateSetting()` function first set `__settingsRestored`
   * to true on the element. It ensures to not send events when restoring the data.
   * Update function has a debouncer set to 300 ms. Each change will be commited
   * after this time wiht the last updated value.
   *
   * ```javascript
   * _setSettings(values) {
   *  this.myValue = values.myKey;
   *  this.__settingsRestored = true;
   * }
   *
   * _valueChangeHandler(value) {
   *  this.updateSetting('myKey', value);
   * }
   * ```
   *
   * ## Handling update event
   *
   * Implement `_settingsChanged(key, value)` function in the component and
   * the function will be called each time a setting was updated.
   *
   * ```javascript
   * ...
   * _settingsChanged(key, value) {
   *  if (key === 'my-setting') {
   *    this.myValue = value;
   *  }
   * }
   * ...
   * ```
   */
  class ArcSettingsBase extends LitElement {
    loading: any;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;

    /**
     * Dispatches `settings-read` custom event to settings provider to read
     * application settings and sets received values on the component.
     *
     * @returns Promise resolved when operartion ends.
     */
    loadSettings(): Promise<any>|null;

    /**
     * Reads settings from the settings provider
     */
    _readSettings(): Promise<any>|null;

    /**
     * Dispatches `settings-changed` to settings provider with new value.
     * The event is dispatched with 300 ms debouncer.
     *
     * @param key Setting key
     * @param value Value to store. Values are serialized
     */
    updateSetting(key: String|null, value: any|null): void;

    /**
     * Dispatches `settings-changed` event to store the setting value.
     *
     * @param name Property name
     * @param value A value to store.
     */
    _updateSetting(name: String|null, value: any|null): void;

    /**
     * Default setter for incomming settings.
     * It takes list of observable properties defined in the static `properties` list
     * and if any of the values' keys matches then the setting is set.
     *
     * @param values List of restored settings.
     */
    _setSettings(values: object|null): void;

    /**
     * Default setter for incomming settings.
     * It takes list of observable properties defined in the static `properties` list
     * and if any of the values' keys matches then the setting is set.
     *
     * @param values List of restored settings.
     * @returns The same values with processed value type and defaults.
     */
    _processValues(values: object|null): object|null;
    _readPropertyValue(definition: any, current: any): any;

    /**
     * Returns a boolean value for the `value`.
     */
    _boolValue(value: any|null): Boolean|null;

    /**
     * Returns a numeric value for the `value`
     *
     * @param val Current value
     * @returns Translated value
     */
    _numValue(val: any|null): Number|null;

    /**
     * Shows internal sub-page
     */
    _showPage(e: ClickEvent|null): void;

    /**
     * Restores the main page of the editor.
     */
    back(): void;

    /**
     * To be used when a list item has a toggle button.
     * When clicking on the list option this function should be called to
     * toggle the button.
     */
    _toggleOption(e: ClickEvent|null): void;

    /**
     * Opens a URL in new window.
     * If the application handle `open-external-url` then it does nothing.
     */
    _openLink(url: String|null): void;

    /**
     * Default handler for a settings change event.
     * Updates property value if it is defined in the static properties list.
     *
     * @param key Property name
     * @param value A value to set.
     */
    _settingsChanged(key: String|null, value: Boolean|String|Number|null): void;

    /**
     * Toggles a boolean value from `anypoint-switch` change event.
     */
    _toogleBooleanValue(e: Event|null): void;
    _inputValueHandler(e: any): void;
    _listValueHandler(e: any): void;

    /**
     * Generates a template result for a line item with a switch.
     *
     * @param opts Item description:
     * - label {String} - Required, list label
     * - description {String} - Optional, description of the item
     * - name {String} - Required, name of the property for checked state
     * - disabled {Boolean} - Optional, disables the item
     */
    _switchTemplate(opts: object|null): TemplateResult|null;

    /**
     * Generates a template result for a line item with a switch.
     *
     * @param opts Item description:
     * - label {String} - Required, list label
     * - description {String} - Optional, description of the item
     * - page {Number} - Required, index of the page to set.
     */
    _pageItemTemplate(opts: object|null): TemplateResult|null;
  }
}