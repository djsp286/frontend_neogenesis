/* URL to get Data withPagination
KO ERVIN: http://10.0.112.164:8081/getUnitList
    WILB :http://10.0.111.56:8081 */

    //base url 
    var base_url_all = 'https://api.docnet.id/';

    //base url untuk diagsoktprint dan prod counter
    var base_url = base_url_all+'CHCMasterDiagSoKtprint/';
    var base_url2 = base_url_all+'CHCMasterProdCounter/';
    //end


// /* JIKA MASIH LOKAL */

// //URL LOGIN 
// var url_login ="http://10.0.111.56:8089/CHCAuth/login";
// var url_changeForgottenPassword = "http://10.0.111.56:8089/CHCAuth/changeForgottenPassword";
// var url_verifyOTP = "http://10.0.111.56:8089/CHCAuth/verifyOTP";
// var url_changePassword = "http://10.0.111.56:8089/CHCAuth/changePassword";
// var url_loginChangePassword ="http://10.0.111.56:8089/CHCAuth/changePassword?login";
// export {url_login,url_changeForgottenPassword,url_verifyOTP,url_changePassword,url_loginChangePassword};

// /* JIKA MASIH LOKAL */

// //URL UNIT
// var url_getUnitListByPaging="http://10.0.111.56:8081/CHCMasterB/getUnitList";
// var url_insertMasterUnit="http://10.0.111.56:8081/CHCMasterB/newUnit";
// var url_setUnitActiveYN ="http://10.0.111.56:8081/CHCMasterB/updateStatusUnit";
// export {url_getUnitListByPaging,url_insertMasterUnit,url_setUnitActiveYN};

// //URL DEPT
// var url_getDeptListByPaging = "http://10.0.111.56:8081/CHCMasterB/getDeptList"
// var url_getDeptListByPagingActive = "http://10.0.111.56:8081/CHCMasterB/getDeptListActive"
// var url_insertMasterDept = "http://10.0.111.56:8081/CHCMasterB/newDept"
// var url_updateDept = "http://10.0.111.56:8081/CHCMasterB/updateDept";
// export { url_getDeptListByPaging, url_insertMasterDept, url_updateDept, url_getDeptListByPagingActive };

// //url dimension
// var url_getDimensiListByPaging = "http://10.0.111.56:8081/CHCMasterB/getDimensiProdList"
// var url_newDimensiProd = "http://10.0.111.56:8081/CHCMasterB/newDimensiProd"
// var url_updateDataDimensiProd = "http://10.0.111.56:8081/CHCMasterB/updateDataDimensiProd"
// var url_searchBarcode = "http://10.0.111.208:8092/Product/Custom"
// export { url_getDimensiListByPaging, url_newDimensiProd, url_updateDataDimensiProd, url_searchBarcode };

// //url karakteristik
// var url_getKarakterHdrList = "http://10.0.111.56:8081/CHCMasterB/getHProdCharList"
// var url_updateKarakterHdr = "http://10.0.111.56:8081/CHCMasterB/updateStatusHProdChar"
// var url_processKarakter = "http://10.0.111.56:8081/CHCMasterB/newProdChar"
// var url_getKarakterDtlList = "http://10.0.111.56:8081/CHCMasterB/getDProdCharList"

// //url pureDead 
// var url_getProdPureDeadList = "http://10.0.111.56:8081/CHCMasterB/getProdPureDeadList"
// var url_deactivateProdPureDeadByProcod = "http://10.0.111.56:8081/CHCMasterB/deactivateProdPureDeadByProcod"
// var url_deactivateProdPureDeadAll = "http://10.0.111.56:8081/CHCMasterB/deactivateProdPureDeadAll"
// var url_newDProdPureDead = "http://10.0.111.56:8081/CHCMasterB/newDProdPureDead"
// var url_Product = "http://10.0.111.208:8092/Product/Custom"

/* JIKA SUDAH KONEK DENGAN SERVER UTAMA BUKAN LOKAL */

//URL LOGIN 
var url_login ="https://api.docnet.id/CHCAuth/login";
var url_changeForgottenPassword = "https://api.docnet.id/CHCAuth/changeForgottenPassword";
var url_verifyOTP = "https://api.docnet.id/CHCAuth/verifyOTP";
var url_changePassword = "https://api.docnet.id/CHCAuth/changePassword";
var url_loginChangePassword ="https://api.docnet.id/CHCAuth/changePassword?login";
export {url_login,url_changeForgottenPassword,url_verifyOTP,url_changePassword,url_loginChangePassword};

