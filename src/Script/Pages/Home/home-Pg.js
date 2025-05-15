import {
  createReportItemHTML,
  createReportsErrorHTML,
  createLoaderAbsoluteHTML, 
} from '../../templates';
import HomePresenter from './home-presenter';
import * as PenaKuAPI from '../../Data/api';
import 'leaflet/dist/leaflet.css';

export default class HomePage {
  #presenter = null;

  async render() {
    return `
      <section>
        <div class="listStory-list__map__container" id="home">
          <div id="map" style="width: 100%; height: 400px;"></div>
          <div id="center-pin">
          <img src="images/mark.png" alt="Pin" style="width:100%; height:100%;">
          </div>
        </div>
      </section>

      <section class="container">
        <h1 class="section-title">Our Story List</h1>

        <div class="listStory-list__container">
          <div id="listStory-list"></div>
          <div id="listStory-list-loading-container"></div>
        </div>
      </section>

      <section class="container">
        <div id="push-notification-tools"></div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter({
      view: this,
      model: PenaKuAPI,
    });

    await this.#presenter.initializeReportsPage();
  }

  /**
   * Menampilkan daftar cerita ke dalam elemen HTML.
   * Jika data kosong, tampilkan tampilan kosong.
   */
  populateReportsList(message, listStory) {
    if (listStory.length === 0) {
      this.populateReportsListEmpty();
      return;
    }

    const listStoryHTML = listStory
      .map((stories) =>
        createReportItemHTML({
          ...stories,
          storieserName: stories.name,
        }),
      )
      .join('');

    document.getElementById('listStory-list').innerHTML = `
      <div class="listStory-list">${listStoryHTML}</div>
    `;
  }

  /**
   * Menampilkan tampilan kosong ketika tidak ada laporan.
   */
  populateReportsListEmpty() {
    document.getElementById('listStory-list').innerHTML = createReportItemHTML();
  }

  /**
   * Menampilkan pesan kesalahan saat gagal memuat laporan.
   */
  populateReportsListError(message) {
    document.getElementById('listStory-list').innerHTML = createReportsErrorHTML(message);
  }

async initialMap() {
  const L = await import('leaflet');

  // Hapus map sebelumnya jika sudah ada
  if (this._map) {
    this._map.remove();
  }

  // Inisialisasi map baru
  this._map = L.map('map').setView([-6.200000, 106.816666], 11);

  // Tambahkan tile layer dari OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(this._map); 

  // Tambahkan listener untuk ambil koordinat tengah setelah peta digeser
  this._map.on('moveend', () => {
    const center = this._map.getCenter();
    console.log('Koordinat tengah:', center.lat, center.lng);
  });
}
  /**
   * Menghapus loading spinner dari daftar laporan.
   */
  hideLoading() {
    document.getElementById('listStory-list-loading-container').innerHTML = '';
  }
}
