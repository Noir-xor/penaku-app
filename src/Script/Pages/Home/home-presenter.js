export default class HomePresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  /**
   * Menampilkan peta laporan kerusakan dengan indikator loading.
   */
  async displayReportDetail() {
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error('displayReportDetail: Terjadi kesalahan saat menampilkan peta:', error);
    } finally {
      this.#view.hideLoading();
    }
  }

  /**
   * Inisialisasi halaman: memuat peta dan daftar cerita.
   */
  async initializeReportsPage() {
    try {
      // Tampilkan peta terlebih dahulu
      await this.displayReportDetail();

      // Ambil semua laporan dari API
      const response = await this.#model.getAllStories();

      // Validasi respons berdasarkan struktur API
      if (response?.error === true || !Array.isArray(response?.listStory)) {
        console.error('initializeReportsPage: Gagal mengambil laporan:', response);
        this.#view.populateReportsListError(response?.message || 'Gagal mengambil data laporan.');
        return;
      }

      // Tampilkan laporan jika berhasil
      this.#view.populateReportsList(response.message, response.listStory);
    } catch (error) {
      console.error('initializeReportsPage: Error umum:', error);
      this.#view.populateReportsListError(error.message || 'Terjadi kesalahan saat mengambil laporan.');
    } finally {
      this.#view.hideLoading();
    }
  }
}
