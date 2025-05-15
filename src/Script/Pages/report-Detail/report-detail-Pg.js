// stories-detail-pg.js (Updated integration with templates)

import {
  createLoaderAbsoluteHTML,
createReportDetailHTML,
  createReportDetailErrorHTML ,
  createSaveReportButtonHTML,
  createRemoveReportButtonHTML,
} from '../../templates';
import { initCarousel } from '../../Utils/index';
import ReportDetailPresenter from './report-detail-presenter';
import { parseActivePathname } from '../../routes/url-parser';
import CustomMap from '../../Utils/map'
import * as PenaKuAPI from '../../Data/api';

export default class ReportDetailPage {
  #presenter = null;
  #form = null;
  #map = null;

  async render() {
    return `
      <section>
        <div class="stories-detail__container">
          <div id="stories-detail" class="stories-detail"></div>
          <div id="stories-detail-loading-container"></div>
        </div>
      </section>
       <div id="stories-detail-notify-me" class="map-loading">

      <section class="container">
      
        <hr>
        <div class="stories-detail__comments__container">
          <div class="stories-detail__comments-form__container">
            <h2 class="stories-detail__comments-form__title">Give Feedback</h2>
            <form id="comments-list-form" class="stories-detail__comments-form__form">
              <textarea name="body" placeholder="Share your story on this app."></textarea>
              <div id="submit-button-container">
                <button class="btn" type="submit">Share</button>
              </div>
            </form>
          </div>
          <hr>
          <div class="stories-detail__comments-list__container">
            <div id="stories-detail-comments-list"></div>
            <div id="comments-list-loading-container"></div>
          </div>
        </div>
       <div id="map-container" style="height: 400px;"></div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new ReportDetailPresenter(parseActivePathname().id, {
      view: this,
      apiModel: PenaKuAPI,
    });

    this.#initializeCommentForm();

    this.#presenter.displayReportDetails();
  }

  async loadReportDetailAndMap(message, stories) {
    document.getElementById('stories-detail').innerHTML = createReportDetailHTML({
      name: stories.name,
      description: stories.description,
      photoUrl: stories.photoUrl,
      lat: stories.lat,
      lon: stories.lon,
      createdAt: stories.createdAt,
    });

  
    await this.#presenter.displayReportDetail();
  
    this.#presenter.displaySaveButton();
    this.#addNotificationListener();

    // marker ke peta
    if (stories.lat && stories.lon) {
      this.map.addMarker([stories.lat, stories.lon], {
        popup: {
          content: `<b>${stories.name}</b><br>${stories.description}`,
        },
      });

      this.map.setView([stories.lat, stories.lon], 15);
    }
  }  

  renderReportDetailError(message) {
    document.getElementById('stories-detail').innerHTML = createReportDetailErrorHTML(message);
  }

  renderCommentsList(message, comments) {
    if (comments.length === 0) {
      this.renderEmptyCommentsList();
      return;
    }

    const html = comments.reduce((acc, comment) => {
      return acc.concat(
        createCommentItemHTML({
          photoUrlCommenter: comment.commenter.photoUrl,
          nameCommenter: comment.commenter.name,
          body: comment.body,
        }),
      );
    }, '');

    document.getElementById('stories-detail-comments-list').innerHTML = `
      <div class="__comments-list">${html}</div>
    `;
  }

  renderEmptyCommentsList() {
    document.getElementById('stories-detail-comments-list').innerHTML = createEmptyCommentsHTML();
  }

  renderCommentsError(message) {
    document.getElementById('stories-detail-comments-list').innerHTML = createCommentsErrorHTML(message);
  }

  async initialMap() {
  try {
    this.map = await CustomMap.build('#map', {
      locate: true, // Atur peta ke lokasi pengguna jika tersedia
      zoom: 15,
    });

    // Misalnya, tambahkan listener klik di peta
    this.map.addMapEventListener('click', async (event) => {
      const { lat, lng } = event.latlng;
      const placeName = await this.map.getPlaceNameByCoordinate(lat, lng);

      this.map.addMarker([lat, lng], {
        popup: {
          content: `Anda mengklik: ${placeName}`,
        },
      });
    });
  } catch (error) {
    console.error('Gagal inisialisasi peta:', error);
  }
}

  #initializeCommentForm() {
    this.#form = document.getElementById('comments-list-form');
    this.#form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = {
        body: this.#form.elements.namedItem('body').value,
      };
      await this.#presenter.submitComment(formData);
    });
  }

  handleCommentPostSuccess(message) {
    console.log(message);
    this.#presenter.loadReportComments();
    this.#resetForm();
  }

  handleCommentPostFailure(message) {
    alert(message);
  }

  #resetForm() {
    this.#form.reset();
  }

renderSaveButton() {
  document.getElementById('submit-button-container').innerHTML = createSaveReportButtonHTML();
  document.getElementById('stories-detail-save').addEventListener('click', () => {
    this.#presenter.saveReport();
  });
}

renderRemoveButton() {
  document.getElementById('submit-button-container').innerHTML = createRemoveReportButtonHTML();
  document.getElementById('stories-detail-remove').addEventListener('click', () => {
    this.#presenter.removeReport();
  });
}


  #addNotificationListener() {
    document.getElementById('stories-detail-notify-me').addEventListener('click', () => {
      this.#presenter.sendReportNotification();
    });
  }

  showDetailLoading() {
    document.getElementById('stories-detail-loading-container').innerHTML = createLoaderAbsoluteHTML();
  }

  hideDetailLoading() {
    document.getElementById('stories-detail-loading-container').innerHTML = '';
  }

  showMapLoading() {
    document.getElementById('map-loading-container').innerHTML = createLoaderAbsoluteHTML();
  }

  hideMapLoading() {
    document.getElementById('map-loading-container').innerHTML = '';
  }

  showCommentsLoading() {
    document.getElementById('comments-list-loading-container').innerHTML = createLoaderAbsoluteHTML();
  }

  hideCommentsLoading() {
    document.getElementById('comments-list-loading-container').innerHTML = '';
  }

  showSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button class="btn" type="submit" disabled>
        <i class="fas fa-spinner loader-button"></i> Tanggapi
      </button>
    `;
  }

  hideSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button class="btn" type="submit">Tanggapi</button>
    `;
  }
}
