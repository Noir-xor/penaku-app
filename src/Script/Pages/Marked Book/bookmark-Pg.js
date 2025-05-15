export default class BookmarkPage {
  async render() {
    return '';
  }

  async afterRender() {
    alert('Halaman cerita tersimpan akan segera hadir!');

    location.hash = '/';
  }
}  