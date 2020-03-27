import React from 'react';
import {
    Form, FormGroup, Card, CardHeader, Input, Button,
    Label, CardBody, CardFooter, Table, Modal, ModalHeader,
    ModalBody, ModalFooter, 
} from 'reactstrap';
import { 
    MdSearch, MdAdd, MdArrowForward, MdCancel, MdSave, MdEdit,
    MdDone, MdClose, 
} from 'react-icons/md';
import 'react-tabs/style/react-tabs.css';
import axios from 'axios';

class MasterProdukSupplierAktifAdd extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: 0,
            result: [],
            result1911: {},
            activeDeptList: [],
            productDetailMargin_DSA: [],
            productDetailMargin_DHJ: [],
            productDetailMargin: [],
            supplierByCode: [],
            supplierFinance: [],
            productSupplier: [],
            productDetailSupplierAktif: [],
            productDetailHargaJual: [],
            supplier: [],
            stsMove: [],
            stsMargin: [],
            currency: [],
            bulanED: [
                {
                    bulan: 1
                },
                {
                    bulan: 2
                },
                {
                    bulan: 3
                },
                {
                    bulan: 4
                },
                {
                    bulan: 5
                },
            ],

            // Input
            inputProductCode: '',
            inputProductName: '',

            inputStsMove: '',
            inputSellUnit: '',

            inputSupplierCode: '',
            inputSupplierName: '',
            inputTOP: '',
            inputPKPYN: 'N',
            inputImportYN: 'N',

            inputCurrencyID: 0,
            inputDollarPrice: '',
            inputFreight: '',
            inputGrossPrice: '',
            inputGrossPcs: 0,
            inputDiscount: '',

            inputNettPrice: '',
            inputNettPcs: 0,
            inputReturED: 'N',
            inputRetur: null,
            inputSupplierReturED: 'N',
            inputSupplierRetur: '',

            inputStsMargin: '',
            inputHetSellPackYN: 'N',
            inputHetSellPack: '',
            inputHargaSpecialPerPcsYN: 'N',
            inputHargaSpecialPerPcs: '',

            inputReturTdkLakuYN: 'N',
            inputReturContentYN: 'N',
            inputReturPackYN: 'N',
            inputReturNewProdYN: 'N',
            inputTukarGulingYN: 'N',

            inputPrsHETNetto: '',
            inputPseudo: '',
            inputMarginHPP: '',
            inputHPP: '',
            inputRecMargin: '',
            inputTglProsesHPP: '',

            inputSaleMargin: '',
            inputSalePriceBox: '',
            inputSalePrice: '',
            inputSaleMarginNon: '',
            inputSalePriceNonBox: '',
            inputSalePriceNon: '',

            inputMarginAuto: '',
            inputHJAAutoBox: '',
            inputHJAAuto: '',
            inputBuyGrpBox: '',
            inputBuyGrp: '',
            inputMarginTambahan: '',

            inputTglEfektif: '',
            inputKonfirmasiYN: '',
            
            // Display
            displayEditButton: "none",
            displayTambahSupplierAktif: "none",
            noDataMessage: "none",
            displayAddButton: "none",

            // Others
            selectedSupplierCode: '',
            responseHeader: '',
            stsMoveStatus: '',
        };
    }

    waitAllDataLoad = async () => {
        await Promise.all([
            this.getMoving(),
            this.getStsMargin(),
            this.getCurrency(),
            this.getSupplier(),
            this.getProductDetailMargin(),
            this.getProductSupplier(),
            this.getNettPrice(),
            this.getSupplierFinanceByCode(),
            this.getSupplierByCode(),
        ]);
    }

    componentDidMount = () => {
        this.getProdukDetail();
    }

    refreshPage = () => {
        document.location.reload()
    }

    getProdukDetail =()=>{
        axios.get('https://api.docnet.id/CHCMasterProduk/Product?kode=' + this.props.activeProcode)
        .then((res)=>{
            if(res.data.data != null){
                this.setState({
                    result: res.data.data,
                    inputProductCode: res.data.data.pro_code,
                    inputProductName: res.data.data.pro_name,
                })
            }else{
                this.setState({
                    noDataMessage:"block"
                })
            }
        })
        .then(() => this.waitAllDataLoad())
        .then(() => this.getCheckboxListener())
    }

    getSupplier = () => {
        axios
        .post('https://api.docnet.id/CHCMasterD/MasterSupplier/CariKodeSupplier')
        .then((res) => {
            if(res.data.Data !== null){
                this.setState({
                    supplier: res.data.Data,
                    // inputSupplierCode: res.data.Data.Sup_Code,
                }, () => {
                    this.getSupplierByCode();
                    this.getSupplierFinanceByCode();
                    this.getViewMatchingSelect();
                })
            }
        })
    }

    getMoving = () => {
        axios
        .get('https://api.docnet.id/CHCMasterSupport/Moving?kodeProduk=' + this.props.activeProcode)
        // .get('http://10.0.111.208:8090/Moving?page=0&length=0')
        .then((res) => {
            if (res.data.data !== null) {
                this.setState({
                //   stsMove: res.data.data,
                  inputStsMove: res.data.data.moving_procod,
                  stsMoveStatus: res.data.data.moving_status,
                }, 
                // () => console.log(this.state.inputStsMove)
                )
            } else {
                this.setState({
                  stsMove: [],
                })
            }
        })
    }

    getStsMargin = () => {
        axios
        .get('https://api.docnet.id/CHCMasterSupport/MasterStsMargin?page=0&length=0')
        .then((res) => {
            if (res.data.data !== null) {
                this.setState({
                  stsMargin: res.data.data,
                  inputStsMargin: res.data.data.sts_margincode
                })
            } else {
                this.setState({
                  stsMargin: [],
                })
            }
        })
    }

    getCurrency = () => {
        axios
        .get('https://api.docnet.id/CHCMasterSupport/MataUang?page=0&length=0')
        .then((res) => {
            if (res.data.data !== null) {
                this.setState({
                  currency: res.data.data,
                  inputCurrencyID: res.data.data.vall_id
                })
            } else {
                this.setState({
                  currency: [],
                })
            }
        })
    }

    getProductDetailMargin = () => {
        axios
        .get('https://api.docnet.id/CHCMasterProduk/ProductDetailMargin?kodeProduk=' + this.props.activeProcode)
        .then((res) => {
            if (res.data.data !== null) {
                this.setState({
                    productDetailMargin_DSA:res.data.data[0].detail_supplier_aktif,
                    productDetailMargin_DHJ:res.data.data[0].detail_harga_jual,
                    productDetailMargin: res.data.data[0],
                    inputSellUnit: this.state.productDetailMargin.sell_unit,
                    inputDollarPrice: this.state.productDetailMargin_DSA.pro_dollarprice,
                    inputFreight: this.state.productDetailMargin_DSA.pro_freight,
                    inputGrossPrice: this.state.productDetailMargin_DSA.pro_grossprice,
                    inputGrossPcs: this.state.productDetailMargin.gross_pcs,
                    inputDiscount: this.state.productDetailMargin_DSA.pro_discount,
                    inputNettPrice: this.state.productDetailMargin_DSA.pro_nettprice,
                    inputNettPcs: this.state.productDetailMargin.netto_pcs,
                    inputHetSellPack: this.state.productDetailMargin_DSA.pro_hetprice,
                    inputHargaSpecialPerPcs: this.state.productDetailMargin_DSA.pro_hrgspecial,

                    inputRetur: this.state.productDetailMargin_DSA.pro_retur,
                    inputStsMargin: this.state.productDetailMargin_DSA.pro_stsmargin,

                    inputReturED: this.state.productDetailMargin_DSA.pro_retured,
                    inputSupplierReturED: this.state.productDetailMargin_DSA.pro_suppretured,
                    inputHetSellPackYN: this.state.productDetailMargin_DSA.pro_hetyn,
                    inputHargaSpecialPerPcsYN: this.state.productDetailMargin_DSA.pro_hargaspecialyn,
                    inputReturContentYN: this.state.productDetailMargin_DSA.pro_returcontent,
                    inputReturNewProdYN: this.state.productDetailMargin_DSA.pro_returnewprod,
                    inputReturPackYN: this.state.productDetailMargin_DSA.pro_returpack,
                    inputReturTdkLakuYN: this.state.productDetailMargin_DSA.pro_returtdklaku,
                    inputTukarGulingYN: this.state.productDetailMargin_DSA.pro_tukargulingyn,
                })
            } else {
                this.setState({
                    productDetailMargin_DSA: [],
                    productDetailMargin_DHJ: [],
                    productDetailMargin: [],
                })
            }

        })
        .then(() => this.checkboxListenerView())
    }

    getSupplierByCode = () => {
        axios
        .post('https://api.docnet.id/CHCMasterD/MasterSupplier/CariKodeSupplier', 
        {
            Sup_Code: this.state.selectedSupplierCode
        })
        .then((res) => {
            if(res.data.Data !== null){
                this.setState({
                    supplierByCode: res.data.Data
                })
            }
        })
        .then(
            this.setState({
                inputImportYN:this.state.supplierByCode.Sup_ImportYN,
                inputPKPYN: this.state.supplierByCode.Sup_PKPYN
            }, () => {
                // console.log("Import: " + this.state.inputImportYN)
                // console.log("Input: " + this.state.inputPKPYN)
            })
        )
        .then(
            () => this.getCheckboxListener()
        )
        //     this.setState({
        //         supplierByCode: res.data.Data,
        //     }, () => {
        //         this.setState({
        //             inputImportYN: this.state.supplierByCode.Sup_ImportYN,
        //             inputPKPYN: this.state.supplierByCode.Sup_PKPYN,
        //         }, () => {
        //             this.getCheckboxListener()
        //         }, () => {
        //             console.log("Import YN: " + this.state.inputImportYN)
        //             console.log("PKP YN: " + this.state.inputPKPYN)
        //         })
        //     })
        // })
    }

    getSupplierFinanceByCode = () => {
        axios
        .post('https://api.docnet.id/CHCMasterD/MasterSupplierFinance/TampilkanSupplierFinancebyOnlyCode', 
        {
            FinSup_SupCode: this.state.selectedSupplierCode
        })
        .then((res) => {
            this.setState({
                supplierFinance: res.data.Data,
            }, () => {
                this.setState({
                    inputTOP: this.state.supplierFinance.FinSup_TOP,
                })
            }, () => {
                // console.log("TOP: " + this.state.inputTOP)
            })
        })
    }

    disableAllInput = () => {
        var fs1Add = document.getElementById("fs1Add"); 
        var fs2Add = document.getElementById("fs2Add");
        var fs3Add = document.getElementById("fs3Add");

        if(this.state.value === 1){
            this.setState({
                value: 0
            })
        }

        fs1Add.disabled = true;
        fs2Add.disabled = true;
        fs3Add.disabled = true;

        this.props.func1();
        document.location.reload();
    }

    enableAllInput = () => {

        // var fs1Add = document.getElementById("fs1Add");
        var fs2Add = document.getElementById("fs2Add");
        var fs3Add = document.getElementById("fs3Add");
        // var fs4Add = document.getElementById("fs4Add");

        if(this.state.value === 0){
            this.setState({
                value: 1
            })
        }

        // fs1Add.disabled = false;
        fs2Add.disabled = false;
        fs3Add.disabled = false;
        // fs4Add.disabled = false;
    }

    reloadPage = () => {
        document.location.reload();
    }

    handleChange =  (type, event) => {
        if(type === "inputProductCode"){
            this.setState({
                inputProductCode: event.target.value
            })
        }

        else if (type === "inputProductName"){
            this.setState({
                inputProductName: event.target.value
            })
        }

        else if(type === "inputStsMove"){
            this.setState({
                inputStsMove: event.target.value
            })
        }

        else if(type === "inputSellUnit"){
            var hitungGross = parseInt(this.state.inputGrossPrice / event.target.value);
            var hitungNett = parseInt(this.state.inputNettPrice / event.target.value);

            if(event.target.value == 0){
                hitungGross = 0;
                hitungNett = 0;
            }

            this.setState({
                inputSellUnit: event.target.value,
                inputGrossPcs: hitungGross,
                inputNettPcs: hitungNett
            })
        }

        else if(type === "inputSupplierCode"){
            this.setState({
                inputSupplierCode: event.target.value
            }, () => {
                this.getSupplierByCode();
                this.getSupplierFinanceByCode();
            })
        }
        
        else if(type === "inputSupplierName"){
            this.setState({
                inputSupplierName: event.target.value
            })
        }

        else if(type === "inputTOP"){
            this.setState({
                inputTOP: event.target.value
            })
        }

        else if(type === "inputPKPYN"){
            this.setState({
                inputPKPYN: event.target.value
            })
        }

        else if(type === "inputImportYN"){
            this.setState({
                inputImportYN: event.target.value
            })
        }

        else if(type === "inputCurrencyID"){
            this.setState({
                inputCurrencyID: event.target.value
            })
        }

        else if(type === "inputDollarPrice"){
            this.setState({
                inputDollarPrice: event.target.value
            })
        }

        else if(type === "inputFreight"){
            this.setState({
                inputFreight: event.target.value
            })
        }

        else if(type === "inputGrossPrice"){
            var hitungGross = parseInt(event.target.value / this.state.inputSellUnit)

            if(this.state.inputGrossPrice == 0){
                hitungGross = 0
            }

            this.setState({
                inputGrossPcs: hitungGross,
                inputGrossPrice: event.target.value
            }, () => this.getNettPrice())
        }
        
        else if(type === "inputGrossPcs"){

            if(this.state.inputGrossPrice === 0 || this.state.inputGrossPcs === NaN){
                this.setState({
                    inputGrossPcs: 0
                })
            }
            else{
                this.setState({
                    inputGrossPcs: this.state.inputGrossPrice/this.state.inputSellUnit
                })
            }
        }
        
        else if(type === "inputDiscount"){
            this.setState({
                inputDiscount: event.target.value
            }, () => this.getNettPrice())
        }
        
        else if(type === "inputTglEfektif"){    
            this.setState({
                inputTglEfektif: event.target.value
            })        
        }
        
        else if(type === "inputNettPcs"){
            if(this.state.inputNettPrice === 0 || this.state.inputNettPcs === NaN){
                this.setState({
                    inputNettPcs: 0
                })
            }
            else{
                this.setState({
                    inputNettPcs: this.state.inputNettPrice/this.state.inputSellUnit
                })
            }
        }
        
        else if(type === "inputReturED"){
            this.setState({
                inputReturED: event.target.value
            })
        }
        
        else if(type === "inputRetur"){
            this.setState({
                inputRetur: event.target.value
            })
        }
        
        else if(type === "inputSupplierReturED"){
            this.setState({
                inputSupplierReturED: event.target.value
            })
        }
        
        else if(type === "inputSupplierRetur"){
            this.setState({
                inputSupplierRetur: event.target.value
            })
        }
        
        else if(type === "inputStsMargin"){
            this.setState({
                inputStsMargin: event.target.value
            })
        }
        
        else if(type === "inputHetSellPackYN"){
            this.setState({
                inputHetSellPackYN: event.target.value
            })
        }
        
        else if(type === "inputHetSellPack"){
            this.setState({
                inputHetSellPack: event.target.value
            })
        }
        
        else if(type === "inputHargaSpecialPerPcsYN"){
            this.setState({
                inputHargaSpecialPerPcsYN: event.target.value
            })
        }
        
        else if(type === "inputHargaSpecialPerPcs"){
            this.setState({
                inputHargaSpecialPerPcs: event.target.value
            })
        }
        
        else if(type === "inputReturTdkLakuYN"){
            this.setState({
                inputReturTdkLakuYN: event.target.value
            })
        }
        
        else if(type === "inputReturContentYN"){
            this.setState({
                inputReturContentYN: event.target.value
            })
        }
        
        else if(type === "inputReturPackYN"){
            this.setState({
                inputReturPackYN: event.target.value
            })
        }
        
        else if(type === "inputReturNewProdYN"){
            this.setState({
                inputReturNewProdYN: event.target.value
            })
        }
        
        else if(type === "inputTukarGulingYN"){
            this.setState({
                inputTukarGulingYN: event.target.value
            })
        }
        
        else if(type === "inputPrsHETNetto"){
            this.setState({
                inputPrsHETNetto: event.target.value
            })
        }
        
        else if(type === "inputPseudo"){
            this.setState({
                inputPseudo: event.target.value
            })
        }
        
        else if(type === "inputMarginHPP"){
            this.setState({
                inputMarginHPP: event.target.value
            })
        }
        
        else if(type === "inputHPP"){
            this.setState({
                inputHPP: event.target.value
            })
        }
        
        else if(type === "inputRecMargin"){
            this.setState({
                inputRecMargin: event.target.value
            })
        }
        
        else if(type === "inputTglProsesHPP"){
            this.setState({
                inputTglProsesHPP: event.target.value
            })
        }
        
        else if(type === "inputSaleMargin"){
            this.setState({
                inputSaleMargin: event.target.value
            })
        }
        
        else if(type === "inputSalePriceBox"){
            this.setState({
                inputSalePriceBox: event.target.value
            })
        }
        
        else if(type === "inputSalePrice"){
            this.setState({
                inputSalePrice: event.target.value
            })
        }
        
        else if(type === "inputSaleMarginNon"){
            this.setState({
                inputSaleMarginNon: event.target.value
            })
        }
        
        else if(type === "inputSalePriceNonBox"){
            this.setState({
                inputSalePriceNonBox: event.target.value
            })
        }
        
        else if(type === "inputSalePriceNon"){
            this.setState({
                inputSalePriceNon: event.target.value
            })
        }
        
        else if(type === "inputMarginAuto"){
            this.setState({
                inputMarginAuto: event.target.value
            })
        }
        
        else if(type === "inputHJAAutoBox"){
            this.setState({
                inputHJAAutoBox: event.target.value
            })
        }
        
        else if(type === "inputHJAAuto"){
            this.setState({
                inputHJAAuto: event.target.value
            })
        }
        
        else if(type === "inputBuyGrpBox"){
            this.setState({
                inputBuyGrpBox: event.target.value
            })
        }
        
        else if(type === "inputBuyGrp"){
            this.setState({
                inputBuyGrp: event.target.value
            })
        }
        
        else if(type === "inputMarginTambahan"){
            this.setState({
                inputMarginTambahan: event.target.value
            })
        }

        else if(type === "editSupplierCode"){
            this.setState({
                selectedSupplierCode: event.target.value
            }, () => {
                this.getSupplierByCode()
                this.getSupplierFinanceByCode()
            })
        }
    }

    checkboxListenerView = () => {
        var checkboxReturED = document.getElementById("checkboxReturED");
        var checkboxSupplierED = document.getElementById("checkboxSupplierED");
        var checkboxHetSellPack = document.getElementById("checkboxHetSellPack");
        var checkboxHargaSpecialPerPcs = document.getElementById("checkboxHargaSpecialPerPcs");
        var checkboxRTL = document.getElementById("checkboxRTL");
        var checkboxRIR = document.getElementById("checkboxRIR");
        var checkboxRKR = document.getElementById("checkboxRKR");
        var checkboxRNI = document.getElementById("checkboxRNI");
        var checkboxTG = document.getElementById("checkboxTG");
        var selectRetur = document.getElementById("selectRetur");
        var inputHetSellPackDet = document.getElementById("inputHetSellPackDet");
        var inputHargaSpecialDet = document.getElementById("inputHargaSpecialDet");

        // Retur ED
        if(this.state.inputReturED === "Y"){
            checkboxReturED.checked = true
            selectRetur.disabled = false
        } else{
            checkboxReturED.checked = false
            selectRetur.disabled = true
        }

        // Supplier Retur ED
        if(this.state.inputSupplierReturED === "Y"){
            checkboxSupplierED.checked = true
        } else{
            checkboxSupplierED.checked = false
        }

        // Het Sell Pack
        if(this.state.inputHetSellPackYN === "Y"){
            checkboxHetSellPack.checked = true
            inputHetSellPackDet.disabled = false
        } else{
            checkboxHetSellPack.checked = false
            inputHetSellPackDet.disabled = true
        }

        // Harga Special per Pcs
        if(this.state.inputHargaSpecialPerPcsYN === "Y"){
            checkboxHargaSpecialPerPcs.checked = true
            inputHargaSpecialDet.disabled = false
        } else{
            checkboxHargaSpecialPerPcs.checked = false
            inputHargaSpecialDet.disabled = true
        }

        // Retur Tidak Laku
        if(this.state.inputReturTdkLakuYN === "Y"){
            checkboxRTL.checked = true
        } else{
            checkboxRTL.checked = false
        }

        // Retur Isi Rusak
        if(this.state.inputReturContentYN === "Y"){
            checkboxRIR.checked = true
        } else{
            checkboxRIR.checked = false
        }

        // Retur Kemasan Rusak
        if(this.state.inputReturPackYN === "Y"){
            checkboxRKR.checked = true
        } else{
            checkboxRKR.checked = false
        }

        // Retur New Item
        if(this.state.inputReturNewProdYN === "Y"){
            checkboxRNI.checked = true
        } else{
            checkboxRNI.checked = false
        }

        // Tukar Guling
        if(this.state.inputTukarGulingYN === "Y"){
            checkboxTG.checked = true
        } else{
            checkboxTG.checked = false
        }
    }

    checkboxListener = () => {
        var checkboxReturED = document.getElementById("checkboxReturED");
        var checkboxSupplierED = document.getElementById("checkboxSupplierED");
        var checkboxHetSellPack = document.getElementById("checkboxHetSellPack");
        var checkboxHargaSpecialPerPcs = document.getElementById("checkboxHargaSpecialPerPcs");
        var checkboxRTL = document.getElementById("checkboxRTL");
        var checkboxRIR = document.getElementById("checkboxRIR");
        var checkboxRKR = document.getElementById("checkboxRKR");
        var checkboxRNI = document.getElementById("checkboxRNI");
        var checkboxTG = document.getElementById("checkboxTG");

        var selectRetur = document.getElementById("selectRetur");
        // var selectSupplierRetur = document.getElementById("selectSupplierRetur");

        var inputHetSellPackDet = document.getElementById("inputHetSellPackDet");
        var inputHargaSpecialDet = document.getElementById("inputHargaSpecialDet");

        // checkboxReturED
        if(checkboxReturED.checked === true){
            this.setState({
                inputReturED: 'Y'
            })
            selectRetur.disabled = false
        }
        else{
            this.setState({
                checkboxReturED: 'N'
            })
            selectRetur.disabled = true
        }

        // checkboxSupplierED
        if(checkboxSupplierED.checked === true){
            this.setState({
                inputSupplierReturED: 'Y'
            })
            // selectSupplierRetur.disabled = false
        }
        else{
            this.setState({
                inputSupplierReturED: 'N'
            })
            // selectSupplierRetur.disabled = true
        }

        // checkboxHetSellPack
        if(checkboxHetSellPack.checked === true){
            this.setState({
                inputHetSellPackYN: 'Y'
            })
            inputHetSellPackDet.disabled = false
        }
        else{
            this.setState({
                inputHetSellPackYN: 'N'
            })
            inputHetSellPackDet.disabled = true
        }

        // checkboxHargaSpecialPerPcs
        if(checkboxHargaSpecialPerPcs.checked === true){
            this.setState({
                inputHargaSpecialPerPcsYN: 'Y'
            })
            inputHargaSpecialDet.disabled = false
        }
        else{
            this.setState({
                inputHargaSpecialPerPcsYN: 'N'
            })
            inputHargaSpecialDet.disabled = true
        }

        // checkboxRTL
        if(checkboxRTL.checked === true){
            this.setState({
                inputReturTdkLakuYN: 'Y'
            })
        }
        else{
            this.setState({
                inputReturTdkLakuYN: 'N'
            })
        }

        // checkboxRIR
        if(checkboxRIR.checked === true){
            this.setState({
                inputReturContentYN: 'Y'
            })
        }
        else{
            this.setState({
                inputReturContentYN: 'N'
            })
        }

        // checkboxRKR
        if(checkboxRKR.checked === true){
            this.setState({
                inputReturPackYN: 'Y'
            })
        }
        else{
            this.setState({
                inputReturPackYN: 'N'
            })
        }

        // checkboxRNI
        if(checkboxRNI.checked === true){
            this.setState({
                inputReturNewProdYN: 'Y'
            })
        }
        else{
            this.setState({
                inputReturNewProdYN: 'N'
            })
        }

        // checkboxTG
        if(checkboxTG.checked === true){
            this.setState({
                inputTukarGulingYN: 'Y'
            })
        }
        else{
            this.setState({
                inputTukarGulingYN: 'N'
            })
        }
    }

    getCheckboxListener = () => {
        var checkboxPKP = document.getElementById("checkboxPKP");
        var checkboxImport = document.getElementById("checkboxImport");

        if(this.state.inputPKPYN === "Y"){
            checkboxPKP.checked = true
        } else{
            checkboxPKP.checked = false
        }

        if(this.state.inputImportYN === "Y"){
            checkboxImport.checked = true
        } else{
            checkboxImport.checked = false
        }
    }

    setSupplier = (supCode) => {
        var tableSupplier = document.getElementById("tableSupplier");
        var form1 = document.getElementById("form1");
        var form2 = document.getElementById("form2");
        var form3 = document.getElementById("form3");
        
        tableSupplier.style.display = "none";
        form1.style.display = "block";
        form2.style.display = "block";
        form3.style.display = "block";

        this.setState({
            selectedSupplierCode: supCode,
            displayEditButton: "inline"
        }, () => {
            this.getSupplierByCode()
            this.getSupplierFinanceByCode()
        })
    }

    getViewMatchingSelect = () => {
        for(let i = 0; i < this.state.supplier.length; i++){
            if(this.state.supplier[i].Sup_Code === this.state.inputSupplierCode){
                this.setState({
                    selectedSupplierCode: this.state.supplier[i].Sup_Code
                })
            }
        }

        this.getSupplierByCode();
        this.getSupplierFinanceByCode();
    }

    getProductSupplier = () => {
        axios.get('https://api.docnet.id/CHCMasterProdukSupplier/ProductSupplier?kodeProduk=' + this.props.activeProcode)
        .then((res)=>{
            if(res.data.data !== null){
                if(res.data.data.pro_suplcode !== ""){
                    this.setState({
                        productSupplier: [res.data.data],
                    }, () => {
                        console.log("DATA TERSEDIA")
                    });
                }
                else{
                    this.setState({
                        productSupplier: [],
                        noDataMessage:"block",
                        displayTambahSupplierAktif: "inline"
                    }, () => {
                        console.log("TIDAK ADA DATA")
                    })
                }
            }else{
                this.setState({
                    productSupplier: [],
                    noDataMessage:"block",
                    displayTambahSupplierAktif: "inline"
                }, () => {
                    console.log("TIDAK ADA DATA")
                })
            }
        })
    }

    setTambahSupplierAktif = () => {

        var tableSupplier = document.getElementById("tableSupplier");
        var form1 = document.getElementById("form1");
        var form2 = document.getElementById("form2");
        var form3 = document.getElementById("form3");
        
        tableSupplier.style.display = "none";
        form1.style.display = "block";
        form2.style.display = "block";
        form3.style.display = "block";

        this.setState({
            // selectedSupplierCode: supCode,
            // displayEditButton: "inline",
            displayTambahSupplierAktif: "none",
            noDataMessage: "none",
            displayAddButton: "inline",
        }, () => {
            this.getSupplierByCode()
            this.getSupplierFinanceByCode()
        })

        this.enableAllInput();

        this.setState({
            value: 3,
        })
    }

    addSupplierAktif = () => {
        var tempJSON = 
        {
            detail_supplier_aktif: {
                procode: this.state.inputProductCode,
                pro_suplcode: this.state.selectedSupplierCode,
                pro_dollarprice: parseFloat(this.state.inputDollarPrice),
                pro_freight: parseFloat(this.state.inputFreight),
                pro_grossprice: parseFloat(this.state.inputGrossPrice),
                pro_discount: parseFloat(this.state.inputDiscount),
                pro_nettprice: parseFloat(this.state.inputNettPrice),
                pro_retured: this.state.inputReturED,
                pro_suppretured: this.state.inputSupplierReturED,
                pro_retur: parseInt(this.state.inputRetur),
                pro_returtdklaku: this.state.inputReturTdkLakuYN,
                pro_returcontent: this.state.inputReturContentYN,
                pro_returpack: this.state.inputReturPackYN,
                pro_returnewprod: this.state.inputReturNewProdYN,
                pro_tukargulingyn: this.state.inputTukarGulingYN,
                pro_currencyid: parseInt(this.state.inputCurrencyID),
                pro_hpp: parseFloat(this.state.productDetailMargin_DSA.pro_hpp),
                pro_hargaspecialyn: this.state.inputHargaSpecialPerPcsYN,
                pro_hrgspecial: parseFloat(this.state.inputHargaSpecialPerPcs),
                pro_hetyn: this.state.inputHetSellPackYN,
                pro_hetprice: parseFloat(this.state.inputHetSellPack),
                pro_stsmargin: parseInt(this.state.inputStsMargin),
            },
            pro_name: this.state.inputProductName,
            top: parseInt(this.state.inputTOP),
            pkpyn: this.state.inputPKPYN,
            import_yn: this.state.inputImportYN,
        }
 
        console.log(tempJSON)

        axios.post('https://api.docnet.id/CHCMasterProdukSupplier/ProductSupplier', tempJSON)
        .then((res) => {
            console.log(res.data.responseCode)
            console.log(res.data)
            if (res.data.responseCode === 200){
                this.setState({
                    responseHeader: "BERHASIL MENAMBAHKAN DATA"
                })
            } else {
                this.setState({
                    responseHeader: "GAGAL MENAMBAHKAN DATA"
                })
            }
        })

        this.toggleAddConfirmationModal.bind(this)
        this.toggleResponseModal()
    }

    editKonfirmasiSupplierProduk = () => {
        var tempJSON = 
        {
            detail_supplier_aktif: {
                procode: this.state.inputProductCode,
                pro_suplcode: this.state.selectedSupplierCode,
                pro_dollarprice: parseFloat(this.state.inputDollarPrice),
                pro_freight: parseFloat(this.state.inputFreight),
                pro_grossprice: parseFloat(this.state.inputGrossPrice),
                pro_discount: parseFloat(this.state.inputDiscount),
                pro_nettprice: parseFloat(this.state.inputNettPrice),
                pro_retured: this.state.inputReturED,
                pro_suppretured: this.state.inputSupplierReturED,
                pro_retur: parseInt(this.state.inputRetur),
                pro_returtdklaku: this.state.inputReturTdkLakuYN,
                pro_returcontent: this.state.inputReturContentYN,
                pro_returpack: this.state.inputReturPackYN,
                pro_returnewprod: this.state.inputReturNewProdYN,
                pro_tukargulingyn: this.state.inputTukarGulingYN,
                pro_currencyid: parseInt(this.state.inputCurrencyID),
                pro_hpp: parseFloat(this.state.productDetailMargin_DSA.pro_hpp),
                pro_hargaspecialyn: this.state.inputHargaSpecialPerPcsYN,
                pro_hrgspecial: parseFloat(this.state.inputHargaSpecialPerPcs),
                pro_hetyn: this.state.inputHetSellPackYN,
                pro_hetprice: parseFloat(this.state.inputHetSellPack),
                pro_stsmargin: parseInt(this.state.inputStsMargin),
            },
            pro_name: this.state.inputProductName,
            top: parseInt(this.state.inputTOP),
            pkpyn: this.state.inputPKPYN,
            import_yn: this.state.inputImportYN,
        }

        console.log(tempJSON)

        axios.put('https://api.docnet.id/CHCMasterProdukSupplier/ProductSupplier?editData', tempJSON)
        .then((res) => {
            console.log(res.data)
            if (res.data.responseCode === 1911){
                // axios.put('http://10.0.111.208:8093/ProductSupplier?confirmEdit', res.data.data)
                this.setState({
                    result1911:res.data.data
                })
                // this.toggleEditLoadingModal()
                this.toggleEditConfirmationModalInitial()
                console.log("res1911: ", this.state.result1911)
            } else if (res.data.responseCode === 1912){
                axios.put('https://api.docnet.id/CHCMasterProdukSupplier/ProductSupplier?confirmEdit', res.data.data)
                // this.setState({
                //     responseHeader: "GAGAL MENYUNTING DATA"
                // })
                // this.toggleEditLoadingModal()
                this.toggleEditConfirmationModal()
            }
        })
    }

    editSupplierProduk = (konfirmasiStatus) => {

        var tglEfektifYear = (this.state.inputTglEfektif).substring(0, 4);
        var tglEfektifMonth = (this.state.inputTglEfektif).substring(5, 7);
        var tglEfektifDate = (this.state.inputTglEfektif).substring(8, 10);
        var tglEfektif = tglEfektifYear + "-" + tglEfektifMonth + "-" + tglEfektifDate;

        // var temp = {
        //     tgl_efektif: tglEfektif,
        //     konfirmasiyn: konfirmasiStatus
        // }

        // var tempJSON = 
        // {
        //     detail_supplier_aktif: {
        //         procode: this.state.inputProductCode,
        //         pro_suplcode: this.state.selectedSupplierCode,
        //         pro_dollarprice: parseFloat(this.state.inputDollarPrice),
        //         pro_freight: parseFloat(this.state.inputFreight),
        //         pro_grossprice: parseFloat(this.state.inputGrossPrice),
        //         pro_discount: parseFloat(this.state.inputDiscount),
        //         pro_nettprice: parseFloat(this.state.inputNettPrice),
        //         pro_retured: this.state.inputReturED,
        //         pro_suppretured: this.state.inputSupplierReturED,
        //         pro_retur: parseInt(this.state.inputRetur),
        //         pro_returtdklaku: this.state.inputReturTdkLakuYN,
        //         pro_returcontent: this.state.inputReturContentYN,
        //         pro_returpack: this.state.inputReturPackYN,
        //         pro_returnewprod: this.state.inputReturNewProdYN,
        //         pro_tukargulingyn: this.state.inputTukarGulingYN,
        //         pro_currencyid: parseInt(this.state.inputCurrencyID),
        //         pro_hpp: parseFloat(this.state.productDetailMargin_DSA.pro_hpp),
        //         pro_hargaspecialyn: this.state.inputHargaSpecialPerPcsYN,
        //         pro_hrgspecial: parseFloat(this.state.inputHargaSpecialPerPcs),
        //         pro_hetyn: this.state.inputHetSellPackYN,
        //         pro_hetprice: parseFloat(this.state.inputHetSellPack),
        //         pro_stsmargin: parseInt(this.state.inputStsMargin),
        //     },
        //     pro_name: this.state.inputProductName,
        //     top: parseInt(this.state.inputTOP),
        //     pkpyn: this.state.inputPKPYN,
        //     import_yn: this.state.inputImportYN,
        //     tgl_efektif: tglEfektif,
        //     konfirmasiyn: konfirmasiStatus,
        // }
         // console.log(tempJSON)

        // this.setState(prevState=>({
        //     result1911:{...prevState.result1911,...temp}
        // }), () => {
        //     console.log(this.state.result1911)
        // })

        // console.log("Tgl Efektif: ", tglEfektif)
        // console.log("Konfirmasi: ", konfirmasiStatus)

        var x = {...this.state.result1911}
        x.tgl_efektif = tglEfektif
        x.konfirmasi = konfirmasiStatus
        this.setState({
            result1911: x
        }, () => {
            axios.put('https://api.docnet.id/CHCMasterProdukSupplier/ProductSupplier?confirmEdit', this.state.result1911)
            .then((res) => {
                console.log(res.data)
                if (res.data.responseCode === 200){
                    this.setState({
                        responseHeader: "BERHASIL MENYUNTING DATA"
                    })
                } else {
                    this.setState({
                        responseHeader: "GAGAL MENYUNTING DATA"
                    })
                }
            })

            this.toggleEditConfirmationModal.bind(this)
            this.toggleResponseModal()
        })        
    }

    getNettPrice = () => {

        var disc = this.state.inputDiscount
        var discCalculation = parseFloat(disc/100)
        var finalDisc = parseFloat(this.state.inputGrossPrice * discCalculation)
        var hitungNettPrice = parseFloat(this.state.inputGrossPrice - finalDisc)
        var hitungNettPcs = parseFloat(hitungNettPrice / this.state.inputSellUnit)

        if((this.state.inputGrossPrice === 0 || this.state.inputGrossPrice === NaN) || 
        (this.state.inputDiscount === 0 || this.state.inputDiscount === NaN)){
            this.setState({
                inputNettPrice: 0,
                inputNettPcs: 0,
            })
        } else if (this.state.inputGrossPrice !== NaN || this.state.inputDiscount !== NaN) {
            this.setState({
                inputNettPcs: hitungNettPcs,
                inputNettPrice: hitungNettPrice,
            })
        }
        
        // if(this.state.inputNettPrice === 0){
        //     hitungNett = 0
        // }
    }

    state =  {
        addConfirmationModalIsOpen: false,
        editLoadingIsOpen: false,
        editConfirmationModalInitialIsOpen: false,
        editConfirmationModalIsOpen: false,
        responseModalIsOpen: false,
    }

    toggleAddConfirmationModal = () => {
        this.setState({
            addConfirmationModalIsOpen: !this.state.addConfirmationModalIsOpen,
            editLoadingIsOpen: this.state.editLoadingIsOpen, 
            editConfirmationModalInitialIsOpen: this.state.editConfirmationModalInitialIsOpen,
            editConfirmationModalIsOpen: this.state.editConfirmationModalIsOpen,
            responseModalIsOpen: this.state.responseModalIsOpen,
        })
    }

    toggleEditLoadingModal = () => {
        this.setState({
            addConfirmationModalIsOpen: this.state.addConfirmationModalIsOpen,
            editLoadingIsOpen: !this.state.editLoadingIsOpen, 
            editConfirmationModalInitialIsOpen: this.state.editConfirmationModalInitialIsOpen,
            editConfirmationModalIsOpen: this.state.editConfirmationModalIsOpen,
            responseModalIsOpen: this.state.responseModalIsOpen,
        })
    }

    toggleEditConfirmationModalInitial = () => {
        this.setState({
            addConfirmationModalIsOpen: this.state.addConfirmationModalIsOpen,
            editLoadingIsOpen: this.state.editLoadingIsOpen,
            editConfirmationModalInitialIsOpen: !this.state.editConfirmationModalInitialIsOpen,
            editConfirmationModalIsOpen: this.state.editConfirmationModalIsOpen,
            responseModalIsOpen: this.state.responseModalIsOpen,
        })
    }

    toggleEditConfirmationModal = () => {
        this.setState({
            addConfirmationModalIsOpen: this.state.addConfirmationModalIsOpen,
            editLoadingIsOpen: this.state.editLoadingIsOpen,
            editConfirmationModalInitialIsOpen: this.state.editConfirmationModalInitialIsOpen,
            editConfirmationModalIsOpen: !this.state.editConfirmationModalIsOpen,
            responseModalIsOpen: this.state.responseModalIsOpen,
        })
    }

    toggleResponseModal = () => {
        this.setState({
            addConfirmationModalIsOpen: this.state.addConfirmationModalIsOpen,
            editLoadingIsOpen: this.state.editLoadingIsOpen,
            editConfirmationModalInitialIsOpen: this.state.editConfirmationModalInitialIsOpen,
            editConfirmationModalIsOpen: this.state.editConfirmationModalIsOpen,
            responseModalIsOpen: !this.state.responseModalIsOpen,
        })
    }

    render() {

        const {
            value, stsMove, currency, stsMargin, 
            bulanED, result, supplier, productDetailMargin,
            productDetailMargin_DHJ, productDetailMargin_DSA,
            supplierByCode, supplierFinance, productSupplier,
          } = this.state;

        return(
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
                        onClick={ ()=>this.addSupplierAktif() }
                        >
                            <MdDone
                            style={{
                                marginRight: "5"
                            }}
                            />Ya
                        </Button>

                        <Button
                        color="secondary"
                        onClick={ this.toggleAddConfirmationModal.bind(this) }
                        >
                            <MdClose
                            style={{
                                marginRight: "5"
                            }}
                            />Tidak
                        </Button>

                    </ModalFooter>

                </Modal>
                {/* Add Confirmation Modal */}

                {/* Edit Loading Modal */}
                <Modal
                isOpen={this.state.editLoadingIsOpen}
                >
                    <ModalHeader
                    toggle={this.toggleEditLoadingModal.bind(this)}
                    >
                        Loading
                    </ModalHeader>

                    <ModalBody>
                        Sending Temporary Data...
                    </ModalBody>

                    <ModalFooter
                    style={{
                      display: "inline-block",
                      textAlign: "center"
                    }}
                    >
                        <Button
                        color="primary"
                        onClick={ ()=>this.toggleEditLoadingModal() }
                        >
                            <MdDone
                            style={{
                                marginRight: "5"
                            }}
                            />OK
                        </Button>

                    </ModalFooter>

                </Modal>
                {/* Edit Loading Modal */}

                {/* Edit Confirmation Modal Initial */}
                <Modal
                isOpen={this.state.editConfirmationModalInitialIsOpen}
                >
                    <ModalHeader
                    toggle={this.toggleEditConfirmationModalInitial.bind(this)}
                    >
                        Konfirmasi Penyuntingan
                    </ModalHeader>

                    <ModalBody>
                        Apakah Anda Yakin Ingin Menyunting Data Ini?
                    </ModalBody>

                    <ModalFooter
                    style={{
                      display: "inline-block",
                      textAlign: "center"
                    }}
                    >
                        <Button
                        color="primary"
                        onClick={ ()=>this.toggleEditConfirmationModal() }
                        >
                            <MdDone
                            style={{
                                marginRight: "5"
                            }}
                            />YES
                        </Button>

                        <Button
                        color="secondary"
                        onClick={ this.toggleEditConfirmationModalInitial.bind(this) }
                        >
                            <MdClose
                            style={{
                                marginRight: "5"
                            }}
                            />NO
                        </Button>

                    </ModalFooter>

                </Modal>
                {/* Edit Confirmation Modal Initial */}

                {/* Edit Confirmation Modal */}
                <Modal
                isOpen={this.state.editConfirmationModalIsOpen}
                >
                    <ModalHeader
                    toggle={this.toggleEditConfirmationModal.bind(this)}
                    >
                        {/* Konfirmasi Penyuntingan */}
                        Input Tanggal Efektif Perubahan HJA
                    </ModalHeader>

                    <ModalBody>
                        {/* Apakah Anda Yakin Ingin Menyunting Data Ini? */}
                        <p>
                            Anda melakukan perubahan Harga Jual / Netto.
                            <br/>
                            Pilih Yes, jika perubahan Harga Jual / Netto akan berlaku antara
                            tanggal: DD-MMM-YYYY s/d DD-MMM-YYYY
                            <br/>
                            (Disimpan ke Schedule Update HJA)
                        </p>
                        <hr/>
                        <div>
                            <Label>Tanggal Harga Berubah: </Label>
                            <Input
                            id = "inputTglEfektif"
                            type="date"
                            onInput={(e) => this.handleChange("inputTglEfektif", e)}
                            />
                        </div>
                        <hr/>
                        Pilih No, jika perubahan Harga Jual / Netto akan disimpan ke Master Product.
                    </ModalBody>

                    <ModalFooter
                    style={{
                      display: "inline-block",
                      textAlign: "center"
                    }}
                    >
                        <Button
                        color="primary"
                        onClick={ ()=>this.editSupplierProduk("Y") }
                        >
                            <MdDone
                            style={{
                                marginRight: "5"
                            }}
                            />YES
                        </Button>

                        <Button
                        color="secondary"
                        onClick={ ()=>this.editSupplierProduk("N") }
                        // onClick={ this.toggleEditConfirmationModal.bind(this) }
                        >
                            <MdClose
                            style={{
                                marginRight: "5"
                            }}
                            />NO
                        </Button>

                    </ModalFooter>

                </Modal>
                {/* Edit Confirmation Modal */}

                {/* Response Modal */}
                <Modal
                isOpen={this.state.responseModalIsOpen}>
                    
                    <ModalHeader
                    toggle={ () => this.toggleResponseModal.bind(this) }
                    >
                        {this.state.responseHeader}
                    </ModalHeader>
                  
                    <ModalBody>
                        {this.state.responseHeader}
                    </ModalBody>
                    
                    <ModalFooter>
                        <Button
                        color="primary"
                        onClick={ () => this.refreshPage() }
                        >
                            OK
                        </Button>
                    </ModalFooter>

                </Modal>
                {/* Response Modal */}

                <div>
                    <Card>

                        <CardBody>
                            
                            <Form>
                                <fieldset
                                id="fs1Add"
                                disabled
                                style={{
                                    marginBottom: "2%",
                                }}
                                >
                                    <div className="d-flex justify-content-between">
                                        <Label
                                        style={{
                                            display: "inline-flex",
                                            justifyContent: "center",
                                            textAlign: "center",
                                            verticalAlign: "center",
                                            margin: "auto",
                                            width: "30%",
                                            justifyContent: "left",
                                        }}
                                        >Product</Label>
                                        
                                        <Input
                                        placeholder="Product Code"
                                        style={{
                                            display:"inline-flex",
                                            width: "25%",
                                        }}
                                        onInput={(e) => this.handleChange("inputProductCode", e)}
                                        value={result.pro_code}
                                        />

                                        <Input
                                        placeholder="Product Name"
                                        style={{
                                            display:"inline-flex",
                                        }}
                                        onInput={(e) => this.handleChange("inputProductName", e)}
                                        value={result.pro_name}
                                        />
                                    </div>

                                </fieldset>
                            </Form>

                            <Form>
                                <Button
                                color="primary"
                                style={{
                                    float: "right",
                                    display: this.state.displayTambahSupplierAktif
                                }}
                                onClick = { () => this.setTambahSupplierAktif() }
                                >
                                    <MdAdd
                                    style={{
                                        marginRight: "10px",
                                    }}
                                    />
                                        Tambah
                                </Button>
                            </Form>

                            <Table
                            id="tableSupplier"
                            bordered
                            responsive
                            style={{
                                justifyContent: "center",
                            }}
                            >
                                <thead>
                                    <tr>
                                        <th
                                        style={{
                                            verticalAlign: "middle",
                                            textAlign: "center",
                                            // width: "20%"
                                        }}
                                        >
                                            Supplier Code
                                        </th>
                                        
                                        {/* <th
                                        style={{
                                            verticalAlign: "middle",
                                            textAlign: "center",
                                            // width: "70%"
                                        }}
                                        >
                                            Supplier Name
                                        </th> */}

                                        <th
                                        style={{
                                            verticalAlign: "middle",
                                            textAlign: "center",
                                            // width: "10%"
                                        }}
                                        >
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                
                                <tbody
                                style={{
                                    // overflow: "auto",
                                    // height: "250px",
                                }}
                                >
                                
                                {/* {supplier.map((supp)=> */}
                                {productSupplier.map((ps)=>
                                <tr>
                                    
                                    <td
                                    style={{
                                        verticalAlign: "middle",
                                        textAlign: "center",
                                        width: "inherit"
                                    }}>
                                        {/* {supp.Sup_Code} */}
                                        {ps.pro_suplcode}
                                    </td>
                                    
                                    {/* <td
                                    style={{
                                        verticalAlign: "middle",
                                        textAlign: "center",
                                        width: "inherit"
                                    }}>
                                        {supp.Sup_Name}
                                        {/* {ps.pro_suplcode} */}
                                    {/* </td> */}
                                    
                                    <td
                                    style={{
                                        verticalAlign: "middle",
                                        textAlign: "center",
                                        width: "inherit"
                                    }}
                                    >
                                        <Button
                                        color="success"
                                        // onClick={ () => this.setSupplier(supp.pro_suplcode) }
                                        onClick={ () => this.setSupplier(ps.pro_suplcode) }
                                        >
                                            <MdEdit/>
                                        </Button>
                                    </td>
                                </tr>
                                )}
                                </tbody>
                                
                            </Table>

                            <p
                            style={{
                                textAlign: "center",
                                display: this.state.noDataMessage,
                            }}
                            >Tidak Ada Data</p>

                            <Form
                            id="form1"
                            style={{
                                display: "none"
                            }}
                            >
                                <fieldset
                                id="fs2Add"
                                disabled
                                >
                                    
                                    <hr/>

                                    <div className="d-flex justify-content-between text-nowrap">
                                        <Label
                                        style={{
                                            display: "inline-flex",
                                            justifyContent: "center",
                                            textAlign: "center",
                                            verticalAlign: "center",
                                            margin: "auto",
                                            width: "23.75%",
                                            justifyContent: "left",
                                        }}
                                        >Status Move</Label>
                                        
                                        <Input
                                        disabled
                                        placeholder="Status Move"
                                        style={{
                                            display:"inline-flex"
                                        }}
                                        value = { this.state.inputStsMove + " - " + this.state.stsMoveStatus }
                                        onInput={(e) => this.handleChange("inputStsMove", e)}
                                        />
                                        
                                        {/* <select
                                        className = "custom-select"
                                        onInput={(e) => this.handleChange("inputStsMove", e)}
                                        >
                                            {stsMove.map(
                                                sm =>
                                                <option value={sm.moving_procod}>{sm.moving_procod} - {sm.moving_status}</option>
                                            )} 
                                        </select> */}

                                    </div>

                                    <div className="d-flex justify-content-between text-nowrap">
                                        <Label
                                        style={{
                                            display: "inline-flex",
                                            justifyContent: "center",
                                            textAlign: "center",
                                            verticalAlign: "center",
                                            margin: "auto",
                                            width: "23.75%",
                                            justifyContent: "left",
                                        }}
                                        >Sell Unit</Label>
                                        
                                        <Input
                                        disabled
                                        placeholder="Sell Unit"
                                        style={{
                                            display:"inline-flex"
                                        }}
                                        type="number"
                                        min={0}
                                        value = { this.state.inputSellUnit }
                                        onInput={(e) => this.handleChange("inputSellUnit", e)}
                                        />
                                    </div>
                                </fieldset>
                            </Form>

                            <hr/>

                            <Form
                            id="form2"
                            style={{
                                display: "none"
                            }}
                            >
                                <fieldset
                                id="fs3Add"
                                disabled>

                                    <div className="d-flex justify-content-between">
                                        <Label
                                        style={{
                                            display: "inline-flex",
                                            justifyContent: "center",
                                            textAlign: "center",
                                            verticalAlign: "center",
                                            margin: "auto",
                                            width: "25%",
                                            justifyContent: "left",
                                        }}
                                        >Supplier</Label>

                                        <select
                                        className = "custom-select"
                                        style={{
                                            display:"inline-flex",
                                        }}
                                        onChange={(e) => this.handleChange("editSupplierCode", e)}
                                        value={this.state.selectedSupplierCode}
                                        >
                                            {supplier.map(
                                                supp =>
                                                <option value={supp.Sup_Code}>{supp.Sup_Code} - {supp.Sup_Name}</option>
                                            )} 
                                        </select>
                                    </div>

                                    <div className="justify-content-between">
                                        <Label
                                        style={{
                                            display: "inline-flex",
                                            justifyContent: "center",
                                            textAlign: "center",
                                            verticalAlign: "center",
                                            margin: "auto",
                                            width: "19.75%",
                                            justifyContent: "left",
                                        }}
                                        >Top</Label>
                                        
                                        <Input
                                        disabled
                                        placeholder="TOP"
                                        type="number"
                                        min="0"
                                        style={{
                                            display:"inline-flex",
                                            width: "16.75%",
                                        }}
                                        onInput={(e) => this.handleChange("inputTOP", e)}
                                        value = {this.state.inputTOP}
                                        />

                                        <Label
                                        style={{
                                            display: "inline-flex",
                                            margin: "auto",
                                            justifyContent: "left",
                                            marginLeft: "1vw"
                                        }}
                                        >
                                            <b>Days</b>
                                        </Label>

                                        <FormGroup
                                        inline
                                        check
                                        style={{
                                            marginLeft: "2vw",
                                            marginRight: "2vw",
                                        }}
                                        >
                                            <Label check>
                                                <Input
                                                disabled
                                                id = "checkboxPKP"
                                                type = "checkbox"
                                                onChange={ () => this.getCheckboxListener.bind(this) }
                                                value = { this.state.inputPKPYN }
                                                /><b>PKP</b>
                                            </Label>
                                        </FormGroup>

                                        <FormGroup
                                        inline
                                        check
                                        >
                                            <Label check>
                                                <Input
                                                disabled
                                                id="checkboxImport"
                                                type="checkbox"
                                                // onChange={ this.checkboxListener.bind(this) }
                                                onChange={ ()=>this.getCheckboxListener.bind(this) }
                                                value={ this.state.inputImportYN } 
                                                /><b>Import</b>
                                            </Label>
                                        </FormGroup>

                                    </div>

                                    <div className="d-flex justify-content-between text-nowrap">
                                        <Label
                                        style={{
                                            display: "inline-flex",
                                            margin: "auto",
                                            width: "25%",
                                            justifyContent: "left",
                                        }}
                                        >Mata Uang</Label>

                                        <select
                                        className = "custom-select"
                                        onInput={(e) => this.handleChange("inputCurrencyID", e)}
                                        >
                                            {currency.map(
                                                curr =>
                                                <option value={curr.vall_id}>{curr.vall_id} - {curr.val_mata_uang} - {curr.val_keterangan}</option>
                                            )} 
                                        </select>
                                    </div>

                                    <div className="justify-content-between">
                                        <Label
                                        style={{
                                            display: "inline-flex",
                                            justifyContent: "center",
                                            textAlign: "center",
                                            verticalAlign: "center",
                                            margin: "auto",
                                            width: "19.75%",
                                            justifyContent: "left",
                                        }}
                                        >Dollar</Label>
                                        
                                        <Input
                                        placeholder="Dollar Price"
                                        type="number"
                                        min="0"
                                        style={{
                                            display:"inline-flex",
                                            width: "16.75%",
                                        }}
                                        onInput={(e) => this.handleChange("inputDollarPrice", e)}
                                        value={ this.state.inputDollarPrice }
                                        />

                                        <Label
                                        style={{
                                            display: "inline-flex",
                                            margin: "auto",
                                            justifyContent: "left",
                                            marginLeft: "1vw",
                                            marginRight: "1vw",
                                        }}
                                        ><b>Freight:</b></Label>

                                        <Input
                                        placeholder="Freight"
                                        type="number"
                                        min="0"
                                        style={{
                                            display:"inline-flex",
                                            width: "16.75%",
                                        }}
                                        onInput={(e) => this.handleChange("inputFreight", e)}
                                        value={ this.state.inputFreight }
                                        />

                                        <Label
                                        style={{
                                            display: "inline-flex",
                                            margin: "auto",
                                            justifyContent: "left",
                                            marginLeft: ".5vw",
                                        }}
                                        >
                                            <b>%</b>
                                        </Label>

                                    </div>

                                    <div className="justify-content-between">
                                        <Label
                                        style={{
                                            display: "inline-flex",
                                            justifyContent: "center",
                                            textAlign: "center",
                                            verticalAlign: "center",
                                            margin: "auto",
                                            width: "19.75%",
                                            justifyContent: "left",
                                        }}
                                        >Gross</Label>
                                        
                                        <Input
                                        placeholder="Gross Price"
                                        type="number"
                                        min="0"
                                        style={{
                                            display:"inline-flex",
                                            width: "16.75%",
                                        }}
                                        onInput={(e) => this.handleChange("inputGrossPrice", e)}
                                        value={ this.state.inputGrossPrice }
                                        />

                                        <Label
                                        style={{
                                            display: "inline-flex",
                                            margin: "auto",
                                            justifyContent: "left",
                                            marginLeft: "1vw",
                                            marginRight: "1vw",
                                        }}
                                        >
                                            <b>/</b>
                                        </Label>

                                        <Input
                                        placeholder="Gross Pcs"
                                        readOnly
                                        style={{
                                            display:"inline-flex",
                                            width: "16.75%",
                                        }}
                                        onInput={(e) => this.handleChange("inputGrossPcs", e)}
                                        value={this.state.inputGrossPcs}
                                        />

                                    </div>

                                    <div className="justify-content-between">
                                        <Label
                                        style={{
                                            display: "inline-flex",
                                            justifyContent: "center",
                                            textAlign: "center",
                                            verticalAlign: "center",
                                            margin: "auto",
                                            width: "19.75%",
                                            justifyContent: "left",
                                        }}
                                        >Discount</Label>
                                        
                                        <Input
                                        placeholder="Discount"
                                        type="number"
                                        min="0"
                                        style={{
                                            display:"inline-flex",
                                            width: "16.75%",
                                        }}
                                        onInput={(e) => this.handleChange("inputDiscount", e)}
                                        value={ this.state.inputDiscount }
                                        />

                                        <Label
                                        style={{
                                            display: "inline-flex",
                                            margin: "auto",
                                            justifyContent: "left",
                                            marginLeft: ".5vw",
                                        }}
                                        >
                                            <b>%</b>
                                        </Label>

                                    </div>

                                    <div className="justify-content-between">
                                        <Label
                                        style={{
                                            display: "inline-flex",
                                            justifyContent: "center",
                                            textAlign: "center",
                                            verticalAlign: "center",
                                            margin: "auto",
                                            width: "19.75%",
                                            justifyContent: "left",
                                        }}
                                        >Netto</Label>
                                        
                                        <Input
                                        disabled
                                        placeholder="Nett Price"
                                        type="number"
                                        min="0"
                                        style={{
                                            display:"inline-flex",
                                            width: "16.75%",
                                        }}
                                        value = { this.state.inputNettPrice}
                                        onInput={(e) => this.handleChange("inputNettPrice", e)}
                                        />

                                        <Label
                                        style={{
                                            display: "inline-flex",
                                            margin: "auto",
                                            justifyContent: "left",
                                            marginLeft: "1vw",
                                            marginRight: "1vw",
                                        }}
                                        >
                                            <b>/</b>
                                        </Label>

                                        <Input
                                        placeholder="Netto Pcs"
                                        readOnly
                                        style={{
                                            display:"inline-flex",
                                            width: "16.75%",
                                        }}
                                        onInput={(e) => this.handleChange("inputNettPcs", e)}
                                        value={this.state.inputNettPcs}
                                        />

                                    </div>

                                    <div className="justify-content-between">

                                        <FormGroup
                                        inline
                                        check
                                        style={{
                                            marginLeft: "2vw",
                                            marginRight: "2vw",
                                        }}
                                        >
                                            <Label
                                            check
                                            className="text-nowrap"
                                            >
                                                <Input
                                                id="checkboxReturED"
                                                type="checkbox"
                                                onChange={ this.checkboxListener.bind(this) }
                                                value = { this.state.inputReturED }
                                                /><b>Retur ED</b>
                                            </Label>

                                            <select
                                            id="selectRetur"
                                            disabled
                                            className = "custom-select"
                                            style={{
                                                marginLeft: "23.25%",
                                                width: "10",
                                            }}
                                            onInput={(e) => this.handleChange("inputRetur", e)}
                                            >
                                                <option selected>Pilih Jumlah Bulan</option>
                                                {bulanED.map(
                                                    bed =>
                                                    <option value={bed.bulan}>{bed.bulan}</option>
                                                )} 
                                            </select>

                                            <Label
                                            className="text-nowrap"
                                            style={{
                                                display: "inline-flex",
                                                margin: "auto",
                                                justifyContent: "left",
                                                marginLeft: "1vw"
                                            }}
                                            >
                                                <b>Bulan Sebelum ED</b>
                                            </Label>

                                        </FormGroup>

                                    </div>

                                    <div className="justify-content-between">

                                        <FormGroup
                                        inline
                                        check
                                        style={{
                                            marginLeft: "2vw",
                                            marginRight: "2vw",
                                        }}
                                        >
                                            <Label
                                            check
                                            className="text-nowrap"
                                            >
                                                <Input
                                                id="checkboxSupplierED"
                                                type="checkbox"
                                                onChange={this.checkboxListener.bind(this)}
                                                value = { this.state.inputSupplierReturED }
                                                /><b>Supplier Retur ED</b>
                                            </Label>

                                            {/* <select
                                            id="selectSupplierRetur"
                                            disabled
                                            className = "custom-select"
                                            style={{
                                                marginLeft: "6.5%",
                                                width: "50vw",
                                            }}
                                            onInput={(e) => this.handleChange("inputSupplierReturED", e)}
                                            >
                                                {bulanED.map(
                                                    bed =>
                                                    <option value={bed.bulan}>{bed.bulan}</option>
                                                )} 
                                            </select> */}

                                        </FormGroup>

                                    </div>

                                    <br/>

                                    <hr/>
                                    
                                    {/* Sts Margin */}
                                    <Form
                                    inline
                                    style={{
                                        textAlign: "center",
                                        justifyContent: "center",
                                    }}
                                    >
                                        <Label 
                                        sm={2}
                                        >
                                            Sts Margin
                                        </Label>
                                    
                                        <select
                                        className = "custom-select"
                                        style = {{
                                            width: "30%",
                                            display:"inline"
                                        }}
                                        onInput={(e) => this.handleChange("inputStsMargin", e)}
                                        >
                                            <option selected disabled>Pilih Status Margin</option>
                                            {stsMargin.map(
                                                sm =>
                                                <option value={sm.sts_margincode}>{sm.sts_margincode} - {sm.sts_marginname}</option>
                                            )} 
                                        </select>
                                    </Form>
                                    {/* Sts Margin */}
                                    
                                    <hr/>

                                    <br/>

                                    {/* Het Sell Pack */}
                                    <Form
                                    style={{
                                        width: "40%",
                                        float: "left",
                                    }}
                                    >
                                        <Form
                                        inline
                                        style={{
                                            textAlign: "left",
                                            justifyContent: "left",
                                        }}>
                                            
                                            <Label
                                            inline
                                            sm={6}>
                                                <Input
                                                id="checkboxHetSellPack"
                                                type="checkbox"
                                                float="left"
                                                onChange={this.checkboxListener.bind(this)}
                                                />
                                                Het Sell Pack
                                            </Label>
                                            
                                            <Input
                                            disabled
                                            type="number"
                                            float="left"
                                            placeholder = "Het Sell Pack"
                                            id="inputHetSellPackDet"
                                            style={{
                                                width: "50%"
                                            }}
                                            onInput={(e) => this.handleChange("inputHetSellPack", e)}
                                            value={ this.state.inputHetSellPack }
                                            />
                                            
                                            {/* <Input
                                            placeholder = "Het Sell Pack"
                                            type="number"
                                            min="0"
                                            onInput={(e) => this.handleChange("edithetprice", e)}
                                            style={{
                                                display:"inline-flex",
                                                width: "50%",
                                            }}
                                            /> */}

                                        </Form>
                                    </Form>

                                    <Form
                                    style={{
                                        width: "60%",
                                        float: "right",
                                    }}
                                    >
                                        <Form
                                        inline
                                        style={{
                                            textAlign: "right",
                                            justifyContent: "right",
                                        }}>
                                            
                                            {/* Harga Special Per Pcs */}
                                            <Label 
                                            inline
                                            sm={6}
                                            >
                                                <Input
                                                float="right"
                                                id="checkboxHargaSpecialPerPcs"
                                                type="checkbox"
                                                onChange={this.checkboxListener.bind(this)}
                                                />
                                                Harga Special Per-Pcs
                                            </Label>
                                            
                                            <Input
                                            disabled
                                            inline
                                            block
                                            type="number"
                                            id="inputHargaSpecialDet"
                                            style={{
                                                width: "40%"
                                            }}
                                            placeholder="Harga Special Per-Pcs"
                                            onInput={(e) => this.handleChange("inputHargaSpecialPerPcs", e)}
                                            value={ this.state.inputHargaSpecialPerPcs }
                                            />
                                        </Form>
                                    </Form>
                                {/* Het Sell Pack */}
                                <br/>

                                <br/>

                                <hr/>
                                
                                <Form
                                inline
                                check
                                style={{
                                    textAlign: "center",
                                    justifyContent: "center",
                                }}
                                >
                                    <Label
                                    check
                                    className="text-nowrap"
                                    >
                                        <Input
                                        id="checkboxRTL"
                                        type="checkbox"
                                        onChange={this.checkboxListener.bind(this)}
                                        /><b>Retur Tdk Laku</b>
                                    </Label>

                                    <Label
                                    check
                                    className="text-nowrap"
                                    style={{
                                        marginLeft: "2vw",
                                        marginRight: "2vw",
                                    }}
                                    >
                                        <Input
                                        id="checkboxRIR"
                                        type="checkbox"
                                        onChange={this.checkboxListener.bind(this)}
                                        /><b>Retur Isi Rusak</b>
                                    </Label>

                                    <Label
                                    check
                                    className="text-nowrap"
                                    >
                                        <Input
                                        id="checkboxRKR"
                                        type="checkbox"
                                        onChange={this.checkboxListener.bind(this)}
                                        /><b>Retur Kemasan Rusak</b>
                                    </Label>

                                    <Label
                                    check
                                    className="text-nowrap"
                                    style={{
                                        marginLeft: "2vw",
                                        marginRight: "2vw",
                                    }}
                                    >
                                        <Input
                                        id="checkboxRNI"
                                        type="checkbox"
                                        onChange={this.checkboxListener.bind(this)}
                                        /><b>Retur New Item</b>
                                    </Label>

                                    <Label
                                    check
                                    className="text-nowrap"
                                    >
                                        <Input
                                        id="checkboxTG"
                                        type="checkbox"
                                        onChange={this.checkboxListener.bind(this)}
                                        /><b>Tukar Guling</b>
                                    </Label>

                                </Form>

                                </fieldset>
                            </Form>

                            <hr/>

                            <Form
                            id="form3"
                            style={{
                                display: "none"
                            }}
                            >
                                <fieldset
                                id="fs4Add"
                                disabled
                                >
                                    <div 
                                    style={{
                                        width: "100%"
                                    }}
                                    >
                                        <div 
                                        style={{
                                            float: "left",
                                            width: "50%",
                                        }}
                                        >
                                            <Label
                                            className="text-nowrap"
                                            style={{
                                                display: "inline-flex",
                                                justifyContent: "center",
                                                textAlign: "center",
                                                verticalAlign: "center",
                                                margin: "auto",
                                                justifyContent: "left",
                                            }}
                                            >HET vs Netto/Pcs</Label>
                                            
                                            <Input
                                            placeholder="Prs HET Netto"
                                            // type="number"
                                            min="0"
                                            style={{
                                                display:"inline-flex",
                                                width: "20%",
                                                marginLeft: "13.75%",
                                            }}
                                            value={ productDetailMargin.prs_hetnetto }
                                            onInput={(e) => this.handleChange("inputPrsHETNetto", e)}
                                            />

                                            <Label
                                            style={{
                                                display: "inline-flex",
                                                margin: "auto",
                                                justifyContent: "left",
                                                marginLeft: ".5vw",
                                            }}
                                            >
                                                <b>%</b>
                                            </Label>

                                        </div>
                                        
                                        <div 
                                        style={{
                                            float: "right",
                                            width: "50%",
                                        }}
                                        >
                                            <Label
                                            className="text-nowrap"
                                            style={{
                                                display: "inline-flex",
                                                justifyContent: "center",
                                                textAlign: "center",
                                                verticalAlign: "center",
                                                margin: "auto",
                                                justifyContent: "left",
                                            }}
                                            >Pseudo</Label>
                                            
                                            <Label
                                            style={{
                                                display: "inline-flex",
                                                margin: "auto",
                                                justifyContent: "left",
                                                marginLeft: "2vw",
                                            }}
                                            >
                                                <b>[</b>
                                            </Label>

                                            <Input
                                            placeholder="Pseudo"
                                            // type="number"
                                            min="0"
                                            style={{
                                                display:"inline-flex",
                                                width: "20%",
                                                marginLeft: "1vw",
                                                marginRight: "1vw",
                                            }}
                                            onInput={(e) => this.handleChange("inputPseudo", e)}
                                            value={ productDetailMargin.pseudo }
                                            />

                                            <Label
                                            style={{
                                                display: "inline-flex",
                                                margin: "auto",
                                                justifyContent: "left",
                                            }}
                                            >
                                                <b>%</b>
                                            </Label>
                                        </div>
                                    </div>

                                    <div 
                                    style={{
                                        width: "100%"
                                    }}
                                    >
                                        <div 
                                        style={{
                                            float: "left",
                                            width: "50%",
                                        }}
                                        >
                                            <Label
                                            className="text-nowrap"
                                            style={{
                                                display: "inline-flex",
                                                justifyContent: "center",
                                                textAlign: "center",
                                                verticalAlign: "center",
                                                margin: "auto",
                                                justifyContent: "left",
                                                marginRight: "3.25vw",
                                            }}
                                            >Margin HPP</Label>
                                            
                                            <Input
                                            placeholder="Margin HPP"
                                            // type="number"
                                            min="0"
                                            style={{
                                                display:"inline-flex",
                                                width: "20%",
                                                marginLeft: "13.1%",
                                            }}
                                            onInput={(e) => this.handleChange("inputMarginHPP", e)}
                                            value={ productDetailMargin_DHJ.pro_marginhpp }
                                            />

                                            <Label
                                            style={{
                                                display: "inline-flex",
                                                margin: "auto",
                                                justifyContent: "left",
                                                marginLeft: ".5vw",
                                            }}
                                            >
                                                <b>%</b>
                                            </Label>

                                        </div>
                                        
                                        <div 
                                        style={{
                                            float: "right",
                                            width: "50%",
                                        }}
                                        >
                                            <Label
                                            className="text-nowrap"
                                            style={{
                                                display: "inline-flex",
                                                justifyContent: "center",
                                                textAlign: "center",
                                                verticalAlign: "center",
                                                margin: "auto",
                                                justifyContent: "left",
                                                marginRight: "2.3vw",
                                            }}
                                            >HPP</Label>
                                            
                                            <Label
                                            style={{
                                                display: "inline-flex",
                                                margin: "auto",
                                                justifyContent: "left",
                                                marginLeft: "1.85vw",
                                            }}
                                            >
                                                <b>[</b>
                                            </Label>

                                            <Input
                                            placeholder="HPP"
                                            // type="number"
                                            min="0"
                                            style={{
                                                display:"inline-flex",
                                                width: "20%",
                                                marginLeft: "1vw",
                                                marginRight: "1vw",
                                            }}
                                            onInput={(e) => this.handleChange("inputHPP", e)}
                                            value={ productDetailMargin_DSA.pro_hpp }
                                            />

                                            <Label
                                            style={{
                                                display: "inline-flex",
                                                margin: "auto",
                                                justifyContent: "left",
                                            }}
                                            >
                                                <b>]</b>
                                            </Label>
                                        </div>
                                    </div>

                                    <div 
                                    style={{
                                        width: "100%"
                                    }}
                                    >
                                        <div 
                                        style={{
                                            float: "left",
                                            width: "50%",
                                        }}
                                        >
                                            <Label
                                            className="text-nowrap"
                                            style={{
                                                display: "inline-flex",
                                                justifyContent: "center",
                                                textAlign: "center",
                                                verticalAlign: "center",
                                                margin: "auto",
                                                justifyContent: "left",
                                                marginRight: "3.25vw",
                                            }}
                                            >Margin Rec.</Label>
                                            
                                            <Input
                                            placeholder="Rec Margin"
                                            // type="number"
                                            min="0"
                                            style={{
                                                display:"inline-flex",
                                                width: "20%",
                                                marginLeft: "12.5%",
                                            }}
                                            onInput={(e) => this.handleChange("inputRecMargin", e)}
                                            value={ productDetailMargin_DHJ.pro_recmargin }
                                            />

                                            <Label
                                            style={{
                                                display: "inline-flex",
                                                margin: "auto",
                                                justifyContent: "left",
                                                marginLeft: ".5vw",
                                            }}
                                            >
                                                <b>%</b>
                                            </Label>

                                        </div>
                                        
                                        <div 
                                        style={{
                                            float: "right",
                                            width: "50%",
                                        }}
                                        >
                                            <Label
                                            className="text-nowrap"
                                            style={{
                                                display: "inline-flex",
                                                justifyContent: "center",
                                                textAlign: "center",
                                                verticalAlign: "center",
                                                margin: "auto",
                                                justifyContent: "left",
                                                marginRight: "2.3vw",
                                            }}
                                            >Tgl Proses HPP</Label>
                                            
                                            <Label
                                            style={{
                                                display: "inline-flex",
                                                margin: "auto",
                                                justifyContent: "left",
                                                marginLeft: ".5vw",
                                            }}
                                            >
                                                <b>[</b>
                                            </Label>

                                            <Input
                                            placeholder="Tgl Proses HPP"
                                            // type="number"
                                            min="0"
                                            style={{
                                                display:"inline-flex",
                                                width: "35%",
                                                marginLeft: "1vw",
                                                marginRight: "1vw",
                                            }}
                                            onInput={(e) => this.handleChange("inputTglProsesHPP", e)}
                                            value={ productDetailMargin.tgl_proseshpp }
                                            />

                                            <Label
                                            style={{
                                                display: "inline-flex",
                                                margin: "auto",
                                                justifyContent: "left",
                                            }}
                                            >
                                                <b>]</b>
                                            </Label>
                                        </div>
                                    </div>

                                    <div 
                                    style={{
                                        width: "100%"
                                    }}
                                    >
                                        <div 
                                        style={{
                                            float: "left",
                                            width: "50%",
                                        }}
                                        >
                                            <Label
                                            className="text-nowrap"
                                            style={{
                                                display: "inline-flex",
                                                justifyContent: "center",
                                                textAlign: "center",
                                                verticalAlign: "center",
                                                margin: "auto",
                                                justifyContent: "left",
                                                marginRight: "3.25vw",
                                            }}
                                            >Margin Jual</Label>
                                            
                                            <Input
                                            placeholder="Sale Margin"
                                            // type="number"
                                            min="0"
                                            style={{
                                                display:"inline-flex",
                                                width: "20%",
                                                marginLeft: "12.5%",
                                            }}
                                            onInput={(e) => this.handleChange("inputSaleMargin", e)}
                                            value={ productDetailMargin_DHJ.pro_salemargin }
                                            />

                                            <Label
                                            style={{
                                                display: "inline-flex",
                                                margin: "auto",
                                                justifyContent: "left",
                                                marginLeft: ".5vw",
                                            }}
                                            >
                                                <b>%</b>
                                            </Label>

                                        </div>
                                        
                                        <div 
                                        style={{
                                            float: "right",
                                            width: "50%",
                                        }}
                                        >
                                            <Label
                                            className="text-nowrap"
                                            style={{
                                                display: "inline-flex",
                                                justifyContent: "center",
                                                textAlign: "center",
                                                verticalAlign: "center",
                                                margin: "auto",
                                                justifyContent: "left",
                                                marginRight: "4vw",
                                            }}
                                            >HJA</Label>
                                            
                                            <Label
                                            style={{
                                                display: "inline-flex",
                                                margin: "auto",
                                                justifyContent: "left",
                                                marginLeft: ".3vw",
                                            }}
                                            >
                                                <b>[</b>
                                            </Label>

                                            <Input
                                            placeholder="Sale Price Box"
                                            // type="number"
                                            min="0"
                                            style={{
                                                display:"inline-flex",
                                                width: "20%",
                                                marginLeft: "1vw",
                                                marginRight: "1vw",
                                            }}
                                            onInput={(e) => this.handleChange("inputSalePriceBox", e)}
                                            value={ productDetailMargin_DHJ.pro_salepricebox }
                                            />

                                            <Label
                                            style={{
                                                display: "inline-flex",
                                                margin: "auto",
                                                justifyContent: "left",
                                                marginRight: ".5vw"
                                            }}
                                            >
                                                <b>]</b>
                                            </Label>

                                            <Label
                                            style={{
                                                display: "inline-flex",
                                                margin: "auto",
                                                justifyContent: "left",
                                            }}
                                            >
                                                <b>/</b>
                                            </Label>

                                            <Label
                                            style={{
                                                display: "inline-flex",
                                                margin: "auto",
                                                justifyContent: "left",
                                                marginLeft: ".5vw",
                                            }}
                                            >
                                                <b>[</b>
                                            </Label>

                                            <Input
                                            readOnly
                                            placeholder="Sale Price"
                                            // type="number"
                                            min="0"
                                            style={{
                                                display:"inline-flex",
                                                width: "20%",
                                                marginLeft: "1vw",
                                                marginRight: "1vw",
                                            }}
                                            onInput={(e) => this.handleChange("inputSalePrice", e)}
                                            value={ productDetailMargin_DHJ.pro_saleprice }
                                            />

                                            <Label
                                            style={{
                                                display: "inline-flex",
                                                margin: "auto",
                                                justifyContent: "left",
                                            }}
                                            >
                                                <b>]</b>
                                            </Label>
                                        </div>
                                    </div>

                                    <div 
                                    style={{
                                        width: "100%"
                                    }}
                                    >
                                        <div 
                                        style={{
                                            float: "left",
                                            width: "50%",
                                        }}
                                        >
                                            <Label
                                            className="text-nowrap"
                                            style={{
                                                display: "inline-flex",
                                                justifyContent: "center",
                                                textAlign: "center",
                                                verticalAlign: "center",
                                                margin: "auto",
                                                justifyContent: "left",
                                                marginRight: ".5vw",
                                            }}
                                            >Margin Jual Non</Label>
                                            
                                            <Input
                                            placeholder="Sale Margin Non"
                                            // type="number"
                                            min="0"
                                            style={{
                                                display:"inline-flex",
                                                width: "20%",
                                                marginLeft: "12.8%",
                                            }}
                                            onInput={(e) => this.handleChange("inputSaleMarginNon", e)}
                                            value={ productDetailMargin_DHJ.pro_salemarginnon }
                                            />

                                            <Label
                                            style={{
                                                display: "inline-flex",
                                                margin: "auto",
                                                justifyContent: "left",
                                                marginLeft: ".5vw",
                                            }}
                                            >
                                                <b>%</b>
                                            </Label>

                                        </div>
                                        
                                        <div 
                                        style={{
                                            float: "right",
                                            width: "50%",
                                        }}
                                        >
                                            <Label
                                            className="text-nowrap"
                                            style={{
                                                display: "inline-flex",
                                                justifyContent: "center",
                                                textAlign: "center",
                                                verticalAlign: "center",
                                                margin: "auto",
                                                justifyContent: "left",
                                                marginRight: "1.25vw",
                                            }}
                                            >HJA Non</Label>
                                            
                                            <Label
                                            style={{
                                                display: "inline-flex",
                                                margin: "auto",
                                                justifyContent: "left",
                                                marginLeft: ".5vw",
                                            }}
                                            >
                                                <b>[</b>
                                            </Label>

                                            <Input
                                            placeholder="Sale Price Non Box"
                                            // type="number"
                                            min="0"
                                            style={{
                                                display:"inline-flex",
                                                width: "20%",
                                                marginLeft: "1vw",
                                                marginRight: "1vw",
                                            }}
                                            onInput={(e) => this.handleChange("inputSalePriceNonBox", e)}
                                            value={ productDetailMargin_DHJ.pro_salepricenonbox }
                                            />

                                            <Label
                                            style={{
                                                display: "inline-flex",
                                                margin: "auto",
                                                justifyContent: "left",
                                                marginRight: ".5vw"
                                            }}
                                            >
                                                <b>]</b>
                                            </Label>

                                            <Label
                                            style={{
                                                display: "inline-flex",
                                                margin: "auto",
                                                justifyContent: "left",
                                            }}
                                            >
                                                <b>/</b>
                                            </Label>

                                            <Label
                                            style={{
                                                display: "inline-flex",
                                                margin: "auto",
                                                justifyContent: "left",
                                                marginLeft: ".5vw",
                                            }}
                                            >
                                                <b>[</b>
                                            </Label>

                                            <Input
                                            readOnly
                                            placeholder="Sale Price Non"
                                            // type="number"
                                            min="0"
                                            style={{
                                                display:"inline-flex",
                                                width: "20%",
                                                marginLeft: "1vw",
                                                marginRight: "1vw",
                                            }}
                                            onInput={(e) => this.handleChange("inputSalePriceNon", e)}
                                            value={ productDetailMargin_DHJ.pro_salepricenon }
                                            />

                                            <Label
                                            style={{
                                                display: "inline-flex",
                                                margin: "auto",
                                                justifyContent: "left",
                                            }}
                                            >
                                                <b>]</b>
                                            </Label>
                                        </div>
                                    </div>

                                    <div 
                                    style={{
                                        width: "100%"
                                    }}
                                    >
                                        <div 
                                        style={{
                                            float: "left",
                                            width: "50%",
                                        }}
                                        >
                                            <Label
                                            className="text-nowrap"
                                            style={{
                                                display: "inline-flex",
                                                justifyContent: "center",
                                                textAlign: "center",
                                                verticalAlign: "center",
                                                margin: "auto",
                                                justifyContent: "left",
                                                marginRight: "2.95vw",
                                            }}
                                            >Margin Auto</Label>
                                            
                                            <Input
                                            placeholder="Margin Auto"
                                            // type="number"
                                            min="0"
                                            style={{
                                                display:"inline-flex",
                                                width: "20%",
                                                marginLeft: "12.5%",
                                            }}
                                            onInput={(e) => this.handleChange("inputMarginAuto", e)}
                                            value={ productDetailMargin_DHJ.mgr_auto }
                                            />

                                            <Label
                                            style={{
                                                display: "inline-flex",
                                                margin: "auto",
                                                justifyContent: "left",
                                                marginLeft: ".5vw",
                                            }}
                                            >
                                                <b>%</b>
                                            </Label>

                                        </div>
                                        
                                        <div 
                                        style={{
                                            float: "right",
                                            width: "50%",
                                        }}>
                                            <Label
                                            className="text-nowrap"
                                            style={{
                                                display: "inline-flex",
                                                justifyContent: "center",
                                                textAlign: "center",
                                                verticalAlign: "center",
                                                margin: "auto",
                                                justifyContent: "left",
                                                marginRight: ".85vw",
                                            }}
                                            >HJA Auto</Label>
                                            
                                            <Label
                                            style={{
                                                display: "inline-flex",
                                                margin: "auto",
                                                justifyContent: "left",
                                                marginLeft: ".5vw",
                                            }}
                                            >
                                                <b>[</b>
                                            </Label>

                                            <Input
                                            placeholder="HJA Auto Box"
                                            // type="number"
                                            min="0"
                                            style={{
                                                display:"inline-flex",
                                                width: "20%",
                                                marginLeft: "1vw",
                                                marginRight: "1vw",
                                            }}
                                            onInput={(e) => this.handleChange("inputHJAAutoBox", e)}
                                            value={ productDetailMargin_DHJ.pro_hjaautobox }
                                            />

                                            <Label
                                            style={{
                                                display: "inline-flex",
                                                margin: "auto",
                                                justifyContent: "left",
                                                marginRight: ".5vw"
                                            }}
                                            >
                                                <b>]</b>
                                            </Label>

                                            <Label
                                            style={{
                                                display: "inline-flex",
                                                margin: "auto",
                                                justifyContent: "left",
                                            }}
                                            >
                                                <b>/</b>
                                            </Label>

                                            <Label
                                            style={{
                                                display: "inline-flex",
                                                margin: "auto",
                                                justifyContent: "left",
                                                marginLeft: ".5vw",
                                            }}
                                            >
                                                <b>[</b>
                                            </Label>

                                            <Input
                                            readOnly
                                            placeholder="HJA Auto"
                                            // type="number"
                                            min="0"
                                            style={{
                                                display:"inline-flex",
                                                width: "20%",
                                                marginLeft: "1vw",
                                                marginRight: "1vw",
                                            }}
                                            onInput={(e) => this.handleChange("inputHJAAuto", e)}
                                            value={ productDetailMargin_DHJ.pro_hjaauto }
                                            />

                                            <Label
                                            style={{
                                                display: "inline-flex",
                                                margin: "auto",
                                                justifyContent: "left",
                                            }}
                                            >
                                                <b>]</b>
                                            </Label>
                                        </div>
                                    </div>

                                    <div
                                    style={{
                                        width: "100%"
                                    }}
                                    >
                                        
                                        <div 
                                        style={{
                                            float: "right",
                                        }}>
                                            <Label
                                            className="text-nowrap"
                                            style={{
                                                display: "inline-flex",
                                                justifyContent: "center",
                                                textAlign: "center",
                                                verticalAlign: "center",
                                                margin: "auto",
                                                justifyContent: "left",
                                                marginRight: ".85vw",
                                            }}
                                            >HJA Buying Grp (Exclude PPN)</Label>
                                            
                                            <Label
                                            style={{
                                                display: "inline-flex",
                                                margin: "auto",
                                                justifyContent: "left",
                                                marginLeft: ".5vw",
                                            }}
                                            >
                                                <b>[</b>
                                            </Label>

                                            <Input
                                            placeholder="Buy Grp Box"
                                            // type="number"
                                            min="0"
                                            style={{
                                                display:"inline-flex",
                                                width: "20%",
                                                marginLeft: "1vw",
                                                marginRight: "1vw",
                                            }}
                                            onInput={(e) => this.handleChange("inputBuyGrpBox", e)}
                                            value={ productDetailMargin_DHJ.pro_buygrpbox }
                                            />

                                            <Label
                                            style={{
                                                display: "inline-flex",
                                                margin: "auto",
                                                justifyContent: "left",
                                                marginRight: ".5vw"
                                            }}
                                            >
                                                <b>]</b>
                                            </Label>

                                            <Label
                                            style={{
                                                display: "inline-flex",
                                                margin: "auto",
                                                justifyContent: "left",
                                            }}
                                            >
                                                <b>/</b>
                                            </Label>

                                            <Label
                                            style={{
                                                display: "inline-flex",
                                                margin: "auto",
                                                justifyContent: "left",
                                                marginLeft: ".5vw",
                                            }}
                                            >
                                                <b>[</b>
                                            </Label>

                                            <Input
                                            readOnly
                                            placeholder="Buy Grp"
                                            // type="number"
                                            min="0"
                                            style={{
                                                display:"inline-flex",
                                                width: "20%",
                                                marginLeft: "1vw",
                                                marginRight: "1vw",
                                            }}
                                            onInput={(e) => this.handleChange("inputBuyGrp", e)}
                                            value={ productDetailMargin_DHJ.pro_buygrp }
                                            />

                                            <Label
                                            style={{
                                                display: "inline-flex",
                                                margin: "auto",
                                                justifyContent: "left",
                                            }}
                                            >
                                                <b>]</b>
                                            </Label>
                                        </div>

                                    </div>

                                    <div 
                                    style={{
                                        width: "100%"
                                    }}
                                    >
                                        <div 
                                        style={{
                                            float: "left",
                                            width: "50%",
                                        }}
                                        >
                                            <Label
                                            className="text-nowrap"
                                            style={{
                                                display: "inline-flex",
                                                justifyContent: "center",
                                                textAlign: "center",
                                                verticalAlign: "center",
                                                margin: "auto",
                                                justifyContent: "left",
                                            }}
                                            >Margin Tambahan</Label>
                                            
                                            <Input
                                            placeholder="Margin Tambahan"
                                            // type="number"
                                            min="0"
                                            style={{
                                                display:"inline-flex",
                                                width: "20%",
                                                marginLeft: "10%",
                                            }}
                                            onInput={(e) => this.handleChange("inputMarginTambahan", e)}
                                            value={ productDetailMargin_DHJ.margin_tambahan }
                                            />

                                            <Label
                                            style={{
                                                display: "inline-flex",
                                                margin: "auto",
                                                justifyContent: "left",
                                                marginLeft: ".5vw",
                                            }}
                                            >
                                                <b>%</b>
                                            </Label>

                                        </div>
                                    </div>
                                
                                </fieldset>
                            </Form>
                            
                        </CardBody>

                        <CardFooter>
                            <Form
                            inline
                            className="cr-search-form"
                            style={{
                                textAlign: "center",
                                float: "right"
                                // justifyContent: "center",
                            }}
                            >
                                {/* Edit */}
                                {
                                    value === 0 
                                    && 
                                    <Button
                                    color={"primary"}
                                    style={{
                                        marginLeft: "5px",
                                        marginRight: "5px",
                                        display: this.state.displayEditButton
                                    }}
                                    onClick={ () => this.enableAllInput() }
                                    >
                                        <MdEdit
                                        style={{
                                            marginRight: "5px"
                                        }}
                                        />Edit
                                    </Button>
                                }

                                {
                                    value === 1 
                                    && 
                                    <Button
                                    color={"success"}
                                    style={{
                                        marginRight: "5px",
                                        marginLeft: "5px",
                                    }}
                                    onClick = { () => this.editKonfirmasiSupplierProduk() }
                                    // onClick = { () => this.toggleEditConfirmationModal() }
                                    >
                                        <MdSave
                                        style={{
                                            marginRight: "5px"
                                        }}
                                        />Save
                                    </Button>
                                }
                                {/* Edit */}
                                
                                {/* Add */}
                                <Button
                                color={"primary"}
                                style={{
                                    marginRight: "5px",
                                    marginLeft: "5px",
                                    display: this.state.displayAddButton,
                                }}
                                onClick = { () => this.toggleAddConfirmationModal() }
                                >
                                    <MdAdd
                                    style={{
                                        marginRight: "5px"
                                    }}
                                    />Tambah
                                </Button>
                                
                                <Button
                                color={"danger"}
                                style={{
                                    marginLeft: "5px",
                                }}
                                onClick={ () => this.disableAllInput() }
                                >
                                    <MdCancel
                                    style={{
                                        marginRight: "5px"
                                    }}
                                    />Cancel
                                </Button>
                                {/* Add */}
                                
                            </Form>
                        </CardFooter>

                    </Card>

                </div>
            </div>
        )
    }
}

export default MasterProdukSupplierAktifAdd;