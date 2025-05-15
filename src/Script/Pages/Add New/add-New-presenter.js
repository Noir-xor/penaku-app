export default class AddNewPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

// Add-New-presenter.js
async displayMapForNewForm() {
  try {
    await this.#view.initialMap(); // Ganti ke method yang benar
  } catch (error) {
    console.error('Error initializing map:', error);
    // Tambahkan fallback atau error handling
    this.#view.showMapError("Failed to load map");
  }
}

  async submitNewReport({ description, evidenceImages, lat, lon }) {
    this.#view.showSubmitLoadingButton();
    try {
      const photo = evidenceImages.length > 0 ? evidenceImages[0] : null;
    
      const result = await this.#model.storeNewReport({description, photo, lat, lon});
      
      if (!result.ok) {
        console.error('submitNewReport response error:', result);
        this.#view.storeFailed(result.message);
        return;
      }

      //men-trigger pengiriman push message tepat setelah laporan berhasil
      //this.#notifyToAllUser(response.data.id);


      this.#view.storeSuccessfully(result.message, result.data);
    } catch (error) {
      console.error('submitNewReport failed:', error);
      this.#view.storeFailed(error.message);
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }  
}  

//async #notifyToAllUser(reportId) {
    //try {
     //const response = await this.#model.sendReportToAllUserViaNotification(reportId);
      //if (!response.ok) {
       // console.error('#notifyToAllUser: response:', response);
        //return false;
      //}
      //return true;
   // } catch (error) {
      //console.error('#notifyToAllUser: error:', error);
      //return false;
    //}
  //}
//}