//URL UNIT
var url_getUnitListByPaging = "https://api.docnet.id/CHCMasterB/getUnitList";
var url_insertMasterUnit = "https://api.docnet.id/CHCMasterB/newUnit";
var url_setUnitActiveYN = "https://api.docnet.id/CHCMasterB/updateStatusUnit";
export { url_getUnitListByPaging, url_insertMasterUnit, url_setUnitActiveYN };

//URL DEPT
var url_getDeptListByPaging = "https://api.docnet.id/CHCMasterB/getDeptList"
var url_getDeptListByPagingActive = "https://api.docnet.id/CHCMasterB/getDeptListActive"
var url_insertMasterDept = "https://api.docnet.id/CHCMasterB/newDept"
var url_updateDept = "https://api.docnet.id/CHCMasterB/updateDept";
export { url_getDeptListByPaging, url_insertMasterDept, url_updateDept, url_getDeptListByPagingActive };

//url dimension
var url_getDimensiListByPaging = "https://api.docnet.id/CHCMasterB/getDimensiProdList"
var url_newDimensiProd = "https://api.docnet.id/CHCMasterB/newDimensiProd"
var url_updateDataDimensiProd = "https://api.docnet.id/CHCMasterB/updateDataDimensiProd"
var url_searchBarcode = "https://api.docnet.id/Product/Custom"
export { url_getDimensiListByPaging, url_newDimensiProd, url_updateDataDimensiProd, url_searchBarcode };

//url karakteristik
var url_getKarakterHdrList = "https://api.docnet.id/CHCMasterB/getHProdCharList"
var url_updateKarakterHdr = "https://api.docnet.id/CHCMasterB/updateStatusHProdChar"
var url_processKarakter = "https://api.docnet.id/CHCMasterB/newProdChar"
var url_getKarakterDtlList = "https://api.docnet.id/CHCMasterB/getDProdCharList"

//url pureDead 
var url_getProdPureDeadList = "https://api.docnet.id/CHCMasterB/getProdPureDeadList"
var url_deactivateProdPureDeadByProcod = "https://api.docnet.id/CHCMasterB/deactivateProdPureDeadByProcod"
var url_deactivateProdPureDeadAll = "https://api.docnet.id/CHCMasterB/deactivateProdPureDeadAll"
var url_newDProdPureDead = "https://api.docnet.id/CHCMasterB/newDProdPureDead"
var url_Product = "https://api.docnet.id/CHCMasterProduk/Product/Custom?findby=procodenoyn"

//Venan 10.0.111.55:8081
//BW 10.0.111.56:8081
//Ko Ervin 192.168.43.18:8081

//username : admin
//password: admin


//MASTER KEMASAN
// var url_tampil_kemasan = "https://api.docnet.id/MasterKemasan/TampilSemuaKemasan";
// // export default url_tampil_kemasan    
// var url_cari_kodekemasan = "https://api.docnet.id/MasterKemasan/CariKodeKemasan";
// // export default url_cari_kodekemasan
// var url_cari_namakemasan = "https://api.docnet.id/MasterKemasan/CariNamaKemasan";
// // export default url_cari_namakemasan
// var url_tambah_kemasan = "https://api.docnet.id/MasterKemasan/TambahKemasan";
// // export default url_tambah_kemasan
// var url_edit_kemasan = "https://api.docnet.id/MasterKemasan/EditKemasan";
// // export default url_edit_kemasan
// var url_hapus_kemasan = "https://api.docnet.id/MasterKemasan/HapusKemasan";
// // export default url_hapus_kemasan 
// var url_tampil_kemasan_limit = 'https://api.docnet.id/MasterKemasan'


var url_tampil_kemasan = "https://api.docnet.id/CHCMasterB/TampilSemuaKemasan";
// export default url_tampil_kemasan

var url_tampil_kemasan_limit = 'https://api.docnet.id/CHCMasterB/MasterKemasan'
// export default url_cari_namakemasan

var url_tambah_kemasan = "https://api.docnet.id/CHCMasterB/TambahKemasan";
// export default url_tambah_kemasan

var url_edit_kemasan = "https://api.docnet.id/CHCMasterB/EditKemasan";
// export default url_edit_kemasan

var url_hapus_kemasan = "https://api.docnet.id/CHCMasterB/HapusKemasan";



//MASTER KEMASAN LOKAL
// http://10.0.112.175
// var url_tampil_kemasan = "http://10.0.111.56:8081/CHCMasterB/TampilSemuaKemasan";
// // export default url_tampil_kemasan

// var url_tampil_kemasan_limit = 'http://10.0.111.56:8081/CHCMasterB/MasterKemasan'

