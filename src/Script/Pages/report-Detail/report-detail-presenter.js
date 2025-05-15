import { reportMapper } from '../../Data/api-map';

export default class ReportDetailPresenter {
  #storiesId;
  #view;
  #api;

  constructor(storiesId, { view, apiModel }) {
    this.#storiesId = storiesId;
    this.#view = view;
    this.#api = apiModel;

  }

async displayReportDetail() {
  this.#view.showMapLoading();
  try {
    await this.#view.initialMap();
  } catch (error) {
    console.error('displayReportDetail error:', error);
  } finally {
    this.#view.hideMapLoading(); // BUKAN hideDetailLoading
  }
}

  async displayReportDetails() {
    this.#view.showDetailLoading();
    try {
      console.log(this.#storiesId);
      
      const response = await this.#api.getStoryDetail(this.#storiesId);


      if (response.error) {
        console.error('displayReportDetails error:', response);
        this.#view.renderReportDetailError(response.message);
        return;
      }

      this.#view.loadReportDetailAndMap(response.message, response.story);
    } catch (error) {
      console.error('displayReportDetails fetch error:', error);
      this.#view.renderReportDetailError(error.message);
    } finally {
      this.#view.hideDetailLoading();
    }
  }

  displaySaveButton() {
    if (this.#isReportSaved()) {
      this.#view.renderRemoveButton();
    } else {
      this.#view.renderSaveButton();
    }
  }

#isReportSaved() {
    const savedReports = JSON.parse(localStorage.getItem('savedReports')) || [];
    return savedReports.includes(this.#storiesId);
  }

  async saveReport() {
    try {
      const savedReports = JSON.parse(localStorage.getItem('savedReports')) || [];

      if (!savedReports.includes(this.#storiesId)) {
        savedReports.push(this.#storiesId);
        localStorage.setItem('savedReports', JSON.stringify(savedReports));

        this.#view.renderRemoveButton();
      } else {
        console.log('Report already saved');
      }
    } catch (error) {
      console.error('Error saving report:', error);
      this.#view.renderSaveError(error.message);
    }
  }

  async removeReport() {
    try {
      let savedReports = JSON.parse(localStorage.getItem('savedReports')) || [];
      savedReports = savedReports.filter(id => id !== this.#storiesId);
      localStorage.setItem('savedReports', JSON.stringify(savedReports));

      this.#view.renderSaveButton();
    } catch (error) {
      console.error('Error removing report:', error);
      this.#view.renderRemoveError(error.message);
    }
  }

  async sendReportNotification() {
  try {
    const result = await this.#api.sendReportToMeViaNotification(this.#storiesId);
    if (!result.ok) {
      console.error('sendReportNotification: Failed response:', result);
      return;
    }
      console.log('sendReportNotification: Success message:', result.message);
    } catch (err) {
      console.error('sendReportNotification: Exception occurred:', err);
    }
  }
}


