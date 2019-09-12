/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/tools/tree/master/packages/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   src/RequestSettingsPanel.js
 */


// tslint:disable:variable-name Describing an API that's defined elsewhere.
// tslint:disable:no-any describes the API as best we are able today

import {html} from 'lit-element';

import {ArcSettingsBase} from './ArcSettingsBase.js';

export {RequestSettingsPanel};

declare class RequestSettingsPanel extends ArcSettingsBase {
  readonly timeoutLabel: any;
  constructor();
  connectedCallback(): void;
  render(): any;
  _processValues(values: any): any;
  _requestSettingsTemplate(): any;
  _timeoutTemplate(): any;
  _redirectTemplate(): any;
}