// // var url_cari_kodekemasan = "http://10.0.111.56:8081/CariKodeKemasan";
// // // export default url_cari_kodekemasan

// // var url_cari_namakemasan = "http://10.0.111.56:8081/CariNamaKemasan";
// // export default url_cari_namakemasan

// // var url_cari_namacodekemasan = "http://10.0.111.56:8081/CariNamaCodeKemasan";
// // export default url_cari_namakemasan

// var url_tambah_kemasan = "http://10.0.111.56:8081/CHCMasterB/TambahKemasan";
// // export default url_tambah_kemasan

// var url_edit_kemasan = "http://10.0.111.56:8081/CHCMasterB/EditKemasan";
// // export default url_edit_kemasan

// var url_hapus_kemasan = "http://10.0.111.56:8081/CHCMasterB/HapusKemasan";


//MASTER STRENGTH
var url_CetakStrength_Count = "https://api.docnet.id/MasterStrength/CetakStrengthCount"
var url_PencarianStrengthKode_Count = "https://api.docnet.id/MasterStrength/PencarianStrengthKodeCount"
var url_PencarianStrengthNama_Count = "https://api.docnet.id/MasterStrength/PencarianStrengthNamaCount"
var url_CetakStrength_Halaman = "https://api.docnet.id/MasterStrength/CetakStrengthHalaman"
var url_PencarianStrengthKode_Halaman = "https://api.docnet.id/MasterStrength/PencarianStrengthKodeHalaman"
var url_PencarianStrengthNama_Halaman = "https://api.docnet.id/MasterStrength/PencarianStrengthNamaHalaman"
var url_TambahStrength = "https://api.docnet.id/MasterStrength/TambahStrength"
var url_HapusStrength = "https://api.docnet.id/MasterStrength/HapusStrength"

