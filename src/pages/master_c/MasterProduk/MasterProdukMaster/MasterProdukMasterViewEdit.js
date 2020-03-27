import React from 'react';
import {
    Button, Form, Label, Table,
    Input, FormGroup, Card, CardBody,Modal,ModalHeader,ModalBody,ModalFooter
} from 'reactstrap';
import {
    MdSave, MdCancel, MdEdit, MdDone,MdClose,MdDelete,MdAdd
} from 'react-icons/md';
import 'react-tabs/style/react-tabs.css';
import axios from 'axios'
import dateFormat from 'dateformat'
import { thisExpression } from '@babel/types';


class MasterProdukMasterViewEdit extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            result: [],
            value: 0,
            headers:'',
            noDataMessage: "none",
            responseCode:'',
            responseHeader:'',
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
            barcodeValue:0,
            puredead:[],
            proconStatus:[
                {
                    statusId:"A",
                    statusName:"A-Aktif"
                },
                {
                    statusId:"Y",
                    statusName:"Y-Non Aktif"
                },
                {
                    statusId:"M",
                    statusName:"M-Mati"
                }
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
                    halalId: "Y",
                    halalStatus: "Yes",
                },
                {
                    halalId: "N",
                    halalStatus: "No",
                }
            ],
            classProduct: [
                {
                    cpID:"A",
                    cpClass: "A",
                },
                {
                    cpID:"B",
                    cpClass: "B",
                },
                {
                    cpID:"C",
                    cpClass: "C",
                },
                {
                    cpID:"D",
                    cpClass: "D",
                },
            ],
            classMargin: [
                {
                    cmId:"A",
                    cmClass: "A",
                },
                {
                    cmId:"B",
                    cmClass: "B",
                },
                {
                    cmId:"C",
                    cmClass: "C",
                },
                {
                    cmId:"D",
                    cmClass: "D",
                },
                {
                    cmId:"E",
                    cmClass: "E",
                },
            ],

            inputCode: '',
            inputOldProduct: '',
            inputCodeSup: '',
            inputName: '',
            inputName2: '',
            inputDeptCode: '',
            inputDeptName: '',
            inputPrinCode: '',
            inputPrinName: '',
            inputCtrlCode: '',
            inputStsMargin: '',
            inputExpDateYN: '',
            inputPrgDiscYN: '',
            inputBuyPack: '',
            inputBuyCode:'',
            inputSellUnit: 0,
            inputSellPack: '',
            inputSellCode:'',
            inputMedUnit: 0,
            inputMedPack: '',
            inputMedCode:'',
            inputBarcodeYN: '',
            inputNoRegYN: '',
            inputNoReg: '',
            inputNoRegBerlaku:'',
            inputNIEDate: '',
            inputHargaSpecialYN: '',
            inputHargaSpecial: '',
            inputHETYN: '',
            inputHETPrice: '',
            inputNonGenerikYN: '',
            inputKelipatan: '',
            inputIPA: '',
            inputValueIPA: 0,
            inputIDA: '',
            inputValueIDA: 0,
            inputKetNIECode:'',
            inputNIESubmitBPOM: '',
            inputHalalYN: '',
            inputNoSertHalal: '',
            inputNoSertHalalBerlaku:'',
            inputHalalDate: '',
            inputScore: '',
            inputBrandCode: '',
            inputBrandName: '',
            inputClsProduct: '',
            inputClsMargin: '',
            inputNPDYN: '',
            inputKemasanYN:'',
            inputMonografYN: '',
            inputImportYN: '',
            inputHomeBrandYN: '',
            inputTabletYN: '',
            inputPackYN: '',
            inputPatenYN: '',
            inputPsikotropikaYN: '',
            inputKlasiBPOM: '',
            inputKlasiBPOMCode:'',
            inputGenerikID: '',
            inputGenerikName:'',
            inputGenerikPsikotropika:'',
            inputTerapiID: '',
            inputTerapiName: '',
            inputStrength: '',
            inputStrengthCode:'',
            inputDsgForm: '',
            inputDsgFormCode:'',
            inputAmount: '',
            inputUnit: 0,
            inputKdGenerik: '',
            inputKdGenerikCode:'',
            inputStorageTemp: '',
            inputStorageCode:'',
            inputTidakBolehDijual: 'N',
            inputFirstDate: '',
            inputSurveyYN: '',
            inputDecorYN: '',
            inputLastUpdate: '',
            inputTimbangYN: '',
            inputInHealthYN: '',
            inputInHealth: '',
            inputKodeInHealth: '',
            inputPTAsuransiInHealth: '',
            inputPTAsuransiInHealthCode:'',
            inputKategoriPro: '',
            inputKategoriCode:'',
            inputPoinSellPack: '',
            inputPoinSelling: '',
            inputNomorIjinProduk: '',
            inputQtyPOMinValue: '1',
            inputQtyPOMinType:'',
            inputBarcode: '',
            firstBarcodeId: 1,
            lastBarcodeId: 1,
            inputMinOrdPO: 0,
            inputLeadTime:'',

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

            responseMessage: '',
            token: '',
        }
    }

    componentDidMount(){
        this.auth();
    }

    auth = async() => {
        await Promise.all([
            axios.post('https://api.docnet.id/CHCAuth/login',
            {
                username: 'admin',
                password: 'admin'
            })
            .then((res) => {
                this.setState({
                    headers: res.headers
                })
            })
        ])
        this.getProdukDetail();

    }

    getProdukDetail = ()=>{
        axios.get('https://api.docnet.id/CHCMasterProduk/Product?kode=' + this.props.activeProcode)
        .then((res)=>{
            if(res.data.data !== null){
                this.setState({
                    result: res.data.data
                })
            }else{
                this.setState({
                    noDataMessage:"inline-block"
                })
            }
        },()=>console.log("result: ",this.state.result))
        .then(()=>this.waitAllDataLoad())
        .then(()=>this.getViewMatchingSelect())
        .then(()=>this.nomorIjinProdukHandler())
        .then(()=>this.keteranganNIEHandler())
        .then(()=>this.HalalHandler())
        .then(()=>this.getBarcodeView())
        .then(()=>this.checkboxListenerView())
    }

    waitAllDataLoad = async () => {
        await Promise.all([
            this.getKdBrand(),
            this.getPrincipal(),
            this.getDeptListActive(),
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
            this.getProdPureDeadList()
        ]);

    }

    getBarcodeView = () =>{
        var btnaddbarcode = document.getElementById("addbarcode");

        if(this.state.result.no_barcode === null){
            this.setState({
                barcodeValue:0
            })
            btnaddbarcode.style.visibility = "hidden"
        }
        else {
            const newItem = [
                {
                    bID: this.state.firstBarcodeId,
                    bCode: this.state.result.no_barcode
                },
            ]
            this.setState({
                barcode:[...this.state.barcode,...newItem],
                barcodeValue:1
            })
            btnaddbarcode.style.visibility = "visible"
        }
    }

    getViewMatchingSelect = () => {
        //Procon
        for(let i=0;i<this.state.proconStatus.length;i++){
            if(this.state.proconStatus[i].statusId === this.state.result.pro_ctrlcode){
                this.setState({
                    inputCtrlCode:this.state.proconStatus[i].statusId
                })
            }
        }

        //NomorIjinProduk
        for(let i=0;i<this.state.nomorIjinProduk.length;i++){
            if(this.state.nomorIjinProduk[i].nipId === this.state.result.pro_nomorijinpro){
                this.setState({
                    inputNomorIjinProduk:this.state.nomorIjinProduk[i].nipId
                })
            }
        }

        //Halal
        for(let i=0;i<this.state.halal.length;i++){
            if(this.state.halal[i].halalId === this.state.result.pro_halal){
                this.setState({
                    inputHalalYN:this.state.halal[i].halalId
                })
            }
        }

        //Amount
        for(let i=0;i<this.state.comco.length;i++){
            if(this.state.comco[i].cmcId === this.state.result.pro_unit){
                this.setState({
                    inputUnit:this.state.comco[i].cmcId
                })
            }
            this.setState({
                inputAmount:this.state.result.pro_amount
            })
        }

        //Class Product
        for(let i=0;i<this.state.classProduct.length;i++){
            if(this.state.classProduct[i].cpID === this.state.result.pro_clsproduct){
                this.setState({
                    inputClsProduct:this.state.classProduct[i].cpID
                })
            }
        }
        //Class Margin
        for(let i=0;i<this.state.classMargin.length;i++){
            if(this.state.classMargin[i].cmId === this.state.result.pro_clsmargin){
                this.setState({
                    inputClsMargin:this.state.classMargin[i].cmId
                })
            }
        }

        //Kelipatan
        this.setState({
            inputKelipatan:this.state.result.pro_kelipatan
        })

        //IPA
        this.setState({
            inputValueIPA:this.state.result.pro_valueipa
        })

        //IDA
        this.setState({
            inputValueIDA:this.state.result.pro_valueida
        })

        //QtyPOMinType
        this.setState({
            inputQtyPOMinType:this.state.result.pro_buypack
        })

        //No Reg
        this.setState({
            inputNoReg:this.state.result.pro_noreg
        })

        //No Reg Berlaku
        this.setState({
            inputNIEDate:this.state.result.pro_niedate
        })

        //No Sert Halal
        this.setState({
            inputNoSertHalal:this.state.result.pro_halal
        })

        //No Sert Halal Berlaku
        this.setState({
            inputNoSertHalalBerlaku:this.state.result.pro_halaldate
        })

        //Tgl Submit BPOM
        this.setState({
            inputNIESubmitBPOM:this.state.result.pro_niesubmitbpom
        })

        //KdBrand
        this.setState({
            inputBrandCode:this.state.result.pro_brandcode
        })
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
            keyword:'',
        },
        {
            headers: this.state.headers
        })
        .then((res) => {
            this.setState({
                activeDeptList: res.data.result,
            },()=> this.getDeptName())
        })
    }

    getDeptName =  async () =>{
        for(let i=0; i<this.state.activeDeptList.length; i++){
            if(this.state.activeDeptList[i].dept_code === this.state.result.pro_deptcode){
                this.setState({
                    inputDeptName:this.state.activeDeptList[i].dept_name,
                    inputDeptCode:this.state.activeDeptList[i].dept_code
                })
            }
        }
    }

    getPrincipal = () => {
        axios
        .post('https://api.docnet.id/CHCMasterD/MasterPrincipal/CariKodePrincipal?kode='+ this.state.result.pro_princode, 
        {
        })
        .then((res) => {
            this.setState({
                principalList: res.data.Data,
            },()=>this.getPrincipalName())
        });
    }

    getPrincipalName = async () =>{
        for(let i=0;i<this.state.principalList.length;i++){
            if(this.state.principalList[i].Pri_Code === this.state.result.pro_princode){
                this.setState({
                    inputPrinName:this.state.principalList[i].Pri_Name,
                    inputPrinCode:this.state.principalList[i].Pri_Code
                })
            }
        }
    }

    getKdBrand = () => {
        axios
        .post('https://api.docnet.id/CHCMasterD/MasterBrand/CariKodeBrand?kode='+this.state.result.pro_brandcode)
        .then((res) => {
            this.setState({
                kdBrandList: res.data.Data,
            },()=>this.getKdBrandName())
        });
    }

    getKdBrandName = async () => {
        for(let i=0;i<this.state.kdBrandList.length;i++){
            if(this.state.kdBrandList[i].Bra_BrandedCode === this.state.result.pro_brandcode){
                this.setState({
                    inputBrandName:this.state.kdBrandList[i].Bra_BrandedName,
                })
            }
        }
    }

    getKemasan = () => {
        axios
        .post('https://api.docnet.id/CHCMasterB/MasterKemasan', 
        {
            limit: 0,
            offset: 0,
            keyword:'',
        },{
            headers:this.state.headers
        }).then((res) => {
            this.setState({
                activePackList: res.data.result,
            },()=>this.getKemasanName())
        });
    }

    getKemasanName = async () => {
        for(let i=0;i<this.state.activePackList.length;i++){
            if(this.state.activePackList[i].pack_code === this.state.result.pro_sellpack){
                this.setState({
                    inputSellPack:this.state.activePackList[i].pack_name,
                    inputSellCode:this.state.activePackList[i].pack_code
                })
            } 
        }

        for(let j=0;j<this.state.activePackList.length;j++){
            if (this.state.activePackList[j].pack_code === this.state.result.pro_medpack){
                this.setState({
                    inputMedPack:this.state.activePackList[j].pack_name,
                    inputMedCode:this.state.activePackList[j].pack_code
                })
        }

        for(let k=0;k<this.state.activePackList.length;k++){
            if(this.state.activePackList[k].pack_code === this.state.result.pro_buypack){
                this.setState({
                    inputBuyPack:this.state.activePackList[k].pack_name,
                    inputBuyCode:this.state.activePackList[k].pack_code
                })
            }
        }

    }
}

    getKeteranganNIE = () => {
        axios
        .get('https://api.docnet.id/CHCMasterSupport/MasterKeteranganNIE?page=0&length=0')
        .then((res) => {
            if (res.data.data !== null) {
                this.setState({
                  keteranganNIE: res.data.data,
                },()=>this.getKeteranganNIEName())
            } else {
                this.setState({
                  keteranganNIE: [],
                })
            }
        })
    }

    getKeteranganNIEName = async () => {
        for(let i=0;i<this.state.keteranganNIE.length;i++){
            if(this.state.keteranganNIE[i].nie_id === this.state.result.pro_ketnie){
                this.setState({
                    inputKetNIECode: this.state.keteranganNIE[i].nie_id
                })
            }
        }
    }

    getKlaBPOM = () => {
        axios
        .get('https://api.docnet.id/CHCMasterA/MasterKlasifikasiBPOM/TampilSemuaKlaBPOM')
        .then((res) => {
            if (res.data.data !== null) {
                this.setState({
                  klaBPOM: res.data.data,
                },()=>this.getKlaBPOMName())
            } else {
                this.setState({
                  klaBPOM: [],
                })
            }
        })
    }

    getKlaBPOMName = async() => {
        for(let i=0;i<this.state.klaBPOM.length;i++){
            if(this.state.klaBPOM[i].kla_Code === this.state.result.pro_klasibpom){
                this.setState({
                    inputKlasiBPOM:this.state.klaBPOM[i].kla_Name,
                    inputKlasiBPOMCode:this.state.klaBPOM[i].kla_Code
                })
            }
        }
    }

    getGenerikList = () => {
        axios
        .get('https://api.docnet.id/CHCMasterA/MasterGenerik/TampilSemuaGenerik',
        {
            page:1,
            size:1,
            keyword:this.state.result.pro_generikid
        })
        .then((res) => {
            if (res.data.responseData !== null) {
                this.setState({
                  activeGenerikList: res.data
                },()=>this.getGenerikName())
            } else {
                this.setState({
                activeGenerikList: [],
                })
            }
        })
    }

    getGenerikName = async () => {
        for(let i=0;i<this.state.activeGenerikList.length;i++){
            // eslint-disable-next-line eqeqeq
            if(this.state.activeGenerikList[i].gen_Code == this.state.result.pro_generikid){
                this.setState({
                    inputGenerikName: this.state.activeGenerikList[i].gen_Name,
                    inputGenerikID:this.state.activeGenerikList[i].gen_Code,
                    inputGenerikPsikotropika:this.state.activeGenerikList[i].gen_psikotropika
                })
            }
        }
    }

    getStrengthList = () => {
        axios
        .post('https://api.docnet.id/CHCMasterA/MasterStrength/CetakStrengthHalaman',
        {
            page:1,
            size:10,
            keyword:""
        })
        .then((res) => {
            this.setState({
                strengthList: res.data.responseData,
            },()=>this.getStrengthName())
        });
    }

    getStrengthName = async () => {
        for(let i=0;i<this.state.strengthList.length;i++){
            if(this.state.strengthList[i].strg_Code === this.state.result.pro_strength){
                this.setState({
                    inputStrength:this.state.strengthList[i].strg_Name,
                    inputStrengthCode:this.state.strengthList[i].strg_Code
                })
            }
        }
    }

    getDossageForm = () => {
        axios
        .post('https://api.docnet.id/CHCMasterA/MasterDosis/TampilkanDossageFormPage', 
        {
            page:1,
            length:30
        }).then((res) => {
            this.setState({
                dossagFormList: res.data
            },()=>this.getDossageFormName())
        });
    }

    getDossageFormName = async() =>{
        for(let i=0;i<this.state.dossagFormList.length;i++){
            if(this.state.dossagFormList[i].dsgform_code === this.state.result.pro_dsgform){
                this.setState({
                    inputDsgForm:this.state.dossagFormList[i].dsgform_name,
                    inputDsgFormCode:this.state.dossagFormList[i].dsgform_code
                })
            }
        }
    }

    getJenisObat = () => {
        axios
        .get('https://api.docnet.id/CHCMasterSupport/MasterJenisObat?page=0&length=0')
        .then((res) => {
            if (res.data.data !== null) {
                this.setState({
                  jenisObat: res.data.data,
                },()=>this.getJenisObatName())
            } else {
                this.setState({
                  jenisObat: [],
                })
            }
        })
    }

    getJenisObatName = async () => {
        for(let i=0;i<this.state.jenisObat.length;i++){
            if(this.state.jenisObat[i].jnsob_code === this.state.result.pro_kdgenerik){
                this.setState({
                    inputKdGenerik:this.state.jenisObat[i].jnsob_name,
                    inputKdGenerikCode:this.state.jenisObat[i].jnsob_code
                })
            }
        }
    }

    getStorage = () => {
        axios
        .get('https://api.docnet.id/CHCMasterSupport/MasterStorage?page=0&length=0')
        .then((res) => {
            if (res.data.data !== null) {
                this.setState({
                  storage: res.data.data,
                },()=>this.getStorageName())
            } else {
                this.setState({
                  storage: [],
                })
            }
        })
    }

    getStorageName = async () => {
        for(let i=0;i<this.state.storage.length;i++){
            if(this.state.storage[i].storage_code === this.state.result.pro_storagetemp){
                this.setState({
                    inputStorageTemp:this.state.storage[i].storage_name,
                    inputStorageCode:this.state.storage[i].storage_code
                })
            }
        }
    }

    getCompanyList = () => {
        axios
        .get('https://api.docnet.id/CHCMasterSupport/MasterCompanyRFID?page=0&length=0')
        .then((res) => {
            if (res.data.data !== null) {
                this.setState({
                  companyList: res.data.data,
                },()=>this.getCompanyName())
            } else {
                this.setState({
                  companyList: [],
                })
            }
        })
    }

    getCompanyName = async() =>{
        for(let i=0;i<this.state.companyList.length;i++){
            // eslint-disable-next-line eqeqeq
            if(this.state.companyList[i].com_idnumber == this.state.result.pro_inhealth){
                this.setState({
                    inputPTAsuransiInHealth:this.state.companyList[i].com_name,
                    inputPTAsuransiInHealthCode:this.state.companyList[i].com_idnumber
                })
            }
        }
    }

    getProductCategory = () => {
        axios
        .get('https://api.docnet.id/CHCMasterSupport/MasterKategoryProduk?page=0&length=0')
        .then((res) => {
            if (res.data.data !== null) {
                this.setState({
                  productCategory: res.data.data,
                },()=>this.getProductCategoryName())
            } else {
                this.setState({
                  productCategory: [],
                })
            }
        })
    }

    getProductCategoryName = async () => {
        for(let i=0;i<this.state.productCategory.length;i++){
            if(this.state.productCategory[i].katpro_id === this.state.result.pro_kategoripro){
                this.setState({
                    inputKategoriPro:this.state.productCategory[i].katpro_nama,
                    inputKategoriCode:this.state.productCategory[i].katpro_id
                })
            }
        }
    }

    getProdPureDeadList = ()=> {
        axios
        .get('https://api.docnet.id/CHCMasterB/getProdPureDeadListProcod', {
            headers: this.state.headers
        })
        .then((res)=>{
            if(res.data.result !== null ){
                this.setState({
                    puredead:res
                }, ()=> this.getProdPureDeadChecked())
            }
        })
    }

    getProdPureDeadChecked = async () => {
        for(let i=0;i<this.state.puredead.length;i++){
            if(this.state.puredead[i].lpbd_procod === this.state.result.pro_code){
                this.setState({
                    inputTidakBolehDijual:'Y'
                })
            } else if(this.state.puredead[i].lpbd_procod !== this.state.result.pro_code){
                this.setState({
                    inputTidakBolehDijual:'N'
                })
            }
        }
    }

    editProdukDetail = () => {
        this.state.ndYear = (this.state.inputNIEDate).substring(0, 4);
        this.state.ndMonth = (this.state.inputNIEDate).substring(5, 7);
        this.state.ndDay = (this.state.inputNIEDate).substring(8, 10);
        this.state.nieDate = this.state.ndYear + "-" + this.state.ndMonth + "-" + this.state.ndDay;

        // this.state.nsbYear = (this.state.inputNIESubmitBPOM).substring(0, 4);
        // this.state.nsbMonth = (this.state.inputNIESubmitBPOM).substring(5, 7);
        // this.state.nsbDay = (this.state.inputNIESubmitBPOM).substring(8, 10);
        // this.state.nieSubmitBpom = this.state.nsbYear + "-" + this.state.nsbMonth + "-" + this.state.nsbDay;
        if(this.state.inputNIESubmitBPOM === ''){
            this.setState({
                nieSubmitBpom:''
            })
        }
        else if(this.state.inputNIESubmitBPOM !== null){
            var nsbYear = (this.state.inputNIESubmitBPOM).substring(0, 4);
            var nsbMonth = (this.state.inputNIESubmitBPOM).substring(5, 7);
            var nsbDay = (this.state.inputNIESubmitBPOM).substring(8, 10);

            this.setState({
                nieSubmitBpom: nsbYear + "-" + nsbMonth + "-" + nsbDay,
            });
        }
        this.setState({
            nieSubmitBpom: nsbYear + "-" + nsbMonth + "-" + nsbDay,
        });

        this.state.hdYear = (this.state.inputHalalDate).substring(0, 4);
        this.state.hdMonth = (this.state.inputHalalDate).substring(5, 7);
        this.state.hdDay = (this.state.inputHalalDate).substring(8, 10);
        this.state.halalDate = this.state.hdYear + "-" + this.state.hdMonth + "-" + this.state.hdDay;

        this.state.luYear = (this.state.inputLastUpdate).substring(0, 4);
        this.state.luMonth = (this.state.inputLastUpdate).substring(5, 7);
        this.state.luDay = (this.state.inputLastUpdate).substring(8, 10);
        this.state.lastUpdate = this.state.luDay + "/" + this.state.luMonth + "/" + this.state.luYear;

        var recentBarcode = [];
        for(var i = 0; i < this.state.barcode.length; i++){
            recentBarcode.push(this.state.barcode[i].bCode.toString());
        }

        var TempJSON = {
            pro_runningid:this.state.result.pro_runningid,
            pro_code:this.state.result.pro_code,
            pro_name:this.state.result.pro_name,
            pro_name2:this.state.result.pro_name2,
            pro_deptcode:this.state.result.pro_deptcode,
            pro_princode:this.state.inputPrinCode,
            pro_ctrlcode:this.state.inputCtrlCode,
            pro_stsmargin:this.state.result.pro_stsmargin,
            pro_expdateyn:this.state.inputExpDateYN,
            pro_buypack:this.state.inputQtyPOMinType,
            pro_sellunit:this.state.result.pro_sellunit,
            pro_sellpack:this.state.inputSellCode,
            pro_medunit:this.state.result.pro_medunit,
            pro_medpack:this.state.inputMedCode,
            pro_barcodeyn:this.state.inputBarcodeYN,
            pro_minordpo:this.state.inputSellCode,
            pro_kelipatan:this.state.inputKelipatan,
            pro_noregyn:this.state.inputNoRegYN,
            pro_noreg:this.state.inputNoReg,
            pro_niedate:this.state.inputNIEDate,
            pro_ketnie:this.state.inputKetNIECode,
            pro_niesubmitbpom:this.state.result.pro_niesubmitbpom,
            pro_hrgspecialyn:this.state.result.pro_hrgspecialyn,
            pro_hrgspecial:this.state.result.pro_hrgspecial,
            pro_hetyn:this.state.result.pro_hetyn,
            pro_hetprice:this.state.result.pro_hetprice,
            pro_brandcode:this.state.inputBrandCode,
            pro_npdyn:this.state.inputNPDYN,
            pro_timbangyn:this.state.inputTimbangYN,
            pro_decoryn:this.state.inputDecorYN,
            pro_tabletyn:this.state.inputTabletYN,
            pro_monograf:this.state.inputMonografYN,
            pro_patenyn:this.state.inputPatenYN,
            pro_importyn:this.state.inputImportYN,
            pro_packyn:this.state.inputKemasanYN,
            pro_klasibpom:this.state.result.pro_klasibpom,
            pro_class:this.state.result.pro_class,
            pro_ipa:this.state.inputIPA,
            pro_valueipa:Number.parseInt(this.state.inputValueIPA),
            pro_ida:this.state.inputIDA,
            pro_valueida:Number.parseInt(this.state.inputValueIDA),
            pro_generikid:this.state.inputGenerikID,
            pro_terapiid:this.state.result.pro_terapiid,
            pro_strength:this.state.inputStrengthCode,
            pro_dsgform:this.state.inputDsgFormCode,
            pro_amount:this.state.inputAmount,
            pro_unit:this.state.inputUnit,
            pro_kdgenerik:this.state.inputKdGenerikCode,
            pro_firstactivity:this.state.result.pro_firstactivity,
            pro_surveyyn:this.state.inputSurveyYN,
            pro_prgdiscyn:this.state.result.pro_prgdiscyn,
            pro_citycodehja:this.state.result.pro_citycodehja,
            pro_saleprice:this.state.result.pro_saleprice,
            pro_salepricebox:this.state.result.pro_salepricebox,
            pro_salepricenon:this.state.result.pro_salepricenon,
            pro_salepricenonbox:this.state.result.pro_salepricenonbox,
            pro_hpp:this.state.result.pro_hpp,
            pro_score:this.state.result.pro_score,
            pro_margincomp:this.state.result.pro_margincomp,
            pro_keterangan:this.state.result.pro_keterangan,
            pro_buygrp:this.state.result.pro_buygrp,
            pro_activeyn:this.state.result.pro_activeyn,
            pro_userid:this.state.result.pro_userid,
            pro_lastupdate:this.state.result.pro_lastupdate,
            pro_dataaktifyn:this.state.result.pro_dataaktifyn,
            pro_homebrandyn:this.state.inputHomeBrandYN,
            pro_leadtime:this.state.result.pro_leadtime,
            pro_bufferyn:this.state.result.pro_bufferyn,
            pro_storagetemp:this.state.inputStorageCode,
            pro_clsproduct:this.state.inputClsProduct,
            pro_clsmargin:this.state.inputClsMargin,
            pro_inhealth:this.state.inputPTAsuransiInHealthCode,
            pro_codesup:this.state.result.pro_codesup,
            pro_pointmedpack:this.state.result.pro_pointmedpack,
            pro_pointsellpack:this.state.result.pro_pointsellpack,
            pro_pointdyn:this.state.result.pro_pointdyn,
            pro_pointdynx:this.state.result.pro_pointdynx,
            pro_pointdyno:this.state.result.pro_pointdyno,
            pro_pointdynv:this.state.result.pro_pointdynv,
            pro_bundleyn:this.state.result.pro_bundleyn,
            pro_bolehbundleyn:this.state.result.pro_bolehbundleyn,
            pro_nongenerikyn:this.state.inputNonGenerikYN,
            pro_nomorijinpro:this.state.inputNomorIjinProduk,
            pro_kategoripro:this.state.inputKategoriCode,
            pro_halalyn:this.state.inputHalalYN,
            pro_noserthalal:this.state.inputNoSertHalal,
            pro_halaldate:this.state.inputNoSertHalalBerlaku,
            pro_halal:this.state.inputHalalYN
        }

        axios.put('https://api.docnet.id/CHCMasterProduk/Product?kode='+this.props.activeProcode,TempJSON)
        .then((res)=>{
            this.getProdukDetail();
            this.componentDidMount();

            
        if (res.data.responseCode === 200){
            this.setState({
              responseHeader: "BERHASIL MENYUNTING DATA"
            })
          } else {
            this.setState({
              responseHeader: "GAGAL MENYUNTING DATA"
            })
          }
        });
        // console.log(TempJSON)
        this.toggleEditConfirmationModal();
    }

    checkboxListenerView = () => {
        var checkboxExpiredDate = document.getElementById("checkboxExpiredDate");
        var checkboxBarcodeDet = document.getElementById("checkboxBarcodeDet");
        var checkboxIPADet = document.getElementById("checkboxIPADet");
        var checkboxIDADet = document.getElementById("checkboxIDADet");
        var checkboxPrgDisc = document.getElementById("checkboxPrgDisc");
        var checkboxNonGenerik = document.getElementById("checkboxNonGenerik");
        var checkboxNPD = document.getElementById("checkboxNPD");
        var checkboxMono = document.getElementById("checkboxMono");
        var checkboxImport = document.getElementById("checkboxImport");
        var checkboxHomeBrand = document.getElementById("checkboxHomeBrand");
        var checkboxJualEceran = document.getElementById("checkboxJualEceran");
        var checkboxKemasan = document.getElementById("checkboxKemasan");
        var checkboxPaten = document.getElementById("checkboxPaten");
        var checkboxPsikotropika = document.getElementById("checkboxPsikotropika");
        var checkboxInHealthDet = document.getElementById("checkboxInHealthDet");
        var checkboxtidakbolehdijual = document.getElementById("checkboxtidakbolehdijual");
        var checkboxSurvey = document.getElementById("checkboxSurvey");
        var checkboxDecor = document.getElementById("checkboxDecor");
        var checkboxTimbang = document.getElementById("checkboxTimbang");

        var FormInputInHealthPT = document.getElementById("selectInHealthPT");
        var FormInputIPAValue = document.getElementById("inputIPADet");
        var FormInputIDAValue = document.getElementById("inputIDADet");
        var tableBarcodeDet = document.getElementById("tableBarcodeDet")

        if(this.state.result.pro_expdateyn === "Y"){
            checkboxExpiredDate.checked = true
        } else if(this.state.result.pro_expdateyn === "N"){
            checkboxExpiredDate.checked = false
        }

        if(this.state.result.pro_prgdiscyn === "Y"){
            checkboxPrgDisc.checked = true
        }else if(this.state.result.pro_prgdiscyn === "N"){
            checkboxPrgDisc.checked = false
        }

        if(this.state.result.pro_barcodeyn === "Y"){
            checkboxBarcodeDet.checked = true
            tableBarcodeDet.style.display = "inline"
        }else if(this.state.result.pro_barcodeyn === "N"){
            checkboxBarcodeDet.checked = false
            tableBarcodeDet.style.display = "none"
        }

        if(this.state.result.pro_ipa === "Y"){
            checkboxIPADet.checked = true
            FormInputIPAValue.disabled = false
        }else if(this.state.result.pro_ipa === "N"){
            checkboxIPADet.checked = false
            FormInputIPAValue.disabled = true
        }

        if(this.state.result.pro_ida === "Y"){
            checkboxIDADet.checked = true
            FormInputIDAValue.disabled = false
        }else if(this.state.result.pro_ida === "N"){
            checkboxIDADet.checked = false
            FormInputIDAValue.disabled = true
        }

        if(this.state.result.pro_nongenerikyn === "Y"){
            checkboxNonGenerik.checked = true
        }else if(this.state.result.pro_nongenerikyn === "N"){
            checkboxNonGenerik.checked = false
        }

        if(this.state.result.pro_npdyn === "Y"){
            checkboxNPD.checked = true
        }else if(this.state.result.pro_npdyn === "N"){
            checkboxNPD.checked = false
        }

        if(this.state.result.pro_monograf === "Y"){
            checkboxMono.checked = true
        }else if(this.state.result.pro_monograf === "N"){
            checkboxMono.checked = false
        }

        if(this.state.result.pro_patenyn === "Y"){
            checkboxPaten.checked = true
        }else if(this.state.result.pro_patenyn === "N"){
            checkboxPaten.checked = false
        }

        if(this.state.result.pro_importyn === "Y"){
            checkboxImport.checked = true
        }else if(this.state.result.pro_importyn === "N"){
            checkboxImport.checked = false
        }

        if(this.state.result.pro_packyn === "Y"){
            checkboxKemasan.checked = true
        }else if(this.state.result.pro_pack === "N"){
            checkboxKemasan.checked =false
        }

        if(this.state.result.pro_tabletyn === "Y"){
            checkboxJualEceran.checked = true
        }else if(this.state.result.pro_tabletyn === "N"){
            checkboxJualEceran.checked = false
        }

        if(this.state.result.pro_homebrandyn === "Y"){
            checkboxHomeBrand.checked = true
        }else if(this.state.result.pro_homebrandyn === "N"){
            checkboxHomeBrand.checked = false
        }

        if(this.state.inputGenerikPsikotropika === "Y"){
            checkboxPsikotropika.checked = true
        }else if(this.state.inputGenerikPsikotropika === "N"){
            checkboxPsikotropika.checked = false
        }

        if(this.state.result.pro_surveyyn === "Y"){
            checkboxSurvey.checked = true
        }else if(this.state.result.pro_surveyyn === "N"){
            checkboxSurvey.checked = false
        }

        if(this.state.result.pro_timbangyn === "Y"){
            checkboxTimbang.checked = true
        }else if(this.state.result.pro_timbangyn === "N"){
            checkboxTimbang.checked = false
        }

        if(this.state.result.pro_decoryn === "Y"){
            checkboxDecor.checked = true
        }else if(this.state.result.pro_decoryn === "N"){
            checkboxDecor.checked = false
        }
        
        if(this.state.inputTidakBolehDijual === "Y"){
            checkboxtidakbolehdijual.checked = true
        }else if(this.state.inputTidakBolehDijual === "N"){
            checkboxtidakbolehdijual.checked = false
        }

        if(this.state.result.pro_inhealth === "Y"){
            checkboxInHealthDet.checked = true
            FormInputInHealthPT.disabled = false
        }else if(this.state.result.pro_inhealth === "N"){
            checkboxInHealthDet.checked = false
            FormInputInHealthPT.disabled = true
        }
        
    }

    checkboxListener = () => {
        var checkboxExpiredDate = document.getElementById("checkboxExpiredDate");
        var checkboxBarcodeDet = document.getElementById("checkboxBarcodeDet");
        var checkboxIPADet = document.getElementById("checkboxIPADet");
        var checkboxIDADet = document.getElementById("checkboxIDADet");
        var checkboxNonGenerik = document.getElementById("checkboxNonGenerik");
        var checkboxNPD = document.getElementById("checkboxNPD");
        var checkboxMono = document.getElementById("checkboxMono");
        var checkboxImport = document.getElementById("checkboxImport");
        var checkboxHomeBrand = document.getElementById("checkboxHomeBrand");
        var checkboxJualEceran = document.getElementById("checkboxJualEceran");
        var checkboxKemasan = document.getElementById("checkboxKemasan");
        var checkboxPaten = document.getElementById("checkboxPaten");
        var checkboxInHealthDet = document.getElementById("checkboxInHealthDet");
        var checkboxSurvey = document.getElementById("checkboxSurvey");
        var checkboxDecor = document.getElementById("checkboxDecor");
        var checkboxTimbang = document.getElementById("checkboxTimbang");

        var FormInputInHealthPT = document.getElementById("selectInHealthPT");
        var FormInputIPAValue = document.getElementById("inputIPADet");
        var FormInputIDAValue = document.getElementById("inputIDADet");
        var tableBarcodeDet = document.getElementById("tableBarcodeDet")

        if(checkboxExpiredDate.checked === true){
            this.setState({
                inputExpDateYN:'Y'
            })
        }else if(checkboxExpiredDate.checked === false){
            this.setState({
                inputExpDateYN:'N'
            })
        }

        if(checkboxBarcodeDet.checked === true){
            tableBarcodeDet.style.display = "inline"
            this.setState({
                inputBarcodeYN:'Y'
            })
        }else if(checkboxBarcodeDet.checked === false){
            tableBarcodeDet.style.display = "none"
            this.setState({
                inputBarcodeYN:'N'
            })
        }

        if(checkboxIPADet.checked === true){
            this.setState({
                inputIPA:'Y'
            })
            FormInputIPAValue.disabled = false
        }else if(checkboxIPADet.checked === false){
            this.setState({
                inputIPA:'N'
            })
            FormInputIPAValue.disabled = true
        }

        if(checkboxIDADet.checked === true){
            this.setState({
                inputIDA:'Y'
            })
            FormInputIDAValue.disabled = false
        }else if(checkboxIDADet.checked === false){
            this.setState({
                inputIDA:'N'
            })
            FormInputIDAValue.disabled = true
        }

        if(checkboxNonGenerik.checked === true){
            this.setState({
                inputNonGenerikYN:'Y'
            })
        }else if(checkboxNonGenerik.checked === false){
            this.setState({
                inputNonGenerikYN:'N'
            })
        }

        if(checkboxNPD.checked === true){
            this.setState({
                inputNPDYN:'Y'
            })
        }else if(checkboxNPD.checked === false){
            this.setState({
                inputNPDYN:'N'
            })
        }

        if(checkboxMono.checked === true){
            this.setState({
                inputMonografYN:'Y'
            })
        }else if(checkboxExpiredDate.checked === false){
            this.setState({
                inputMonografYN:'N'
            })
        }

        if(checkboxImport.checked === true){
            this.setState({
                inputImportYN:'Y'
            })
        }else if(checkboxImport.checked === false){
            this.setState({
                inputImportYN:'N'
            })
        }

        if(checkboxHomeBrand.checked === true){
            this.setState({
                inputHomeBrandYN:'Y'
            })
        }else if(checkboxHomeBrand.checked === false){
            this.setState({
                inputHomeBrandYN:'N'
            })
        }

        if(checkboxJualEceran.checked === true){
            this.setState({
                inputTabletYN:'Y'
            })
        }else if(checkboxJualEceran.checked === false){
            this.setState({
                inputTabletYN:'N'
            })
        }
        if(checkboxKemasan.checked === true){
            this.setState({
                inputKemasanYN:'Y'
            })
        }else if(checkboxKemasan.checked === false){
            this.setState({
                inputKemasanYN:'N'
            })
        }

        if(checkboxPaten.checked === true){
            this.setState({
                inputPatenYN:'Y'
            })
        }else if(checkboxPaten.checked === false){
            this.setState({
                inputPatenYN:'N'
            })
        }

        if(checkboxInHealthDet.checked === true){
            FormInputInHealthPT.disabled = false
            this.setState({
                inputInHealthYN:'Y'
            })
        }else if(checkboxInHealthDet.checked === false){
            FormInputInHealthPT.disabled = true
            this.setState({
                inputInHealthYN:'N'
            })
        }

        if(checkboxSurvey.checked === true){
            this.setState({
                inputSurveyYN:'Y'
            })
        }else if(checkboxSurvey.checked === false){
            this.setState({
                inputSurveyYN:'N'
            })
        }

        if(checkboxDecor.checked === true){
            this.setState({
                inputDecorYN:'Y'
            })
        }else if(checkboxDecor.checked === false){
            this.setState({
                inputDecorYN:'N'
            })
        }

        if(checkboxTimbang.checked === true){
            this.setState({
                inputTimbangYN:'Y'
            })
        }else if(checkboxTimbang.checked === false){
            this.setState({
                inputTimbangYN:'N'
            })
        }
    }

    nomorIjinProdukHandler = () => {
        var nomorIjinProdukValue = this.state.inputNomorIjinProduk;
        var noRegFormGroup = document.getElementById("noRegFormGroupDet");
        var noRegBerlakuFormGroup = document.getElementById("noRegBerlakuFormGroupDet");
        var checkboxNoRegDet = document.getElementById("checkboxNoRegDet")

        if (nomorIjinProdukValue === "Y"){
            noRegFormGroup.style.visibility = "visible"
            noRegBerlakuFormGroup.style.visibility = "visible"
            checkboxNoRegDet.checked = true
            this.setState({
                inputNoRegYN:'Y'
            })
           
        }
        else if(nomorIjinProdukValue === "N"){
            noRegFormGroup.style.visibility = "hidden"
            noRegBerlakuFormGroup.style.visibility = "hidden"
            checkboxNoRegDet.checked = false
            this.setState({
                inputNoRegYN:'N'
            })
        }
    }

    keteranganNIEHandler = () => {
        var keteranganNIEValue = this.state.inputKetNIECode;
        var inputTglBPOM = document.getElementById("inputFormTglSubmitBPOM");
        
        if (keteranganNIEValue === '1'){
            inputTglBPOM.style.visibility = "visible"
        }else if(keteranganNIEValue === '2' || '3'){
            inputTglBPOM.style.visibility = "hidden"
        }
    }

    HalalHandler = () =>{
        var HalalInputValue = this.state.inputHalalYN;
        var HalalNoSert = document.getElementById("FormInputNoSertHalal");
        var HalalNoSertBerlaku = document.getElementById("FormInputNoSertHalalBerlaku");

        if(HalalInputValue === "Y"){
            HalalNoSert.style.visibility = "visible"
            HalalNoSertBerlaku.style.visibility = "visible"
        }else if(HalalInputValue === "N"){
            HalalNoSert.style.visibility = "hidden"
            HalalNoSertBerlaku.style.visibility = "hidden"
        }
    }

    enableAllInput = () => {
        var fsPrincipal = document.getElementById("fsPrincipal");
        var fsProconExpDate = document.getElementById("fsProconExpDate");
        var fsBarcode = document.getElementById("fsBarcode");
        var fsQTYPOMin = document.getElementById("fsQTYPOMin");
        var fsNoIjinProduk = document.getElementById("fsNoIjinProduk");
        var fsNoReg = document.getElementById("fsNoReg");
        var fsNoRegBerlaku = document.getElementById("fsNoRegBerlaku");
        var fsNonGenerik = document.getElementById("fsNonGenerik");
        var fsKelipatan = document.getElementById("fsKelipatan");
        var fsIPA = document.getElementById("fsIPA");
        var fsIDA = document.getElementById("fsIDA");
        var fsKetNIE = document.getElementById("fsKetNIE");
        var fsHalal = document.getElementById("fsHalal");
        var fsNoSertBerlaku = document.getElementById("fsNoSertBerlaku");
        var fsNoSertHalal =  document.getElementById("fsNoSertHalal");
        var fsKdBrand = document.getElementById("fsKdBrand");
        var fsNPDMonografImportHomeBrand = document.getElementById("fsNPDMonografImportHomeBrand");
        var fsJualEceranKemasanPatenPsikotropika = document.getElementById("fsJualEceranKemasanPatenPsikotropika");

         var fsGenerik = document.getElementById("fsGenerik");
         var fsStrengthDsgForm = document.getElementById("fsStrengthDsgForm");
         var fsAmount = document.getElementById("fsAmount");
         var fsKdGenerik = document.getElementById("fsKdGenerik");
         var fsStorage = document.getElementById("fsStorage");
         var fsFirstDate = document.getElementById("fsFirstDate");
         var fsInHealth = document.getElementById("fsInHealth");
         var fsKategoriProduk = document.getElementById("fsKategoriProduk");
         var fsTidakDijualSurveyDekorTimbang = document.getElementById("fsTidakDijualSurveyDekorTimbang");

        
        if(this.state.value === 0){
            this.setState({
                value: 1
            })
        }

        fsProconExpDate.disabled = false;
        fsFirstDate.disabled = false;
        fsNoIjinProduk.disabled = false;
        fsNoRegBerlaku.disabled = false;
        fsNoReg.disabled = false;
        fsTidakDijualSurveyDekorTimbang.disabled = false;
        fsPrincipal.disabled = false;
        fsNonGenerik.disabled = false;
        fsKdBrand.disabled = false;
        fsNPDMonografImportHomeBrand.disabled = false;
        fsIPA.disabled = false;
        fsIDA.disabled = false;
        fsKelipatan.disabled  = false;
        fsBarcode.disabled  = false;
        fsQTYPOMin.disabled = false;
        fsInHealth.disabled = false;
        fsGenerik.disabled = false;
        fsStrengthDsgForm.disabled = false;
        fsAmount.disabled = false;
        fsKdGenerik.disabled  = false;
        fsStorage.disabled= false;
        fsJualEceranKemasanPatenPsikotropika.disabled  = false;
        fsKategoriProduk.disabled = false;
        fsHalal.disabled = false;
        fsNoSertBerlaku.disabled = false;
        fsNoSertHalal.disabled = false;
        fsKetNIE.disabled = false;

    }

    disableAllInput = () =>{

        var fsProduct = document.getElementById("fsProduct");
        var fsProdes2 = document.getElementById("fsProdes2");
        var fsDepartment = document.getElementById("fsDepartment");
        var fsPrincipal = document.getElementById("fsPrincipal");
        var fsProconExpDate = document.getElementById("fsProconExpDate");
        var fsPrgDiscount = document.getElementById("fsPrgDiscount");
        var fsBuySellMedPackMinOrdOut = document.getElementById("fsBuySellMedPackMinOrdOut");
        var fsBarcode = document.getElementById("fsBarcode");

        var fsQTYPOMin = document.getElementById("fsQTYPOMin");
        var fsNoIjinProduk = document.getElementById("fsNoIjinProduk");
        var fsNoReg = document.getElementById("fsNoReg");
        var fsNoRegBerlaku = document.getElementById("fsNoRegBerlaku");
        var fsNonGenerik = document.getElementById("fsNonGenerik");
        var fsKelipatan = document.getElementById("fsKelipatan");
        var fsIPA = document.getElementById("fsIPA");
        var fsIDA = document.getElementById("fsIDA");
        var fsKetNIE = document.getElementById("fsKetNIE");
        var fsTglBPOMDet = document.getElementById("fsTglBPOMDet");
        var fsHalal = document.getElementById("fsHalal");
        var fsNoSertBerlaku = document.getElementById("fsNoSertBerlaku");
        var fsPoinSellAsliScore = document.getElementById("fsPoinSellAsliScore");
        var fsKdBrand = document.getElementById("fsKdBrand");
        var fsClassMargin = document.getElementById("fsClassMargin");
        var fsClassProduct = document.getElementById("fsClassProduk");
        var fsNPDMonografImportHomeBrand = document.getElementById("fsNPDMonografImportHomeBrand");
        var fsJualEceranKemasanPatenPsikotropika = document.getElementById("fsJualEceranKemasanPatenPsikotropika");


         var fsKlaBPOM = document.getElementById("fsKlaBPOM");
         var fsGenerik = document.getElementById("fsGenerik");
         var fsStrengthDsgForm = document.getElementById("fsStrengthDsgForm");
         var fsAmount = document.getElementById("fsAmount");
         var fsKdGenerik = document.getElementById("fsKdGenerik");
         var fsStorage = document.getElementById("fsStorage");
         var fsFirstDate = document.getElementById("fsFirstDate");
         var fsLastUpdate = document.getElementById("fsLastUpdate");
         var fsInHealth = document.getElementById("fsInHealth");
         var fsKategoriProduk = document.getElementById("fsKategoriProduk");
         var fsTidakDijualSurveyDekorTimbang = document.getElementById("fsTidakDijualSurveyDekorTimbang");

        if(this.state.value === 1){
            this.setState({
                value:0
            })
        }

        fsProduct.disabled = true;
        fsProdes2.disabled =  true;
        fsDepartment.disabled = true;
        fsPrincipal.disabled = true;
        fsProconExpDate.disabled = true;
        fsPrgDiscount.disabled = true;
        fsBuySellMedPackMinOrdOut.disabled = true;
        fsBarcode.disabled = true;

        fsQTYPOMin.disabled = true;
        fsNoIjinProduk.disabled = true;
        fsNoReg.disabled = true;
        fsNoRegBerlaku.disabled = true;
        fsNonGenerik.disabled = true;
        fsKelipatan.disabled = true;
        fsIPA.disabled = true;
        fsIDA.disabled = true;
        fsKetNIE.disabled = true;
        fsTglBPOMDet.disabled = true;
        fsHalal.disabled = true;
        fsNoSertBerlaku.disabled = true;
        fsPoinSellAsliScore.disabled = true;
        fsKdBrand.disabled = true;
        fsClassProduct.disabled = true;
        fsClassMargin.disabled = true;
        fsNPDMonografImportHomeBrand.disabled = true;
        fsJualEceranKemasanPatenPsikotropika.disabled = true;

        fsKlaBPOM.disabled = true;
        fsGenerik.disabled = true;
        fsStrengthDsgForm.disabled = true;
        fsAmount.disabled = true;
        fsKdGenerik.disabled = true;
        fsStorage.disabled = true;
        fsFirstDate.disabled = true;
        fsLastUpdate.disabled = true;
        fsInHealth.disabled = true;
        fsKategoriProduk.disabled = true;
        fsTidakDijualSurveyDekorTimbang.disabled = true;

        this.props.func();
    }

    handleChange = (type, event) => {
        //Principal
        if(type === "editPrincipal"){
            this.setState({
                inputPrinCode:event.target.value
            })
        }
        //Procon
        if(type === "editProcon"){
            this.setState({
                inputCtrlCode: event.target.value
            })
        }

        //Nomor Ijin Produk
        if(type === "editNoIjinProduk"){
            this.setState({
                inputNomorIjinProduk:event.target.value
            },()=>this.nomorIjinProdukHandler())
        }

        //Barcode
        if(type === "inputBarcode"){
            if(this.state.barcode && !this.state.barcode.length){
                this.setState({
                    inputBarcode:event.target.value
                })
            }
            else if(this.state.barcode && this.state.barcode.length){
                const [lastBarcodeArr] = this.state.barcode.slice(-1)
                const lastBarcodeVal = lastBarcodeArr.bID
                this.setState({
                    lastBarcodeId:lastBarcodeVal
                })
                this.setState({
                    inputBarcode: event.target.value,
                    lastBarcodeId:lastBarcodeVal+1
                })
            }
        }
       
        //QtyPOMinval
        if(type === "editQTYPOvalue"){
            this.setState({
                inputQtyPOMinValue:event.target.value
            })
        }

        //QtyPOMinType
        if(type === "EditQTYPoType"){
            this.setState({
                inputSellCode:event.target.value
            })
        }

        //NoReg
        if(type === "editNoReg"){
            this.setState({
                inputNoReg:event.target.value
            })
        }

        //NoRegBerlaku
        if(type === "editNoRegBerlaku"){
            this.setState({
                inputNIEDate:event.target.value
            })
        }

        //Kelipatan
        if(type === "editKelipatan"){
            this.setState({
                inputKelipatan:event.target.value
            })
        }

        //IPA
        if(type === "editIPAValue"){
            this.setState({
                inputValueIPA:event.target.value
            })
        }

        //IDA
        if(type === "editIDAValue"){
            this.setState({
                inputValueIDA:event.target.value
            })
        }

        //KetNIE
        if(type === "editKetNIE"){
            this.setState({
                inputKetNIECode:event.target.value
            },()=>this.keteranganNIEHandler())
        }
        //Non-Generik
        if(type === "editNonGenerik"){
            this.setState({
                inputNonGenerikYN:event.target.value
            })
        }
        //Halal
        if(type === "editHalalYN"){
            this.setState({
                inputHalalYN:event.target.value
            },()=>this.HalalHandler())
        }
        //NoSertHalal
        if(type === "editNoSertHalal"){
            this.setState({
                inputNoSertHalal:event.target.value
            })
        }

        //NoSertHalalBerlaku
        if(type === "editNoSertHalalBerlaku"){
            this.setState({
                inputNoSertHalalBerlaku:event.target.value
            })
        }
        //KdBrand
        if(type === "editKdBrand"){
            this.setState({
                inputBrandCode:event.target.value
            })
        }
        //Generik
        if(type === "editGenerik"){
            this.setState({
                inputGenerikID:event.target.value
            })
        }

        //Strength
        if(type === "editStrength"){
            this.setState({
                inputStrengthCode:event.target.value
            })
        }
        //DsgForm
        if(type === "editDossage"){
            this.setState({
                inputDsgFormCode:event.target.value
            })
        }
        //Amount
        if(type === "editAmount"){
            this.setState({
                inputAmount:event.target.value
            })
        }

        if(type === "editAmountUnit"){
            this.setState({
                inputUnit:event.target.value
            })
        }

        //firstdate
        if(type === "editfirstdate"){
            this.setState({
                inputFirstDate:event.target.value
            })
        }

        //Storage
        if(type === "editstorage"){
            this.setState({
                inputStorageCode:event.target.value
            })
        }

        //KdGenerik
        if(type === "editkdgenerik"){
            this.setState({
                inputKdGenerikCode:event.target.value
            })
        }

        //Kategori Produk
        if(type === "editkategoriproduk"){
            this.setState({
                inputKategoriCode:event.target.value
            })
        }

        //InHealth
        if(type==="editinhealth"){
            this.setState({
                inputPTAsuransiInHealthCode:event.target.value
            })
        }
    }

    refreshPage = () => {
        this.props.func();
    }

    state =  {
        editConfirmationModalIsOpen: false,
        addBarcodeModalIsOpen: false,
        responseModalIsOpen: false,
    }

    toggleEditConfirmationModal = () => {
        this.setState({
          editConfirmationModalIsOpen: !this.state.editConfirmationModalIsOpen,
          responseModalIsOpen: this.state.responseModalIsOpen,
          addBarcodeModalIsOpen: this.state.addBarcodeModalIsOpen,
        })
    }
    
    toggleAddBarcodeModal = () => {
        this.setState({
            editConfirmationModalIsOpen: this.state.addConfirmationModalIsOpen,
            responseModalIsOpen: this.state.responseModalIsOpen,
            addBarcodeModalIsOpen: !this.state.addBarcodeModalIsOpen,
        })
    }
    
    toggleResponseModal = () => {
        this.setState({
          editConfirmationModalIsOpen: this.state.editConfirmationModalIsOpen,
          responseModalIsOpen: !this.state.responseModalIsOpen,
          addBarcodeModalIsOpen: this.state.addBarcodeModalIsOpen,
        })
    }

    render(){

        const {
            result, value,barcodeValue, proconStatus, 
            comco, classProduct,classMargin, barcode,nomorIjinProduk,halal, principalList, activeDeptList, activePackList, keteranganNIE,
            kdBrandList, klaBPOM, activeGenerikList,strengthList,dossagFormList,
            jenisObat,storage,companyList,productCategory
        } = this.state;

        return(
            <div>
                {/* Edit Confirmation Modal */}
                <Modal
                isOpen={this.state.editConfirmationModalIsOpen}
                >
                    <ModalHeader
                    toggle={this.toggleEditConfirmationModal.bind(this)}
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
                        onClick={ ()=>this.editProdukDetail() }
                        ><MdDone
                        style={{
                            marginRight: "5"
                        }}
                        />Ya
                        </Button>

                        <Button
                        color="secondary"
                        onClick={this.toggleEditConfirmationModal.bind(this)}
                        ><MdClose
                        style={{
                            marginRight: "5"
                        }}
                        />Tidak
                        </Button>

                    </ModalFooter>

                </Modal>
                {/* Edit Confirmation Modal */}

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
                                marginBottom: "0.5%"
                            }}
                            >
                                <fieldset
                                disabled
                                id="fsProduct"
                                style={{
                                    width:"100%"
                                }}>
                                <Label 
                                sm={3}
                                style={{
                                    width:"17%"
                                }}>
                                    Product
                                </Label>
                                
                                <Input
                                placeholder = "ID 1"
                                maxLength={7}
                                value = {result.pro_code}
                                style={{
                                    width: "10%",
                                    display: "inline"
                                }}
                                />

                                <Input
                                placeholder = "ID 2"
                                style={{
                                    width: "10%",
                                    display: "inline"
                                }}
                                />

                                <Input
                                placeholder = "ID 3"
                                maxLength={10}
                                value={result.pro_codesup}
                                style={{
                                    width: "10%",
                                    display: "inline"
                                }}
                                />

                                <Input
                                placeholder = "Nama Produk"
                                maxLength={100}
                                value={result.pro_name}
                                style={{
                                    width: "40%",
                                    display: "inline"
                                }}
                                />
                                </fieldset>
                            </FormGroup>
                            {/* Product */}

                            {/* Prodes2 */}
                            <FormGroup 
                            row
                            style={{
                                marginBottom: "0px",
                            }}
                            >
                                <fieldset
                                disabled
                                id="fsProdes2"
                                style={{
                                    width:"100%"
                                }}>
                                <Label 
                                sm={3}
                                style={{
                                    width:"17%"
                                }}>
                                    Prodes2
                                </Label>
                                
                                <Input
                                placeholder = "ID 1"
                                maxLength={100}
                                value={result.pro_name2}
                                style={{
                                    width: "70%",
                                    display: "inline"
                                }}
                                />
                                </fieldset>
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
                                marginTop:"2%"
                            }}
                            >
                                {/* Department */}
                                <FormGroup 
                                row
                                style={{
                                    marginBottom: "1%",
                                }}
                                >
                                    <fieldset
                                    disabled
                                    id="fsDepartment"
                                    style={{
                                        width:"100%",
                                        float:"right"
                                    }}>
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
                                        value={this.state.inputDeptCode}
                                        >
                                            {activeDeptList.map(
                                                adl =>
                                                <option value={adl.dept_code}>{adl.dept_code} - {adl.dept_name}</option>
                                            )} 
                                        </select>
                                    </fieldset>
                                </FormGroup>
                                {/* Department */}

                                {/* Principal */}
                                <FormGroup 
                                row
                                style={{
                                    marginBottom: "0px",
                                }}
                                >
                                    <fieldset
                                    disabled
                                    id="fsPrincipal"
                                    style={{
                                        width:"100%",
                                        float:"right"
                                    }}>
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
                                        value={this.state.inputPrinCode}
                                        onChange = {(e)=>this.handleChange("editPrincipal",e)}
                                        >
                                            {principalList.map(
                                                pl =>
                                                <option value={pl.Pri_Code}>{pl.Pri_Code} - {pl.Pri_Name}</option>
                                            )} 
                                        </select>

                                    </fieldset>
                                </FormGroup>
                                {/* Principal */}
                            </Form>
                            {/* Department & Principal */}

                            {/* Procon, Sts Margin, Exp. Date & Prg Discount */}
                            <Form
                            style={{
                                width: "50%",
                                float: "right",
                                marginTop:"2%"
                            }}
                            >
                                <FormGroup inline>
                                    {/* Procon */}
                                    <fieldset
                                    disabled
                                    id="fsProconExpDate"
                                    style={{
                                        width:"100%",
                                        float:"right"
                                    }}>
                                    <Label sm={3}>
                                        Procon
                                    </Label>

                                    {
                                        value === 0 
                                        && 
                                        <select
                                        className = "custom-select"
                                        style = {{
                                            width: "30%",
                                            display:"inline",
                                            marginRight: "5%",
                                        }}
                                        value={this.state.inputCtrlCode}
                                        >
                                            {proconStatus.map(
                                                ps =>
                                                <option value={ps.statusId}>{ps.statusName}</option>
                                            )} 
                                        </select>
                                    }

                                    {
                                        value === 1 
                                        &&
                                        <select
                                        className = "custom-select"
                                        style = {{
                                            width: "30%",
                                            display:"inline",
                                            marginRight: "5%",
                                        }}
                                        onChange={(e)=>this.handleChange("editProcon",e)}
                                        >
                                            {proconStatus.map(
                                                ps =>
                                                <option value={this.state.inputCtrlCode}>{ps.statusName}</option>
                                            )} 
                                        </select>
                                    }
                                    {/* Procon */}

                                    {/* Expired Date */}
                                    <FormGroup 
                                    inline 
                                    check
                                    >
                                        <Label check>
                                            <Input type="checkbox"
                                            id="checkboxExpiredDate"
                                            onChange={()=>this.checkboxListener()}
                                            />Exp. Date
                                        </Label>
                                    </FormGroup>
                                    {/* Expired Date */}
                                    </fieldset>
                                </FormGroup>       

                                <FormGroup inline>
                                   
                                    {/* Prg Discount */}
                                    <FormGroup 
                                    inline
                                    check
                                    >
                                        <fieldset
                                        disabled
                                        id="fsPrgDiscount"
                                        style={{
                                            width:"100%",
                                            marginTop:"5%"
                                        }}>
                                        <Label check>
                                            <Input type="checkbox"
                                            id="checkboxPrgDisc"/>Prg Discount
                                        </Label>
                                        </fieldset>
                                    </FormGroup>
                                    {/* Prg Discount */}
                                </FormGroup>                  

                            </Form>
                            {/* Procon, Sts Margin, Exp. Date & Prg Discount */}
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
                                    <fieldset
                                    disabled
                                    id="fsBuySellMedPackMinOrdOut"
                                    style={{
                                        width:"100%"
                                    }}>

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
                                        value={1}
                                        style={{
                                            width: "20%",
                                            display: "inline",
                                        }}
                                        />

                                    {
                                        value === 0 
                                        && 
                                        <select
                                        className = "custom-select"
                                        style = {{
                                            width: "30%",
                                            marginRight: "5%",
                                            display:"inline"
                                        }}
                                        value={result.pro_buypack}
                                        >
                                            {activePackList.map(
                                                apl =>
                                                <option value={apl.pack_code}>{apl.pack_name}</option>
                                            )} 
                                        </select>
                                    }
                                    
                                    {
                                        value === 1 
                                        && 
                                        <select
                                        className = "custom-select"
                                        style = {{
                                            width: "30%",
                                            marginRight: "5%",
                                            display:"inline"
                                        }}
                                        value={result.pro_buypack}
                                        >
                                            {activePackList.map(
                                                apl =>
                                                <option value={apl.pack_code}>{apl.pack_name}</option>
                                            )} 
                                        </select>
                                    }                     
                                        
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
                                        type="number"
                                        value={result.pro_sellunit}
                                        style={{
                                            width: "20%",
                                            display: "inline"
                                        }}
                                        />
                                        {
                                            value === 0 
                                            && 
                                            <select
                                            className = "custom-select"
                                            style = {{
                                                width: "30%",
                                                marginRight: "5%",
                                                display:"inline"
                                            }}
                                            value={result.pro_sellpack}
                                            >
                                                {activePackList.map(
                                                    apl =>
                                                    <option value={apl.pack_code}>{apl.pack_name}</option>
                                                )} 
                                            </select>
                                        }

                                        {
                                            value === 1
                                            && 
                                            <select
                                            className = "custom-select"
                                            style = {{
                                                width: "30%",
                                                marginRight: "5%",
                                                display:"inline"
                                            }}
                                            value={result.pro_sellpack}
                                            >
                                                {activePackList.map(
                                                    apl =>
                                                    <option value={apl.pack_code}>{apl.pack_name}</option>
                                                )} 
                                            </select>
                                        }        
                                        
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
                                        type="number"
                                        value={result.pro_medunit}
                                        style={{
                                            width: "20%",
                                            display: "inline"
                                        }}
                                        />

                                        {
                                            value === 0 
                                            && 
                                            <select
                                            className = "custom-select"
                                            style = {{
                                                width: "30%",
                                                marginRight: "5%",
                                                display:"inline"
                                            }}
                                            value={result.pro_medpack}
                                            >
                                                {activePackList.map(
                                                    apl =>
                                                    <option value={apl.pack_code}>{apl.pack_name}</option>
                                                )} 
                                            </select>
                                        }

                                        {
                                            value === 1 
                                            && 
                                            <select
                                            className = "custom-select"
                                            style = {{
                                                width: "30%",
                                                marginRight: "5%",
                                                display:"inline"
                                            }}
                                            value={result.pro_medpack}
                                            >
                                                {activePackList.map(
                                                    apl =>
                                                    <option value={apl.pack_code}>{apl.pack_name}</option>
                                                )} 
                                            </select>
                                        } 
                                        
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
                                            Min Ord Pack
                                        </Label>

                                        <Input
                                        disabled
                                        value={1}
                                        style={{
                                            width: "20%",
                                            display: "inline"
                                        }}
                                        />
                                        {
                                            value === 0 
                                            && 
                                            <select
                                            className = "custom-select"
                                            style = {{
                                                width: "30%",
                                                marginRight: "5%",
                                                display:"inline"
                                            }}
                                            value={result.pro_buypack}
                                            >
                                                {activePackList.map(
                                                    apl =>
                                                    <option value={apl.pack_code}>{apl.pack_name}</option>
                                                )} 
                                            </select>
                                        }

                                        {
                                            value === 1 
                                            && 
                                            <select
                                            className = "custom-select"
                                            style = {{
                                                width: "30%",
                                                marginRight: "5%",
                                                display:"inline"
                                            }}
                                            value={result.pro_buypack}
                                            >
                                                {activePackList.map(
                                                    apl =>
                                                    <option value={apl.pack_code}>{apl.pack_name}</option>
                                                )} 
                                            </select>
                                        }
                                    </FormGroup>
                                    {/* Min Ord Out */}
                                    </fieldset>
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
                                }}>
                                     <fieldset
                                        disabled
                                        id="fsBarcode">
                                    <FormGroup
                                    inline
                                    check>
                                        <Label check>
                                            <Input
                                            id="checkboxBarcodeDet"
                                            type="checkbox"
                                            onChange={()=>this.checkboxListener()}
                                            />Barcode
                                        </Label>
                                    </FormGroup>

                                    <Table
                                    bordered
                                    responsive
                                    disabled
                                    id="tableBarcodeDet"
                                    style={{
                                        height: "20%",
                                        marginTop: "10px",
                                        display: "none"
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
                                                    { barcodeValue === 1 && barcode.map((b) =>
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

                                    <Button
                                            color={"primary"}
                                            onClick = {this.toggleAddBarcodeModal.bind(this)}
                                            id="addbarcode"
                                            style={{
                                                marginTop:"2%",
                                                visibility:"hidden"
                                            }}
                                            >
                                                <MdAdd/>
                                                Tambah
                                            </Button>
                                    </fieldset>
                                </Form>
                            </Form>
                        </Form>

                        <hr/>

                        {/* Qty PO Min & Nomor Ijin Produk */}
                        <Form
                        style={{
                            marginTop: "5%"
                        }}>
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
                                    width:"100%"
                                }}
                                >
                                    <fieldset
                                    disabled
                                    id="fsQTYPOMin"
                                    style={{
                                        width:"100%"
                                    }}>
                                    <Label 
                                    sm={4}
                                    style={{
                                        width:"25%",
                                        float:"left"
                                    }}>
                                        Qty PO Min
                                    </Label>

                                    {
                                        value === 0 
                                        && 
                                        <Input
                                        value={this.state.inputQtyPOMinValue}
                                        style={{
                                            width: "20%",
                                            display: "inline",
                                            marginLeft: "6%",
                                            float:"left"
                                        }}
                                        />
                                        
                                    }
                                    
                                    {
                                        value === 1 
                                        && 
                                        <Input
                                        value={this.state.inputQtyPOMinValue}
                                        style={{
                                            width: "20%",
                                            display: "inline",
                                            marginLeft: "6%",
                                            float:"left"
                                        }}
                                        onChange={(e)=>this.handleChange("editQTYPOvalue",e)}
                                        />
                                    }

                                         <select
                                            className = "custom-select"
                                            style = {{
                                                width: "30%",
                                                marginRight: "5%",
                                                display:"inline",
                                                float:"left"
                                            }}
                                            onChange={(e)=>this.handleChange("editQTYPOType",e)}
                                            value={this.inputQtyPOMinType}
                                            >
                                                {activePackList.map(
                                                    apl =>
                                                    <option value={apl.pack_code}>{apl.pack_name}</option>
                                                )} 
                                            </select>
                                    </fieldset>
                                </FormGroup>
                                {/* Qty PO Min */}

                                {/* Nomor Ijin Produk */}
                                <FormGroup 
                                row
                                style={{
                                    marginBottom: "0px",
                                    width:"100%",
                                    marginTop:"2%"
                                }}
                                >
                                    <fieldset
                                    disabled
                                    id="fsNoIjinProduk"
                                    style={{
                                        width:"100%"
                                    }}>
                                    <Label 
                                    sm={4}
                                    style={{
                                        width:"30%",
                                        float:"left",
                                        marginRight:"1%"
                                    }}>
                                        Nomor Ijin Produk:
                                    </Label>

                                    {
                                        value === 0 && 
                                        <select
                                        className = "custom-select"
                                        style = {{
                                            width: "50%",
                                            display:"inline",
                                            marginRight:"5%",
                                            float:"center"
                                        }}
                                        value={this.state.inputNomorIjinProduk}
                                        >
                                            {nomorIjinProduk.map(
                                                nip =>
                                                <option value={nip.nipId}>{nip.nipStatus}</option>
                                            )} 
                                        </select>
                                    }

                                    {
                                        value === 1 
                                        && 
                                        <select
                                        id="selectNomorIjinProdukDet"
                                        className = "custom-select"
                                        style = {{
                                            width: "50%",
                                            display:"inline",
                                            marginRight:"5%",
                                            float:"center"
                                        }}
                                        value={this.state.inputNomorIjinProduk}
                                        onChange={(e)=>this.handleChange("editNoIjinProduk",e)}
                                        >
                                            {nomorIjinProduk.map(
                                                nip =>
                                                <option value={nip.nipId}>{nip.nipStatus}</option>
                                            )} 
                                        </select>
                                    }
                                    </fieldset>
                                </FormGroup>
                                {/* Nomor Ijin Produk */}

                                {/* No. Reg */}
                                <FormGroup
                                inline 
                                check
                                id="noRegFormGroupDet"
                                style={{
                                    marginBottom: "5%",
                                    visibility: "hidden",
                                    width:"100%"
                                }}
                                >
                                    <fieldset
                                    disabled
                                    id="fsNoReg"
                                    style={{
                                        width:"100%",
                                        marginTop:"2%"
                                    }}
                                    >
                                    <Label 
                                    inline
                                    sm={6}
                                    style={{
                                        width:"25%",
                                        float:"left",
                                        marginRight:"3%"
                                    }}>
                                        <Input 
                                        id="checkboxNoRegDet"
                                        type="checkbox"
                                        disabled = "true"
                                        />
                                        No. Reg
                                    </Label>

                                    <Input
                                    inline
                                    value={this.state.inputNoReg}
                                    maxLength={50}
                                    id="inputNoRegDet"
                                    style={{
                                        float:"center",
                                        width:"50%",
                                    }}
                                    onChange={(e)=>this.handleChange("editNoReg",e)}
                                    />
                                    </fieldset>
                                </FormGroup>
                                {/* No. Reg */}

                                {/* No. Reg Berlaku s/d */}
                                <FormGroup 
                                row
                                id = "noRegBerlakuFormGroupDet"
                                style={{
                                    marginBottom: "0px",
                                    visibility: "hidden",
                                    width:"100%"
                                }}
                                >
                                    <fieldset
                                    disabled
                                    id="fsNoRegBerlaku"
                                    style={{
                                        width:"100%"
                                    }}>
                                    
                                    <Label 
                                    sm={4}
                                    style={{
                                        float:"left",
                                        width:"30%",
                                        marginRight:"1%"
                                    }}>
                                        No. Reg Berlaku s/d:
                                    </Label>

                                    {
                                        value === 0 
                                        && 
                                        <Input
                                        type="datetime"
                                        value={dateFormat(result.pro_niedate, "dd/mm/yyyy")}
                                        style={{
                                            width: "50%",
                                            float:"center"
                                        }}
                                        />}

                                    {
                                        value === 1 
                                        && 
                                        <Input
                                        type="date"
                                        style = {{
                                            width: "50%",
                                            float:"center"
                                        }}
                                        value={dateFormat(this.state.inputNIEDate, "yyyy-mm-dd")}
                                        onChange={(e)=>this.handleChange("editNoRegBerlaku",e)}
                                        />
                                    }
                                    </fieldset>
                                </FormGroup>
                                {/* No. Reg Berlaku s/d */}

                                
                                {/* No. Reg */}

                                {/* Non-Generik */}
                                <FormGroup
                                inline
                                check
                                style={{
                                    marginTop: "5%",
                                    width:"100%"
                                }}
                                >
                                    <fieldset
                                    disabled
                                    id="fsNonGenerik"
                                    style={{
                                        width:"100%"
                                    }}>
                                    <Label
                                    check
                                    sm={5}
                                    >
                                        <Input type="checkbox"
                                        id="checkboxNonGenerik"
                                        onChange={(e)=>this.handleChange("editNonGenerik",e)}
                                        />Non-Generik
                                    </Label>

                                    <Input
                                    inline
                                    style={{
                                        visibility: "hidden",
                                        // display: "none"
                                    }}
                                    />
                                    </fieldset>
                                </FormGroup>
                                {/* Non-Generik */}

                                {/* LT */}
                                <FormGroup
                                inline
                                style={{
                                    marginTop: "5%",
                                    width:"100%"
                                }}>
                                    <fieldset
                                    disabled
                                    id="fsLT"
                                    style={{
                                        width:"100%"
                                    }}>
                                         <Label 
                                        sm={4}>
                                            Lead Time
                                        </Label>

                                        <Input
                                        placeholder = "Lead Time"
                                        value={result.pro_leadtime}
                                        style={{
                                            width: "40%",
                                            display: "inline",
                                        }}
                                        type="number"
                                        min={0}>
                                            </Input>
                                        </fieldset>
                                </FormGroup>
                                {/* LT */}

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
                                    marginBottom: "3%",
                                    width:"100%"
                                }}
                                >
                                    <fieldset
                                    disabled
                                    id="fsKelipatan"
                                    style={{
                                        width:"100%"
                                    }}>
                                    <Label 
                                    sm={4}
                                    style={{
                                        width:"30%",
                                        float:"left",
                                        marginRight:"5%"
                                    }}>
                                        Kelipatan
                                    </Label>

                                    <Input
                                    value={this.state.inputKelipatan}
                                    style={{
                                        width: "50%",
                                        display: "inline",
                                    }}
                                    onChange={(e)=>this.handleChange("editKelipatan",e)}
                                    />
                                    </fieldset>
                                </FormGroup>
                                {/* Kelipatan */}

                                {/* IPA */}
                                <FormGroup
                                inline 
                                check
                                style={{
                                    marginBottom: "2%",
                                    width:"100%"
                                }}
                                >
                                    <fieldset
                                    disabled
                                    id="fsIPA"
                                    style={{
                                        width:"100%"
                                    }}>
                                    <Label 
                                    inline
                                    sm={6}
                                    style={{
                                        float:"left",
                                        width:"20%",
                                        marginRight:"12%"
                                    }}>
                                        <Input
                                        id="checkboxIPADet"
                                        type="checkbox"
                                        onChange={()=>this.checkboxListener()}
                                    />
                                    IPA
                                    </Label>

                                    <Input
                                    inline
                                    disabled
                                    value={this.state.inputValueIPA}
                                    id="inputIPADet"
                                    style={{
                                        width:"50%",
                                        float:"center",
                                    }}
                                    onChange = {(e)=>this.handleChange("editIPAValue",e)}
                                    />
                                    </fieldset>
                                </FormGroup>
                                {/* IPA */}    

                                {/* IDA */}
                                <FormGroup
                                inline 
                                check
                                style={{
                                    marginBottom: "5%",
                                    width:"100%"
                                }}
                                >
                                    <fieldset
                                    disabled
                                    id="fsIDA"
                                    style={{
                                        width:"100%"
                                    }}>
                                    <Label 
                                    inline
                                    sm={6}
                                    style={{
                                        width:"20%",
                                        float:"left",
                                        marginRight:"12%"
                                    }}>
                                        <Input
                                        id="checkboxIDADet"
                                        type="checkbox"
                                        onChange={()=>this.checkboxListener()}
                                        />
                                        IDA
                                    </Label>

                                    <Input
                                    inline
                                    disabled
                                    value={this.state.inputValueIDA}
                                    id="inputIDADet"
                                    style={{
                                        width:"50%",
                                        float:"center",
                                    }}
                                    onChange={(e)=>this.handleChange("editIDAValue",e)}
                                    />
                                    </fieldset>
                                </FormGroup>
                                {/* IDA */}

                                {/* Keterangan NIE */}
                                <FormGroup 
                                row
                                style={{
                                    marginBottom: "3%",
                                    width:"100%"
                                }}
                                >
                                    <fieldset
                                    disabled
                                    id="fsKetNIE"
                                    style={{
                                        width:"100%"
                                    }}>
                                    <Label 
                                    sm={4}
                                    style={{
                                        float:"left",
                                        width:"20%",
                                        marginRight:"15%"
                                    }}>
                                        Ket. NIE
                                    </Label>

                                    {
                                        value === 0 
                                        && 
                                        <select
                                        className = "custom-select"
                                        style = {{
                                            width: "50%",
                                            float:"center"
                                        }}
                                        value={this.state.inputKetNIECode}
                                        >
                                            {keteranganNIE.map(
                                                kne =>
                                                <option value={kne.nie_id}>{kne.nie_id}. {kne.nie_nama}</option>
                                            )} 
                                        </select>
                                    }

                                    {
                                        value === 1 
                                        && 
                                        <select
                                        className = "custom-select"
                                        style = {{
                                            width: "50%",
                                            float:"center"
                                        }}
                                        value={this.state.inputKetNIECode}
                                        onChange={(e)=>this.handleChange("editKetNIE",e)}
                                        >
                                            {keteranganNIE.map(
                                                kne =>
                                                <option value={kne.nie_id}>{kne.nie_id}. {kne.nie_nama}</option>
                                            )} 
                                        </select>
                                    }
                                    </fieldset>
                                </FormGroup>
                                {/* Keterangan NIE */}
                                
                                <FormGroup
                                row
                                id="inputFormTglSubmitBPOM"
                                style={{
                                    marginBottom:"3%",
                                    width:"100%",
                                    visibility:"hidden"
                                }}>
                                    <fieldset
                                    disabled
                                    id="fsTglBPOMDet"
                                    style={{
                                        width:"100%"
                                    }}>
                                        <Label 
                                            style={{
                                                width:"30%",
                                                marginRight:"5%",
                                                float:"left"
                                            }}
                                            sm={4}>
                                                Tgl. Submit BPOM
                                            </Label>

                                            {value === 0 && 
                                            <Input
                                            value={dateFormat(result.pro_niesubmitbpom, "dd/mm/yyyy")}
                                            style = {{
                                                width: "50%",
                                                float:"center"
                                            }}>
                                            </Input>}

                                            {value === 1 && 
                                            <Input
                                            style = {{
                                                width: "50%",
                                                float:"center"
                                            }}
                                            value={dateFormat(result.pro_niesubmitbpom,"yyyy-mm-dd")}
                                            >
                                            </Input>}
                                    </fieldset>
                                </FormGroup>

                                <FormGroup
                                row
                                style={{
                                    marginBottom: "5%",
                                    width:"100%"
                                }}
                                >
                                    <fieldset
                                    disabled
                                    id="fsHalal"
                                    style={{
                                        width:"100%"
                                    }}>
                                        <Label 
                                        sm={4}
                                        style={{
                                            float:"left",
                                            width:"20%",
                                            marginRight:"15%"
                                            }}>
                                                Halal
                                                </Label>

                                    {
                                        value === 0 
                                        && 
                                        <select
                                        className = "custom-select"
                                        style = {{
                                            width: "50%",
                                            float:"center"
                                        }}
                                        value={this.state.inputHalalYN}
                                        >
                                            {halal.map(
                                                hl =>
                                                <option value={hl.halalId}>{hl.halalStatus}</option>
                                            )} 
                                        </select>
                                    }

                                    {
                                        value === 1 
                                        && 
                                        <select
                                        className = "custom-select"
                                        style = {{
                                            width: "50%",
                                            float:"center"
                                        }}
                                        value={this.state.inputHalalYN}
                                        onChange={(e)=>this.handleChange("editHalalYN",e)}
                                        >
                                            {halal.map(
                                                hl =>
                                                <option value={hl.halalId}>{hl.halalStatus}</option>
                                            )} 
                                        </select>
                                    }

                                    </fieldset>
                                </FormGroup>

                                <FormGroup
                                 inline 
                                 check
                                 id="FormInputNoSertHalal"
                                 style={{
                                     marginBottom: "5%",
                                     visibility: "hidden",
                                     width:"100%"
                                 }}>
                                      <fieldset
                                    disabled
                                    id="fsNoSertHalal"
                                    style={{
                                        width:"100%",
                                    }}>
                                         <Label 
                                    sm={5}
                                    style={{
                                        float:"left",
                                        width:"30%",
                                        marginRight:"2%"
                                    }}>
                                        No. Sertifikasi Halal: 
                                    </Label>

                                <Input
                                    inline
                                    id="inputHalalDet"
                                    value={this.state.inputNoSertHalal}
                                    maxLength={50}
                                    placeholder = "No. Sertifikasi Halal"
                                    style={{
                                        width:"50%",
                                        float:"center"
                                    }}
                                    onChange={(e)=>this.handleChange("editNoSertHalal",e)}
                                    />
                                    </fieldset>
                                </FormGroup>

                                <FormGroup
                                inline 
                                check
                                id="FormInputNoSertHalalBerlaku"
                                style={{
                                    marginBottom: "5%",
                                    visibility: "hidden",
                                    width:"100%"
                                }}
                                >
                                    <fieldset
                                    disabled
                                    id="fsNoSertBerlaku"
                                    style={{
                                        width:"100%",
                                    }}>
                                    <Label 
                                    sm={5}
                                    style={{
                                        float:"left",
                                        width:"30%",
                                        marginRight:"2%"
                                    }}>
                                        No. Sertifikasi Berlaku s/d: 
                                    </Label>

                                    {
                                        value === 0 
                                        && 
                                        <Input
                                        value={dateFormat(result.pro_halaldate,"dd/mm/yyyy")}
                                        style={{
                                            width: "50%",
                                            float:"center"
                                        }}
                                        />
                                    }

                                    {
                                        value === 1 
                                        &&
                                        <Input
                                        type="date"
                                        style = {{
                                            width: "50%",
                                            float:"center"
                                        }}
                                        value={dateFormat(this.state.inputNoSertHalalBerlaku,"yyyy-mm-dd")}
                                        onChange={(e)=>this.handleChange("editNoSertHalalBerlaku",e)}
                                        />
                                    }
                                    </fieldset>
                                </FormGroup>

                                

                            </Form>
                            {/* Procon, Sts Margin, Exp. Date & Prg Discount */}
                        </Form>
                        {/* Qty PO Min & dll */}
                        

                        {/* Poin Sell Pack */}
                        <FormGroup>
                            <Label
                            style={{
                                visibility: "hidden"
                            }}
                            >aaa</Label>

                            <br/>

                            <Label
                            style={{
                                visibility: "hidden"
                            }}
                            >aaa</Label>
                            <br/>
                            <Label
                            style={{
                                visibility: "hidden"
                            }}
                            >aaa</Label>
                        </FormGroup>

                        <Form
                        style={{
                            textAlign: "center",
                            justifyContent: "center",
                        }}
                        >
                            {/* Poin Sell Pack */}
                            <FormGroup 
                            row
                            style={{
                                textAlign: "left",
                                justifyContent: "center",
                                width:"100%"
                            }}
                            >
                                <fieldset
                                disabled
                                id="fsPoinSellAsliScore"
                                style={{
                                    width:"90%",
                                    float:"center",
                                    marginLeft:"8%"
                                }}>
                                <Label 
                                sm={2}
                                >
                                    Poin Sell Pack
                                </Label>

                                <Input
                                style={{
                                    width: "10%",
                                    display: "inline",
                                }}
                                />    

                                <Label 
                                sm={2}
                                >
                                    Poin Asli
                                </Label>

                                <Input
                                style={{
                                    width: "10%",
                                    display: "inline",
                                }}
                                />

                                <Label 
                                sm={2}
                                >
                                    Score
                                </Label>

                                <Input
                                value={result.pro_score}
                                type="number"
                                style={{
                                    width: "10%",
                                    display: "inline",
                                }}
                                />
                                </fieldset>
                            </FormGroup>
                            {/* Poin Sell Pack */}
                        </Form>

                        <hr/>

                        {/* Kd Brand */}
                        <Form
                        style={{
                            marginTop: "5%",
                            width:"100%"
                        }}>
                        <FormGroup 
                        row
                        style={{
                            marginBottom: "1%",
                            width:"100%"
                        }}>
                            <fieldset
                            disabled
                            id="fsKdBrand"
                            style={{
                                width:"100%"
                            }}>
                            <Label 
                            sm={4}
                            style={{
                                float:"left",
                                width:"20%",
                                marginRight:"5%"
                            }}>
                                Kd Brand
                            </Label>
                            {
                                value === 0 
                                && 
                                <select
                                        className = "custom-select"
                                        style = {{
                                            width: "50%",
                                            display:"inline"
                                        }}
                                        value={this.state.inputBrandCode}
                                        >
                                            {kdBrandList.map(
                                                kbl =>
                                                <option value={kbl.Bra_BrandedCode}>{kbl.Bra_BrandedCode} - {kbl.Bra_BrandedName}</option>
                                            )} 
                                        </select>
                            }

                            {
                                value === 1 
                                && 
                                <select
                                        className = "custom-select"
                                        style = {{
                                            width: "50%",
                                            display:"inline"
                                        }}
                                        value={this.state.inputBrandCode}
                                        onChange={(e)=>this.handleChange("editKdbrand",e)}
                                        >
                                            {kdBrandList.map(
                                                kbl =>
                                                <option value={kbl.Bra_BrandedCode}>{kbl.Bra_BrandedCode} - {kbl.Bra_BrandedName}</option>
                                            )} 
                                        </select>
                            }

                            </fieldset>
                            </FormGroup>
                            </Form>
                            <br/>
                            {/* Kd Brand */}

                            <Form
                            style={{
                                width:"48%",
                                marginTop:"1%",
                                marginRight:"1%",
                                float:"left"
                            }}>
                                {/* Class Produk */}
                                <FormGroup 
                                row
                                style={{
                                    marginBottom: "1%",
                                    width:"100%",
                                }}
                                >
                                    <fieldset
                                    disabled
                                    id="fsClassProduct"
                                    style={{
                                        width:"100%"
                                    }}>
                                    <Label 
                                    sm={4}
                                    style={{
                                        marginLeft:"15%",
                                        width:"20%",
                                        float:"left"
                                    }}>
                                        Class Produk
                                    </Label>

                                    {
                                        value === 0 
                                        && 
                                        <select
                                        className = "custom-select"
                                        style = {{
                                            width: "28%",
                                            float:"left"
                                        }}
                                        >
                                            {classProduct.map(
                                                cp =>
                                                <option value={this.state.inputClsProduct}>{cp.cpClass}</option>
                                            )} 
                                        </select>
                                    }

                                    {
                                        value === 1 
                                        &&
                                        <select
                                        className = "custom-select"
                                        style = {{
                                            width: "28%",
                                            float:"left"
                                        }}
                                        >
                                            {classProduct.map(
                                                cp =>
                                                <option value={this.state.inputClsProduct}>{cp.cpClass}</option>
                                            )} 
                                        </select>
                                    }
                                    </fieldset>
                                    </FormGroup>
                                    </Form>

                                    <Form
                                    style={{
                                        width:"48%",
                                        marginTop:"1%",
                                        float:"right",
                                        marginLeft:"1%"
                                    }}>
                                    <FormGroup
                                     row
                                     style={{
                                         marginBottom: "1%",
                                         width:"100%"
                                     }}>
                                         <fieldset
                                         disabled
                                         id="fsClassMargin"
                                         style={{
                                             width:"100%"
                                         }}>

                                    <Label 
                                    sm={4}
                                    style={{
                                        width:"20%",
                                        float:"left"
                                    }}>
                                        Class Margin
                                    </Label>

                                    {
                                        value === 0 
                                        && 
                                        <select
                                        className = "custom-select"
                                        style = {{
                                            width: "28%",
                                            float:"centr"
                                        }}
                                        >
                                            {classMargin.map(
                                                cm =>
                                                <option value={this.state.inputClsMargin}>{cm.cmClass}</option>
                                            )} 
                                        </select>
                                    }

                                    {
                                        value === 1 
                                        && 
                                        <select
                                        className = "custom-select"
                                        style = {{
                                            width: "28%",
                                            float:"centr"
                                        }}
                                        >
                                            {classMargin.map(
                                                cm =>
                                                <option value={this.state.inputClsMargin}>{cm.cmClass}</option>
                                            )} 
                                        </select>
                                    }
                                    </fieldset>
                                </FormGroup>
                                {/* Class Produk */}
                                </Form>

                                <Form
                                style={{
                                    width:"100%",
                                    marginTop:"2%"
                                }}>
                                    <FormGroup 
                                    check
                                    style={{
                                        textAlign: "center",
                                        width:"100%",
                                    }}>
                                        <fieldset
                                        disabled
                                        id="fsNPDMonografImportHomeBrand"
                                        style={{
                                            width:"100%"
                                        }}>
                                        <Label 
                                        inline
                                        sm={3}>
                                            <Input type="checkbox"
                                            id="checkboxNPD"
                                            />
                                            NPD (Pharos)
                                        </Label>

                                        <Label 
                                        inline
                                        sm={3}>
                                            <Input type="checkbox"
                                            id="checkboxMono"
                                            />
                                            Monograf
                                        </Label>

                                        <Label 
                                        inline
                                        sm={3}>
                                            <Input type="checkbox"
                                            id="checkboxImport"
                                            />
                                            Import
                                        </Label>

                                        <Label 
                                        inline
                                        sm={3}>
                                            <Input type="checkbox"
                                            id="checkboxHomeBrand"
                                            />
                                            Home Brand
                                        </Label>
                                        </fieldset>
                                    </FormGroup>
                                </Form>

                                <Form
                                style={{
                                    width:"100%"
                                }}>
                                    <FormGroup 
                                    check
                                    style={{
                                        textAlign: "center",
                                        width:"100%"
                                    }}
                                    >
                                        <fieldset
                                        disabled
                                        id="fsJualEceranKemasanPatenPsikotropika"
                                        width="100%"
                                        >
                                        <Label 
                                        inline
                                        sm={3}>
                                            <Input type="checkbox"
                                            id="checkboxJualEceran"
                                            />
                                            Jual Eceran
                                        </Label>

                                        <Label 
                                        inline
                                        sm={3}>
                                            <Input type="checkbox"
                                            id="checkboxKemasan"
                                            />
                                            Kemasan
                                        </Label>

                                        <Label 
                                        inline
                                        sm={3}>
                                            <Input type="checkbox"
                                            id="checkboxPaten"
                                            />
                                            Paten
                                        </Label>

                                        <Label 
                                        inline
                                        sm={3}>
                                            <Input type="checkbox"
                                            disabled
                                            id="checkboxPsikotropika"/>
                                            Psikotropika
                                        </Label>
                                        </fieldset>
                                    </FormGroup>
                                </Form>

                                <Form>

                                    <FormGroup 
                                    row
                                    style={{
                                        marginTop: "5%"
                                    }}
                                    >
                                        <fieldset
                                        disabled
                                        id="fsKlaBPOM"
                                        style={{
                                            width:"100%"
                                        }}>
                                        <Label 
                                        sm={3}
                                        style={{
                                            float:"left",
                                            width:"20%",
                                            marginRight:"5%"
                                        }}>
                                            Kla. BPOM
                                        </Label>

                                        {
                                            value === 0 
                                            && 
                                            <select
                                                className = "custom-select"
                                                style = {{
                                                    width: "55%",
                                                    display:"inline"
                                                }}
                                                value={this.state.inputKlasiBPOMCode}
                                            >
                                            {klaBPOM.map(
                                                kbm =>
                                                <option value={kbm.kla_Code}>{kbm.kla_Code} - {kbm.kla_Name}</option>
                                            )} 
                                        </select>
                                        }

                                        {
                                            value === 1 
                                            &&
                                            <select
                                                className = "custom-select"
                                                style = {{
                                                    width: "55%",
                                                    display:"inline"
                                                }}
                                                value={this.state.inputKlasiBPOMCode}
                                            >
                                            {klaBPOM.map(
                                                kbm =>
                                                <option value={kbm.kla_Code}>{kbm.kla_Code} - {kbm.kla_Name}</option>
                                            )} 
                                        </select>
                                        }
                                        </fieldset>
                                    </FormGroup>

                                    <FormGroup 
                                    row
                                    style={{
                                        marginBottom: "1%",
                                    }}
                                    >
                                        <fieldset
                                        disabled
                                        id="fsGenerik"
                                        style={{
                                            width:"100%"
                                        }}>
                                        <Label 
                                        sm={3}
                                        style={{
                                            float:"left",
                                            width:"20%",
                                            marginRight:"5%"
                                        }}>
                                            Generik
                                        </Label>

                                        <select
                                        className = "custom-select"
                                        style = {{
                                            width: "55%",
                                            display:"inline"
                                        }}
                                        value={this.state.inputGenerikID}
                                        onChange={(e)=>this.handleChange("editGenerik",e)}
                                        >
                                            {activeGenerikList.map(
                                                agl =>
                                                <option value={agl.gen_Code}>{agl.gen_Code}. {agl.gen_Name}</option>
                                            )} 
                                        </select>
                                        </fieldset>
                                    </FormGroup>

                                    <FormGroup 
                                    row
                                    style={{
                                        marginBottom: "1%"
                                    }}
                                    >
                                        <fieldset
                                        disabled
                                        id="fsStrengthDsgForm"
                                        style={{
                                            width:"100%"
                                        }}>
                                        <Label 
                                        sm={3}
                                        style={{
                                            float:"left",
                                            width:"20%",
                                            marginRight:"5%",
                                            marginBottom:"1%"
                                        }}>
                                            Strength
                                        </Label>

                                        {
                                            value === 0 
                                            && 
                                            <select
                                                className = "custom-select"
                                                style = {{
                                                    width: "20%",
                                                    display:"inline",
                                                    marginBottom:"1%"
                                                }}
                                                value={this.state.inputStrengthCode}
                                            >
                                            {strengthList.map(
                                                sl =>
                                                <option value={sl.strg_Code}>{sl.strg_Name}</option>
                                            )} 
                                        </select>
                                        }

                                        {
                                            value === 1 
                                            && 
                                            <select
                                                className = "custom-select"
                                                style = {{
                                                    width: "20%",
                                                    display:"inline",
                                                    marginBottom:"1%"
                                                }}
                                                value={this.state.inputStrengthCode}
                                                onChange={(e)=>this.handleChange("editStrength",e)}
                                            >
                                            {strengthList.map(
                                                sl =>
                                                <option value={sl.strg_Code}>{sl.strg_Name}</option>
                                            )} 
                                        </select>
                                        }

                                        <Label 
                                        sm={3}
                                        style={{
                                            width:"14%",
                                            marginLeft:"1%"
                                        }}
                                        >Dsg Form
                                        </Label>

                                        {
                                            value === 0 
                                            && 
                                            <select
                                            className = "custom-select"
                                            style = {{
                                                width: "20%",
                                                display:"inline",
                                            }}
                                            value={this.state.inputDsgFormCode}
                                        >
                                        {dossagFormList.map(
                                            dfl =>
                                            <option value={dfl.dsgform_code}>{dfl.dsgform_name}</option>
                                        )} 
                                    </select>
                                        }

                                        {
                                            value === 1 
                                            && 
                                            <select
                                            className = "custom-select"
                                            style = {{
                                                width: "20%",
                                                display:"inline",
                                            }}
                                            value={this.state.inputDsgFormCode}
                                            onChange={(e)=>this.handleChange("editDossage",e)}
                                        >
                                        {dossagFormList.map(
                                            dfl =>
                                            <option value={dfl.dsgform_code}>{dfl.dsgform_name}</option>
                                        )} 
                                    </select>
                                        }
                                        </fieldset>
                                    </FormGroup>

                                    <FormGroup 
                                    row
                                    style={{
                                        marginBottom: "1%"
                                    }}
                                    >
                                        <fieldset
                                        disabled
                                        id="fsAmount"
                                        style={{
                                            width:"100%"
                                        }}>
                                        <Label 
                                        sm={3}
                                        style={{
                                            float:"left",
                                            width:"20%",
                                            marginRight:"5%"
                                        }}>
                                            Amount
                                        </Label>

                                        {
                                            value === 0 
                                            && 
                                            <Input
                                            className=""
                                            value={result.pro_amount}
                                            style={{
                                                width: "10%",
                                                display:"inline"
                                            }}
                                            />
                                           
                                        }

                                        {
                                            value === 0 &&
                                            <select
                                            className = "custom-select"
                                            style = {{
                                                width: "30%"
                                            }}
                                            value={this.state.inputUnit}
                                            >
                                               
                                                {
                                                    comco.map(
                                                        cmc =>
                                                        <option value={cmc.cmcId}>{cmc.cmcName}</option>
                                                    )
                                                } 
                                            </select>
                                        }

                                       

                                        {
                                            value === 1 
                                            && 
                                            <Input
                                            value={this.state.inputAmount}
                                            style={{
                                                width: "10%",
                                                display:"inline"
                                            }}
                                            onChange={(e)=>this.handleChange("editAmount",e)}
                                            />
                                            
                                        }

                                        {
                                            value=== 1 &&
                                            <select
                                            className = "custom-select"
                                            style = {{
                                                width: "30%"
                                            }}
                                            value={this.state.inputUnit}
                                            onChange={(e)=>this.handleChange("editAmountUnit",e)}
                                            >
                                               
                                                {
                                                    comco.map(
                                                        cmc =>
                                                        <option value={cmc.cmcId}>{cmc.cmcName}</option>
                                                    )
                                                } 
                                            </select>
                                        }


                                        </fieldset>
                                    </FormGroup>

                                    <FormGroup
                                     row
                                     style={{
                                         marginBottom: "1%"
                                     }}>
                                         <fieldset
                                         disabled
                                         id="fsKdGenerik"
                                         style={{
                                             width:"100%"
                                         }}>
                                    <Label 
                                        sm={3}
                                        style={{
                                            float:"left",
                                            width:"20%",
                                            marginRight:"5%"
                                        }}
                                        >Kd. Generik
                                        </Label>

                                        {
                                            value === 0 
                                            && 
                                            <select
                                            className = "custom-select"
                                            style = {{
                                                width: "40%",
                                            }}
                                            value={this.state.inputKdGenerikCode}
                                        >
                                        {jenisObat.map(
                                            jo =>
                                            <option value={jo.jnsob_code}>{jo.jnsob_name}</option>
                                        )} 
                                    </select>
                                        }

                                        {
                                            value === 1 
                                            &&
                                            <select
                                            className = "custom-select"
                                            style = {{
                                                width: "40%",
                                            }}
                                            onChange={(e)=>this.handleChange("editkdgenerik",e)}
                                            value={this.state.inputKdGenerikCode}
                                        >
                                        {jenisObat.map(
                                            jo =>
                                            <option value={jo.jnsob_code}>{jo.jnsob_name}</option>
                                        )} 
                                    </select>
                                        }
                                        </fieldset>
                                    </FormGroup>

                                    <FormGroup 
                                    row
                                    style={{
                                        marginBottom: "1%"
                                    }}
                                    >
                                        <fieldset
                                        disabled
                                        id="fsStorage"
                                        style={{
                                            width:"100%"
                                        }}>
                                        <Label 
                                        sm={3}
                                        style={{
                                            width:"20%",
                                            float:"left",
                                            marginRight:"5%"
                                        }}>
                                            Storage
                                        </Label>

                                        {
                                            value === 0 
                                            && 
                                            <select
                                            className = "custom-select"
                                            style = {{
                                                width: "20%",
                                            }}
                                            value={this.state.inputStorageCode}
                                        >
                                        {storage.map(
                                            se =>
                                            <option value={se.storage_code}>{se.storage_name}</option>
                                        )} 
                                    </select>
                                        }

                                        {
                                            value === 1 
                                            &&
                                            <select
                                            className = "custom-select"
                                            style = {{
                                                width: "20%",
                                            }}
                                            onChange={(e)=>this.handleChange("editstorage",e)}
                                            value={this.state.inputStorageCode}
                                        >
                                        {storage.map(
                                            se =>
                                            <option value={se.storage_code}>{se.storage_name}</option>
                                        )} 
                                    </select>
                                        }
                                        </fieldset>
                                    </FormGroup>

                                    <FormGroup 
                                    row
                                    style={{
                                        marginBottom: "1%"
                                    }}
                                    >
                                        <fieldset
                                        disabled
                                        id="fsFirstDate"
                                        style={{
                                            width:"100%"
                                        }}>
                                        <Label 
                                        sm={3}
                                        style={{
                                            width:"20%",
                                            marginRight:"5%",
                                            float:"left"
                                        }}>
                                            Firstdate
                                        </Label>

                                        <Input
                                        type="date"
                                        style = {{
                                            width: "40%",
                                        }}
                                        onChange={(e)=>this.handleChange("editfirstdate",e)}
                                        />
                                        </fieldset>
                                    </FormGroup>

                                    <FormGroup 
                                    row
                                    style={{
                                        marginBottom: "1%"
                                    }}
                                    >
                                        <fieldset
                                        disabled
                                        id="fsLastUpdate"
                                        style={{
                                            width:"100%"
                                        }}>
                                        <Label 
                                        sm={3}
                                        style={{
                                            float:"left",
                                            width:"20%",
                                            marginRight:"5%"
                                        }}>
                                            LastUpdate
                                        </Label>

                                        {
                                            value === 0
                                            &&
                                            <Input
                                            value={dateFormat(result.pro_lastupdate,"dd/mm/yyyy")}
                                            style = {{
                                                width: "40%",
                                            }}
                                            />
                                        }

                                        {
                                            value === 1
                                            &&
                                            <Input
                                            type = "date"
                                            style = {{
                                                width: "40%",
                                            }}
                                            value={dateFormat(result.pro_lastupdate, "yyyy-mm-dd")}
                                            />
                                        }
                                        </fieldset>
                                    </FormGroup>

                                    <Form>
                                        <FormGroup 
                                        inline
                                        check
                                        style={{
                                            marginBottom:"1%",
                                            width:"100%"
                                        }}
                                        >
                                            <fieldset
                                            disabled
                                            id="fsInHealth"
                                            style={{
                                                width:"100%"
                                            }}>
                                            <Label 
                                            inline
                                            sm={4}
                                            style={{
                                                width:"20%",
                                                float:"left",
                                                marginLeft:"3%",
                                                marginRight:"1%",
                                            }}>
                                                <Input
                                                id="checkboxInHealthDet"
                                                type="checkbox"
                                                />
                                                In Health
                                            </Label>

                                            { 
                                                value === 0 
                                                && 
                                                <select
                                                id="selectInHealthPT"
                                                className = "custom-select"
                                                style = {{
                                                    width: "41%",
                                                    display:"inline"
                                                }}
                                                value={this.state.inputPTAsuransiInHealthCode}
                                            >
                                            {companyList.map(
                                                cl =>
                                                <option value={cl.com_idnumber}>{cl.com_name}</option>
                                            )} 
                                        </select>
                                            }

                                            {
                                                value === 1 
                                                &&
                                                <select
                                                id="selectInHealthPT"
                                                className = "custom-select"
                                                style = {{
                                                    width: "40%",
                                                    display:"inline"
                                                }}
                                                value={this.state.inputPTAsuransiInHealthCode}
                                                onChange={(e)=>this.handleChange("editinhealth",e)}
                                            >
                                            {companyList.map(
                                                cl =>
                                                <option value={cl.com_idnumber}>{cl.com_name}</option>
                                            )} 
                                        </select>
                                            }
                                            </fieldset>
                                        </FormGroup>

                                    </Form>

                                    <br/>

                                    <FormGroup 
                                    row
                                    style={{
                                        marginBottom: "1%"
                                    }}
                                    >
                                        <fieldset
                                        disabled
                                        id="fsKategoriProduk"
                                        style={{
                                            width:"100%"
                                        }}>
                                        <Label 
                                        sm={3}
                                        style={{
                                            width:"20%",
                                            marginRight:"5%",
                                            float:"left"
                                        }}>
                                            Kategori Produk
                                        </Label>

                                        {
                                            value === 0 
                                            && 
                                            <select
                                                className = "custom-select"
                                                style = {{
                                                    width: "30%",
                                                    display:"inline"
                                                }}
                                                value={this.state.inputKategoriCode}
                                            >
                                            {productCategory.map(
                                                pc =>
                                                <option value={pc.katpro_id}>{pc.katpro_id} - {pc.katpro_nama}</option>
                                            )} 
                                        </select>
                                        }

                                        {
                                            value === 1 
                                            &&
                                            <select
                                                className = "custom-select"
                                                style = {{
                                                    width: "30%",
                                                    display:"inline"
                                                }}
                                                onChange={(e)=>this.handleChange("editkategoriproduk",e)}
                                                value={this.state.inputKategoriCode}
                                            >
                                            {productCategory.map(
                                                pc =>
                                                <option value={pc.katpro_id}>{pc.katpro_id}. {pc.katpro_nama}</option>
                                            )} 
                                        </select>
                                        }
                                            </fieldset>
                                    </FormGroup>

                                    <br/>

                                    <Form>
                                        <FormGroup 
                                        check
                                        style={{
                                            textAlign: "center"
                                        }}
                                        >
                                            <fieldset
                                            disabled
                                            id="fsTidakDijualSurveyDekorTimbang">
                                            <Label 
                                            inline
                                            sm={3}>
                                                <Input type="checkbox"
                                                disabled
                                                id="checkboxtidakbolehdijual"
                                                />
                                                TIDAK BOLEH DIJUAL
                                            </Label>

                                            <Label 
                                            inline
                                            sm={3}>
                                                <Input type="checkbox"
                                                id="checkboxSurvey"/>
                                                Survey
                                            </Label>

                                            <Label 
                                            inline
                                            sm={3}>
                                                <Input type="checkbox"
                                                id="checkboxDecor"
                                                />
                                                Dekor
                                            </Label>

                                            <Label 
                                            inline
                                            sm={3}>
                                                <Input type="checkbox"
                                                id="checkboxTimbang"
                                                />
                                                Timbang
                                            </Label>
                                            </fieldset>
                                        </FormGroup>
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
                                {
                                    value === 0 
                                    && 
                                    <Button
                                    color = "secondary"
                                    style={{
                                        marginRight:"1%"
                                    }}
                                    onClick = {()=>this.enableAllInput()}
                                    >
                                        <MdEdit
                                        style={{
                                            marginRight: "5px"
                                        }}
                                        />EDIT
                                    </Button>
                                }

                                {
                                    value === 1
                                    && 
                                    <Button
                                    color = "success"
                                    onClick={this.toggleEditConfirmationModal.bind(this)}
                                    style={{
                                        marginRight:"1%"
                                    }}
                                    >
                                        <MdSave
                                        style={{
                                            marginRight: "5px"
                                        }}
                                        />SAVE
                                    </Button>
                                }

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

                        {/* Confirm Edit Modal */}
                <Modal
                  isOpen={this.state.editConfirmationModalIsOpen}>
                  <ModalHeader
                    toggle={this.toggleEditConfirmationModal.bind(this)}
                  >Konfirmasi Penyuntingan
                  </ModalHeader>
                  <ModalBody>
                    Apakah Anda yakin ingin menyunting data ini?
                  </ModalBody>
                  <ModalFooter
                    style={{
                      display: "inline-block",
                      textAlign: "center"
                    }}
                  >
                    <Button
                      color="primary"
                      onClick={()=>this.editProdukDetail()}
                    ><MdDone
                      style={{
                        marginRight: "5"
                      }}
                    />Ya
                    </Button>
                    <Button
                      color="secondary"
                      onClick={this.toggleEditConfirmationModal.bind(this)}
                    ><MdClose
                      style={{
                        marginRight: "5"
                      }}
                    />Tidak
                    </Button>
                  </ModalFooter>
                </Modal>
                {/* Response Modal */}

                    </CardBody>

                </Card>
                
            </div>
        )
    }

}export default MasterProdukMasterViewEdit