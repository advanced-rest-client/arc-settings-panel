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
import { arrowDropDown, arrowBack } from '@advanced-rest-client/arc-icons/ArcIcons.js';
import '@anypoint-web-components/anypoint-item/anypoint-item.js';
import '@anypoint-web-components/anypoint-item/anypoint-item-body.js';
import '@anypoint-web-components/anypoint-input/anypoint-input.js';
import '@anypoint-web-components/anypoint-switch/anypoint-switch.js';
import '@anypoint-web-components/anypoint-button/anypoint-icon-button.js';
export class RequestSettingsPanel extends ArcSettingsBase {
  static get properties() {
    return {
      /**
       * Variables support enabled setting.
       */
      appVariablesEnabled: { type: Boolean },
      /**
       * Sequest default timeout setting.
       */
      requestDefaultTimeout: { type: Number },
      /**
       * Global option to follow redirects
       */
      followRedirects: { type: Boolean },
      /**
       * Collects information abour system variables when evaluating
       * request.
       */
      systemVariablesEnabled: { type: Boolean },
      /**
       * When set `systemVariablesEnabled` options is disabled.
       * Chrome apps does not have this option.
       */
      systemVariablesDisabled: { type: Boolean },
      /**
       * Default OAuth 2 redirect URI.
       */
      oauth2redirectUri: { type: String },
      /**
       * The default value for the OAuth2 redirect URI if missing.
       */
      defaultOauth2RedirectUri: { type: String },
      /**
       * Ignore `content-*` headers when making GET request
       */
      ignoreContentOnGet: { type: Boolean }
    };
  }

  get timeoutLabel() {
    const { requestDefaultTimeout } = this;
    if (requestDefaultTimeout > 0) {
      return `Timeout request after ${requestDefaultTimeout} seconds`;
    }
    return 'No timeout';
  }

  constructor() {
    super();
    this.defaultOauth2RedirectUri = 'https://auth.advancedrestclient.com/oauth-popup.html';
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    if (this.page === undefined) {
      this.page = 0;
    }
  }

  _processValues(values) {
    if (typeof values.appVariablesEnabled === 'undefined') {
      if (typeof values.variablesEnabled !== 'undefined') {
        values.appVariablesEnabled = this._boolValue(values.variablesEnabled);
      } else {
        values.appVariablesEnabled = true;
      }
    } else {
      values.appVariablesEnabled = this._boolValue(values.appVariablesEnabled);
    }
    if (typeof values.followRedirects === 'undefined') {
      values.followRedirects = true;
    } else {
      values.followRedirects = this._boolValue(values.followRedirects);
    }
    if (typeof values.requestDefaultTimeout === 'undefined') {
      values.requestDefaultTimeout = 45;
    } else {
      values.requestDefaultTimeout = this._numValue(values.requestDefaultTimeout);
      if (values.requestDefaultTimeout > 1000) {
        values.requestDefaultTimeout = Math.round(values.requestDefaultTimeout/1000);
      }
    }
    if (typeof values.systemVariablesEnabled === 'undefined') {
      values.systemVariablesEnabled = true;
    } else {
      values.systemVariablesEnabled = this._boolValue(values.systemVariablesEnabled);
    }

    if (typeof values.oauth2redirectUri === 'undefined') {
      values.oauth2redirectUri = this.defaultOauth2RedirectUri;
    }

    if (typeof values.ignoreContentOnGet === 'undefined') {
      values.ignoreContentOnGet = false;
    } else {
      values.ignoreContentOnGet = this._boolValue(values.ignoreContentOnGet);
    }
    return values;
  }

  _setSettings(values) {
    this.__settingsRestored = false;
    this.appVariablesEnabled = values.appVariablesEnabled;
    this.followRedirects = values.followRedirects;
    this.requestDefaultTimeout = values.requestDefaultTimeout;
    this.systemVariablesEnabled = values.systemVariablesEnabled;
    this.oauth2redirectUri = values.oauth2redirectUri;
    this.ignoreContentOnGet = values.ignoreContentOnGet;
    this.__settingsRestored = true;
  }

  _settingsChanged(key, value) {
    this.__settingsRestored = false;
    switch (key) {
      case 'appVariablesEnabled':
      case 'systemVariablesEnabled':
      case 'requestDefaultTimeout':
      case 'followRedirects':
      case 'ignoreContentOnGet':
        this[key] = value;
        break;
    }
    this.__settingsRestored = true;
  }

