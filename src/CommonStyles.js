import { css } from 'lit-element';

export default css`
  :host {
    display: block;
  }

  .panel-title {
    font-size: var(--arc-font-subhead-font-size);
    font-weight: var(--arc-font-subhead-font-weight);
    line-height: var(--arc-font-subhead-line-height);
    display: flex;
    flex-direction: row;
    align-items: center;
    color: var(--arc-settings-panel-header-color);
    fill: currentcolor;
  }

  .panel-icon {
    fill: var(--icon-fill-color, currentcolor);
    width: 24px;
    height: 24px;
  }

  .nav-away-icon {
    transform: rotate(-90deg);
  }

  .clickable {
    cursor: pointer;
  }

  .card {
    padding: 12px;
    border-radius: 4px;
    border: 1px #e5e5e5 solid;
    background-color: var(--arc-settings-panel-card-background-color);
  }

  :host([compatibility]) .card {
    padding: 0;
    border-left: 0;
    border-right: 0;
    border-radius: 0;
    border-top: 2px var(--anypoint-item-border-left-color, var(--anypoint-color-aluminum4)) solid;
    border-bottom: 2px var(--anypoint-item-border-left-color, var(--anypoint-color-aluminum4)) solid;
  }

  :host([compatibility]) .card.with-padding {
    padding: 10px;
  }

  :host([compatibility]) .card.with-border {
    border: 2px var(--anypoint-item-border-left-color, var(--anypoint-color-aluminum4)) solid;
  }

  p {
    margin: 16px;
  }

  .error-toast {
    background-color: var(--warning-primary-color, #ff7043);
    color: var(--warning-contrast-color, #fff);
  }

  .icon {
    width: 24px;
    height: 24px;
  }

  anypoint-input:not(.auto-width) {
    width: auto;
    max-width: 700px;
  }

  anypoint-switch {
    margin-right: 0;
  }
`;
