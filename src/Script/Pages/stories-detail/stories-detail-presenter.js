import { storiesMap } from '../../data/api-map';

export default class storiesDetailPresenter {
  #storiesId;
  #view;
  #api;

  constructor(storiesId, { view, apiModel }) {
    this.#storiesId = storiesId;
    this.#view = view;
    this.#api = apiModel;

  }

async displaystoriesDetail() {
  this.#view.showMapLoading();
  try {
    await this.#view.initialMap();
  } catch (error) {
    console.error('displaystoriesDetail error:', error);
  } finally {
    this.#view.hideMapLoading(); // BUKAN hideDetailLoading
  }
}

  async displaystoriesDetails() {
    this.#view.showDetailLoading();
    try {
      console.log(this.#storiesId);
      
      const response = await this.#api.getStoryDetail(this.#storiesId);


      if (response.error) {
        console.error('displaystoriesDetails error:', response);
        this.#view.renderstoriesDetailError(response.message);
        return;
      }

      this.#view.loadstoriesDetailAndMap(response.message, response.story);
    } catch (error) {
      console.error('displaystoriesDetails fetch error:', error);
      this.#view.renderstoriesDetailError(error.message);
    } finally {
      this.#view.hideDetailLoading();
    }
  }

  displaySaveButton() {
    if (this.#isstoriesSaved()) {
      this.#view.renderRemoveButton();
    } else {
      this.#view.renderSaveButton();
    }
  }

#isstoriesSaved() {
    const savedstoriess = JSON.parse(localStorage.getItem('savedstoriess')) || [];
    return savedstoriess.includes(this.#storiesId);
  }

  async savestories() {
    try {
      const savedstoriess = JSON.parse(localStorage.getItem('savedstoriess')) || [];

      if (!savedstoriess.includes(this.#storiesId)) {
        savedstoriess.push(this.#storiesId);
        localStorage.setItem('savedstoriess', JSON.stringify(savedstoriess));

        this.#view.renderRemoveButton();
      } else {
        console.log('stories already saved');
      }
    } catch (error) {
      console.error('Error saving stories:', error);
      this.#view.renderSaveError(error.message);
    }
  }

  async removestories() {
    try {
      let savedstoriess = JSON.parse(localStorage.getItem('savedstoriess')) || [];
      savedstoriess = savedstoriess.filter(id => id !== this.#storiesId);
      localStorage.setItem('savedstoriess', JSON.stringify(savedstoriess));

      this.#view.renderSaveButton();
    } catch (error) {
      console.error('Error removing stories:', error);
      this.#view.renderRemoveError(error.message);
    }
  }

  async sendstoriesNotification() {
  try {
    const result = await this.#api.sendstoriesToMeViaNotification(this.#storiesId);
    if (!result.ok) {
      console.error('sendstoriesNotification: Failed response:', result);
      return;
    }
      console.log('sendstoriesNotification: Success message:', result.message);
    } catch (err) {
      console.error('sendstoriesNotification: Exception occurred:', err);
    }
  }
}