// export {
//     url_tampil_kemasan, url_tampil_kemasan_limit,
//     url_tambah_kemasan, url_edit_kemasan, url_hapus_kemasan,
//     url_CetakStrength_Count, url_PencarianStrengthKode_Count,
//     url_PencarianStrengthNama_Count, url_CetakStrength_Halaman,
//     url_PencarianStrengthKode_Halaman, url_PencarianStrengthNama_Halaman,
//     url_TambahStrength, url_HapusStrength
// };
    
    //team spetnaz
    //MASTER SOLUSI
    //edited by teddy 08/10/2019
    var url_tambah_solusi = base_url+'MasterSolusi/TambahSolusi';
    var url_cari_kodesolusi = base_url+'MasterSolusi/CariKodeSolusi';
    var url_tampil_solusi = base_url+'MasterSolusi/TampilSemuaSolusi';
    var url_cari_namasolusi = base_url+'MasterSolusi/CariNamaSolusi';
    var url_edit_solusi = base_url+'MasterSolusi/EditSolusi';
    var url_hapus_solusi = base_url+'MasterSolusi/HapusSolusi';
    var url_cari_kodenamasolusi = base_url+'MasterSolusi/CariKodeNamaSolusi';

    //MASTER DIAGNOSA

    var url_tambah_diagnosa =  base_url+'MasterDiagnosa/TambahDiagnosa' ;
    var url_cari_kodediagnosa = base_url+'MasterDiagnosa/CariGcIdDiagnosa' ;
    var url_cari_kodesolusi_mc = base_url+'MasterDiagnosa/CariMcIdDiagnosa' ;
    var url_tampil_diagnosa = base_url+'MasterDiagnosa/TampilSemuaDiagnosa';
    var url_cari_namadiagnosa = base_url+'MasterDiagnosa/CariGcNamaDiagnosa';
    var url_cari_namasolusi_mc = base_url+'MasterDiagnosa/CariMcNamaDiagnosa';
    var url_edit_diagnosa = base_url+'MasterDiagnosa/EditDiagnosa' ;
    var url_hapus_diagnosa = base_url+'MasterDiagnosa/HapusDiagnosa' ;
    var url_cari_gcidnamadiagnosa = base_url+'MasterDiagnosa/CariGcIdNamaDiagnosa';

    //MASTER KATEGORI PRINT

    var url_tambah_kp =  base_url+'MasterKtPrint/TambahKategoriPrint' ;
    var url_tampil_kp = base_url+'MasterKtPrint/TampilSemuaKategoriPrint';
    var url_cari_sgcnama = base_url+'MasterKtPrint/CariSgcNamaKategoriPrint' ;
    var url_cari_sgcid = base_url+'MasterKtPrint/CariSgcIdKategoriPrint' ;
    var url_cari_gcnama = base_url+'MasterKtPrint/CariGcNamaKategoriPrint';
    var url_cari_gcid = base_url+'MasterKtPrint/CariGcIdKategoriPrint';
    var url_edit_kp = base_url+'MasterKtPrint/EditKategoriPrint' ;
    var url_hapus_kp = base_url+'MasterKtPrint/HapusKategoriPrint' ;
    var url_cari_idnamakategoriprint = base_url+'MasterKtPrint/CariSgcIdNamaKategoriPrint';
    var url_tampil_kpsupplier = base_url+'MasterKtPrint/TampilKategoriPrint_PICTCPrint';
    
    //MASTER TC added by teddy 10/10/2019
    var url_tampil_tc = base_url+'MasterTCPenyakit/TampilSemuaTCPenyakit';
    var url_cari_tcid = base_url+'MasterTCPenyakit/CariIdTCPenyakit';
    var url_cari_tcnama = base_url+'MasterTCPenyakit/CariNamaTCPenyakit';
    var url_tambah_tc = base_url+'MasterTCPenyakit/TambahTCPenyakit';
    var url_edit_tc = base_url+'MasterTCPenyakit/EditTCPenyakit';
    var url_hapus_tc = base_url+'MasterTCPenyakit/HapusTCPenyakit';

    //MASTER BRIDGING
    var url_tampil_produk =  base_url_all +'CHCMasterProduk/Product';
    var url_tampil_bridging = base_url+'MasterBridgingSick/TampilSemuaBridgingSick';
    var url_tambah_bridging = base_url+'MasterBridgingSick/TambahBridgingSick';
    var url_cari_bridging_procode = base_url+'MasterBridgingSick/CariProcodBridgingSick';
    var url_cari_bridging_prodes = base_url+'MasterBridgingSick/CariProdesBridgingSick';
    var url_cari_bridging_brdid = base_url+'MasterBridgingSick/CariBrdIdBridgingSick';
    var url_cari_bridging_sgcid = base_url+'MasterBridgingSick/CariSGCIdBridgingSick';
    var url_cari_bridging_sgcnama = base_url+'MasterBridgingSick/CariSGCNamaBridgingSick';
    var url_cari_bridging_mcid = base_url+'MasterBridgingSick/CariMCIdBridgingSick';
    var url_cari_bridging_mcnama = base_url+'MasterBridgingSick/CariMCNamaBridgingSick';
    var url_cari_bridging_gcid = base_url+'MasterBridgingSick/CariGCIdBridgingSick';
    var url_cari_bridging_gcnama = base_url+'MasterBridgingSick/CariGCNamaBridgingSick';
    var url_edit_bridging = base_url+'MasterBridgingSick/EditBridgingSick';
    var url_hapus_bridging = base_url+'MasterBridgingSick/HapusBridgingSick';

    //Master PIC TC Print
    var url_tampil_pictcprint = base_url+'MasterPICTCPrint/TampilSemuaPICTCPrint';
    var url_cari_karyawan = base_url+'MasterKaryawan/CariNIPNamaKaryawanPurchasing';
    var url_tampil_karyawan = base_url+'MasterKaryawan/TampilKaryawanPurchasing';
    var url_tambah_pictcprint = base_url+'MasterPICTCPrint/TambahPICTCPrint';
    var url_hapus_pictcprint = base_url+'MasterPICTCPrint/HapusPICTCPrint';
    var url_edit_pictcprint = base_url+'MasterPICTCPrint/EditPICTCPrint';
    var url_cari_pictcprint = base_url+'MasterPICTCPrint/CariDataPICTCPrint';
    var url_tampil_supplier = base_url_all+'CHCMasterD/MasterSupplier/TampilkanSupplierPage';
    var url_cari_supplier = base_url_all + 'CHCMasterD/MasterSupplier/SupplierCodeorName';
    var url_hitung_supplier = base_url_all +'CHCMasterD/MasterSupplier/HitungDataSupplier'

    //Master Product Counter
    var url_tampil_supplier_brand = base_url2+'MasterProdCounter/GetCariDataSupplierBrand';
    var url_tampil_outlet_counter = base_url2+'MasterProdCounter/GetOutletMasterProdCounter';
    var url_tampil_produk_outlet = base_url2+'MasterProdCounter/GetProductMasterProdCounter';
    var url_hapus_outlet_counter = base_url2+'MasterProdCounter/HapusMasterProdCounter';
    var url_surat_counter = base_url2+'MasterProdCounter/SuratMasterProdCounter';
    var url_info_counter = base_url2+'MasterProdCounter/InfoCounterMasterProdCounter';
    var url_info_new_product_counter = base_url2+'MasterProdCounter/InfoProdukBaruMasterProdCounter';
    var url_tampil_tambah_outlet = base_url2+'MasterProdCounter/GetOutletTambahMasterProdCounter';
    var url_print_counter = base_url2+'MasterProdCounter/PrintMasterProdCounter';
    var url_tambah_outlet_counter = base_url2+'MasterProdCounter/TambahMasterProdCounter';
    var url_view_info_counter_outlet = base_url2+'MasterProdCounter/ViewInfoCounterOutletMasterProdCounter';
    var url_view_info_counter_supplier = base_url2+'MasterProdCounter/ViewInfoCounterSupplierMasterProdCounter';
    var url_info_produk_baru = base_url2+'MasterProdCounter/InfoProdukBaruMasterProdCounter';
    var url_cari_data_print = base_url2+'MasterProdCounter/GetCariDataSupplierBrandOutletPrint';
    var url_link_pdf_print = base_url2+'MasterProdCounter/convertToPDFOutletCounter'; //10.0.112.25
    var url_link_pdf_info_new_product = base_url2+'MasterProdCounter/GetFileInfoProdukBaruMasterProdCounter?sup='; //10.0.111.169
    var url_semua_holiday = base_url2+"TabelLibur/SemuaData"; //10.0.111.169
    var url_link_pdf_info_counter_out = base_url2+'MasterProdCounter/GetFileInfoCounter/'; //10.0.111.8
    var url_link_pdf_info_counter_sup = base_url2+'MasterProdCounter/GetFileInfoCounter/'; //10.0.111.8
    var url_link_print_surat = base_url2+'MasterProdCounter/convertToPDF'; //10.0.112.110
    var url_link_print_surat_prod = base_url2+'MasterProdCounter/convertToPDFCetak'; //10.0.112.110

    //end team spetnaz
    
    
    export{url_getKarakterDtlList, url_getKarakterHdrList, url_updateKarakterHdr, url_processKarakter, 
        url_getProdPureDeadList, url_deactivateProdPureDeadByProcod,url_deactivateProdPureDeadAll, url_newDProdPureDead, url_Product};
    export {
            url_tampil_kemasan, url_tampil_kemasan_limit,
            url_tambah_kemasan, url_edit_kemasan, url_hapus_kemasan};

    //team spetnaz
    export {
        url_tambah_solusi, url_cari_kodesolusi, url_tampil_solusi, url_cari_namasolusi,
        url_edit_solusi, url_hapus_solusi,url_tambah_diagnosa, url_cari_kodediagnosa,
        url_tampil_diagnosa, url_cari_namadiagnosa,url_edit_diagnosa,url_hapus_diagnosa,url_cari_kodesolusi_mc,
        url_cari_namasolusi_mc,
        url_cari_kodenamasolusi, url_tambah_kp,url_edit_kp,url_hapus_kp,url_tampil_kp,url_cari_sgcid,url_cari_sgcnama,
        url_cari_gcid,url_cari_gcnama, url_cari_gcidnamadiagnosa, url_tampil_tc, url_cari_tcid,
        url_cari_tcnama, url_tambah_tc, url_edit_tc, url_hapus_tc, url_tampil_produk, url_tambah_bridging, 
        url_tampil_bridging, url_cari_bridging_brdid, url_cari_bridging_sgcid, url_cari_bridging_sgcnama, url_cari_bridging_mcid,
        url_cari_bridging_mcnama, url_cari_bridging_gcid, url_cari_bridging_gcnama, url_edit_bridging, url_hapus_bridging,
        url_cari_idnamakategoriprint, url_cari_bridging_procode, url_cari_bridging_prodes, url_tampil_pictcprint,
        url_cari_karyawan, url_tampil_karyawan, url_tambah_pictcprint, url_hapus_pictcprint, url_edit_pictcprint, url_tampil_kpsupplier,
        url_cari_pictcprint, url_tampil_supplier, url_cari_supplier, url_tampil_supplier_brand, url_tampil_outlet_counter, url_tampil_produk_outlet,
        url_hapus_outlet_counter, url_surat_counter, url_info_counter, url_info_new_product_counter, url_tampil_tambah_outlet, url_print_counter, url_tambah_outlet_counter,
        url_view_info_counter_outlet, url_view_info_counter_supplier, url_info_produk_baru, url_cari_data_print, url_link_pdf_print,
        url_link_pdf_info_new_product, url_semua_holiday, url_link_pdf_info_counter_out, url_link_pdf_info_counter_sup,
        url_link_print_surat, url_link_print_surat_prod, url_hitung_supplier
    };
    //end team spetnaz
