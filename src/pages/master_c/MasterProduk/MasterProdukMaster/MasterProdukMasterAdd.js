import React from 'react';
import {
  Button, Form, Label, Table, Input, FormGroup,
  Card, CardBody, Col, Row, CardHeader, Modal, 
  ModalHeader, ModalBody,ModalFooter, UncontrolledButtonDropdown, 
  DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';
import { 
    MdAdd, MdEdit, MdDelete, MdDone, MdClose, MdSearch, MdSave,
    MdCancel,
    MdAssignmentReturned, 
  } from 'react-icons/md';
import dateFormat from 'dateformat';
import axios from 'axios';
import { Promise } from 'q';

class MasterProdukMasterAdd extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            headers: '',
            activeDeptList: [],
            principalList: [],
            kdBrandList: [],
            activePackList: [],
            activeGenerikList: [],
            activeUnit: [],
            klaBPOM: [],
            jenisObat: [],
            storage: [],
            companyList: [],
            productCategory: [],
            generikList: [],
            strengthList: [],
            dossagFormList: [],
            keteranganNIE: [],
            barcode:[],
            proconStatus: [
                {
                    statusId: "A",
                    statusName: "A - Aktif",
                },
                {
                    statusId: "Y",
                    statusName: "Y - Non Aktif",
                },
                {
                    statusId: "M",
                    statusName: "M - Mati",
                },
            ],
            stsMargin: [
                {
                    stsId: "1",
                    stsName: "BRAND1",
                },
                {
                    stsId: "2",
                    stsName: "BRAND2",
                },
            ],
            comco: [
                {
                    cmcId: "1",
                    cmcName: "PIECE",
                }
            ],
            minOrdOut: [
                {
                    mooId: "1",
                    mooName: "Combo Sell Pack",
                }
            ],
            nomorIjinProduk: [
                {
                    nipId: "N",
                    nipStatus: "No",
                },
                {
                    nipId: "Y",
                    nipStatus: "Yes",
                }
            ],
            halal: [
                {
                    halalId: "1",
                    halalStatus: "Yes",
                },
                {
                    halalId: "2",
                    halalStatus: "No",
                }
            ],
            classProduct: [
                {
                    cpId: "A",
                    cpClass: "A",
                },
                {
                    cpId: "B",
                    cpClass: "B",
                },
                {
                    cpId: "C",
                    cpClass: "C",
                },
                {
                    cpId: "D",
                    cpClass: "D",
                },
            ],
            classMargin: [
                {
                    cmId: "A",
                    cmClass: "A",
                },
                {
                    cmId: "B",
                    cmClass: "B",
                },
                {
                    cmId: "C",
                    cmClass: "C",
                },
                {
                    cmId: "D",
                    cmClass: "D",
                },
                {
                    cmId: "E",
                    cmClass: "E",
                },
            ],

            // Input
            inputCode: '',
            inputOldProduct: '',
            inputCodeSup: '',
            inputName: '',
            inputName2: '',
            inputDeptCode: '',
            inputDeptName: '',
            inputPrinCode: '',
            inputPrinName: '',
            inputCtrlCode: 'A',
            inputStsMargin: '',
            inputExpDateYN: 'N',
            inputPrgDiscYN: 'N',
            inputBuyPack: 1,
            inputSellUnit: 0,
            inputSellPack: '',
            inputMedUnit: 0,
            inputMedPack: '',
            inputBarcodeYN: 'N',
            inputNoRegYN: 'N',
            inputNoReg: '',
            inputNIEDate: '',
            inputHargaSpecialYN: 'N',
            inputHargaSpecial: '',
            inputHETYN: 'N',
            inputHETPrice: '',
            inputNonGenerikYN: 'N',
            inputKelipatan: '',
            inputIPA: 'N',
            inputValueIPA: '',
            inputIDA: 'N',
            inputValueIDA: '',
            inputLeadTime: '',
            inputKetNIE: '1',
            // inputKetNIE: 'N',
            inputNIESubmitBPOM: '',
            inputHalalYN: 'N',
            inputNoSertHalal: '',
            inputHalalDate: '',
            inputScore: '',
            inputBrandCode: '',
            inputBrandName: '',
            inputClsProduct: 'A',
            inputClsMargin: 'A',
            inputNPDYN: 'N',
            inputMonograf: 'N',
            inputImportYN: 'N',
            inputHomeBrandYN: 'N',
            inputTabletYN: 'N',
            inputPackYN: 'N',
            inputPatenYN: 'N',
            inputPsikotropikaYN: 'N',
            inputKlasiBPOM: '',
            inputGenerikID: '',
            inputGenerikName: '',
            inputTerapiID: '',
            inputTerapiName: '',
            inputStrength: '',
            inputDsgForm: '',
            inputAmount: '',
            inputUnit: '1',
            inputKdGenerik: '',
            inputStorageTemp: '',
            inputTidakBolehDijual: 'N',
            inputFirstDate: '',
            inputSurveyYN: 'N',
            inputDecorYN: 'N',
            inputLastUpdate: '',
            inputTimbangYN: 'Y',
            inputInHealthYN: 'N',
            inputInHealth: '',
            inputKodeInHealth: '',
            inputPTAsuransiInHealth: '',
            inputKategoriPro: '',
            inputPoinSellPack: '',
            inputPoinSelling: '',
            inputNomorIjinProduk: 'N',
            inputQtyPOMin: '',
            inputBarcode: '',
            firstBarcodeId: 1,
            lastBarcodeId: 1,
            inputMinOrdPO: 0,

            nieDate: '',
            ndDay: '',
            ndMonth: '',
            ndYear: '',

            nieSubmitBpom: '',
            nsbDay: '',
            nsbMonth: '',
            nsbYear: '',

            halalDate: '',
            hdDay: '',
            hdMonth: '',
            hdYear: '',

            firstDate: '',
            fdDay: '',
            fdMonth: '',
            fdYear: '',

            lastUpdate: '',
            luDay: '',
            luMonth: '',
            luYear: '',

            responseHeader: '',
            responseMessage: '',
        };
    }

    state =  {
        addConfirmationModalIsOpen: false,
        addBarcodeModalIsOpen: false,
        responseModalIsOpen: false,
    }

    toggleAddConfirmationModal = () => {
        this.setState({
            addConfirmationModalIsOpen: !this.state.addConfirmationModalIsOpen,
            responseModalIsOpen: this.state.responseModalIsOpen,
            addBarcodeModalIsOpen: this.state.addBarcodeModalIsOpen,
        })
    }

    toggleAddBarcodeModal = () => {
        this.setState({
            addConfirmationModalIsOpen: this.state.addConfirmationModalIsOpen,
            responseModalIsOpen: this.state.responseModalIsOpen,
            addBarcodeModalIsOpen: !this.state.addBarcodeModalIsOpen,
        })
    }

    toggleResponseModal = () => {
        this.setState({
            addConfirmationModalIsOpen: this.state.addConfirmationModalIsOpen,
            responseModalIsOpen: !this.state.responseModalIsOpen,
            addBarcodeModalIsOpen: this.state.addBarcodeModalIsOpen,
        })
    }

    waitAllDataLoad = async() => {
        var checkboxTimbang = document.getElementById("checkboxTimbang");
        checkboxTimbang.checked = true;
        await Promise.all([
        this.getDeptListActive(),
        this.getPrincipal(),
        this.getKdBrand(),
        this.getUnitActive(),
        this.getKemasan(),
        this.getKeteranganNIE(),
        this.getKlaBPOM(),
        this.getJenisObat(),
        this.getStorage(),
        this.getCompanyList(),
        this.getProductCategory(),
        this.getGenerikList(),
        this.getStrengthList(),
        this.getDossageForm(),
        ])
    }

    componentDidMount(){
        this.auth();
    }    

    auth = async() => {
        await Promise.all([
            axios
            .post('https://api.docnet.id/CHCAuth/login',
            {
                username: 'admin',
                password: 'admin'
            })
            .then((res) => {
                // console.log(res)
                this.setState({
                    headers: res.headers,
                })
            })
        ])
        this.waitAllDataLoad();
    }

    insertBarcodeToTempArray = (inputBarcode) => {
        if(this.state.barcode && !this.state.barcode.length){
            const newItem = [
                {
                    bID: this.state.firstBarcodeId,
                    bCode: inputBarcode
                },
            ]
            this.setState({
                barcode:[...this.state.barcode,...newItem]
            })
    
        }else if(this.state.barcode && this.state.barcode.length){
            const newItem = [
                {
                    bID: this.state.lastBarcodeId,
                    bCode: inputBarcode
                },
            ]
            this.setState({
                barcode:[...this.state.barcode,...newItem]
            })
        }

        this.toggleAddBarcodeModal()
    }

    removeBarcodeById = (id,code) => {

        const idToRemove = id
        const codeToRemove = code

        this.setState(prevState=>({
            barcode: prevState.barcode.filter(item => item.bID !== idToRemove && codeToRemove)
        }))

    }
    
    getDeptListActive = () => {
        axios
        .post('https://api.docnet.id/CHCMasterB/getDeptListActive', 
        {
            limit: 0,
            offset: 0,
            keyword: "",
        },
        {
            headers: this.state.headers
        })
        .then((res) => {
          if(res.data.result !== null){
            this.setState({
                activeDeptList: res.data.result,
                inputDeptCode: res.data.result[0].dept_code
            })
          }
        });
    }

    getPrincipal = () => {
        axios
        .post('https://api.docnet.id/CHCMasterD/MasterPrincipal/TampilkanPrincipal', 
        {
        })
        .then((res) => {
            if(res.data !== null){
                this.setState({
                    principalList: res.data.Data,
                    inputPrinCode: res.data.Data[0].Pri_Code,
                })
            }
        });
    }

    getKdBrand = () => {
        axios
        .post('https://api.docnet.id/CHCMasterD/MasterBrand/TampilkanBrand', 
        {
        })
        .then((res) => {
           if(res.data !== null){
            this.setState({
                kdBrandList: res.data.Data,
                inputBrandCode: res.data.Data[0].Bra_BrandedCode,
            })
           }
        });
    }

    getKemasan = () => {
        axios
        .post('https://api.docnet.id/CHCMasterB/MasterKemasan', 
        {
            limit: 0,
            offset: 0
        },
        {
            headers: this.state.headers
        }).then((res) => {
            if(res.data.result !== null){
                this.setState({
                    activePackList: res.data.result,
                    inputBuyPack: res.data.result[0].unit_code,
                    inputSellPack: res.data.result[0].unit_code,
                    inputMedPack: res.data.result[0].unit_code,
                })
            }
        });
    }

    getUnitActive = () => {
        axios
        .post('https://api.docnet.id/CHCMasterB/getUnitListActive', 
        {
            limit: 0,
            offset: 0,
        },{
            headers:this.state.headers
        }).then((res) => {
            if(res.data.result !== null){
                this.setState({
                    activeUnit: res.data.result,
                    inputBuyPack: res.data.result[0].unit_code,
                    inputSellPack: res.data.result[0].unit_code,
                    inputMedPack: res.data.result[0].unit_code,
                })
            }
        });
    }

    getKeteranganNIE = () => {
        axios
        .get('https://api.docnet.id/CHCMasterSupport/MasterKeteranganNIE?page=0&length=0')
        .then((res) => {
            if (res.data.data !== null) {
                this.setState({
                  keteranganNIE: res.data.data,
                  inputKetNIE: res.data.data[0].nie_id,  
                })
            } else {
                this.setState({
                  keteranganNIE: [],
                })
            }
        })
    }

    getKlaBPOM = () => {
        axios
        .get('https://api.docnet.id/CHCMasterA/MasterKlasifikasiBPOM/TampilSemuaKlaBPOM',)
        .then((res) => {
            if (res.data.data !== null) {
                this.setState({
                  klaBPOM: res.data.data,
                  inputKlasiBPOM: res.data.data[0].kla_Code,
                })
            } else {
                this.setState({
                  klaBPOM: [],
                })
            }
        })
    }

    getGenerikList = () => {
        axios
        .get('https://api.docnet.id/CHCMasterA/MasterGenerik/TampilSemuaGenerik',)
        .then((res) => {
            if (res.data !== null) {
                this.setState({
                  activeGenerikList: res.data,
                  inputGenerikID: res.data[0].gen_Code,
                })
            } else {
                this.setState({
                activeGenerikList: [],
                })
            }
        })
    }

    getStrengthList = () => {
        axios
        .get('https://api.docnet.id/CHCMasterA/MasterStrength/CetakStrength')
        .then((res) => {
            this.setState({
                strengthList: res.data.responseData,
                inputStrength: res.data.responseData[0].strg_Code,
            })
        });
    }

    getDossageForm = () => {
        axios
        .post('https://api.docnet.id/CHCMasterA/MasterDosis/TampilkanDossageForm', 
        {
        }).then((res) => {
           if(res.data !== null){
            this.setState({
                dossagFormList: res.data,
                inputDsgForm: res.data[0].dsgform_code,
            })
           }
        });
    }

    getJenisObat = () => {
        axios
        .get('https://api.docnet.id/CHCMasterSupport/MasterJenisObat?page=0&length=0')
        .then((res) => {
            if (res.data.data !== null) {
                this.setState({
                  jenisObat: res.data.data,
                  inputKdGenerik: res.data.data[0].jnsob_code,
                })
            } else {
                this.setState({
                  jenisObat: [],
                })
            }
        })
    }

    getStorage = () => {
        axios
        .get('https://api.docnet.id/CHCMasterSupport/MasterStorage?page=0&length=0')
        .then((res) => {
            if (res.data.data !== null) {
                this.setState({
                  storage: res.data.data,
                  inputStorageTemp: res.data.data[0].storage_code,
                })
            } else {
                this.setState({
                  storage: [],
                })
            }
        })
    }

    getCompanyList = () => {
        axios
        .get('https://api.docnet.id/CHCMasterSupport/MasterCompanyRFID?page=0&length=0')
        .then((res) => {
            if (res.data.data !== null) {
                this.setState({
                  companyList: res.data.data,
                  inputPTAsuransiInHealth: res.data.data[0].com_idnumber,
                })
            } else {
                this.setState({
                  companyList: [],
                })
            }
        })
    }

    getProductCategory = () => {
        axios
        .get('https://api.docnet.id/CHCMasterSupport/MasterKategoryProduk?page=0&length=0')
        .then((res) => {
            if (res.data.data !== null) {
                this.setState({
                  productCategory: res.data.data,
                  inputKategoriPro: res.data.data[0].katpro_id,
                })
            } else {
                this.setState({
                  productCategory: [],
                })
            }
        })
    }

    checkboxListener = () => {
        var checkboxBarcode = document.getElementById("checkboxBarcode");
        var checkboxIPA = document.getElementById("checkboxIPA");
        var checkboxIDA = document.getElementById("checkboxIDA");
        var checkboxNoReg = document.getElementById("checkboxNoReg");
        var checkboxHargaSpecial = document.getElementById("checkboxHargaSpecial");
        var checkboxHalal = document.getElementById("checkboxHalal");
        var checkboxHetSellPack = document.getElementById("checkboxHetSellPack");
        var checkboxInHealth = document.getElementById("checkboxInHealth");

        var checkboxExpDate = document.getElementById("checkboxExpDate");
        var checkboxPrgDisc = document.getElementById("checkboxPrgDisc");
        var checkboxNonGenerik = document.getElementById("checkboxNonGenerik");
        var checkboxNPD = document.getElementById("checkboxNPD");
        var checkboxMonograf = document.getElementById("checkboxMonograf");
        var checkboxImport = document.getElementById("checkboxImport");
        var checkboxHomeBrand = document.getElementById("checkboxHomeBrand");

        var checkboxJualEceran = document.getElementById("checkboxJualEceran");
        var checkboxKemasan = document.getElementById("checkboxKemasan");
        var checkboxPaten = document.getElementById("checkboxPaten");
        var checkboxPsikotropika = document.getElementById("checkboxPsikotropika");
        var checkboxTidakBolehDijual = document.getElementById("checkboxTidakBolehDijual");
        var checkboxSurvey = document.getElementById("checkboxSurvey");
        var checkboxDekor = document.getElementById("checkboxDekor");
        var checkboxTimbang = document.getElementById("checkboxTimbang");

        var tableBarcode = document.getElementById("tableBarcode");
        var inputIPA = document.getElementById("inputIPA");
        var inputIDA = document.getElementById("inputIDA");
        var inputNoReg = document.getElementById("inputNoReg");
        var inputHargaSpecial = document.getElementById("inputHargaSpecial");
        var inputHalal = document.getElementById("inputHalal");
        var noSertifikasiFormGroup = document.getElementById("noSertifikasiFormGroup");
        var inputNetSellPack = document.getElementById("inputNetSellPack");

        // var inputInHealth = document.getElementById("inputInHealth");
        var selectInHealth = document.getElementById("selectInHealth");

        var inputNoSertHalal = document.getElementById("inputHalal");
        var inputHalalDate = document.getElementById("inputHalalDate");
        var inputHETPrice = document.getElementById("inputNetSellPack");

        // Barcode
        if(checkboxBarcode.checked === true){
            tableBarcode.style.display = "inline";
            this.setState({
                inputBarcodeYN: 'Y'
            })
        }
        else{
            tableBarcode.style.display = "none";
            this.setState({
                inputBarcodeYN: 'N'
            })
        }

        // IPA
        if(checkboxIPA.checked === true){
            inputIPA.disabled = false;
            this.setState({
                inputIPA: 'Y',
                inputValueIPA: inputIPA.value
            })
        }
        else{
            inputIPA.disabled = true;
            this.setState({
                inputIPA: 'N',
                inputValueIPA: '',
            })
        }

        // IDA
        if(checkboxIDA.checked === true){
            inputIDA.disabled = false;
            this.setState({
                inputIDA: 'Y',
                inputValueIDA: inputIDA.value,
            })
        }
        else{
            inputIDA.disabled = true;
            this.setState({
                inputIDA: 'N',
                inputValueIDA: '',
            })
        }

        // No. Reg
        if(checkboxNoReg.checked === true){
            inputNoReg.disabled = false;
            this.setState({
                inputNoRegYN: 'Y',
                inputNoReg: inputNoReg.value,
            })
        }
        else{
            inputNoReg.disabled = true;
            this.setState({
                inputNoRegYN: 'N',
                inputNoReg: '',
            })
        }

        // // Harga Special
        // if(checkboxHargaSpecial.checked === true){
        //     inputHargaSpecial.disabled = false;
        //     this.setState({
        //         inputHargaSpecialYN: 'Y',
        //         inputHargaSpecial: inputHargaSpecial.value
        //     })
        // }
        // else{
        //     inputHargaSpecial.disabled = true;
        //     this.setState({
        //         inputHargaSpecialYN: 'N',
        //         inputHargaSpecial: '',
        //     })
        // }

        // // Halal
        // if(checkboxHalal.checked === true){
        //     inputHalal.disabled = false;
        //     noSertifikasiFormGroup.style.visibility = "visible";
        //     this.setState({
        //         inputHalalYN: 'Y',
        //         inputNoSertHalal: inputNoSertHalal.value,
        //         inputHalalDate: inputHalalDate.value,
        //     })
        // }
        // else{
        //     inputHalal.disabled = true;
        //     noSertifikasiFormGroup.style.visibility = "hidden";
        //     this.setState({
        //         inputHalalYN: 'N',
        //         inputNoSertHalal: '',
        //         inputHalalDate: '',
        //     })
        // }

        // In Health
        if(checkboxInHealth.checked === true){
            // inputInHealth.disabled = false;
            selectInHealth.disabled = false;
            this.setState({
                inputInHealthYN:  'Y',
                // inputInHealth: inputInHealth.value,
            })
        }
        else{
            // inputInHealth.disabled = true;
            selectInHealth.disabled = true;
            this.setState({
                inputInHealthYN: 'N',
                inputInHealth: '',
                inputPTAsuransiInHealth: '',
            })
        }

        // Exp. Date
        if(checkboxExpDate.checked === true){
            this.setState({
                inputExpDateYN: "Y"
            })
        }
        else{
            this.setState({
                inputExpDateYN: "N"
            })
        }

        // Prg Disc
        if(checkboxPrgDisc.checked === true){
            this.setState({
                inputPrgDiscYN: "Y"
            })
        }
        else{
            this.setState({
                inputPrgDiscYN: "N"
            })
        }

        // Non Generik
        if(checkboxNonGenerik.checked === true){
            this.setState({
                inputNonGenerikYN: "Y"
            })
        }
        else{
            this.setState({
                inputNonGenerikYN: "N"
            })
        }

        // NPD
        if(checkboxNPD.checked === true){
            this.setState({
                inputNPDYN: "Y"
            })
        }
        else{
            this.setState({
                inputNPDYN: "N"
            })
        }

        // Monograf
        if(checkboxMonograf.checked === true){
            this.setState({
                inputMonograf: "Y"
            })
        }
        else{
            this.setState({
                inputMonograf: "N"
            })
        }

        // Import
        if(checkboxImport.checked === true){
            this.setState({
                inputImportYN: "Y"
            })
        }
        else{
            this.setState({
                inputImportYN: "N"
            })
        }

        // Home Brand
        if(checkboxHomeBrand.checked === true){
            this.setState({
                inputHomeBrandYN: "Y"
            })
        }
        else{
            this.setState({
                inputHomeBrandYN: "N"
            })
        }

        // Jual Eceran
        if(checkboxJualEceran.checked === true){
            this.setState({
                inputTabletYN: "Y"
            })
        }
        else{
            this.setState({
                inputTabletYN: "N"
            })
        }

        // Kemasan
        if(checkboxKemasan.checked === true){
            this.setState({
                inputPackYN: "Y"
            })
        }
        else{
            this.setState({
                inputPackYN: "N"
            })
        }

        // Paten
        if(checkboxPaten.checked === true){
            this.setState({
                inputPatenYN: "Y"
            })
        }
        else{
            this.setState({
                inputPatenYN: "N"
            })
        }

        // Psikotropika
        if(checkboxPsikotropika.checked === true){
            this.setState({
                inputPsikotropikaYN: "Y"
            })
        }
        else{
            this.setState({
                inputPsikotropikaYN: "N"
            })
        }

        // Tidak Boleh Dijual
        if(checkboxTidakBolehDijual.checked === true){
            this.setState({
                inputTidakBolehDijual: "Y"
            })
        }
        else{
            this.setState({
                inputTidakBolehDijual: "N"
            })
        }

        // Survey
        if(checkboxSurvey.checked === true){
            this.setState({
                inputSurveyYN: "Y"
            })
        }
        else{
            this.setState({
                inputSurveyYN: "N"
            })
        }

        // Dekor
        if(checkboxDekor.checked === true){
            this.setState({
                inputDecorYN: "Y"
            })
        }
        else{
            this.setState({
                inputDecorYN: "N"
            })
        }

        // Timbang
        if(checkboxTimbang.checked === true){
            this.setState({
                inputTimbangYN: "Y"
            })
        }
        else{
            this.setState({
                inputTimbangYN: "N"
            })
        }
    }

    nomorIjinProdukHandler = () => {
        var nomorIjinProdukValue = document.getElementById("selectNomorIjinProduk").value;
        var noRegFormGroup = document.getElementById("noRegFormGroup");
        var noRegBerlakuFormGroup = document.getElementById("noRegBerlakuFormGroup");
        var checkboxNoReg = document.getElementById("checkboxNoReg");
        var inputNoRegBerlaku = document.getElementById("inputNoRegBerlaku");

        if(nomorIjinProdukValue === "No"){
            noRegFormGroup.style.visibility = "hidden"
            noRegBerlakuFormGroup.style.visibility = "hidden"

            this.setState({
                inputNomorIjinProduk: "N",
                // inputNoRegYN: 'N',
            })

            // checkboxNoReg.checked = false;
            inputNoRegBerlaku.disabled = true;
        }
        else if (nomorIjinProdukValue === "Yes"){
            noRegFormGroup.style.visibility = "visible"
            noRegBerlakuFormGroup.style.visibility = "visible"

            this.setState({
                inputNomorIjinProduk: "Y",
                // inputNoRegYN: 'Y',
            })
            
            // checkboxNoReg.checked = true;
            inputNoRegBerlaku.disabled = false;
        }
    }

    keteranganNIEHandler = () => {
        var keteranganNIEValue = document.getElementById("selectketeranganNIE").value;
        var labelTglBPOM = document.getElementById("labelTglBPOM");
        var inputTglBPOM = document.getElementById("inputTglBPOM");

        if (keteranganNIEValue === "1"){
            labelTglBPOM.style.visibility = "visible"
            inputTglBPOM.style.visibility = "visible"

            this.setState({
                inputKetNIE: '1'
            })

            inputTglBPOM.disabled = false
        }
        else if(keteranganNIEValue === "2"){
            labelTglBPOM.style.visibility = "hidden"
            inputTglBPOM.style.visibility = "hidden"

            this.setState({
                inputKetNIE: '2',
            })

            inputTglBPOM.disabled = true
        }
        else{
            labelTglBPOM.style.visibility = "hidden"
            inputTglBPOM.style.visibility = "hidden"

            this.setState({
                inputKetNIE: '3',
            })

            inputTglBPOM.disabled = true
        }
    }

    halalHandler = () => {
        var halalValue = document.getElementById("selectHalal").value;
        var labelNoSertHalal = document.getElementById("labelNoSertHalal");
        var inputNoSertHalal = document.getElementById("inputNoSertHalal");
        var formGroupNoSertHalalBerlaku = document.getElementById("noSertifikasiFormGroup");
        var inputNoSertifikasiBerlaku = document.getElementById("inputNoSertifikasiBerlaku");

        if(halalValue === "No"){
            labelNoSertHalal.style.visibility = "hidden"
            inputNoSertHalal.style.visibility = "hidden"
            formGroupNoSertHalalBerlaku.style.visibility = "hidden"

            this.setState({
                inputHalalYN: "N"
            })

            inputNoSertHalal.disabled = true;
            inputNoSertifikasiBerlaku.disabled = true;
        }
        else if (halalValue === "Yes"){
            labelNoSertHalal.style.visibility = "visible"
            inputNoSertHalal.style.visibility = "visible"
            formGroupNoSertHalalBerlaku.style.visibility = "visible"

            this.setState({
                inputHalalYN: "Y"
            })

            inputNoSertHalal.disabled = false;
            inputNoSertifikasiBerlaku.disabled = false
        }
    }

    handleChange = (type, event) => {
        if(type === "inputCode"){
            this.setState({
                inputCode: event.target.value
            })
        }

        else if (type === "inputMinOrdPO"){
            if(this.state.inputMedUnit === 0 || this.state.inputMinOrdPO === NaN){
                this.setState({
                    inputMinOrdPO: 0
                })
            }
            else{
                this.setState({
                    inputMinOrdPO: this.state.inputSellUnit/this.state.inputMedUnit
                })
            }
            
        }

        else if(type === "inputBarcode"){
            if(this.state.barcode && !this.state.barcode.length){
                this.setState({
                    inputBarcode:event.target.value
                })
                // console.log(this.state.firstBarcodeId,this.state.inputBarcode)
            }
            else if(this.state.barcode && this.state.barcode.length){
                const [lastBarcodeArr] = this.state.barcode.slice(-1)
                const lastBarcodeVal = lastBarcodeArr.bID
                this.setState({
                    lastBarcodeId:lastBarcodeVal
                })
                this.setState({
                    inputBarcode: event.target.value,
                    lastBarcodeId: lastBarcodeVal + 1
                })
                // console.log(this.state.firstBarcodeId, this.state.lastBarcodeId)
                // console.log(this.state.barcode)
            }
        }

        else if(type === "inputOldProduct"){
            this.setState({
                inputOldProduct: event.target.value
            })
        }

        else if(type === "inputCodeSup"){
            this.setState({
                inputCodeSup: event.target.value
            })
        }
        
        else if(type === "inputName"){
            this.setState({
                inputName: event.target.value
            })
        }

        else if(type === "inputName2"){
            this.setState({
                inputName2: event.target.value
            })
        }

        else if(type === "inputQtyPOMin"){
            this.setState({
                inputQtyPOMin: event.target.value
            })
        }

        else if(type === "inputDeptCode"){
            this.setState({
                inputDeptCode: event.target.value
            })
        }

        else if(type === "inputDeptName"){
            this.setState({
                inputDeptName: event.target.value
            })
        }

        else if(type === "inputPrinCode"){
            this.setState({
                inputPrinCode: event.target.value
            })
        }

        else if(type === "inputPrinName"){
            this.setState({
                inputPrinName: event.target.value
            })
        }
        
        else if(type === "inputCtrlCode"){
            this.setState({
                inputCtrlCode: event.target.value
            })
        }
        
        else if(type === "inputStsMargin"){
            this.setState({
                inputStsMargin: event.target.value
            })
        }
        
        else if(type === "inputExpDateYN"){
            this.setState({
                inputExpDateYN: event.target.value
            })
        }
        
        else if(type === "inputPrgDiscYN"){
            this.setState({
                inputPrgDiscYN: event.target.value
            })
        }
        
        else if(type === "inputBuyPack"){
            this.setState({
                inputBuyPack: event.target.value
            })
        }
        
        else if(type === "inputSellUnit"){
            var hitung = parseInt(event.target.value / this.state.inputMedUnit)
            if (this.state.inputMedUnit == 0){
                hitung = 0
            }
            this.setState({
                inputMinOrdPO: hitung,
                inputSellUnit: event.target.value
            })
        }
        
        else if(type === "inputSellPack"){
            this.setState({
                inputSellPack: event.target.value
            })
        }
        
        else if(type === "inputMedUnit"){
            var hitung = parseInt(this.state.inputSellUnit / event.target.value)
            if (event.target.value == 0){
                hitung = 0
            }
            this.setState({
                inputMinOrdPO: hitung,
                inputMedUnit: event.target.value
            })
        }
        
        else if(type === "inputMedPack"){
            this.setState({
                inputMedPack: event.target.value
            })
        }
        
        else if(type === "inputNoRegYN"){
            this.setState({
                inputNoRegYN: event.target.value
            })
        }
        
        else if(type === "inputNoReg"){
            this.setState({
                inputNoReg: event.target.value
            })
        }
        
        else if(type === "inputNIEDate"){
            this.setState({
                inputNIEDate: event.target.value
            })
        }
        
        else if(type === "inputHargaSpecialYN"){
            this.setState({
                inputHargaSpecialYN: event.target.value
            })
        }
        
        else if(type === "inputHargaSpecial"){
            this.setState({
                inputHargaSpecial: event.target.value
            })
        }
        
        else if(type === "inputHETYN"){
            this.setState({
                inputHETYN: event.target.value
            })
        }
        
        else if(type === "inputHETPrice"){
            this.setState({
                inputHETPrice: event.target.value
            })
        }
        
        else if(type === "inputNonGenerikYN"){
            this.setState({
                inputNonGenerikYN: event.target.value
            })
        }
        
        else if(type === "inputPoinSellPack"){
            this.setState({
                inputPoinSellPack: event.target.value
            })
        }
        
        else if(type === "inputPoinSelling"){
            this.setState({
                inputPoinSelling: event.target.value
            })
        }
        
        else if(type === "inputPsikotropikaYN"){
            this.setState({
                inputPsikotropikaYN: event.target.value
            })
        }
        
        else if(type === "inputKelipatan"){
            this.setState({
                inputKelipatan: event.target.value
            })
        }
        
        else if(type === "inputIPA"){
            this.setState({
                inputIPA: event.target.value
            })
        }
        
        else if(type === "inputValueIPA"){
            this.setState({
                inputValueIPA: event.target.value
            })
        }
        
        else if(type === "inputIDA"){
            this.setState({
                inputIDA: event.target.value
            })
        }
        
        else if(type === "inputValueIDA"){
            this.setState({
                inputValueIDA: event.target.value
            })
        }
        
        else if(type === "inputLeadTime"){
            this.setState({
                inputLeadTime: event.target.value
            })
        }
        
        else if(type === "inputKetNIE"){
            this.setState({
                inputKetNIE: event.target.value
            })
        }
        
        else if(type === "inputNIESubmitBPOM"){
            this.setState({
                inputNIESubmitBPOM: event.target.value
            })
        }
        
        else if(type === "inputHalalYN"){
            this.setState({
                inputHalalYN: event.target.value
            })
        }
        
        else if(type === "inputNoSertHalal"){
            this.setState({
                inputNoSertHalal: event.target.value
            })
        }
        
        else if(type === "inputHalalDate"){
            this.setState({
                inputHalalDate: event.target.value
            })
        }
        
        else if(type === "inputScore"){
            this.setState({
                inputScore: event.target.value
            })
        }
        
        else if(type === "inputBrandCode"){
            this.setState({
                inputBrandCode: event.target.value
            })
        }
        
        else if(type === "inputBrandName"){
            this.setState({
                inputBrandName: event.target.value
            })
        }
        
        else if(type === "inputClsProduct"){
            this.setState({
                inputClsProduct: event.target.value
            })
        }
        
        else if(type === "inputClsMargin"){
            this.setState({
                inputClsMargin: event.target.value
            })
        }
        
        else if(type === "inputNPDYN"){
            this.setState({
                inputNPDYN: event.target.value
            })
        }
        
        else if(type === "inputMonograf"){
            this.setState({
                inputMonograf: event.target.value
            })
        }
        
        else if(type === "inputImportYN"){
            this.setState({
                inputImportYN: event.target.value
            })
        }
        
        else if(type === "inputHomeBrandYN"){
            this.setState({
                inputHomeBrandYN: event.target.value
            })
        }
        
        else if(type === "inputTabletYN"){
            this.setState({
                inputTabletYN: event.target.value
            })
        }
        
        else if(type === "inputPackYN"){
            this.setState({
                inputPackYN: event.target.value
            })
        }
        
        else if(type === "inputPatenYN"){
            this.setState({
                inputPatenYN: event.target.value
            })
        }
        
        else if(type === "inputPsikotropikaYN"){
            this.setState({
                inputPsikotropikaYN: event.target.value
            })
        }
        
        else if(type === "inputKlasiBPOM"){
            this.setState({
                inputKlasiBPOM: event.target.value
            })
        }
        
        else if(type === "inputGenerikID"){
            this.setState({
                inputGenerikID: event.target.value
            })
        }
        
        else if(type === "inputGenerikName"){
            this.setState({
                inputGenerikName: event.target.value
            })
        }
        
        else if(type === "inputTerapiID"){
            this.setState({
                inputTerapiID: event.target.value
            })
        }
        
        else if(type === "inputTerapiName"){
            this.setState({
                inputTerapiName: event.target.value
            })
        }
        
        else if(type === "inputStrength"){
            this.setState({
                inputStrength: event.target.value
            })
        }
        
        else if(type === "inputDsgForm"){
            this.setState({
                inputDsgForm: event.target.value
            })
        }
        
        else if(type === "inputAmount"){
            this.setState({
                inputAmount: event.target.value
            })
        }
        
        else if(type === "inputUnit"){
            this.setState({
                inputUnit: event.target.value
            })
        }
        
        else if(type === "inputKdGenerik"){
            this.setState({
                inputKdGenerik: event.target.value
            })
        }
        
        else if(type === "inputStorageTemp"){
            this.setState({
                inputStorageTemp: event.target.value
            })
        }
        
        else if(type === "inputTidakBolehDijual"){
            this.setState({
                inputTidakBolehDijual: event.target.value
            })
        }
        
        else if(type === "inputFirstDate"){
            this.setState({
                inputFirstDate: event.target.value
            })
        }
        
        else if(type === "inputSurveyYN"){
            this.setState({
                inputSurveyYN: event.target.value
            })
        }
        
        else if(type === "inputDecorYN"){
            this.setState({
                inputDecorYN: event.target.value
            })
        }
        
        else if(type === "inputLastUpdate"){
            this.setState({
                inputLastUpdate: event.target.value
            })
        }
        
        else if(type === "inputTimbangYN"){
            this.setState({
                inputTimbangYN: event.target.value
            })
        }
        
        else if(type === "inputInHealthYN"){
            this.setState({
                inputInHealthYN: event.target.value
            })
        }
        
        else if(type === "inputInHealth"){
            this.setState({
                inputInHealth: event.target.value
            })
        }
        
        else if(type === "inputPTAsuransiInHealth"){
            this.setState({
                inputPTAsuransiInHealth: event.target.value
            })
        }
        
        else if(type === "inputKategoriPro"){
            this.setState({
                inputKategoriPro: event.target.value
            })
        }
    }

    refreshPage = () => {
        this.props.func();
    }

    addProdukMaster = () => {

        if(this.state.inputNIEDate !== ""){
            this.state.ndYear = (this.state.inputNIEDate).substring(0, 4);
            this.state.ndMonth = (this.state.inputNIEDate).substring(5, 7);
            this.state.ndDay = (this.state.inputNIEDate).substring(8, 10);
            // this.state.nieDate = this.state.ndDay + "/" + this.state.ndMonth + "/" + this.state.ndYear;
            this.state.nieDate = this.state.ndYear + "-" + this.state.ndMonth + "-" + this.state.ndDay;
        } else{
            this.state.nieDate = ""
        }

        if(this.state.inputNIESubmitBPOM !== ""){
            this.state.nsbYear = (this.state.inputNIESubmitBPOM).substring(0, 4);
            this.state.nsbMonth = (this.state.inputNIESubmitBPOM).substring(5, 7);
            this.state.nsbDay = (this.state.inputNIESubmitBPOM).substring(8, 10);
            // this.state.nieSubmitBpom = this.state.nsbDay + "/" + this.state.nsbMonth + "/" + this.state.nsbYear;
            this.state.nieSubmitBpom = this.state.nsbYear + "-" + this.state.nsbMonth + "-" + this.state.nsbDay;
        } else{
            this.state.nieSubmitBpom = ""
        }

        if(this.state.inputHalalDate !== ""){
            this.state.hdYear = (this.state.inputHalalDate).substring(0, 4);
            this.state.hdMonth = (this.state.inputHalalDate).substring(5, 7);
            this.state.hdDay = (this.state.inputHalalDate).substring(8, 10);
            // this.state.halalDate = this.state.hdDay + "/" + this.state.hdMonth + "/" + this.state.hdYear;
            this.state.halalDate = this.state.hdYear + "-" + this.state.hdMonth + "-" + this.state.hdDay;
        } else{
            this.state.halalDate = ""
        }

        // this.state.fdYear = (this.state.inputFirstDate).substring(0, 4);
        // this.state.fdMonth = (this.state.inputFirstDate).substring(5, 7);
        // this.state.fdDay = (this.state.inputFirstDate).substring(8, 10);
        // // this.state.firstDate = this.state.fdDay + "/" + this.state.fdMonth + "/" + this.state.fdYear;
        // this.state.firstDate = this.state.fdYear + "-" + this.state.fdMonth + "-" + this.state.fdDay;

        // this.state.luYear = (this.state.inputLastUpdate).substring(0, 4);
        // this.state.luMonth = (this.state.inputLastUpdate).substring(5, 7);
        // this.state.luDay = (this.state.inputLastUpdate).substring(8, 10);
        // this.state.lastUpdate = this.state.luDay + "/" + this.state.luMonth + "/" + this.state.luYear;

        // if(this.state.nieDate === "--"){
        //     this.setState({
        //         nieDate: ""
        // }, () => {
        //     console.log(this.state.nieDate)
        // })
        // }
        // if(this.state.nieSubmitBpom === "--"){
        //     this.setState({
        //         nieSubmitBpom: ""
        //     }, ()=>{
        //         console.log(this.state.nieSubmitBpom)
        //     })
        // }
        // if(this.state.halalDate === "--"){
        //     this.setState({
        //         halalDate: ""
        //     }, ()=>{
        //         console.log(this.state.halalDate)
        //     })
        // }

        var recentBarcode = [];
        for(var i = 0; i < this.state.barcode.length; i++){
            recentBarcode.push(this.state.barcode[i].bCode.toString());
        }

        var tempJSON = {
            // first_date: this.state.firstDate,
            kode_produk_inhealth: this.state.inputInHealth,
            no_barcode: recentBarcode,
            not_sale: this.state.inputTidakBolehDijual,
            old_procode: this.state.inputOldProduct,
            poin_dynamic: "",
            poin_sell_pack: this.state.inputSellPack,
            poin_selling: this.state.inputPoinSelling, 
            pro_activeyn: "Y", 
            pro_amount: parseInt(this.state.inputAmount), 

            pro_barcodeyn: this.state.inputBarcodeYN, 
            pro_bolehbundleyn: "", 
            pro_brandcode: this.state.inputBrandCode, 
            pro_bufferyn: "", 
            pro_bundleyn: "", 
            pro_buygrp: "", 
            pro_buygrpbox: "", 
            pro_buypack: parseInt(this.state.inputBuyPack), 
            pro_citycodehja: "", 
            pro_class: "", 

            pro_clsmargin: this.state.inputClsMargin, 
            pro_clsproduct: this.state.inputClsProduct, 
            pro_code: this.state.inputCode, 
            pro_codesup: this.state.inputCodeSup, 
            pro_ctrlcode: this.state.inputCtrlCode, 
            pro_dataaktifyn: "", 
            pro_decoryn: this.state.inputDecorYN, 
            pro_deptcode: this.state.inputDeptCode, 
            pro_dsgform: parseInt(this.state.inputDsgForm), 
            pro_expdateyn: this.state.inputExpDateYN, 

            pro_firstactivity: "", 
            pro_generikid: this.state.inputKdGenerik, 
            pro_halal: this.state.inputHalalYN, 
            pro_halaldate: this.state.halalDate, 
            pro_halalyn: "", 
            pro_hetprice: "", 
            pro_hetyn: "", 
            pro_homebrandyn: this.state.inputHomeBrandYN, 
            pro_hpp: "", 
            pro_hrgspecial: parseInt(this.state.inputHargaSpecial),

            pro_hrgspecialyn: this.state.inputHargaSpecialYN, 
            pro_ida: this.state.inputIDA, 
            pro_importyn: this.state.inputImportYN, 
            pro_inhealth: this.state.inputInHealthYN, 
            pro_ipa: this.state.inputIPA, 
            pro_kategoripro: this.state.inputKategoriPro, 
            pro_kdgenerik: this.state.inputKdGenerik, 
            pro_kelipatan: parseInt(this.state.inputKelipatan), 
            pro_keterangan: "", 
            pro_ketnie: this.state.inputKetNIE,

            pro_klasibpom: this.state.inputKlasiBPOM, 
            pro_lastupdate: "", 
            pro_leadtime: parseInt(this.state.inputLeadTime), 
            pro_margincomp: "", 
            pro_medpack: parseInt(this.state.inputMedPack), 
            pro_medunit: parseInt(this.state.inputMedUnit),
            pro_minordpo: this.state.inputMinOrdPO,
            pro_monograf: this.state.inputMonograf, 
            pro_name: this.state.inputName, 
            pro_name2: this.state.inputName2,
            
            pro_niedate: this.state.nieDate,
            pro_niesubmitbpom: this.state.nieSubmitBpom,
            pro_nomorijinpro: this.state.inputNomorIjinProduk,
            pro_nongenerikyn: this.state.inputNonGenerikYN,
            pro_noreg: this.state.inputNoReg,
            pro_noregyn: this.state.inputNoRegYN,
            pro_noserthalal: this.state.inputNoSertHalal,
            pro_npdyn: this.state.inputNPDYN,
            pro_packyn: this.state.inputPackYN,
            pro_patenyn: this.state.inputPatenYN,
            pro_pointdyn: "",

            pro_pointdyno: "",
            pro_pointdynv: "",
            pro_pointdynx: "",
            pro_pointmedpack: parseInt(this.state.inputMedPack),
            pro_pointsellpack: parseInt(this.state.inputSellPack),
            pro_prgdiscyn: this.state.inputPrgDiscYN,
            pro_princode: this.state.inputPrinCode,
            pro_runningid: "",
            pro_saleprice: "",
            pro_salepricebox: "",
            pro_salepricenon: "",

            pro_salepricenonbox: "",
            pro_score: parseInt(this.state.inputScore),
            pro_sellpack: parseInt(this.state.inputSellPack),
            pro_sellunit: parseInt(this.state.inputSellUnit),
            pro_storagetemp: parseInt(this.state.inputStorageTemp),
            pro_strength: parseInt(this.state.inputStrength),
            pro_stsmargin: "",
            pro_surveyyn: this.state.inputSurveyYN,
            pro_tabletyn: this.state.inputTabletYN,
            pro_terapiid: "",
            pro_timbangyn: this.state.inputTimbangYN,

            pro_unit: parseInt(this.state.inputUnit),
            pro_userid: "CONVERT",
            pro_valueida: parseInt(this.state.inputValueIDA),
            pro_valueipa: parseInt(this.state.inputValueIPA),
            pt_asuransi_inhealth: this.state.inputPTAsuransiInHealth,
        }

        console.log(tempJSON)
        
        axios.post('http://10.0.111.212:8092/CHCMasterProduk/Product', tempJSON)
        .then((res) => {
            console.log(res.data)
            if (res.data.error.status === false){
                this.setState({
                  responseHeader: "BERHASIL MENAMBAHKAN DATA"
                })
            } else {
                this.setState({
                    responseHeader: "GAGAL MENAMBAHKAN DATA"
                })
            }
        })

        this.toggleAddConfirmationModal()
        this.toggleResponseModal()
    }

    getTodayDate = () => {
        let date = new Date();

        let tDate = date.getDate().toString();
        let tMonth = (date.getMonth() + 1).toString();
        let tYear = date.getFullYear().toString();

        return (tYear + "-" + tMonth + "-" + tDate);
    }

    render() {
      const {
          proconStatus, comco, nomorIjinProduk, 
          classProduct, classMargin, activeDeptList, 
          activePackList, klaBPOM, jenisObat, storage, 
          companyList, productCategory, activeGenerikList, 
          strengthList, dossagFormList, principalList, 
          kdBrandList, barcode, keteranganNIE,
        } = this.state;

        return (

            <div>
                
                {/* Add Confirmation Modal */}
                <Modal
                isOpen={this.state.addConfirmationModalIsOpen}
                >
                    <ModalHeader
                    toggle={this.toggleAddConfirmationModal.bind(this)}
                    >
                        Konfirmasi Penyimpanan
                    </ModalHeader>

                    <ModalBody>
                        Apakah Anda Yakin Ingin Menyimpan Data Ini?
                    </ModalBody>

                    <ModalFooter
                    style={{
                      display: "inline-block",
                      textAlign: "center"
                    }}
                    >
                        <Button
                        color="primary"
                        onClick={ ()=>this.addProdukMaster() }
                        ><MdDone
                        style={{
                            marginRight: "5"
                        }}
                        />Ya
                        </Button>

                        <Button
                        color="secondary"
                        onClick={this.toggleAddConfirmationModal.bind(this)}
                        ><MdClose
                        style={{
                            marginRight: "5"
                        }}
                        />Tidak
                        </Button>

                    </ModalFooter>

                </Modal>
                {/* Add Confirmation Modal */}

                {/* Add Barcode Modal */}
                <Modal
                isOpen={this.state.addBarcodeModalIsOpen}
                >
                    <ModalHeader
                    toggle={this.toggleAddBarcodeModal.bind(this)}
                    >
                        Tambah Barcode
                    </ModalHeader>

                    <ModalBody>
                        <Label>Barcode</Label>
                        <Input
                        placeholder="Barcode"
                        onInput={(e) => this.handleChange("inputBarcode", e)} 
                        />
                    </ModalBody>

                    <ModalFooter
                    style={{
                      display: "inline-block",
                      textAlign: "center"
                    }}
                    >
                        <Button
                        color="primary"
                        onClick={ ()=>this.insertBarcodeToTempArray(this.state.inputBarcode) }
                        ><MdSave
                        style={{
                            marginRight: "5"
                        }}
                        />
                        Save
                        </Button>

                        <Button
                        color="secondary"
                        onClick={this.toggleAddBarcodeModal.bind(this)}
                        ><MdClose
                        style={{
                            marginRight: "5"
                        }}
                        />Cancel
                        </Button>

                    </ModalFooter>

                </Modal>
                {/* Add Barcode Modal */}

                {/* Response Modal */}
                <Modal
                isOpen={this.state.responseModalIsOpen}>
                    
                    <ModalHeader
                    toggle={this.toggleResponseModal.bind(this)}
                    >
                        {this.state.responseHeader}
                    </ModalHeader>
                  
                    <ModalBody>
                        {this.state.responseHeader}
                    </ModalBody>
                    
                    <ModalFooter>
                        <Button
                        color="primary"
                        onClick={ this.refreshPage.bind(this) }
                        >
                            OK
                        </Button>
                    </ModalFooter>

                </Modal>
                {/* Response Modal */}

                <Card>

                    <CardBody>

                        {/* Product & Prodes2 */}
                        <Form>

                            {/* Product */}
                            <FormGroup 
                            row
                            style={{
                                marginBottom: "0px"
                            }}
                            >
                                <Label 
                                sm={3}>
                                    Product
                                </Label>
                                
                                {/* <Input
                                disabled
                                placeholder = "Prod. Code"
                                style={{
                                    width: "10%",
                                    display: "inline"
                                }}
                                maxLength={7}
                                onInput={(e) => this.handleChange("inputCode", e)}
                                /> */}

                                <Input
                                placeholder = "Old Prod."
                                style={{
                                    width: "15%",
                                    display: "inline"
                                }}
                                autoComplete
                                minLength={1}
                                maxLength={7}
                                onInput={(e) => this.handleChange("inputOldProduct", e)}
                                />

                                <Input
                                placeholder = "Sup. Code"
                                style={{
                                    width: "15%",
                                    display: "inline"
                                }}
                                maxLength={10}
                                onInput={(e) => this.handleChange("inputCodeSup", e)}
                                />

                                <Input
                                placeholder = "Prod. Name"
                                style={{
                                    width: "40%",
                                    display: "inline"
                                }}
                                maxLength={100}
                                onInput={(e) => this.handleChange("inputName", e)}
                                />
                            </FormGroup>
                            {/* Product */}

                            {/* Prodes2 */}
                            <FormGroup 
                            row
                            style={{
                                marginBottom: "0px"
                            }}
                            >
                                <Label 
                                sm={3}>
                                    Prodes2
                                </Label>
                                
                                <Input
                                placeholder = "Prod. Name 2"
                                style={{
                                    width: "70%",
                                    display: "inline"
                                }}
                                maxLength={100}
                                onInput={(e) => this.handleChange("inputName2", e)}
                                />
                            </FormGroup>
                            {/* Prodes 2 */}
                        </Form>
                        {/* Product & Prodes 2 */}

                        {/* Department, Principal, Procon, StsMargin */}
                        <Form>

                            {/* Department & Principal */}
                            <Form
                            style={{
                                width: "50%",
                                float: "left",
                            }}
                            >
                                {/* Department */}
                                <FormGroup 
                                row
                                style={{
                                    marginBottom: "0px",
                                }}
                                >
                                    <Label 
                                    sm={4}>
                                        Department
                                    </Label>

                                    <select
                                    className = "custom-select"
                                    style = {{
                                        width: "60%",
                                        marginRight: "5%",
                                    }}
                                    onInput={(e) => this.handleChange("inputDeptCode", e)}
                                    >
                                        {activeDeptList.map(
                                            adl =>
                                            <option value={adl.dept_code}>{adl.dept_code} - {adl.dept_name}</option>
                                        )} 
                                    </select>

                                    {/* <Input
                                    placeholder="Dept. Name"
                                    style = {{
                                        width: "35%",
                                        marginRight: "5%",
                                    }}
                                    onInput={(e) => this.handleChange("inputDeptName", e)}
                                    /> */}
                                    
                                    {/* <select
                                    className = "custom-select"
                                    style = {{
                                        width: "35%",
                                        marginRight: "5%",
                                    }}
                                    >
                                        {activeDeptList.map(
                                            adl =>
                                            <option value={adl.dept_name}>{adl.dept_name}</option>
                                        )} 
                                    </select> */}
                                </FormGroup>
                                {/* Department */}

                                {/* Principal */}
                                <FormGroup 
                                row
                                style={{
                                    marginBottom: "0px",
                                }}
                                >
                                    <Label 
                                    sm={4}>
                                        Principal
                                    </Label>

                                    <select
                                    className = "custom-select"
                                    style = {{
                                        width: "60%",
                                        marginRight: "5%",
                                    }}
                                    onChange={(e) => this.handleChange("inputPrinCode", e)}
                                    >
                                        {principalList.map(
                                            pl =>
                                            <option value={pl.Pri_Code}>{pl.Pri_Code} - {pl.Pri_Name}</option>
                                        )} 
                                    </select>

                                    {/* <Input
                                    style = {{
                                        width: "35%",
                                        marginRight: "5%",
                                    }}
                                    placeholder="Prin. Name"
                                    onInput={(e) => this.handleChange("inputPrinName", e)}
                                    /> */}

                                    {/* <select
                                    className = "custom-select"
                                    style = {{
                                        width: "35%",
                                        marginRight: "5%",
                                    }}
                                    >
                                        {activeDeptList.map(
                                            adl =>
                                            <option value={adl.dept_name}>{adl.dept_name}</option>
                                        )} 
                                    </select> */}
                                </FormGroup>
                                {/* Principal */}
                            </Form>
                            {/* Department & Principal */}

                            {/* Procon, Sts Margin, Exp. Date & Prg Discount */}
                            <Form
                            style={{
                                width: "50%",
                                float: "right",
                            }}
                            >
                                <FormGroup inline>
                                    {/* Procon */}
                                    <Label sm={3}>
                                        Procon
                                    </Label>

                                    <select
                                    className = "custom-select"
                                    style = {{
                                        width: "60%",
                                        marginRight: "5%",
                                    }}
                                    onChange={(e) => this.handleChange("inputCtrlCode", e)}
                                    >
                                        {proconStatus.map(
                                            ps =>
                                            <option value={ps.statusId}>{ps.statusName}</option>
                                        )} 
                                    </select>
                                    {/* Procon */}

                                    {/* Expired Date */}
                                    <FormGroup 
                                    inline 
                                    check
                                    >
                                        {/* <Label 
                                        check
                                        >
                                            <Input
                                            type="checkbox"
                                            id="checkboxExpDate"
                                            onChange={this.checkboxListener.bind(this)}
                                            />Exp. Date
                                        </Label> */}
                                    </FormGroup>
                                    {/* Expired Date */}
                                </FormGroup>       

                                <FormGroup inline>
                                    {/* Sts Margin */}
                                    {/* <Label sm={3}>
                                        Sts Margin
                                    </Label>

                                    <select
                                    className = "custom-select"
                                    style = {{
                                        width: "30%",
                                        marginRight: "5%",
                                    }}
                                    // onInput={(e) => this.handleChange("inputStsMargin", e)}
                                    onSelect={(e) => this.handleChange("inputStsMargin", e)}
                                    >
                                        {stsMargin.map(
                                            sm =>
                                            <option value={sm.stsId}>{sm.stsName}</option>
                                        )} 
                                    </select>
                                    Sts Margin */}

                                    {/* Prg Discount */}
                                    <FormGroup inline
                                    check
                                    style={{
                                    }}
                                    >
                                        <Label check className="ml-3">
                                            <Input
                                            type="checkbox"
                                            id="checkboxExpDate"
                                            onChange={this.checkboxListener.bind(this)}
                                            />Exp. Date
                                        </Label>

                                        <Label check className="ml-3">
                                            <Input 
                                            type="checkbox"
                                            id="checkboxPrgDisc"
                                            onChange={this.checkboxListener.bind(this)}
                                            />Prg Discount
                                        </Label>
                                    </FormGroup>
                                    {/* Prg Discount */}
                                </FormGroup>                  

                            </Form>
                            {/* Procon, Sts Margin, Exp. Date & Brg Discount */}

                            </Form>
                            {/* Department, Principal, Procon, StsMargin */}

                            <Form>

                                <Form>

                                    <FormGroup>
                                        <Label
                                        style={{
                                            visibility: "hidden",
                                        }}
                                        >
                                            AAA
                                        </Label>
                                    </FormGroup>

                                    <Form
                                    style={{
                                        textAlign: "center",
                                    }}
                                    >

                                        {/* Buy Pack */}
                                        <FormGroup 
                                        row
                                        style={{
                                            marginBottom: "0px",
                                        }}
                                        >
                                            <Label 
                                            sm={4}>
                                                Buy Pack
                                            </Label>

                                            <Input
                                            disabled
                                            value = "1"
                                            style={{
                                                width: "20%",
                                                display: "inline",
                                            }}
                                            onInput={(e) => this.handleChange("inputBuyUnit", e)}
                                            />

                                            <select
                                            className = "custom-select"
                                            style = {{
                                                width: "30%",
                                                marginRight: "5%",
                                            }}
                                            onInput={(e) => this.handleChange("inputBuyPack", e)}
                                            >
                                                {activePackList.map(
                                                    apl =>
                                                    <option value={apl.pack_code}>{apl.pack_name}</option>
                                                )}
                                                {/* {activeUnit.map(
                                                    au =>
                                                    <option value={au.unit_code}>{au.unit_name}</option>
                                                )}  */}
                                            </select>

                                            {/* value={this.state.inputSellPack}
                                            onInput={(e) => this.handleChange("inputSellPack", e)}               */}
                                            
                                        </FormGroup>
                                        {/* Buy Pack */}

                                        {/* Sell Pack */}
                                        <FormGroup 
                                        row
                                        style={{
                                            marginBottom: "0px",
                                        }}
                                        >
                                            <Label 
                                            sm={4}>
                                                Sell Pack
                                            </Label>

                                            <Input
                                            placeholder = "Sell Unit"
                                            style={{
                                                width: "20%",
                                                display: "inline"
                                            }}
                                            min={1}
                                            type="number"
                                            onInput={(e) => this.handleChange("inputSellUnit", e)}
                                            />

                                            <select
                                            className = "custom-select"
                                            style = {{
                                                width: "30%",
                                                marginRight: "5%",
                                            }}
                                            onInput={(e) => this.handleChange("inputSellPack", e)}
                                            >
                                                {activePackList.map(
                                                    apl =>
                                                    <option value={apl.pack_code}>{apl.pack_name}</option>
                                                )}
                                                {/* {activeUnit.map(
                                                    au =>
                                                    <option value={au.unit_code}>{au.unit_name}</option>
                                                )} */}
                                            </select>        
                                            
                                        </FormGroup>
                                        {/* Sell Pack */}

                                        {/* Med Pack */}
                                        <FormGroup 
                                        row
                                        style={{
                                            marginBottom: "0px",
                                        }}
                                        >
                                            <Label 
                                            sm={4}>
                                                Med Pack
                                            </Label>

                                            <Input
                                            placeholder = "Med Unit"
                                            style={{
                                                width: "20%",
                                                display: "inline"
                                            }}
                                            min={1}
                                            type="number"
                                            onInput={(e) => this.handleChange("inputMedUnit", e)}
                                            />

                                            <select
                                            className = "custom-select"
                                            style = {{
                                                width: "30%",
                                                marginRight: "5%",
                                            }}
                                            onInput={(e) => this.handleChange("inputMedPack", e)}
                                            >
                                                {activePackList.map(
                                                    apl =>
                                                    <option value={apl.pack_code}>{apl.pack_name}</option>
                                                )}
                                                {/* {activeUnit.map(
                                                    au =>
                                                    <option value={au.unit_code}>{au.unit_name}</option>
                                                )} */}
                                            </select> 
                                            
                                        </FormGroup>
                                        {/* Med Pack */}

                                        {/* Min Ord Out */}
                                        <FormGroup 
                                        row
                                        style={{
                                            marginBottom: "0px",
                                        }}
                                        >
                                            <Label 
                                            sm={4}>
                                                Min Ord Out
                                            </Label>

                                            <Input
                                            disabled
                                            style={{
                                                width: "20%",
                                                display: "inline"
                                            }}
                                            onInput={(e) => this.handleChange("inputMinOrdPo", e)}
                                            value={this.state.inputMinOrdPO}
                                            />

                                            <select
                                            disabled
                                            className = "custom-select"
                                            style = {{
                                                width: "30%",
                                                marginRight: "5%",
                                            }}
                                            value={this.state.inputSellPack}
                                            onInput={(e) => this.handleChange("inputSellPack", e)}
                                            >
                                                {activePackList.map(
                                                    apl =>
                                                    <option value={apl.pack_code}>{apl.pack_name}</option>
                                                )}
                                                {/* {activeUnit.map(
                                                    au =>
                                                    <option value={au.unit_code}>{au.unit_name}</option>
                                                )} */}
                                            </select> 
                                            
                                        </FormGroup>
                                        {/* Min Ord Out */}
                                    
                                    </Form>

                                </Form>
                            </Form>

                            <Form>
                                <Form>

                                    <Form
                                    style={{
                                        textAlign: "center",
                                        paddingLeft: "20%",
                                        paddingRight: "20%",
                                    }}
                                    >

                                        <FormGroup
                                        inline
                                        check
                                        style={{
                                            marginBottom: "5%",
                                        }}
                                        >
                                            <Label check>
                                                <Input
                                                id="checkboxBarcode"
                                                type="checkbox"
                                                onClick={this.checkboxListener.bind(this)}
                                                />Barcode
                                            </Label>
                                        </FormGroup>

                                        <FormGroup
                                        style={{
                                            marginTop: "5%"
                                        }}
                                        id="tableBarcode"
                                        style={{
                                            // height: "20%",
                                            display: "none"
                                        }}
                                        >

                                            <br/>

                                            <Button
                                            color={"primary"}
                                            onClick = {this.toggleAddBarcodeModal.bind(this)}
                                            >
                                                <MdAdd/>
                                                Tambah
                                            </Button>

                                            <Table
                                            bordered
                                            responsive
                                            // id="tableBarcode"
                                            style={{
                                                height: "15vw",
                                                marginTop: "5px",
                                                // display: "none"
                                            }}
                                            >
                                                <thead>
                                                    <tr>
                                                        <th>No</th>
                                                        <th>Barcode</th>
                                                        <th>Action(s)</th>
                                                    </tr>
                                                </thead>
                                                
                                                <tbody>
                                                    {barcode.map((b) =>
                                                    <tr>
                                                        <th 
                                                        scope="row"
                                                        style={{
                                                            width: "25%",
                                                        }}>
                                                        {b.bID}
                                                        </th>
                                                        
                                                        <td
                                                        style={{
                                                        width: "40%",
                                                        }}>
                                                        {b.bCode}
                                                        </td>
                                                        
                                                        <td
                                                        style={{
                                                        width: "40%",
                                                        }}>
                                                            {/* <Button
                                                            color={"success"}
                                                            style={{
                                                                marginRight: "2.5%"
                                                            }}
                                                            >
                                                                <MdEdit/>
                                                            </Button> */}

                                                            <Button
                                                            color={"danger"}
                                                            style={{
                                                                marginLeft: "2.5%"
                                                            }}
                                                            onClick = { () => this.removeBarcodeById(b.bID,b.bCode)}
                                                            >
                                                                <MdDelete/>
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                    )}
                                                </tbody>
                                            </Table>

                                        </FormGroup>
                                    
                                    </Form>

                                </Form>
                            </Form>

                            <hr/>

                            {/* Qty PO Min & Nomor Ijin Produk */}
                            <Form
                            style={{
                            marginTop: "5%"
                            }}
                            >

                                <Form
                                style={{
                                    width: "50%",
                                    float: "left",
                                }}
                                >
                                    {/* Qty PO Min */}
                                    <FormGroup 
                                    row
                                    style={{
                                        marginBottom: "0px",
                                    }}
                                    >
                                        <Label 
                                        sm={4}>
                                            Qty PO Min
                                        </Label>

                                        <Input
                                        placeholder = "pcs"
                                        style={{
                                            width: "15%",
                                            display: "inline",
                                        }}
                                        min={1}
                                        type="number"
                                        onChange={(e) => this.handleChange("inputQtyPOMin", e)}
                                        />
                                        
                                        <select
                                        disabled
                                        className = "custom-select"
                                        style = {{
                                            width: "45%",
                                            marginRight: "5%",
                                        }}
                                        value={this.state.inputBuyPack}
                                        onInput={(e) => this.handleChange("inputBuyPack", e)}
                                        >
                                            {activePackList.map(
                                                apl =>
                                                <option value={apl.pack_code}>{apl.pack_name}</option>
                                            )}
                                            {/* {activeUnit.map(
                                                au =>
                                                <option value={au.unit_code}>{au.unit_name}</option>
                                            )} */}
                                        </select>

                                    </FormGroup>
                                    {/* Qty PO Min */}

                                    {/* Nomor Ijin Produk */}
                                    <FormGroup 
                                    row
                                    style={{
                                        marginBottom: "0px",
                                    }}
                                    >
                                        <Label 
                                        sm={4}>
                                            Nomor Ijin Produk:
                                        </Label>

                                        <select
                                        id="selectNomorIjinProduk"
                                        className = "custom-select"
                                        style = {{
                                            width: "60%",
                                        }}
                                        onChange={this.nomorIjinProdukHandler.bind(this)}
                                        >
                                            {nomorIjinProduk.map(
                                                nip =>
                                                <option value={nip.nipStatus}>{nip.nipStatus}</option>
                                            )} 
                                        </select>
                                    </FormGroup>
                                    {/* Nomor Ijin Produk */}

                                    {/* No. Reg */}
                                    <FormGroup
                                    inline
                                    disabled 
                                    check
                                    id="noRegFormGroup"
                                    style={{
                                        marginBottom: "5%",
                                        visibility: "hidden"
                                    }}
                                    >

                                        <Label 
                                        inline
                                        sm={6}>
                                            <Input 
                                            id="checkboxNoReg"
                                            type="checkbox"
                                            onClick={this.checkboxListener.bind(this)}
                                            />
                                            No. Reg
                                        </Label>

                                        <Input
                                        inline
                                        placeholder = "No. Reg"
                                        id="inputNoReg"
                                        disabled="true"
                                        onChange={(e) => this.handleChange("inputNoReg", e)}
                                        maxLength={50}
                                        />
                                        
                                    </FormGroup>
                                    {/* No. Reg */}

                                    {/* No. Reg Berlaku s/d */}
                                    <FormGroup 
                                    row
                                    disabled
                                    id = "noRegBerlakuFormGroup"
                                    style={{
                                        marginBottom: "0px",
                                        visibility: "hidden"
                                    }}
                                    >
                                        <Label 
                                        sm={4}>
                                            No. Reg Berlaku s/d:
                                        </Label>

                                        <Input
                                        id="inputNoRegBerlaku"
                                        disabled
                                        type = "date"
                                        style = {{
                                            width: "60%",
                                        }}
                                        onChange={(e) => this.handleChange("inputNIEDate", e)}
                                        />
                                    </FormGroup>
                                    {/* No. Reg Berlaku s/d */}

                                    {/* Non-Generik */}
                                    <FormGroup
                                    inline
                                    check
                                    style={{
                                        marginTop: "5%",
                                        marginBottom: "30%",
                                    }}
                                    >
                                        <Label
                                        check
                                        // sm={5}
                                        >
                                            <Input 
                                            type="checkbox"
                                            id="checkboxNonGenerik"
                                            onClick={this.checkboxListener.bind(this)}
                                            />Non-Generik
                                        </Label>
                                        
                                    </FormGroup>
                                    {/* Non-Generik */}

                                    {/* Harga Special Per Pcs */}
                                    <FormGroup
                                    inline 
                                    check
                                    style={{
                                        marginBottom: "5%",
                                        visibility: "hidden"
                                    }}
                                    >

                                        <Label 
                                        inline
                                        sm={4}>
                                            <Input
                                            id="checkboxHargaSpecial"
                                            type="checkbox"
                                            onClick={this.checkboxListener.bind(this)}
                                            />
                                            Harga Special Per-Pcs
                                        </Label>

                                        <Input
                                        inline
                                        placeholder = "Harga Special Per-Pcs"
                                        id="inputHargaSpecial"
                                        disabled="true"
                                        onInput={(e) => this.handleChange("inputHargaSpecial", e)}
                                        type="number"
                                        min={0}
                                        />
                                        
                                    </FormGroup>
                                    {/* No. Reg */}

                                </Form>
                                {/* Qty PO Min & Nomor Ijin Produk */}

                                {/* Kelipatan, IPA, IDA */}
                                <Form
                                style={{
                                    width: "50%",
                                    float: "right",
                                }}
                                >

                                    {/* Kelipatan */}
                                    <FormGroup 
                                    row
                                    style={{
                                        marginBottom: "0px",
                                    }}
                                    >
                                        <Label 
                                        sm={4}>
                                            Kelipatan
                                        </Label>

                                        <Input
                                        placeholder = "Kelipatan"
                                        style={{
                                            width: "60%",
                                            display: "inline",
                                        }}
                                        onInput={(e) => this.handleChange("inputKelipatan", e)}
                                        type="number"
                                        min={0}
                                        />

                                    </FormGroup>
                                    {/* Kelipatan */}

                                    {/* IPA */}
                                    <FormGroup
                                    inline 
                                    check
                                    style={{
                                        marginBottom: "5%"
                                    }}
                                    >

                                        <Label 
                                        inline
                                        sm={6}>
                                            <Input
                                            id="checkboxIPA"
                                            type="checkbox"
                                            onChange={this.checkboxListener.bind(this)}
                                            />
                                            IPA
                                        </Label>

                                        <Input
                                        inline
                                        placeholder = "Value IPA"
                                        id="inputIPA"
                                        disabled
                                        onInput= {(e) => this.handleChange("inputValueIPA", e)}
                                        type="number"
                                        min={1}
                                        />
                                        
                                    </FormGroup>
                                    {/* IPA */}    

                                    {/* IDA */}
                                    <FormGroup
                                    inline 
                                    check
                                    style={{
                                        marginBottom: "5%"
                                    }}
                                    >

                                        <Label 
                                        inline
                                        sm={6}>
                                            <Input
                                            id="checkboxIDA"
                                            type="checkbox"
                                            onChange={this.checkboxListener.bind(this)} 
                                            />
                                            IDA
                                        </Label>

                                        <Input
                                        inline
                                        placeholder = "Value IDA"
                                        id="inputIDA"
                                        disabled
                                        onInput={(e) => this.handleChange("inputValueIDA", e)}
                                        type="number"
                                        min={1}
                                        />
                                        
                                    </FormGroup>
                                    {/* IDA */}

                                    {/* LT */}
                                    <FormGroup 
                                    row
                                    style={{
                                        marginBottom: "0px",
                                    }}
                                    >
                                        <Label 
                                        sm={4}>
                                            Lead Time
                                        </Label>

                                        <Input
                                        placeholder = "Lead Time"
                                        style={{
                                            width: "60%",
                                            display: "inline",
                                        }}
                                        onInput={(e) => this.handleChange("inputLeadTime", e)}
                                        type="number"
                                        min={0}
                                        />

                                    </FormGroup>
                                    {/* LT */}

                                    {/* Keterangan NIE */}
                                    <FormGroup 
                                    row
                                    style={{
                                        marginBottom: "0px",
                                    }}
                                    >
                                        <Label 
                                        sm={4}>
                                            Ket. NIE
                                        </Label>

                                        <select
                                        id = "selectketeranganNIE"
                                        className = "custom-select"
                                        style = {{
                                            width: "60%",
                                        }}
                                        onChange = {this.keteranganNIEHandler.bind(this)}
                                        >
                                            {keteranganNIE.map(
                                                knie =>
                                                <option value={knie.nie_id}>{knie.nie_id} - {knie.nie_nama}</option>
                                            )}
                                        </select>

                                        <Label 
                                        id = "labelTglBPOM"
                                        style={{
                                            // visibility: "hidden",
                                        }}
                                        sm={4}>
                                            Tgl. Submit BPOM
                                        </Label>

                                        <Input
                                        id = "inputTglBPOM"
                                        type="date"
                                        style = {{
                                            width: "60%",
                                            // visibility: "hidden",
                                        }}
                                        onInput={(e) => this.handleChange("inputNIESubmitBPOM", e)}
                                        />

                                    </FormGroup>
                                    {/* Keterangan NIE */}

                                    {/* <FormGroup
                                    style={{
                                        marginBottom: "5%",
                                    }}
                                    >

                                        <Label 
                                        inline
                                        sm={4}>
                                            <Input
                                            id="checkboxHalal"
                                            type="checkbox"
                                            onClick={this.checkboxListener.bind(this)}
                                            />
                                            Halal
                                        </Label>

                                        <Input
                                        id="inputHalal"
                                        placeholder = "No. Sertifikasi Halal"
                                        disabled
                                        style={{
                                            width: "60%",
                                            display: "inline",
                                        }}
                                        onInput={(e) => this.handleChange("inputNoSertHalal", e)}
                                        maxLength={50}
                                        />
                                        
                                    </FormGroup>

                                    <FormGroup
                                    inline 
                                    check
                                    id="noSertifikasiFormGroup"
                                    style={{
                                        marginBottom: "5%",
                                        visibility: "hidden"
                                    }}
                                    >
                                        <Label 
                                        sm={5}>
                                            No. Sertifikasi Berlaku s/d: 
                                        </Label>

                                        <Input
                                        type="date"
                                        style = {{
                                            width: "60%",
                                        }}
                                        id="inputHalalDate"
                                        onInput={(e) => this.handleChange("inputHalalDate", e)}
                                        />
                                    </FormGroup> */}

                                    <FormGroup
                                    inline
                                    style={{
                                        marginBottom: "5%",
                                    }}
                                    >

                                        <Label 
                                        sm={4}>
                                            Halal
                                        </Label>

                                        <select
                                        id = "selectHalal"
                                        className = "custom-select"
                                        style = {{
                                            width: "62.5%",
                                        }}
                                        onChange = {this.halalHandler.bind(this)}
                                        >
                                            {nomorIjinProduk.map(
                                                nip =>
                                                <option value={nip.nipStatus}>{nip.nipStatus}</option>
                                            )}
                                        </select>

                                        {/* <Label 
                                        inline
                                        sm={4}>
                                            <Input
                                            id="checkboxHalal"
                                            type="checkbox"
                                            onClick={this.checkboxListener.bind(this)}
                                            />
                                            Halal
                                        </Label>

                                        <Input
                                        inline
                                        id="inputHalal"
                                        placeholder = "No. Sertifikasi Halal"
                                        disabled
                                        onInput={(e) => this.handleChange("inputNoSertHalal", e)}
                                        maxLength={50}
                                        /> */}
                                        
                                    </FormGroup>

                                    <FormGroup 
                                    row
                                    style={{
                                        marginBottom: "5px",
                                    }}
                                    >
                                        <Label 
                                        id="labelNoSertHalal"
                                        sm={4}
                                        style={{
                                            visibility: "hidden",
                                        }}
                                        >
                                            No. Sert. Halal
                                        </Label>

                                        <Input
                                        id="inputNoSertHalal"
                                        disabled
                                        style={{
                                            width: "60%",
                                            display: "inline",
                                            visibility: "hidden",
                                        }}
                                        placeholder = "No. Sert. Halal"
                                        onInput={(e) => this.handleChange("inputNoSertHalal", e)}
                                        maxLength={50}
                                        />

                                    </FormGroup>

                                    <FormGroup
                                    inline 
                                    check
                                    id="noSertifikasiFormGroup"
                                    style={{
                                        marginBottom: "5%",
                                        visibility: "hidden"
                                    }}
                                    >
                                        <Label 
                                        sm={5}>
                                            No. Sertifikasi Berlaku s/d: 
                                        </Label>

                                        <Input
                                        id="inputNoSertifikasiBerlaku"
                                        disabled
                                        type="date"
                                        style = {{
                                            width: "60%",
                                        }}
                                        onInput={(e) => this.handleChange("inputHalalDate", e)}
                                        />
                                    </FormGroup>

                                    {/* Het Sell Pack */}
                                    <FormGroup
                                    inline 
                                    check
                                    style={{
                                        marginBottom: "5%"
                                    }}
                                    >

                                        {/* <Label 
                                        inline
                                        sm={5}>
                                            <Input
                                            id="checkboxHetSellPack"
                                            type="checkbox"
                                            onClick={this.checkboxListener.bind(this)}
                                            />
                                            HET Sell Pack
                                        </Label>

                                        <Input
                                        inline
                                        disabled
                                        placeholder = "HET Price"
                                        id="inputNetSellPack"
                                        onInput={(e) => this.handleChange("inputHETPrice", e)}
                                        type="number"
                                        min={0}
                                        /> */}
                                        
                                    </FormGroup>
                                    {/* Net Sell Pack */}

                                </Form>
                                {/* Procon, Sts Margin, Exp. Date & Brg Discount */}

                                <Form
                                style={{
                                    visibility: "hidden"
                                }}
                                >

                                    <Label 
                                    sm={2}
                                    >
                                        HIDDEN
                                    </Label>

                                </Form>
                            </Form>

                            <hr/>

                            <div
                            style={{
                                textAlign: "center",
                            }}
                            >
                                <Label 
                                sm={2}
                                >
                                    Poin Sell Pack
                                </Label>

                                <Input
                                style={{
                                    width: "10vw",
                                    display: "inline",
                                }}
                                min={0}
                                placeholder="Poin Sell Pack"
                                type="number"
                                onInput={(e) => this.handleChange("inputPoinSellPack", e)}
                                />    

                                <Label 
                                sm={2}
                                >
                                    Poin Asli
                                </Label>

                                <Input
                                style={{
                                    width: "10vw",
                                    display: "inline",
                                }}
                                placeholder="Poin Asli"
                                type="number"
                                onInput={(e) => this.handleChange("inputPoinSelling", e)}
                                min={0}
                                />

                                <Label 
                                sm={2}
                                >
                                    Score
                                </Label>

                                <Input
                                style={{
                                    width: "10vw",
                                    display: "inline",
                                }}
                                onInput={(e) => this.handleChange("inputScore", e)}
                                type="number"
                                placeholder="Score"
                                min={0}
                                />
                            </div>

                            <hr/>

                            <Form
                            style={{
                            marginTop: "5%"
                            }}
                            >
                            <Form>

                                {/* Kd Brand */}
                                <FormGroup 
                                row
                                style={{
                                    textAlign: "center",
                                    marginBottom: "0px",
                                }}
                                >
                                    <Label 
                                    sm={2}>
                                        Kd Brand
                                    </Label>

                                    <select
                                    className = "custom-select"
                                    style = {{
                                        width: "58.5%",
                                        marginRight: "5%",
                                    }}
                                    onInput={(e) => this.handleChange("inputBrandCode", e)}
                                    >
                                        {kdBrandList.map(
                                            kbl =>
                                            <option value={kbl.Bra_BrandedCode}>{kbl.Bra_BrandedCode} - {kbl.Bra_BrandedName}</option>
                                        )} 
                                    </select>

                                    {/* <select
                                    className = "custom-select"
                                    style = {{
                                        width: "50%",
                                        marginRight: "5%",
                                    }}
                                    >
                                        {activeDeptList.map(
                                            adl =>
                                            <option value={adl.dept_name}>{adl.dept_name}</option>
                                        )} 
                                    </select> */}
                                </FormGroup>
                                {/* Kd Brand */}

                                {/* Class Produk */}
                                <FormGroup 
                                row
                                style={{
                                    textAlign: "center",
                                    marginBottom: "0px",
                                }}
                                >
                                    <Label 
                                    sm={2}>
                                        Class Produk
                                    </Label>

                                    <select
                                    className = "custom-select"
                                    style = {{
                                        width: "20%",
                                        marginRight: "2%",
                                    }}
                                    onInput={(e) => this.handleChange("inputClsProduct", e)}
                                    >
                                        {classProduct.map(
                                            cp =>
                                            <option value={cp.cpId}>{cp.cpClass}</option>
                                        )} 
                                    </select>

                                    <Label 
                                    sm={2}>
                                        Class Margin
                                    </Label>

                                    <select
                                    className = "custom-select"
                                    style = {{
                                        width: "20%",
                                        marginRight: "2%",
                                    }}
                                    onInput={(e) => this.handleChange("inputClsMargin", e)}
                                    >
                                        {classMargin.map(
                                            cm =>
                                            <option value={cm.cmId}>{cm.cmClass}</option>
                                        )} 
                                    </select>
                                </FormGroup>
                                {/* Class Produk */}

                                <Form>
                                    <FormGroup 
                                    check
                                    style={{
                                        textAlign: "center"
                                    }}
                                    >
                                        <Label 
                                        inline
                                        sm={3}>
                                            <Input 
                                            type="checkbox"
                                            id="checkboxNPD"
                                            onInput={(e) => this.checkboxListener("inputNPDYN", e)}
                                            />
                                            NPD (Pharos)
                                        </Label>

                                        <Label 
                                        inline
                                        sm={3}>
                                            <Input 
                                            type="checkbox"
                                            id="checkboxMonograf"
                                            onInput={(e) => this.checkboxListener("inputMonograf", e)}
                                            />
                                            Monograf
                                        </Label>

                                        <Label 
                                        inline
                                        sm={3}>
                                            <Input 
                                            type="checkbox"
                                            id="checkboxImport"
                                            onInput={(e) => this.checkboxListener("inputImportYN", e)}
                                            />
                                            Import
                                        </Label>

                                        <Label 
                                        inline
                                        sm={3}>
                                            <Input 
                                            type="checkbox"
                                            id="checkboxHomeBrand"
                                            onInput={(e) => this.checkboxListener("inputHomeBrandYN", e)}
                                            />
                                            Home Brand
                                        </Label>
                                    </FormGroup>
                                </Form>

                                <Form>
                                    <FormGroup 
                                    check
                                    style={{
                                        textAlign: "center"
                                    }}
                                    >
                                        <Label 
                                        inline
                                        sm={3}>
                                            <Input 
                                            type="checkbox"
                                            id="checkboxJualEceran"
                                            onInput={(e) => this.checkboxListener("inputTabletYN", e)}
                                            />
                                            Jual Eceran
                                        </Label>

                                        <Label 
                                        inline
                                        sm={3}>
                                            <Input 
                                            type="checkbox"
                                            id="checkboxKemasan"
                                            onInput={(e) => this.checkboxListener("inputPackYN", e)}
                                            />
                                            Kemasan
                                        </Label>

                                        <Label 
                                        inline
                                        sm={3}>
                                            <Input 
                                            type="checkbox"
                                            id="checkboxPaten"
                                            onInput={(e) => this.checkboxListener("inputPatenYN", e)}
                                            />
                                            Paten
                                        </Label>

                                        <Label 
                                        inline
                                        sm={3}>
                                            <Input 
                                            type="checkbox"
                                            id="checkboxPsikotropika"
                                            onInput={(e) => this.checkboxListener("inputPsikotropikaYN", e)}
                                            />
                                            Psikotropika
                                        </Label>
                                    </FormGroup>
                                </Form>

                                <Form>

                                    <FormGroup 
                                    row
                                    style={{
                                        marginTop: "5%"
                                    }}
                                    >
                                        <Label 
                                        sm={3}>
                                            Kla. BPOM
                                        </Label>

                                        <select
                                        className = "custom-select"
                                        style = {{
                                            width: "70%"
                                        }}
                                        onInput={(e) => this.handleChange("inputKlasiBPOM", e)}
                                        >
                                            {klaBPOM.map(
                                                kbpom =>
                                                <option value={kbpom.kla_Code}>{kbpom.kla_Code} - {kbpom.kla_Name}</option>
                                            )} 
                                        </select>
                                    </FormGroup>

                                    <FormGroup 
                                    row
                                    style={{
                                        marginBottom: "0px",
                                    }}
                                    >
                                        <Label 
                                        sm={3}>
                                            Generik
                                        </Label>
                                        
                                        <select
                                        className = "custom-select"
                                        style = {{
                                            width: "70%",
                                            display: "inline",
                                        }}
                                        onInput={(e) => this.handleChange("inputGenerikID", e)}
                                        >
                                            {activeGenerikList.map(
                                                agl =>
                                                <option value={agl.gen_Code}>{agl.gen_Code} - {agl.gen_Name}</option>
                                            )}
                                        </select>
                                        
                                        {/* <Input
                                        style={{
                                            width: "55%",
                                            display: "inline"
                                        }}
                                        onInput={(e) => this.handleChange("inputGenerikName", e)}
                                        placeholder="Generik Name"
                                        /> */}
                                    </FormGroup>

                                    {/* <FormGroup 
                                    row
                                    style={{
                                        marginBottom: "0px",
                                    }}
                                    >
                                        <Label 
                                        sm={3}>
                                            Terapi
                                        </Label>

                                        <Input
                                        style={{
                                            width: "15%",
                                            display: "inline",
                                        }}
                                        onInput={(e) => this.handleChange("inputTerapiID", e)}
                                        maxLength={3}
                                        placeholder="Terapi ID"
                                        />
                                        
                                        <Input
                                        style={{
                                            width: "55%",
                                            display: "inline"
                                        }}
                                        onInput={(e) => this.handleChange("inputTerapiName", e)}
                                        placeholder="Terapi Name"
                                        />
                                    </FormGroup> */}

                                    <FormGroup 
                                    row
                                    style={{
                                        marginBottom: "0px"
                                    }}
                                    >
                                        <Label 
                                        sm={3}>
                                            Strength
                                        </Label>

                                        <select
                                        className = "custom-select"
                                        style = {{
                                            width: "20%"
                                        }}
                                        onInput={(e) => this.handleChange("inputStrength", e)}
                                        >
                                            {strengthList.map(
                                                sl =>
                                                <option value={sl.strg_Code}>{sl.strg_Code} - {sl.strg_Name}</option>
                                            )} 
                                        </select>

                                        <Label 
                                        sm={3}
                                        style={{
                                            textAlign: "right"
                                        }}
                                        >Dsg Form
                                        </Label>

                                        <select
                                        className = "custom-select"
                                        style = {{
                                            width: "20%",
                                            textAlign: "right",
                                        }}
                                        onInput={(e) => this.handleChange("inputDsgForm", e)}
                                        >
                                            {dossagFormList.map(
                                                dfl =>
                                                <option value={dfl.dsgform_code}>{dfl.dsgform_code} - {dfl.dsgform_name}</option>
                                            )} 
                                        </select>
                                    </FormGroup>

                                    <FormGroup 
                                    row
                                    style={{
                                        marginBottom: "0px"
                                    }}
                                    >
                                        <Label 
                                        sm={3}>
                                            Amount
                                        </Label>

                                        <Input
                                        style={{
                                            width: "10%",
                                            display: "inline",
                                        }}
                                        onInput={(e) => this.handleChange("inputAmount", e)}
                                        type="number"
                                        placeholder="Amount"
                                        min={1}
                                        />

                                        <select
                                        className = "custom-select"
                                        style = {{
                                            width: "20%"
                                        }}
                                        onInput={(e) => this.handleChange("inputUnit", e)}
                                        >
                                            {comco.map(
                                                cmc =>
                                                <option value={cmc.cmcId}>{cmc.cmcId} - {cmc.cmcName}</option>
                                            )} 
                                        </select>

                                        <Label 
                                        sm={2}
                                        style={{
                                            textAlign: "right"
                                        }}
                                        >Kd. Generik
                                        </Label>

                                        <select
                                        className = "custom-select"
                                        style = {{
                                            width: "20%",
                                            textAlign: "right",
                                        }}
                                        onInput={(e) => this.handleChange("inputKdGenerik", e)}
                                        >
                                            {jenisObat.map(
                                                jo =>
                                                <option value={jo.jnsob_code}>{jo.jnsob_code} - {jo.jnsob_name}</option>
                                            )}
                                        </select>
                                    </FormGroup>

                                    <FormGroup 
                                    row
                                    style={{
                                        marginBottom: "0px"
                                    }}
                                    >
                                        <Label 
                                        sm={3}>
                                            Storage
                                        </Label>

                                        <select
                                        className = "custom-select"
                                        style = {{
                                            width: "20%",
                                            marginRight: "17%"
                                        }}
                                        onInput={(e) => this.handleChange("inputStorageTemp", e)}
                                        >
                                            {storage.map(
                                                strg =>
                                                <option value={strg.storage_code}>{strg.storage_code} - {strg.storage_name}</option>
                                            )} 
                                        </select>
                                    </FormGroup>

                                    {/* <FormGroup 
                                    row
                                    style={{
                                        marginBottom: "0px"
                                    }}
                                    >
                                        <Label 
                                        sm={3}>
                                            Firstdate
                                        </Label>

                                        <Input
                                        type="date"
                                        style = {{
                                            width: "60%",
                                        }}
                                        onInput={(e) => this.handleChange("inputFirstDate", e)}
                                        // value = {"" + this.getTodayDate() + ""}
                                        />
                                    </FormGroup> */}

                                    {/* <FormGroup 
                                    row
                                    style={{
                                        marginBottom: "0px"
                                    }}
                                    >
                                        <Label 
                                        sm={3}>
                                            LastUpdate
                                        </Label>

                                        <Input
                                        type="date"
                                        style = {{
                                            width: "60%",
                                        }}
                                        onInput={(e) => this.handleChange("inputLastUpdate", e)}
                                        />
                                    </FormGroup> */}

                                    <Form>
                                        <FormGroup 
                                        check
                                        style={{
                                            textAlign: "left"
                                        }}
                                        >
                                            <Label 
                                            inline
                                            sm={3}>
                                                <Input
                                                id="checkboxInHealth"
                                                type="checkbox"
                                                onClick={this.checkboxListener.bind(this)}
                                                />
                                                In Health
                                            </Label>

                                            {/* <Input
                                            id="inputInHealth"
                                            style={{
                                                width: "20%",
                                                display: "inline",
                                            }}
                                            disabled
                                            onInput={(e) => this.handleChange("inputInHealth", e)}
                                            placeholder="Kode In Health"
                                            /> */}

                                            <select
                                            id="selectInHealth"
                                            className = "custom-select"
                                            style = {{
                                                width: "30%",
                                            }}
                                            disabled
                                            onInput={(e) => this.handleChange("inputPTAsuransiInHealth", e)}

                                            >
                                                {companyList.map(
                                                    cl =>
                                                    <option value={cl.com_idnumber}>{cl.com_idnumber} - {cl.com_name}</option>
                                                )} 
                                            </select>

                                        </FormGroup>

                                    </Form>

                                    <br/>

                                    <FormGroup 
                                    row
                                    style={{
                                        marginBottom: "0px"
                                    }}
                                    >
                                        <Label 
                                        sm={3}>
                                            Kategori Produk
                                        </Label>

                                        <select
                                        className = "custom-select"
                                        style = {{
                                            width: "30%",
                                        }}
                                        onInput={(e) => this.handleChange("inputKategoriPro", e)}
                                        >
                                            {productCategory.map(
                                                pc =>
                                                <option value={pc.katpro_id}>{pc.katpro_id} - {pc.katpro_nama}</option>
                                            )} 
                                        </select>
                                    </FormGroup>

                                    <br/>

                                    <Form>
                                        <FormGroup 
                                        check
                                        style={{
                                            textAlign: "center"
                                        }}
                                        >
                                            <Label 
                                            inline
                                            sm={3}>
                                                <Input 
                                                type="checkbox"
                                                id="checkboxTidakBolehDijual"
                                                onChange={this.checkboxListener.bind(this)}
                                                />
                                                TIDAK BOLEH DIJUAL
                                            </Label>

                                            <Label 
                                            inline
                                            sm={3}>
                                                <Input 
                                                type="checkbox"
                                                id="checkboxSurvey"
                                                onClick={this.checkboxListener.bind(this)}
                                                />
                                                Survey
                                            </Label>

                                            <Label 
                                            inline
                                            sm={3}>
                                                <Input 
                                                type="checkbox"
                                                id="checkboxDekor"
                                                onClick={this.checkboxListener.bind(this)}
                                                />
                                                Dekor
                                            </Label>

                                            <Label 
                                            inline
                                            sm={3}>
                                                <Input
                                                type="checkbox"
                                                id="checkboxTimbang"
                                                onClick={this.checkboxListener.bind(this)}
                                                />
                                                Timbang
                                            </Label>
                                        </FormGroup>
                                    </Form>

                                </Form>

                            </Form>
                            </Form>

                            <hr/>

                            <div>
                                <Form
                                style={{
                                    textAlign: "center",
                                    marginTop: "2vw",
                                }}
                                >
                                    <Button
                                    color = "success"
                                    style={{
                                        marginRight:"1%"
                                    }}
                                    onClick = {this.toggleAddConfirmationModal.bind(this)}
                                    >
                                        <MdSave
                                        style={{
                                            marginRight: "5px"
                                        }}
                                        />SAVE
                                    </Button>

                                    <Button
                                    color = "danger"
                                    onClick= {this.props.func}
                                    style={{
                                        marginLeft:"1%"
                                    }}
                                    >
                                        <MdCancel
                                        style={{
                                            marginRight: "5px"
                                        }}
                                        />CANCEL
                                    </Button>
                                </Form>
                            </div>

                    </CardBody>

                </Card>
            
            </div>
        )
    }
}

export default MasterProdukMasterAdd;