/**
@license
Copyright 2018 The Advanced REST client authors <arc@mulesoft.com>
Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.
*/
import { html } from 'lit-element';
import { ArcSettingsBase } from './ArcSettingsBase.js';
import '@anypoint-web-components/anypoint-item/anypoint-item.js';
import '@anypoint-web-components/anypoint-item/anypoint-item-body.js';
import '@anypoint-web-components/anypoint-switch/anypoint-switch.js';

export class ElectronExperimentsSettingsPanel extends ArcSettingsBase {
  static get properties() {
    return {
      /**
       * Collects information abour system variables when evaluating
       * request.
       */
      popupMenuExperimentEnabled: { type: Boolean, default: false },
      /**
       * Setting to validate certificates when making a request.
       * @type {Object}
       */
      validateCertificates: { type: Boolean, default: false },
      /**
       * Enables platform's native HTTP transport.
       */
      nativeTransport: { type: Boolean, default: false },
      /**
       * Enables requests/projects drag and drop between different views.
       */
      draggableEnabled: { type: Boolean, default: false }
    };
  }

  render() {
    return html`
    <h2 class="panel-title">Experiments</h2>
    <p class="experiments-info">Experimental features may be removed without notification.</p>
    <div class="card">
      ${this._switchTemplate({
        label: 'Popup menu',
        description: 'Allows to popup applicaiton menu to it\'s own window',
        name: 'popupMenuExperimentEnabled'
      })}
      ${this._switchTemplate({
        label: 'Validate SSL certificates',
        description: 'Validate certificate when making a request',
        name: 'validateCertificates'
      })}
      ${this._switchTemplate({
        label: 'Native request',
        description: 'Use platform\'s native HTTP transport instead of ARC\'s',
        name: 'nativeTransport'
      })}
      ${this._switchTemplate({
        label: 'Drag and drop support',
        description: 'Enables request and project data drag and drop between different views',
        name: 'draggableEnabled'
      })}
    </div>
    `;
  }
}
