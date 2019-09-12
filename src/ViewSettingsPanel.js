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
import '@anypoint-web-components/anypoint-dropdown-menu/anypoint-dropdown-menu.js';
import '@anypoint-web-components/anypoint-listbox/anypoint-listbox.js';

export class ViewSettingsPanel extends ArcSettingsBase {
  static get properties() {
    return {
      /**
       * Current setting value for list types.
       */
      viewListType: { type: String }
    };
  }

  /**
   * Dispatches `navigate` ebenmt to themes panel.
   */
  openThemesPanel() {
    this.dispatchEvent(new CustomEvent('navigate', {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {
        base: 'themes-panel'
      }
    }));
  }

  _processValues(values) {
    if (typeof values.viewListType === 'undefined') {
      values.viewListType = 'default';
    } else {
      values.viewListType = String(values.viewListType);
    }
    return values;
  }

  _setSettings(values) {
    this.__settingsRestored = false;
    this.viewListType = values.viewListType;
    this.__settingsRestored = true;
  }

  _settingsChanged(key, value) {
    this.__settingsRestored = false;
    switch (key) {
      case 'viewListType':
        this[key] = value;
        break;
    }
    this.__settingsRestored = true;
  }

  render() {
    const { viewListType, compatibility } = this;
    return html`
    <h2 class="panel-title">View settings</h2>
    <div class="card">
      <div class="layout-selector">
        <anypoint-dropdown-menu
          ?compatibility="${compatibility}"
          name="viewListType">
          <label slot="label">Lists layout</label>
          <anypoint-listbox
            slot="dropdown-content"
            attrforselected="data-value"
            .selected="${viewListType}"
            ?compatibility="${compatibility}"
            @selected-changed="${this._listValueHandler}">
            <anypoint-item data-value="default">Default</anypoint-item>
            <anypoint-item data-value="comfortable">Comfortable</anypoint-item>
            <anypoint-item data-value="compact">Compact</anypoint-item>
          </anypoint-listbox>
        </anypoint-dropdown-menu>
      </div>

      <anypoint-item
        @click="${this.openThemesPanel}"
        class="clickable"
        ?compatibility="${compatibility}">
        <anypoint-item-body twoline ?compatibility="${compatibility}">
          <div>Themes</div>
          <div secondary>Opens themes selector screen</div>
        </anypoint-item-body>
        <span class="panel-icon nav-away-icon">${openInNew}</span>
      </anypoint-item>
    </div>`;
  }
}
