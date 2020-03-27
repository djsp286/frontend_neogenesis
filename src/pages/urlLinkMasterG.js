/* URL to get Data withPagination
KO ERVIN: http://10.0.112.164:8081/getUnitList
    WILB :http://10.0.112.246:8081/getUnitList  */

    //-->>  MASTER G  <<--//
    //URL REASON
    var url_getTotalReasonPage = "https://api.docnet.id/CHCMasterG/MasterReason/getTotalReasonPage";
    var url_getListReason      = "https://api.docnet.id/CHCMasterG/MasterReason/getReasonList";
    var url_addNewReason       = "https://api.docnet.id/CHCMasterG/MasterReason/addNewReason";
    var url_editReason         = "https://api.docnet.id/CHCMasterG/MasterReason/editMReason";

    //URL Expedisi
    var url_getTotalExpedisiPage = "https://api.docnet.id/CHCMasterG/MasterEkspedisi/getTotalExpeditionPage";
    var url_getExpedisiList      = "https://api.docnet.id/CHCMasterG/MasterEkspedisi/getExpeditionList";
    var url_addNewExpedition     = "https://api.docnet.id/CHCMasterG/MasterEkspedisi/addNewExpedition";
    var url_editMExpedition      = "https://api.docnet.id/CHCMasterG/MasterEkspedisi/editMExpedition";

     //URL MinimalSP, Minimal SP NIE, Minimal SP SIA SIPA
     var url_getListMinimalSP          = "https://api.docnet.id/CHCMasterG/MasterMinSP/getMinimalSPList";
     var url_addMinimalSP              = "https://api.docnet.id/CHCMasterG/MasterMinSP/addMinimalSP";

     var url_getListMinimalSPNIE       = "https://api.docnet.id/CHCMasterG/MasterMinSPNie/getMinimalSPNIEList";
     var url_addMinimalSPNIE           = "https://api.docnet.id/CHCMasterG/MasterMinSPNie/addMinimalSPNIE";

     var url_getListMinimalSPSIASIPA   = "https://api.docnet.id/CHCMasterG/MasterMinSPSiaSipa/getMinimalSPSiaSipaList";
     var url_addMinimalSPSIASIPA       = "https://api.docnet.id/CHCMasterG/MasterMinSPSiaSipa/addMinimalSP";    

     //URL MOBIL
     var url_getTotalMobilPage          = "https://api.docnet.id/CHCMasterG/MasterMobil/getTotalMobilPage";
     var url_getMobilList               = "https://api.docnet.id/CHCMasterG/MasterMobil/getMobilList";
     var url_newMasterMobil             = "https://api.docnet.id/CHCMasterG/MasterMobil/newMasterMobil";
     var url_updateMasterMobil          = "https://api.docnet.id/CHCMasterG/MasterMobil/updateMasterMobil";

      //URL Biaya Expedisi
      var url_getTotalBiayaExpedisiPage    = "https://api.docnet.id/CHCMasterG/MasterBiayaEkspedisi/getTotalBiayaExpedisiPage";
      var url_getBiayaExpedisiList         = "https://api.docnet.id/CHCMasterG/MasterBiayaEkspedisi/getBiayaExpedisiList";
      var url_getAllNamaKota               = "https://api.docnet.id/CHCMasterG/MasterBiayaEkspedisi/getAllNamaKota";
      var url_getAllKodeExpedisi           = "https://api.docnet.id/CHCMasterG/MasterBiayaEkspedisi/getAllKodeEkspedisi";
      var url_addBiayaExpedisi             = "https://api.docnet.id/CHCMasterG/MasterBiayaEkspedisi/addBiayaExpedisi";
      var url_editBiayaExpedisi            = "https://api.docnet.id/CHCMasterG/MasterBiayaEkspedisi/editBiayaExpedisi";

      //URL TITIPAN LK
      var url_getTotalHeaderTitipanLKPage  = "https://api.docnet.id/CHCMasterG/MasterTitipanLK/getTotalHeaderTitipanLKPage";
      var url_getHeaderTitipanLK           = "https://api.docnet.id/CHCMasterG/MasterTitipanLK/getHeaderTitipanLK";
      var url_getNmKaryawan                = "https://api.docnet.id/CHCMasterG/MasterTitipanLK/getNmKaryawan";
      var url_saveNewTitipanLK             = "https://api.docnet.id/CHCMasterG/MasterTitipanLK/saveNewTitipanLK";
      var url_getDetailTitipanLK           = "https://api.docnet.id/CHCMasterG/MasterTitipanLK/getDetailTitipanLK/";
      var url_printTitipanLK               = "https://api.docnet.id/CHCMasterG/MasterTitipanLK/printTitipanLK";

      export {url_getTotalReasonPage,url_getListReason,url_addNewReason,url_editReason,url_getTotalExpedisiPage,
        url_getExpedisiList,url_addNewExpedition,url_editMExpedition,url_getListMinimalSP,url_addMinimalSP,
        url_getListMinimalSPNIE,url_addMinimalSPNIE,url_getListMinimalSPSIASIPA,url_addMinimalSPSIASIPA,
        url_getTotalMobilPage,url_getMobilList,url_newMasterMobil,url_updateMasterMobil,url_getTotalBiayaExpedisiPage,
        url_getBiayaExpedisiList,url_getAllNamaKota,url_getAllKodeExpedisi,url_addBiayaExpedisi,url_editBiayaExpedisi,
        url_getTotalHeaderTitipanLKPage,url_getHeaderTitipanLK,url_getNmKaryawan,url_saveNewTitipanLK,url_getDetailTitipanLK,
        url_printTitipanLK}

    //-->>  MASTER G  <<--//


    //URL UNIT
    var url_getUnitListByPaging="http://10.0.112.175:8081/getUnitList";
    var url_insertMasterUnit="http://10.0.112.175:8081/newUnit";
    var url_setUnitActiveYN ="http://10.0.112.175:8081/updateStatusUnit";

    //URL DEPT
    var url_getDeptListByPaging ="http://10.0.112.175:8081/getDeptList"
    var url_insertMasterDept ="http://10.0.112.175:8081/newDept"
    var url_updateDept ="http://10.0.112.175:8081/updateDept";

    //url dimension
    var url_getDimensiListByPaging = "http://10.0.112.175:8081/getDimensiProdList"
    var url_newDimensiProd = "http://10.0.112.175:8081/newDimensiProd"
    var url_updateDataDimensiProd = "http://10.0.112.175:8081/updateDataDimensiProd"
    
    export {url_getUnitListByPaging,url_insertMasterUnit,url_setUnitActiveYN,
        url_getDeptListByPaging,url_insertMasterDept,url_updateDept,
        url_getDimensiListByPaging,url_newDimensiProd,url_updateDataDimensiProd};

        /* URL to get Data withPagination
KO ERVIN: http://10.0.112.164:8081/getUnitList
    WILB :http://10.0.112.246:8081/getUnitList  */


    //MASTER KEMASAN
    var url_tampil_kemasan = "https://api.docnet.id/MasterKemasan/TampilSemuaKemasan";
    // export default url_tampil_kemasan    
    var url_cari_kodekemasan = "https://api.docnet.id/MasterKemasan/CariKodeKemasan";
    // export default url_cari_kodekemasan
    var url_cari_namakemasan = "https://api.docnet.id/MasterKemasan/CariNamaKemasan";
    // export default url_cari_namakemasan
    var url_tambah_kemasan = "https://api.docnet.id/MasterKemasan/TambahKemasan";
    // export default url_tambah_kemasan
    var url_edit_kemasan = "https://api.docnet.id/MasterKemasan/EditKemasan";
    // export default url_edit_kemasan
    var url_hapus_kemasan = "https://api.docnet.id/MasterKemasan/HapusKemasan";
    // export default url_hapus_kemasan 
    var url_tampil_kemasan_limit = 'https://api.docnet.id/MasterKemasan'
    
    //MASTER STRENGTH
    var url_CetakStrength_Count = "https://api.docnet.id/MasterStrength/CetakStrengthCount"
    var url_PencarianStrengthKode_Count = "https://api.docnet.id/MasterStrength/PencarianStrengthKodeCount"
    var url_PencarianStrengthNama_Count = "https://api.docnet.id/MasterStrength/PencarianStrengthNamaCount"
    var url_CetakStrength_Halaman = "https://api.docnet.id/MasterStrength/CetakStrengthHalaman"
    var url_PencarianStrengthKode_Halaman = "https://api.docnet.id/MasterStrength/PencarianStrengthKodeHalaman"
    var url_PencarianStrengthNama_Halaman = "https://api.docnet.id/MasterStrength/PencarianStrengthNamaHalaman"
    var url_TambahStrength = "https://api.docnet.id/MasterStrength/TambahStrength"
    var url_HapusStrength = "https://api.docnet.id/MasterStrength/HapusStrength"
    
    export {
            url_tampil_kemasan, url_tampil_kemasan_limit, url_cari_kodekemasan, url_cari_namakemasan,
            url_tambah_kemasan, url_edit_kemasan, url_hapus_kemasan,
            url_CetakStrength_Count, url_PencarianStrengthKode_Count, 
            url_PencarianStrengthNama_Count, url_CetakStrength_Halaman,
            url_PencarianStrengthKode_Halaman, url_PencarianStrengthNama_Halaman,
            url_TambahStrength, url_HapusStrength};