  _requestSettingsTemplate() {
    const {
      timeoutLabel,
      appVariablesEnabled,
      systemVariablesDisabled,
      systemVariablesEnabled,
      followRedirects,
      ignoreContentOnGet,
      compatibility
    } = this;
    return html`<section>
      <h2 class="panel-title">Request behavior</h2>
      <div class="card">
        <anypoint-item
          data-page="1"
          @click="${this._showPage}"
          class="clickable"
          ?compatibility="${compatibility}">
          <anypoint-item-body twoline ?compatibility="${compatibility}">
            <div>
              Request timeout
            </div>
            <div secondary>${timeoutLabel}</div>
          </anypoint-item-body>
          <span class="panel-icon nav-away-icon">${arrowDropDown}</span>
        </anypoint-item>

        <anypoint-item
          data-page="2"
          @click="${this._showPage}"
          class="clickable"
          ?compatibility="${compatibility}">
          <anypoint-item-body twoline ?compatibility="${compatibility}">
            <div>
              OAuth2 redirect URI
            </div>
            <div secondary>Sets default OAuth2 redirect URI</div>
          </anypoint-item-body>
          <span class="panel-icon nav-away-icon">${arrowDropDown}</span>
        </anypoint-item>

        <anypoint-item
          class="clickable"
          @click="${this._toggleOption}"
          ?compatibility="${compatibility}">
          <anypoint-item-body twoline ?compatibility="${compatibility}">
            <div>
              Local variables
            </div>
            <div secondary>Use application variables when processing request</div>
          </anypoint-item-body>
          <anypoint-switch
            tabindex="-1"
            .checked="${appVariablesEnabled}"
            name="appVariablesEnabled"
            @checked-changed="${this._toogleBooleanValue}"
            ?compatibility="${compatibility}"></anypoint-switch>
        </anypoint-item>

        <anypoint-item
          class="clickable"
          @click="${this._toggleOption}"
          ?disabled="${systemVariablesDisabled}"
          ?compatibility="${compatibility}">
          <anypoint-item-body twoline ?compatibility="${compatibility}">
            <div>
              System variables
            </div>
            <div secondary="">Include system variables when processing request</div>
          </anypoint-item-body>
          <anypoint-switch
            tabindex="-1"
            .checked="${systemVariablesEnabled}"
            ?disabled="${systemVariablesDisabled}"
            name="systemVariablesEnabled"
            @checked-changed="${this._toogleBooleanValue}"
            ?compatibility="${compatibility}"></anypoint-switch>
        </anypoint-item>

        <anypoint-item
          class="clickable"
          @click="${this._toggleOption}"
          ?compatibility="${compatibility}">
          <anypoint-item-body twoline ?compatibility="${compatibility}">
            <div>
              Follow redirects
            </div>
            <div secondary="">Automatically follow redirects when making a request</div>
          </anypoint-item-body>
          <anypoint-switch
            tabindex="-1"
            name="followRedirects"
            .checked="${followRedirects}"
            @checked-changed="${this._toogleBooleanValue}"
            ?compatibility="${compatibility}"></anypoint-switch>
        </anypoint-item>

        <anypoint-item
          class="clickable"
          @click="${this._toggleOption}"
          ?compatibility="${compatibility}">
          <anypoint-item-body twoline ?compatibility="${compatibility}">
            <div>
              Ignore content related headers for GET request
            </div>
            <div secondary="">Ignore all <b>Content-*</b> headers when making a GET request.</div>
          </anypoint-item-body>
          <anypoint-switch
            tabindex="-1"
            .checked="${ignoreContentOnGet}"
            name="ignoreContentOnGet"
            @checked-changed="${this._toogleBooleanValue}"
            ?compatibility="${compatibility}"></anypoint-switch>
        </anypoint-item>
      </div>
    </section>`;
  }

  _timeoutTemplate() {
    const { requestDefaultTimeout, compatibility } = this;
    return html`<section>
      <h2 class="panel-title">
        <anypoint-icon-button
          @click="${this.back}"
          ?compatibility="${compatibility}">
          <span class="icon">${arrowBack}</span>
        </anypoint-icon-button>
        Timeout settings
      </h2>
      <div class="card with-border">
        <anypoint-input
          min="0"
          step="1"
          type="number"
          .value="${requestDefaultTimeout}"
          name="requestDefaultTimeout"
          @value-changed="${this._inputValueHandler}"
          pattern="[0-9]*"
          invalidmessage="Enter time as a number"
          class="auto-width"
          ?compatibility="${compatibility}">
          <label slot="label">Request timeout</label>
          <div slot="suffix">seconds</div>
        </anypoint-input>
        <p>
          When set to "0" (zero) then the request will never timeout.
          If the server does not close the connection and sends no response then the request will never end.
        </p>
        <p>
          Set the value to positive number to set the time (in seconds) after which the request will timeout.
        </p>
      </div>
    </section>`;
  }

  _redirectTemplate() {
    const { oauth2redirectUri, compatibility } = this;
    return html`<section>
      <h2 class="panel-title">
        <anypoint-icon-button
          @click="${this.back}"
          ?compatibility="${compatibility}">
          <span class="icon">${arrowBack}</span>
        </anypoint-icon-button>
        OAuth2 redirect URI
      </h2>

      <div class="card with-border">
        <anypoint-input
          class="oauth2-redirect"
          .value="${oauth2redirectUri}"
          type="url"
          required
          autovalidate
          invalidmessage="Enter valid URL"
          name="oauth2redirectUri"
          @value-changed="${this._inputValueHandler}"
          ?compatibility="${compatibility}"
        >
          <label slot="label">URI value</label>
        </anypoint-input>
        <p>
          This value is used by the authorization panel in the request editor.
          ARC will use this URI to pass it to the autorization server.
        </p>
      </div>
    </section>`;
  }

  render() {
    const { page } = this;
    if (page === 0) {
      return this._requestSettingsTemplate();
    }
    if (page === 1) {
      return this._timeoutTemplate();
    }
    if (page === 2) {
      return this._redirectTemplate();
    }
  }
}
