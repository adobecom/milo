import { LitElement } from 'lit';

export default class MatchMediaController {
    key;
    host;
    media;
    matches;

    /**
     * @param {LitElement} host
     * @param {string} query
     */
    constructor(host, query) {
        this.key = Symbol("match-media-key");
        this.media = window.matchMedia(query);
        this.matches = this.media.matches;
        this.updateMatches = this.updateMatches.bind(this);
        (this.host = host).addController(this);
    }

    hostConnected() {
        this.media.addEventListener('change', this.updateMatches)
    }

    hostDisconnected() {
        this.media.removeEventListener('change', this.updateMatches);
    }

    updateMatches() {
        if (this.matches === this.media.matches) return;
        this.matches = this.media.matches;
        this.host.requestUpdate(this.key, !this.matches);
    }
}
