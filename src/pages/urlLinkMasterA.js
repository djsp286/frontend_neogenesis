
    //MASTER STRENGTH
    var url_CetakStrength_Count             = "https://api.docnet.id/CHCMasterA/MasterStrength/CetakStrengthCount";
    var url_PencarianStrengthKode_Count     = "https://api.docnet.id/CHCMasterA/MasterStrength/PencarianStrengthKodeCount";
    var url_PencarianStrengthNama_Count     = "https://api.docnet.id/CHCMasterA/MasterStrength/PencarianStrengthNamaCount";
    var url_CetakStrength_Halaman           = "https://api.docnet.id/CHCMasterA/MasterStrength/CetakStrengthHalaman";
    var url_PencarianStrengthKode_Halaman   = "https://api.docnet.id/CHCMasterA/MasterStrength/PencarianStrengthKodeHalaman";
    var url_PencarianStrengthNama_Halaman   = "https://api.docnet.id/CHCMasterA/MasterStrength/PencarianStrengthNamaHalaman";
    var url_TambahStrength                  = "https://api.docnet.id/CHCMasterA/MasterStrength/TambahStrength";
    var url_HapusStrength                   = "https://api.docnet.id/CHCMasterA/MasterStrength/HapusStrength";

    export {
        url_CetakStrength_Count,
        url_PencarianStrengthKode_Count,
        url_PencarianStrengthNama_Count,
        url_CetakStrength_Halaman,
        url_PencarianStrengthKode_Halaman,
        url_PencarianStrengthNama_Halaman,
        url_TambahStrength,
        url_HapusStrength
    };

    //MASTER GENERIK
    var url_TampilSemuaGenerik             = "https://api.docnet.id/CHCMasterA/MasterGenerik/CetakGenerikCount";
    var url_CariKodeGenerik_Count          = "https://api.docnet.id/CHCMasterA/MasterGenerik/CariKodeGenerikCount";
    var url_CariNamaGenerik_Count          = "https://api.docnet.id/CHCMasterA/MasterGenerik/CariNamaGenerikCount";
    var url_CetakGenerik_Halaman           = "https://api.docnet.id/CHCMasterA/MasterGenerik/CetakGenerikHalaman";
    var url_PencarianKodeGenerik_Halaman   = "https://api.docnet.id/CHCMasterA/MasterGenerik/PencarianKodeGenerikHalaman";
    var url_PencarianNamaGenerik_Halaman   = "https://api.docnet.id/CHCMasterA/MasterGenerik/PencarianNamaGenerikHalaman";
    var url_TambahGenerik                  = "https://api.docnet.id/CHCMasterA/MasterGenerik/TambahGenerik";
    var url_HapusGenerik                   = "https://api.docnet.id/CHCMasterA/MasterGenerik/HapusGenerik";
    var url_EditGenerik                    = "https://api.docnet.id/CHCMasterA/MasterGenerik/UbahGenerik";

    export {
        url_TampilSemuaGenerik,
        url_CariKodeGenerik_Count,
        url_CariNamaGenerik_Count,
        url_CetakGenerik_Halaman,
        url_PencarianKodeGenerik_Halaman,
        url_PencarianNamaGenerik_Halaman,
        url_TambahGenerik,
        url_HapusGenerik,
        url_EditGenerik
    };

    //MASTER DOSSAGE
    var url_DossageForm_Count               = "https://api.docnet.id/CHCMasterA/MasterDosis/JumlahHalaman";
    var url_CariKodeDossageForm_Halaman     = "https://api.docnet.id/CHCMasterA/MasterDosis/CariKodeDossageFormPage";
    var url_CariNamaDossageForm_Halaman     = "https://api.docnet.id/CHCMasterA/MasterDosis/CariNamaDossageFormPage";
    var url_CetakDossageForm_Halaman        = "https://api.docnet.id/CHCMasterA/MasterDosis/TampilkanDossageFormPage";
    var url_TambahDossageForm               = "https://api.docnet.id/CHCMasterA/MasterDosis/TambahDossageForm";
    var url_HapusDossageForm                = "https://api.docnet.id/CHCMasterA/MasterDosis/DeleteDossageForm/";

    export {
        url_DossageForm_Count,
        url_CariKodeDossageForm_Halaman,
        url_CariNamaDossageForm_Halaman,
        url_CetakDossageForm_Halaman,
        url_TambahDossageForm,
        url_HapusDossageForm
    };

    //MASTER BPOM
    var url_CetakKlaBPOM                    = "https://api.docnet.id/CHCMasterA/MasterKlasifikasiBPOM/TampilSemuaKlaBPOM";
    var url_CariNamaKlaBPOM                 = "https://api.docnet.id/CHCMasterA/MasterKlasifikasiBPOM/CariKlaBPOMDgnNama";
    var url_CariKodeKlaBPOM                 = "https://api.docnet.id/CHCMasterA/MasterKlasifikasiBPOM/CariKlaBPOMDgnKode";
    var url_KlaBPOM_PageCount               = "https://api.docnet.id/CHCMasterA/MasterKlasifikasiBPOM/AmbilMaxPage";
    var url_TambahKlaBPOM                   = "https://api.docnet.id/CHCMasterA/MasterKlasifikasiBPOM/TambahKlaBPOM";
    var url_UbahKlaBPOM                     = "https://api.docnet.id/CHCMasterA/MasterKlasifikasiBPOM/UbahKlaBPOM/";
    var url_HapusKlaBPOM                    = "https://api.docnet.id/CHCMasterA/MasterKlasifikasiBPOM/HapusKlaBPOM";

    export {
        url_CetakKlaBPOM,
        url_CariNamaKlaBPOM,
        url_CariKodeKlaBPOM,
        url_KlaBPOM_PageCount,
        url_TambahKlaBPOM,
        url_UbahKlaBPOM,
        url_HapusKlaBPOM
    };

//MASTER TEMPLATE ALOKASI
var url_ParameterTmpOut                = "https://api.docnet.id/CHCMasterJ/MasterTemplateAlokasi/AmbilParameter"
var url_CetakTmpOut                    = "https://api.docnet.id/CHCMasterJ/MasterTemplateAlokasi/TampilkanTemplateAlokasi";
var url_CetakAddTmpOut                 = "https://api.docnet.id/CHCMasterJ/MasterTemplateAlokasi/TampilkanJenisArea";
var url_TambahTmpOut                   = "https://api.docnet.id/CHCMasterJ/MasterTemplateAlokasi/TambahTemplateAlokasi";
var url_UbahTmpOut                     = "https://api.docnet.id/CHCMasterJ/MasterTemplateAlokasi/EditTemplateAlokasi";
var url_HapusTmpOut                    = "https://api.docnet.id/CHCMasterJ/MasterTemplateAlokasi/DeleteTemplateAlokasi";
//10.0.111.23
export {
    url_ParameterTmpOut,
    url_CetakTmpOut,
    url_CetakAddTmpOut,
    url_TambahTmpOut,
    url_UbahTmpOut,
    url_HapusTmpOut
};
