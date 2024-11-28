export default function mmmGeoDropdownHtml() {
  return `
    <div class="six wide field" id="geo-dropdown">
      <label>Region/geo</label>
      <div class="ui fluid search selection dropdown directValue">
        <input type="hidden" name="locale" />
        <i class="dropdown icon"></i>
        <div class="default text">Select Region or Geo</div>
        <div class="menu">
          <div class="item" data-value="">All geos</div>
          <h5 class="ui header">Regions</h5>
          <div class="item" data-value="na region"><i class="us flag"></i>NA: US, CA, CA_FR</div>
          <div class="item" data-value="apac region"><i class="au flag"></i>APAC: AU, NZ, KR</div>
          <div class="item" data-value="latam region"><i class="mx flag"></i>LATAM: MX, BR</div>
          <div class="item" data-value="jp region"><i class="jp flag"></i>Japan 日本 (ja_JP)</div>
          <h5 class="ui header">Top geos</h5>
          <div class="item" data-value="us"><i class="us flag"></i>US: United States </div>
          <div class="item" data-value="ca_fr"><i class="ca flag"></i>CA-EN: Canada - English</div>
          <div class="item" data-value="ca"><i class="ca flag"></i>CA-FR: Canada - Français</div>
          <div class="item" data-value="au"><i class="au flag"></i>AU: Australia</div>
          <div class="item" data-value="nz"><i class="nz flag"></i>NZ: New Zealand</div>
          <div class="item" data-value="kr"><i class="kr flag"></i>KR: Korea 한국</div>
          <div class="item" data-value="mx"><i class="mx flag"></i>MX: México</div>
          <div class="item" data-value="pt"><i class="br flag"></i>BR: Brasil</div>
          <div class="item" data-value="jp"><i class="jp flag"></i>JP: Japan 日本</div>
        </div>
      </div>
    </div>
  `;
}
