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
import { openInNew } from '@advanced-rest-client/arc-icons/ArcIcons.js';
import '@anypoint-web-components/anypoint-item/anypoint-item.js';
import '@anypoint-web-components/anypoint-item/anypoint-item-body.js';
import '@anypoint-web-components/anypoint-switch/anypoint-switch.js';

export class PrivacySettingsPanel extends ArcSettingsBase {
  static get properties() {
    return {
      /**
       * If true then Google Analytics tracking is enabled.
       */
      telemetry: { type: Boolean },
      /**
       * A link to the privacy policy
       */
      privacyPolicyUrl: { type: String }
    };
  }

  constructor() {
    super();
    let url = 'https://docs.google.com/document/d/';
    url += '1BzrKQ0NxFXuDIe2zMA-0SZBNU0P46MHr4GftZmoLUQU/edit';
    this.privacyPolicyUrl = url;
  }

  // Opens privacy policy in a new window.
  openPrivacyPolicy() {
    this._openLink(this.privacyPolicyUrl);
  }

  _processValues(values) {
    if (typeof values.telemetry === 'undefined') {
      values.telemetry = true;
    } else {
      values.telemetry = this._boolValue(values.telemetry);
    }
    return values;
  }

  _setSettings(values) {
    this.__settingsRestored = false;
    this.telemetry = values.telemetry;
    this.__settingsRestored = true;
  }

  _settingsChanged(key, value) {
    this.__settingsRestored = false;
    switch (key) {
      case 'telemetry':
       this[key] = value;
       break;
    }
    this.__settingsRestored = true;
  }

  render() {
    const { compatibility, telemetry } = this;
    return html`<h2 class="panel-title">Account and privacy</h2>
    <section class="card">
      <anypoint-item
        class="clickable"
        @click="${this._toggleOption}"
        ?compatibility="${compatibility}">
        <anypoint-item-body twoline ?compatibility="${compatibility}">
          <div>
            Send anonymous usage data
          </div>
          <div secondary>Help us make ARC better by providing anonymous usage statistics.</div>
        </anypoint-item-body>
        <anypoint-switch
          tabindex="-1"
          .checked="${telemetry}"
          name="telemetry"
          @checked-changed="${this._toogleBooleanValue}"
          ?compatibility="${compatibility}"></anypoint-switch>
      </anypoint-item>

      <anypoint-item
        @click="${this.openPrivacyPolicy}"
        class="clickable"
        ?compatibility="${compatibility}">
        <anypoint-item-body twoline ?compatibility="${compatibility}">
          <div>Privacy policy</div>
          <div secondary>Opens application privacy policy in a browser.</div>
        </anypoint-item-body>
        <span class="panel-icon nav-away-icon">${openInNew}</span>
      </anypoint-item>
    </section>`;
  }
}
