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
import { html, css } from 'lit-element';
import { ArcSettingsBase } from './ArcSettingsBase.js';
import { arrowBack } from '@advanced-rest-client/arc-icons/ArcIcons.js';
import '@anypoint-web-components/anypoint-item/anypoint-item.js';
import '@anypoint-web-components/anypoint-item/anypoint-item-body.js';
import '@anypoint-web-components/anypoint-switch/anypoint-switch.js';
import '@anypoint-web-components/anypoint-button/anypoint-icon-button.js';
import '@anypoint-web-components/anypoint-button/anypoint-button.js';
import '@anypoint-web-components/anypoint-checkbox/anypoint-checkbox.js';
import '@anypoint-web-components/anypoint-dialog/anypoint-dialog.js';
import '@advanced-rest-client/export-panel/export-panel.js';

export class DataSettingsPanel extends ArcSettingsBase {
  static get styles() {
    return [
      ArcSettingsBase.styles,
      css`
      anypoint-checkbox {
        display: block;
        margin: 12px 0px;
      }
      `
    ];
  }
  static get properties() {
    return {
      /**
       * True when delete database request is being processed.
       */
      deletingDatabases: { type: Boolean, ignore: true },
      /**
       * History store enabled / disabled
       */
      historyEnabled: { type: Boolean, default: true },
      /**
       * When set is renders "REST APIs" delete option.
       */
      restApis: { type: Boolean, ignore: true }
    };
  }

  connectedCallback() {
    /* istanbul ignore else */
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    /* istanbul ignore else */
    if (this.page === undefined) {
      this.page = 0;
    }
  }

  _deleteAllClick() {
    const node = this.shadowRoot.querySelector('anypoint-dialog');
    /* istanbul ignore else */
    if (node) {
      node.opened = true;
    }
  }

  // Called when delete datastore dialog is closed.
  _onClearDialogResult(e) {
    if (!e.detail.confirmed) {
      return;
    }
    this.deleteDatabases();
  }

  _getSelectedDatabases() {
    const nodes = this.shadowRoot.querySelectorAll('#deleteForm anypoint-checkbox');
    const result = [];
    for (let i = 0, len = nodes.length; i < len; i++) {
      const node = nodes[i];
      if (!node.checked) {
        continue;
      }
      const { name } = node;
      result.push(name);
      if (name === 'saved') {
        result.push('legacy-projects');
      } else if (name === 'variables') {
        result.push('variables-environments');
      }
    }
    return result;
  }

  /**
   * Handler to be called when the clear data dialog has been closed.
   * It it's not canceled then it will clear (destroy) selected datastores.
   *
   * @return {Promise}
   */
  async deleteDatabases() {
    const models = this._getSelectedDatabases();
    this.deletingDatabases = true;
    const e = new CustomEvent('destroy-model', {
      bubbles: true,
      composed: true,
      detail: {
        models,
        result: []
      }
    });
    this.dispatchEvent(e);
    for(const promise of e.detail.result) {
      await promise;
    }
    this.deletingDatabases = false;
  }

  _exportAllFile() {
    const form = document.createElement('export-form');
    form.style.display = 'none';
    this.shadowRoot.appendChild(form);
    setTimeout(() => {
      form.selectAll();
      form.startExport();
      this.shadowRoot.removeChild(form);
    });
  }

  _dataSettingsTemplate() {
    return html`<section>
      <h2 class="panel-title">Stored data</h2>
      <div class="card">
        ${this._switchTemplate({
          label: 'Save history data',
          description: 'Automatically saves requests in a history',
          name: 'historyEnabled'
        })}
        ${this._pageItemTemplate({
          label: 'Data export options',
          description: 'Save history, saved requests and projects data to file',
          page: 1
        })}
        ${this._pageItemTemplate({
          label: 'Data cleanup',
          page: 2
        })}
      </div>
    </section>`;
  }

  _exportTemplate() {
    const { restApis, compatibility, outlined } = this;
    return html`<section>
      <h2 class="panel-title">
        <anypoint-icon-button
          @click="${this.back}"
          ?compatibility="${compatibility}">
          <span class="icon">${arrowBack}</span>
        </anypoint-icon-button>
        Data export
      </h2>
      <div class="card with-border with-padding">
        <export-form
          ?restapis="${restApis}"
          ?compatibility="${compatibility}"
          ?outlined="${outlined}"></export-form>
      </div>
    </section>`;
  }

  _clearDataTemplate() {
    const { restApis, compatibility, deletingDatabases } = this;
    return html`<section>
      <h2 class="panel-title">
        <anypoint-icon-button
          @click="${this.back}"
          ?compatibility="${compatibility}">
          <span class="icon">${arrowBack}</span>
        </anypoint-icon-button>
        Clear stored data
      </h2>

      <div class="card with-border with-padding" id="deleteForm">
        <p>What to remove?</p>
        <anypoint-checkbox name="saved" checked>Saved requests and projects</anypoint-checkbox>
        <anypoint-checkbox name="history" checked>Requests history</anypoint-checkbox>
        <anypoint-checkbox name="cookies" checked>Cookies</anypoint-checkbox>
        <anypoint-checkbox name="auth-data" checked>Saved passwords</anypoint-checkbox>
        <anypoint-checkbox name="url-history" checked>URLs history (autofill data)</anypoint-checkbox>
        <anypoint-checkbox name="websocket-url-history" checked>Web sockets history</anypoint-checkbox>
        <anypoint-checkbox name="variables" checked>Variables and environments</anypoint-checkbox>
        <anypoint-checkbox name="host-rules" checked>Host rules</anypoint-checkbox>
        ${restApis ? html`<anypoint-checkbox name="rest-apis" checked>REST APIs</anypoint-checkbox>` : ''}

        <div class="actions">
          <anypoint-button
            @click="${this._deleteAllClick}"
            emphasis="high"
            ?compatibility="${compatibility}"
            ?disabled="${deletingDatabases}"
            data-action="delete"
          >Remove</anypoint-button>
          ${deletingDatabases ? html`Clearing data...` : ''}
        </div>
      </div>

      <anypoint-dialog @overlay-closed="${this._onClearDialogResult}" ?compatibility="${compatibility}">
        <h2>Remove data?</h2>
        <div>Maybe you should create a backup first?</div>
        <div class="buttons">
          <anypoint-button
            ?compatibility="${compatibility}"
            data-action="delete-export-all"
            @click="${this._exportAllFile}">Create backup file</anypoint-button>
          <anypoint-button
            ?compatibility="${compatibility}"
            dialog-dismiss>Cancel</anypoint-button>
          <anypoint-button
            ?compatibility="${compatibility}"
            dialog-confirm
            class="action-button"
            autofocus>Confirm</anypoint-button>
        </div>
      </anypoint-dialog>
    </section>`;
  }

  render() {
    const { page } = this;
    if (page === 0) {
      return this._dataSettingsTemplate();
    }
    if (page === 1) {
      return this._exportTemplate();
    }
    /* istanbul ignore else */
    if (page === 2) {
      return this._clearDataTemplate();
    }
  }
}
