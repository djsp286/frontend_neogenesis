import Page from 'components/Page';
import React from 'react';
import {
    Button, Badge, Card, CardBody, CardHeader, Col, Row, Table, Modal,
    ModalBody, ModalFooter, ModalHeader, Input, Label, Nav, Form,
    Navbar, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem,
    ButtonGroup, InputGroup, InputGroupAddon, FormGroup, CardFooter
} from 'reactstrap';
import { MdHighlightOff, MdCheckCircle, MdHighlight, MdAdd, MdDelete, MdSearch, MdEdit, MdCancel, MdSave, MdGolfCourse } from 'react-icons/md';
import { runInThisContext } from 'vm';
import { withRouter } from 'react-router-dom';
import { parse } from 'path';
import { arrayOf } from 'prop-types';
import Purchase_Order_Tab from './Purchase_Order_Tab';


const detail = {
    POD_Group: "",
    POD_NoPO: "",
    POD_Procod: "",
    POD_Name: "",
    POD_Qty: "",
    POD_ProdStatus: "",
    POD_GrossBeli: "",
    POD_SellUnit: "",
    POD_Disc: "",
    POD_Disc2: "",
    POD_NettoBeli: "",
    POD_POStatus: "",
    POD_BonusYN: "",
    POD_ConfirmID: "",
    POD_AccID: "",
    POD_UpdateID: "",
    POD_OrderBy: "",
    POD_STS : "",
    POD_BuyPack  : "",
    POD_SellPack : "",
}
class Purchase_Order_Detail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            resultPODetail: [],
            resultPOHeader: [],
            resultRO: [],
            activeTypePOCode: this.props.typePOCode,
            flagActivedProductForInsertDetail: false,
            flagButtonDisabled: true,
            currentDetail: { ...detail },
            checkedPO:[],
            checkedRO:[],
        
            arrayTampungDetail: [],
            arrayTampungRO    : [],

            insertArray : [],
            removeArray : [],
            deleteArray : [],

            deleteArrayRO : [],
            removeArrayRO : [],
           
            flagButtonEditDetail : true,
            activeDetailUnit : 10

        };
    }

    componentDidMount() {
        this.findPO(this.props.activeGroup, this.props.activeNomorPO)
        // this.getLastPO()
        // console.log("ini halaman detail")
        // console.log(this.state.resultPOHeader)
    }


    componentDidUpdate(previousProps, previousState) {
        if (previousProps.flagAddButtonPressed !== this.props.flagAddButtonPressed) {
            this.setState({
                resultPODetail: [],
                resultRO: [],
                flagButtonDisabled: true,
                activeTypePOCode: this.props.typePOCode,
                flagButtonEditDetail : false,
                checkedPO : [],
                resultPODetailForValidasi :[]
            }, () => console.log("type po : "+this.state.activeTypePOCode +" flagButtonEditDetail :"+this.state.flagButtonEditDetail));

        }
        if (previousProps.flagEditButtonPress !== this.props.flagEditButtonPress) {
            this.setState({
                flagButtonDisabled: false
            })
        }
        if (previousProps.flagSaveButtonPress !== this.props.flagSaveButtonPress) {
            console.log("ini halaman detail cek resultheadersend")
           
            if(this.props.flagAdding === true){
                console.log("adding")
                console.log(this.props.resultHeaderSend)
                this.buatPo()
            }
            else{
                console.log("not adding")
                if(this.state.insertArray.length != 0){
                    console.log("insertarray not null")
                    console.log(this.state.insertArray)
                    this.addDetailDatabase()
                }
                if(this.state.removeArray.length != 0 ){
                    console.log("removearray not null")
                    console.log(this.state.removeArray)
                    this.removeDetailDatabase()
                }
                if(this.state.deleteArray.length != 0){
                    console.log("deletearray not null")
                    console.log(this.state.deleteArray)
                    this.deleteDetailDatabase()
                }
                if(this.state.deleteOutletArray != 0){

                }
                if(this.state.removeArray != 0){

                }
                this.props.refreshPageFunc()
            }
        }

        if (previousProps.flagFindButtonPress !== this.props.flagFindButtonPress) {
            console.log("ini halaman detail habis pencet find")
            this.setState({
                resultPOHeader: this.props.resultPOFind.T_POHeader,
                resultPODetail: this.props.resultPOFind.T_PODetail
            })
            console.log(this.props.resultPOFind.T_PODetail)
        }

        if(previousProps.flagPrintPO !== this.props.flagPrintPO){
            this.setState({
                modal_print : true
            })
        }

        if(previousProps.flagButtonEditDetail !== this.props.flagButtonEditDetail){
            console.log("flagbuttoneditdetail berubah")
            if(this.props.flagButtonEditDetail === true){
                this.setState({
                    flagButtonEditDetail : true,
                    flagButtonDisabled : false,
                })
                // this.state.flagButtonEditDetail = true
                // this.state.flagButtonDisabled = false
                console.log("flagButtonEditDetail"+this.state.flagButtonEditDetail)
            }
            else{
                this.setState({
                    flagButtonEditDetail : false,
                    flagButtonDisabled : true,
                })
                // this.state.flagButtonEditDetail = false
                // this.state.flagButtonDisabled = true
                console.log("flagButtonEditDetail"+this.state.flagButtonEditDetail)
            }
        }

        // if(previousProps.flagGudangFound !== this.props.flagGudangFound){
        //      if(this.props.flagGudangFound === true){
        //         this.state.flagGudangFound = true
        //         this.state.flagButtonDisabled = false
        //         console.log("flagGudangFound"+this.state.flagGudangFound)
        //     }
        //     else{
        //         this.state.flagGudangFound = false
        //         this.state.flagButtonDisabled = true
        //         console.log("flagGudangFound"+this.state.flagGudangFound)
        //     }
        // }

        if(previousProps.flagGetDataPOFinished !== this.props.flagGetDataPOFinished){
            console.log("sudah get PO Header")
            this.findPO(this.props.activeGroup, this.props.activeNomorPO)
            
        }
        
    }

    getLastPO() {
        const option = {
            method: "GET",
            json: true,
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": window.localStorage.getItem('tokenLogin')
            },
        }

        fetch("http://localhost:2222/po?type=lastinput&group=2", option)
            .then(response => response.json())
            .then(data => {
                if (data.data[0] === null) {
                    console.log("Data PO Detail Kosong")
                    this.setState({ resultPODetail: [], resultPOHeader: [] })
                }
                else {

                    if (data.data[0].T_PurchaseOrder.T_PODetail === null) {
                        console.log("resultpodetail kosong")
                        this.setState({
                            resultPOHeader: data.data[0].T_PurchaseOrder.T_POHeader,
                            activeTypePOCode: data.data[0].T_PurchaseOrder.T_POHeader.POH_TipePO,
                            activeJmlPrint: data.data[0].T_PurchaseOrder.T_POHeader.POH_JmlPrint,

                            resultPODetail: []
                        })

                    }

                    else {
                        var checktemp=[];
                        for(let i=0;i<data.data[0].T_PurchaseOrder.T_PODetail.length;i++)
                        {
                            checktemp.push(false);
                        }


                        console.log("resultpodetail tidak kosong")
                        this.setState({
                            resultPOHeader: data.data[0].T_PurchaseOrder.T_POHeader,
                            activeTypePOCode: data.data[0].T_PurchaseOrder.T_POHeader.POH_TipePO,
                            activeJmlPrint: data.data[0].T_PurchaseOrder.T_POHeader.POH_JmlPrint,

                            resultPODetail: data.data[0].T_PurchaseOrder.T_PODetail,
                            resultPODetailForValidasi : data.data[0].T_PurchaseOrder.T_PODetail,
                            checkedPO:checktemp
                        })
                    }


                    console.log(this.state.resultPODetail)
                    console.log(JSON.stringify(data.data))
                    console.log("activeTypePOCode :" + this.state.activeTypePOCode)
                }

            });
    }

    findPO(group, nopo){
        const option = {
            method  : "GET",
            json    : true,
            headers : {
                    "Content-Type": "application/json;charset=UTF-8",
                    "Authorization" : window.localStorage.getItem('tokenLogin')
                    },
            }
            fetch("http://localhost:2222/po?type=noPO&group="+group+"&noPO="+nopo,option)
            .then(response => response.json())
            .then(data =>{ 
                    console.log("http://localhost:2222/po?type=noPO&group="+group+"&noPO="+nopo)
                    if (data.data[0] === null) {
                        console.log("Data PO Detail Kosong")
                        this.setState({ resultPODetail: [], resultPOHeader: [] })
                    }
                    else {
                        if (data.data[0].T_PurchaseOrder.T_PODetail === null){
                            console.log("resultpodetail kosong")
                            this.setState({
                                resultPOHeader: data.data[0].T_PurchaseOrder.T_POHeader,
                                activeTypePOCode: data.data[0].T_PurchaseOrder.T_POHeader.POH_TipePO,
                                activeJmlPrint: data.data[0].T_PurchaseOrder.T_POHeader.POH_JmlPrint,
    
                                resultPODetail: []
                            })
                        } 
                        else{
                            if(data.data[0].T_PurchaseOrder.T_POHeader.POH_NoPO === nopo)  {
                                var checktemp=[];
                                for(let i=0;i<data.data[0].T_PurchaseOrder.T_PODetail.length;i++)
                                {
                                    checktemp.push(false);
                                }
                                console.log("Data Find Ada")
                                this.setState({
                                    resultPOHeader : data.data[0].T_PurchaseOrder.T_POHeader,
                                    resultPODetail : data.data[0].T_PurchaseOrder.T_PODetail,
                                    resultPODetailForValidasi : data.data[0].T_PurchaseOrder.T_PODetail,
                                    activeTypePOCode: data.data[0].T_PurchaseOrder.T_POHeader.POH_TipePO,
                                    activeJmlPrint: data.data[0].T_PurchaseOrder.T_POHeader.POH_JmlPrint,
                                    checkedPO:checktemp
                                })
                                
                            }
    
                            else{
                                console.log("Data Find Kosong")
                                this.setState({
                                    resultPOHeader : [],
                                    resultPODetail : [],
                                    resultPODetailForValidasi : []
                                })
                            }
                        }
                       
                    }
                });
    }

    // getPOfromTabPage(){
    //     this.setState({
    //         resultPOHeader: this.props.resultPOFind.T_POHeader,
    //         resultPOHeader:  this.props.resultPOFind.T_PODetail
           
    //     })
    //     console.log("pofromtabpage")
    //     console.log(this.props.resultPOFind.T_POHeader)
    // }

    getRO(procode) {
        console.log("getRO")
        // const option = {
        //     method: "GET",
        //     json: true,
        //     headers: {
        //         "Content-Type": "application/json;charset=UTF-8"
        //     },
        // }

        // fetch("http://10.0.111.212:1111/CHCRO/RO?kodeProduk=" + procode, option)
        //     .then(response => response.json())
        //     .then(data => {
        //         if (data.data === null) {
        //             console.log("Data RO Kosong")
        //             this.setState({
        //                 resultRO: [],
        //                 modal_response: true,
        //                 responseHeader: "RO",
        //                 responseMessage: "Data RO tidak ada",
        //             })
        //         }
        //         else {
        //             var checktemp=[];
        //             for(let i=0;i<data.data.length;i++)
        //             {
        //                 checktemp.push(false);
        //             }

        //             console.log("Data RO Tidak Kosong")
        //             this.setState({
        //                 resultRO: [],
        //                 resultRO: data.data,
        //                 checkedRO : checktemp
        //             })
        //             console.log(this.state.resultRO)
        //         }

        //     });
    }

    addDetailDatabase() {
        var url = "http://localhost:2222/po?type=insertDetailManual";
        var payload = [{
            T_POHeader: this.state.resultPOHeader
            ,
            T_PODetail: this.state.insertArray
        }]

        console.log(payload)
        console.log("fungsi add detail")

        fetch(url, {
            method: "POST",
            body: JSON.stringify(payload),
            json: true,
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.data === null) {
                    console.log("gagal add detail")
                }
                else {
                    console.log("berhasil add detail")
                    this.setState({
                        // modal_response: true,
                        // responseHeader: "Add Detail",
                        // responseMessage: "Data detail berhasil ditambah",

                        // modal_add_detail: false,
                        insertArray : []
                    })

                }
            });

    }

    deleteDetailDatabase(){
        var url = "http://localhost:2222/po?type=deleteProcod";
        var payload = [{
            T_POHeader: this.state.resultPOHeader
            ,
            T_PODetail: this.state.deleteArray
        }]

        console.log(payload)
        console.log("fungsi delete detail")

        fetch(url, {
            method: "POST",
            body: JSON.stringify(payload),
            json: true,
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.data === null) {
                    console.log("gagal delete detail")
                }
                else {
                    console.log("berhasil delete detail")
                    this.setState({
                        // modal_response: true,
                        // responseHeader: "Add Detail",
                        // responseMessage: "Data detail berhasil ditambah",

                        // modal_add_detail: false,
                        deleteArray : []
                    })

                }
            });
    }

    removeDetailDatabase(){
        var url = "http://localhost:2222/po?type=removeProcod";
        var payload = [{
            T_POHeader: this.state.resultPOHeader
            ,
            T_PODetail: this.state.removeArray
        
        }]

        console.log("fungsi remove detail")
        console.log(JSON.stringify(payload))
        

        fetch(url, {
            method: "POST",
            body: JSON.stringify(payload),
            json: true,
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.data === null) {
                    console.log("gagal remove detail")
                }
                else {
                    console.log("berhasil remove detail")
                    this.setState({
                        // modal_response: true,
                        // responseHeader: "Add Detail",
                        // responseMessage: "Data detail berhasil ditambah",

                        // modal_add_detail: false,
                        removeArray :[]
                    })

                }
            });
    }

    buatPo() {
        var url = "http://localhost:2222/po?type=buatPOManual";

        var payload = {
            T_POHeader: {
                POH_Group: 2,
                POH_NoPO: null,
                POH_Kota: 6,
                POH_Nosup: this.props.resultHeaderSend["supcode"],
                POH_TipePO: parseInt(this.props.resultHeaderSend["tipepo"]),
                POH_TOP: parseInt(this.props.resultHeaderSend["top"]),
                POH_JmlPrint: 0,
                POH_SendToWareHouse: this.props.resultHeaderSend["gudangCode"],
                POH_BonusYN: null,
                POH_Keterangan: "Jalan aja",
                POH_UpdateID: "0000007",
                POH_UpdateTime: null,
                POH_UangMukaYN: null,
                POH_MataUang: null,
                Count: 0
            }
            ,
            T_PODetail: this.state.resultPODetail
        }

        console.log("fungsi buat po")
        console.log(JSON.stringify(payload))

        fetch(url, {
            method: "POST",
            body: JSON.stringify(payload),
            json: true,
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.data === null) {
                    console.log("gagal add detail")
                }
                else {
                    console.log("berhasil add detail")
                    this.setState({
                        modal_response: true,
                        responseHeader: "Add Detail",
                        responseMessage: "Data detail berhasil ditambah",

                        modal_add_detail: false,

                        flagButtonDisabled: true,
                        flagButtonEditDetail : false
                    })

                    this.getLastPO()
                    this.props.refreshPageFunc()
                    this.props.changeFlagAdding()

                }
            });

    }


    searchProductMDProduct(code) {

        console.log("searchProductMDProduct")
        const option = {
            method: "GET",
            json: true,
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
        }

        fetch("http://10.0.111.212:8093/CHCMasterProdukSupplier/ProductDetailMargin?kodeProduk=" + code, option)
            .then(response => response.json())
            .then(data => {
                if (data.error.status === true) {
                    console.log("Product Tidak Ada")
                    this.setState({
                        activeDetailHarga: "",
                        activeDetailName: "",
                        activeDetailDisc: "",
                        activeDetailQuantity: "",
                        activeDetailDisc2: "",
                        modal_response: true,
                        responseHeader: "Add Detail",
                        responseMessage: "Procod Tidak Ditemukan",
                        flagActivedProductForInsertDetail: false
                    })
                }
                else {
                    if(data.data.detail_supplier_aktif.pro_suplcode === this.props.activeSuplierCode){
                        console.log("Product Ada")
                        this.setState({
                            activeDetailName: data.data.pro_name,
                            activeDetailHarga: data.data.detail_supplier_aktif.pro_grossprice,
                            activeDetailDisc: data.data.detail_supplier_aktif.pro_discount,
                            activeDetailUnit: data.data.sell_unit,
                            flagActivedProductForInsertDetail: true
                        })
                        console.log("activeDetailHarga : " + data.data.pro_name)
                    }

                    else{
                        this.setState({
                            activeDetailHarga: "",
                            activeDetailName: "",
                            activeDetailDisc: "",
                            activeDetailQuantity: "",
                            activeDetailDisc2: "",
                            modal_response: true,
                            responseHeader: "Add Detail",
                            responseMessage: "Procod Tidak Ditemukan Dalam Suplier Code Ini",
                            flagActivedProductForInsertDetail: false
                        })
                    }
                   
                }

            });
    }

    getMovingSTS(code) {
        var url = "http://10.0.111.169:8098/UploadDownloadVB/MoveMovingCFU/GetMovingByProcode";
        var payload = {
            procode: code
        }

        console.log("fungsi moving STS")
        console.log(JSON.stringify(payload))

        fetch(url, {
            method: "POST",
            body: JSON.stringify(payload),
            json: true,
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Authorization": window.localStorage.getItem('tokenLogin')
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.data[0] === null) {
                    console.log("gagal get moving")
                }
                else {
                    console.log("berhasil get moving")
                    this.setState({
                       activeDetailSTS : data.data[0].status
                    })
                    console.log("moving : "+data.data[0].status)
                    
                }
            });

    }

    searchProductMDBuyLocal(code) {
        console.log("searchProductMDBuyLocal")
        const option = {
            method: "GET",
            json: true,
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
        }

        fetch("http://10.0.111.22:8086/CHCMasterE/md_buy_lokal/" + code, option)
            .then(response => response.json())
            .then(data => {

                if (data.data.length === 0) {
                    console.log("Product Tidak Ada")
                    this.setState({
                        activeDetailHarga: "",
                        activeDetailName: "",
                        activeDetailDisc: "",
                        activeDetailQuantity: "",
                        modal_response: true,
                        responseHeader: "Add Detail",
                        responseMessage: "Procod Tidak Ditemukan",
                        flagActivedProductForInsertDetail: false
                    })
                }
                else {
                    console.log("Product Ada")
                    this.setState({
                        activeDetailName: data.data[0].pro_Name,
                        activeDetailHarga: data.data[0].buylclh_Lgbupri,
                        activeDetailDisc: data.data[0].buylclh_Disc,
                        flagActivedProductForInsertDetail: true
                    })
                }
                console.log("activeDetailName : " + this.state.activeDetailName)
                console.log("searchProductMDBuyLocal : ")
                console.log(data)
            });
    }

    searchProductMDWarehouseBuyLocal(gudang, code) {
        console.log("searchProductMDWarehouseBuyLocal")
        const option = {
            method: "GET",
            json: true,
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
        }

        fetch("http://10.0.111.50:8091/CHCMasterProdukOnline/PembelianLocal?gudang="+gudang+"&procode="+code, option)
            .then(response => response.json())
            .then(data => {

                if (data.error.status === true) {
                    console.log("Product Tidak Ada")
                    this.setState({
                        activeDetailHarga: "",
                        activeDetailName: "",
                        activeDetailDisc: "",
                        activeDetailQuantity: "",
                        activeDetailDisc2: "",
                        modal_response: true,
                        responseHeader: "Add Detail",
                        responseMessage: "Procod Tidak Ditemukan",
                        flagActivedProductForInsertDetail: false
                    })
                }
                else {
                    if(data.data.pl_supcode === this.props.activeSuplierCode){
                        console.log("Product Ada")
                        this.setState({
                            activeDetailName: data.data.pro_name,
                            activeDetailHarga: data.data.pl_lgbupri,
                            activeDetailDisc: data.data.pl_disc,
                            activeDetailUnit: data.data.pro_sellunit,
                            flagActivedProductForInsertDetail: true
                        },()=> console.log("activeDetailUnit : " + data.data.pro_sellunit))
                       
                    }

                    else{
                        this.setState({
                            activeDetailHarga: "",
                            activeDetailName: "",
                            activeDetailDisc: "",
                            activeDetailQuantity: "",
                            activeDetailDisc2: "",
                            modal_response: true,
                            responseHeader: "Add Detail",
                            responseMessage: "Procod Tidak Ditemukan Dalam Suplier Code Ini",
                            flagActivedProductForInsertDetail: false
                        })
                    }
                   
                }
            });
    }

    enterPressedSearch(event) {
        var code = event.keyCode || event.which;
        if (code === 13) {

            if (this.state.activeTypePOCode === "5") {
                // this.searchProductMDBuyLocal(event.target.value)
                this.searchProductMDWarehouseBuyLocal("981",event.target.value)
            }
            else {
                this.searchProductMDProduct(event.target.value)
            }

        }

    }

    openModal() {
        if(this.state.flagButtonEditDetail === true){
            this.setState({
                modal_add_detail: true,
                activeDetailHarga: "",
                activeDetailName: "",
                activeDetailDisc: "",
                activeDetailQuantity: "",
                activeDetailDisc2: "",
                activeDetailProcod: "",
                activeDetailDisc2 : 0,
                flagActivedProductForInsertDetail: false
            })
        }
        else{
            this.setState({
                modal_response : true,
                responseHeader: "Add Detail",
                responseMessage: "No Suplier TIDAK DITEMUKAN",
            })
        }
        
    }

    inputValue = (type, event) => {
        if (type === "InputProcod") {
            this.setState({
                activeDetailProcod: event.target.value
            });
        } else if (type === "InputHarga") {
            this.setState({
                activeDetailHarga: event.target.value
            });
        } else if (type === "InputQuantity") {
            this.setState({
                activeDetailQuantity: event.target.value,
                activeDetailQuantityFromModulus : parseInt(event.target.value) / parseInt(this.state.activeDetailUnit)    
            });
            
        } else if (type === "InputDisc2") {
            this.setState({
                activeDetailDisc2: event.target.value
            });
           
        }
    }

    updateResultPODetailArray = (todo) => {

        // var length = this.state.resultPODetail.length
        // console.log("panjang : " +length)
        var {checkedPO} =this.state;

        if (this.state.flagActivedProductForInsertDetail === true) {
            if(this.state.activeDetailQuantityFromModulus > 0){
                todo["POD_Group"] = this.props.activeGroup
                todo["POD_Procod"] = this.state.activeDetailProcod
                todo["POD_Qty"] = parseInt(this.state.activeDetailQuantity)
                todo["POD_GrossBeli"] = parseInt(this.state.activeDetailHarga)
                todo["POD_Disc"] = parseInt(this.state.activeDetailDisc)
                todo["POD_Disc2"] = parseInt(this.state.activeDetailDisc2)
                todo["POD_Name"] = this.state.activeDetailName
                todo["POD_SellUnit"] = this.state.activeDetailUnit
                todo["POD_STS"] = this.state.activeDetailSTS
                todo["POD_BuyPack"] = "-"
                todo["POD_SellPack"] = "-" 

                checkedPO.push(false);

            
                this.setState(prevState => ({
                    resultPODetail: [...prevState.resultPODetail, todo],
                    resultPODetailForValidasi : [...prevState.resultPODetailForValidasi, todo],
                    insertArray : [...prevState.insertArray, todo],
                    modal_add_detail: false,
                    checkedPO:checkedPO
                }),()=>this.props.sumTotalNettoFromDetailPage(this.state.resultPODetail));
                
            }else {
                this.setState({
                    modal_response: true,
                    responseHeader: "Add Detail",
                    responseMessage: "Quantity harus lebih dari 0",
                })
            }
        }
        else{
            this.setState({
                modal_response: true,
                responseHeader: "Add Detail",
                responseMessage: "Data Product Tidak Ada",
            })
        }
            

        // todo["POD_Group"] = 1
        // todo["POD_Procod"] = this.state.activeDetailProcod
        // todo["POD_Qty"] = parseInt(this.state.activeDetailQuantity)
        // todo["POD_GrossBeli"] = parseInt(this.state.activeDetailHarga) 
        // todo["POD_Disc"] = parseInt(this.state.activeDetailDisc)
        // todo["POD_Disc2"] = parseInt(this.state.activeDetailDisc2)
        // todo["POD_Name"] = this.state.activeDetailName
        // todo["POD_SellUnit"] = parseInt(this.state.activeDetailUnit)
        // todo["POD_STS"] = this.state.activeDetailSTS
        // todo["POD_BuyPack"] = "-"
        // todo["POD_SellPack"] = "-"

        // checkedPO.push(false);
        
        // this.setState(prevState => ({
        //     resultPODetail: [...prevState.resultPODetail, todo],
        //     resultPODetailForValidasi : [...prevState.resultPODetailForValidasi, todo],
        //     insertArray : [...prevState.insertArray, todo],
        //     modal_add_detail: false,
        //     checkedPO:checkedPO
        // }), ()=>this.props.sumTotalNettoFromDetailPage(this.state.resultPODetail));
        
    }


    // handleCheckboxClick(todo) {
    //     console.log("handlecheckboxclick")
    //     var temporary_result = this.state.arrayTampungDetail;

    //     var flag = 0
    //     for(let i = 0 ; i< temporary_result.length ; i++){
    //         if(temporary_result[i].POD_Procod == todo.POD_Procod){
    //             console.log("procode : "+temporary_result[i].POD_Procod)

    //             temporary_result.splice(i,1);
    //             this.setState({
    //                 arrayTampungDetail : temporary_result,
    //             },()=> console.log(this.state.arrayTampungDetail))
                
    //             flag = 1
    //             return;
    //         }
    //     }

    //     if(flag === 0){
    //         var temp = todo
    //         console.log("temp",temp);
            
    //         this.setState(prevState =>({
    //             arrayTampungDetail: [...prevState.arrayTampungDetail, temp]
    //         }),()=> console.log(this.state.arrayTampungDetail));
    //     }
    // }


    handleCheckboxClick1(event, detail, index) {
        // console.log("handlecheckboxclick")
        // console.log(this.state.resultPODetailForValidasi)
        // console.log(this.state.insertArray)
        var temporary_result = this.state.arrayTampungDetail;
       
        const checked = event.target.checked;
        var checkedPO = this.state.checkedPO;
        var flag = 0;
        
        if (checked === true) {
            console.log("insertarraydihandlecheck")
            console.log(this.state.insertArray)
            
            for(let j=0; j<this.state.insertArray.length ; j++){
                if(this.state.insertArray[j].POD_Procod === detail.POD_Procod ){
                    flag = 1
                    console.log("temporary result masuk flag = 1")
                }
            }
            if(flag === 0){
                temporary_result.push(detail); //tempArray add
                console.log("temporary result masuk")
            }
            checkedPO[index] = true; //set to True
            
            this.setState({
                checkedPO: checkedPO,
                arrayTampungDetail:temporary_result
                },()=>{console.log("checked",this.state.checkedPO,"arrayTampungDetail",this.state.arrayTampungDetail);
            });    
        } 

        else {
            for(let j=0; j<this.state.insertArray.length ; j++){
                if(this.state.insertArray[j].POD_Procod === detail.POD_Procod ){
                    flag = 1
                }
            }
            if(flag===0)
                temporary_result.splice(temporary_result.indexOf(detail), 1); //tempAray remove
            
            checkedPO[index] = false; //set to False

            this.setState({
                checkedPO: checkedPO,
                arrayTampungDetail:temporary_result
            },()=>{console.log("checked",this.state.checkedPO,"arrayTampungDetail",this.state.arrayTampungDetail);
            });
        }
        console.log("insertArrayPasDiCheck")
        console.log(this.state.insertArray)
    } 


    handleCheckboxClickRO(event, detail, index){
        var temporary_result = this.state.arrayTampungRO;
       
        const checked = event.target.checked; 
        var checkedRO = this.state.checkedRO;

        if (checked === true) {
            temporary_result.push(detail); //tempArray add
            
            checkedRO[index] = true; //set to True

            this.setState({
                checkedRO: checkedRO,
                arrayTampungRO:temporary_result
                },()=>{console.log("checked",this.state.checkedRO,"arrayTampungRO",this.state.arrayTampungRO);
            });

        } 
        else {
            temporary_result.splice(temporary_result.indexOf(detail), 1); //tempAray remove
            
            checkedRO[index] = false; //set to False
            this.setState({
                checkedRO: checkedRO,
                arrayTampungRO:temporary_result
            },()=>{console.log("checked",this.state.checkedRO,"arrayTampungRO",this.state.arrayTampungRO);
            });
        }
    
    }

    // removeDetail(){
    //     console.log("masuk removeDetail")
        
    //     var {checkedPO,resultPODetailForValidasi,resultPODetail,insertArray}=this.state;
    //     var tampilan=[];
    //     var checkedtemp=[];
    //     var count=0;

    //     for(let i = 0 ; i< checkedPO.length ; i++)
    //     {   
    //         //ambil yang tidak dicentang masukan ke array tampilan
    //         if(checkedPO[i]===false){
    //             tampilan.push(resultPODetail[i]);
    //             count+=1;
    //         }
             
    //         else{
                
    //             // if(insertArray.length !== 0){
    //             //     for(let m=0; m<insertArray.length ; m++){
    //             //         if(insertArray[m].POD_Procod === resultPODetail[i].POD_Procod){
    //             //             insertArray.splice(m, 1);
    //             //         }
    //             //     }
    //             // }

    //             for(let j=0; j<resultPODetailForValidasi.length ; j++){
    //                 for(let k=0; k<insertArray.length ; k++){
    //                     if(insertArray[k].POD_Procod === resultPODetail[i].POD_Procod){
                            
    //                         console.log("insertarray yang akan dihapus :"+insertArray[k].POD_Procod+
    //                         "dan resultdetailnya : "+resultPODetailForValidasi[j].POD_Procod)
    //                         console.log("berhasil masuk if hapus insertarray di removedetail")
    //                         console.log(insertArray)

    //                         insertArray.splice(k, 1);
    //                         return
                           
    //                     }
    //                 } 
    //             }
    //         }
    //     }

    //     //kasih validasi check sesuai array tampilan
    //     for(let i = 0 ; i< count ; i++)
    //     {
    //         checkedtemp.push(false);
    //     }

    //     this.setState(prevState=>({
    //         checkedPO:checkedtemp,
    //         resultPODetail:tampilan,
    //         removeArray: [...prevState.removeArray,...this.state.arrayTampungDetail],
    //         arrayTampungDetail : []
    //     }),
    //         ()=>console.log(this.state.checkedPO,"  ",this.state.resultPODetail," YANG DI REMOVE",this.state.removeArray)
    //     );
    //     this.props.sumTotalNettoFromDetailPage(this.state.resultPODetail)
     
    // }


    removeDetail(){
        console.log("masuk removeDetail")
        
        var {checkedPO,resultPODetail,insertArray}=this.state;
        var tampilan=[];
        var checkedtemp=[];
        var count=0;

        for(let i = 0 ; i< checkedPO.length ; i++)
        {   
            //ambil yang tidak dicentang masukan ke array tampilan
            if(checkedPO[i]===false){
                tampilan.push(resultPODetail[i]);
                count+=1;
            }
             
            else{
                if(insertArray.length !== 0){
                    for(let m=0; m<insertArray.length ; m++){
                        if(insertArray[m].POD_Procod === resultPODetail[i].POD_Procod){
                            insertArray.splice(m, 1);
                            break
                        }
                    }
                }
            }
        }

        
        //kasih validasi check sesuai array tampilan
        for(let i = 0 ; i< count ; i++)
        {
            checkedtemp.push(false);
        }

        this.setState(prevState=>({
            checkedPO:checkedtemp,
            resultPODetail:tampilan,
            removeArray: [...prevState.removeArray,...this.state.arrayTampungDetail],
            arrayTampungDetail : []
        }),
            ()=> this.props.sumTotalNettoFromDetailPage(this.state.resultPODetail)
        );

        console.log(this.state.checkedPO,"  ",this.state.resultPODetail," YANG DI REMOVE",this.state.removeArray)
        
       
     
    }

    deleteDetail(){
        var {checkedPO,resultPODetail,insertArray}=this.state;
        var tampilan=[];
        var checkedtemp=[];
        var count=0;

        for(let i = 0 ; i< checkedPO.length ; i++)
        {
            if(checkedPO[i]===false){
                tampilan.push(resultPODetail[i]);
                count+=1;
            }
            // else{
            //     for(let j=0; j<resultPODetailForValidasi.length ; j++){
            //         for(let k=0; k<insertArray.length ; k++){
            //             if(insertArray[k].POD_Procod === resultPODetailForValidasi[j].POD_Procod){
            //                 insertArray.splice(k, 1);
            //                 console.log("berhasil masuk if hapus insertarray di deletedetail")
            //             }
            //         } 
            //     }
            // }
            else{
                if(insertArray.length !== 0){
                    for(let m=0; m<insertArray.length ; m++){
                        if(insertArray[m].POD_Procod === resultPODetail[i].POD_Procod){
                            insertArray.splice(m, 1);
                            break
                        }
                    }
                }
            }
        }
        for(let i = 0 ; i< count ; i++)
        {
            checkedtemp.push(false);
        }
        this.setState( prevState =>({
            checkedPO:checkedtemp,
            resultPODetail:tampilan,
            deleteArray: [...prevState.deleteArray,...this.state.arrayTampungDetail],
            arrayTampungDetail : []
        }),
            ()=> this.props.sumTotalNettoFromDetailPage(this.state.resultPODetail)
        );
        console.log(this.state.checkedPO,"  ",this.state.resultPODetail," YANG DI DELETE",this.state.deleteArray)
    }


    removeOutlet(){
        var {checkedRO}=this.state;
        var tampilan=[];
        var checkedtemp=[];
        var count=0;

        for(let i = 0 ; i< checkedRO.length ; i++)
        {   
            if(checkedRO[i]===false){
                tampilan.push(this.state.resultRO[i]);
                count+=1;
            }
        }
        for(let i = 0 ; i< count ; i++)
        {
            checkedtemp.push(false);
        }

        this.setState(prevState=>({
            checkedRO:checkedtemp,
            resultRO:tampilan,
            removeArrayRO: [...prevState.removeArrayRO,...this.state.arrayTampungRO],
            arrayTampungRO : []
        }),
            ()=>console.log(this.state.checkedPO,"  ",this.state.resultPODetail," OUTLET YANG DI REMOVE",this.state.removeArrayRO)
        );

        console.log(this.state.removeArrayRO)
    }

    deleteOutlet(){
        var {checkedRO}=this.state;
        var tampilan=[];
        var checkedtemp=[];
        var count=0;

        for(let i = 0 ; i< checkedRO.length ; i++)
        {   
            if(checkedRO[i]===false){
                tampilan.push(this.state.resultRO[i]);
                count+=1;
            }
        }
        for(let i = 0 ; i< count ; i++)
        {
            checkedtemp.push(false);
        }

        this.setState(prevState=>({
            checkedRO:checkedtemp,
            resultRO:tampilan,
            deleteArrayRO: [...prevState.deleteArrayRO,...this.state.arrayTampungRO],
            arrayTampungRO : []
        }),
            ()=>console.log(this.state.checkedPO,"  ",this.state.resultPODetail," OUTLET YANG DI DELETE",this.state.deleteArrayRO)
        );

        console.log(this.state.deleteArrayRO)
    }

    printPO(){
        var url = "http://localhost:2222/po?type=insertREORDD";

        var payload = {
            T_POHeader: 
                this.state.resultPOHeader
            ,
            T_PODetail: this.state.resultPODetail
        }

        console.log("fungsi insert reordd")
        console.log(JSON.stringify(payload))

        fetch(url, {
            method: "POST",
            body: JSON.stringify(payload),
            json: true,
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.data === null) {
                    console.log("gagal print")
                }
                else {
                    console.log("berhasil print")
                    this.setState({
                        modal_response: true,
                        responseHeader: "Print",
                        responseMessage: "Print berhasil",
                        
                        modal_print: false,
                    })
                    
                    this.props.refreshPageFunc()
                }
            });

    }


    render() {
        return (
            
            <Page
                title="Detail"
                className="Detail">
               
                <Modal
                    isOpen={this.state.modal_response}
                >
                    <ModalHeader>
                        {this.state.responseHeader}
                    </ModalHeader>
                    <ModalBody>
                        {this.state.responseMessage}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={() => { this.setState({ modal_response: false }) }}>OK</Button>
                    </ModalFooter>
                </Modal>

                <Modal
                    isOpen={this.state.modal_print}
                >
                    <ModalHeader>
                        Print PO
                    </ModalHeader>
                    <ModalBody>
                        Apakah mau melanjutkan print ?
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={()=>this.printPO()}>Iya</Button>
                        <Button color="success" onClick={()=>this.setState({modal_print : false})}>Cancel</Button>
                    </ModalFooter>
                </Modal>

                <Modal
                    isOpen={this.state.modal_add_detail}
                    size="lg"
                    style={{
                        height: "200pw", width: "300pw",
                    }}
                >
                    <ModalHeader>
                        Add Detail
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col xs={2}>
                                <Label>PROCOD</Label>
                            </Col>
                            <Col xs={2}>
                                <Input value={this.state.activeDetailProcod} onChange={(e) => this.inputValue("InputProcod", e)} onKeyPress={e => this.enterPressedSearch(e)} type="text"></Input>
                            </Col>
                            <Col xs={8}>
                                <Input disabled value={this.state.activeDetailName} type="text"></Input>
                            </Col>
                        </Row>
                        
                        <Row className={"mt-2"}>
                            <Col xs={2}>
                              
                            </Col>
                            <Col>
                                Tekan Enter untuk mencari procode
                            </Col>
                        </Row>

                        <Row className={"mt-3"}>
                            <Col xs={2}>
                                <Label>HARGA</Label>
                            </Col>
                            <Col xs={3}>
                                <Input disabled value={this.state.activeDetailHarga} type="text"></Input>
                            </Col>
                            <Col xs={0.1}>
                                <Label>DISC</Label>
                            </Col>
                            <Col xs={2}>
                                <Input disabled value={this.state.activeDetailDisc} type="text"></Input>
                            </Col>
                        </Row>
                        <Row className={"mt-3"}>
                            <Col xs={2}>
                                <Label>QUANTITY</Label>
                            </Col>
                            <Col xs={3}>
                                <Input value={this.state.activeDetailQuantity} onChange={(e) => this.inputValue("InputQuantity", e)} type="number"></Input>
                            </Col>
                            <Col xs={0.1}>
                                <Label>SELLPACK</Label>
                            </Col>
                            <Col xs={2}>
                                <Input disabled value={this.state.activeDetailUnit}></Input>
                            </Col>
                            <Col xs={0.1}>
                                <Label>QTY/SELLPACK : {this.state.activeDetailQuantityFromModulus}</Label>
                            </Col>
                        </Row>
                        <Row className={"mt-3"}>
                            <Col xs={2}>
                                <Label>DISC 2</Label>
                            </Col>
                            <Col xs={2}>
                                <Input value={this.state.activeDetailDisc2} onChange={(e) => this.inputValue("InputDisc2", e)} type="number"></Input>
                            </Col>

                            <Col className={"ml-5"} xs={0.1}>
                                <Label>No.Agree Off Faktur :</Label>
                            </Col>

                            <Col xs={2}>
                                <Input type="text"></Input>
                            </Col>

                        </Row>

                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={() => this.updateResultPODetailArray({ ...this.state.currentDetail })} >
                            Insert
                        </Button>
                        <Button color="success" onClick={() => this.setState({ modal_add_detail: false })} >Close</Button>
                        <Button color="success" >Reset</Button>
                    </ModalFooter>
                </Modal>

                <Table hover
                    style={{
                        marginTop: "15px"
                    }}
                    responsive>
                    <thead>
                        <tr width="100%">
                            <th></th>
                            <th>PROCODE</th>
                            <th>NAMA PRODUK</th>
                            <th>KET</th>
                            <th>QTY</th>
                            <th>BUYPACK</th>
                            <th>UNIT</th>
                            <th>SELLPACK</th>
                            <th>STS</th>
                            <th>LVL</th>
                            <th>HARGA GROSS</th>
                            <th>DISC</th>
                            <th>DISC2</th>
                            <th>TOTAL NETTO BELI</th>
                        </tr>
                    </thead>

                    <tbody>

                        {this.state.resultPODetail.map((detail,index) =>

                            <tr onClick={() => this.getRO(detail.POD_Procod)}>
                                <td>
                                    <Input 
                                        disabled = {this.state.flagButtonDisabled}
                                        checked={this.state.checkedPO[index]}
                                        value={detail}
                                        onClick={event =>
                                          this.handleCheckboxClick1(event, detail, index)
                                        }
                                        type = "checkbox">
                                    </Input>
                                </td>
                                <td>{detail.POD_Procod}</td>
                                <td>{detail.POD_Name}</td>
                                <td>ket</td>
                                <td>{detail.POD_Qty}</td>
                                <td>{detail.POD_BuyPack}</td>
                                <td>{detail.POD_SellUnit}</td>
                                <td>{detail.POD_SellPack}</td>
                                <td>sts</td>
                                <td>lvl</td>
                                <td align="center">
                                    <Label>Rp. </Label>
                                    {
                                        parseInt(Math.round(detail.POD_GrossBeli)).toLocaleString(
                                            'en-US',
                                        )}
                                </td>

                                <td>{detail.POD_Disc} %</td>
                                <td>{detail.POD_Disc2} %</td>
                                <td align="center">
                                    <Label>Rp. </Label>
                                    {
                                        parseInt(Math.round((detail.POD_GrossBeli - (detail.POD_Disc * detail.POD_GrossBeli / 100) - (detail.POD_Disc2 * detail.POD_GrossBeli / 100)) * detail.POD_Qty)).toLocaleString(
                                            'en-US',
                                        )}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>

                <Row >
                    <ButtonGroup size="sm" className={"ml-3"}>
                        <Button disabled={this.state.flagButtonDisabled} onClick={() => this.openModal()} variant="secondary">Add Detail</Button>
                        <Button disabled={this.state.flagButtonDisabled} onClick={()=> this.removeDetail()} variant="secondary">Remove Detail</Button>
                        <Button disabled={this.state.flagButtonDisabled} onClick={()=> this.deleteDetail()} variant="secondary">Delete Detail</Button>
                        <Button disabled={this.state.flagButtonDisabled} variant="secondary">Set Disc2</Button>
                        <Button disabled={this.state.flagButtonDisabled} variant="secondary">Add Bonus</Button>
                    </ButtonGroup>
                </Row>

                <Table
                    style={{
                        marginTop: "15px"
                    }}
                    responsive>
                    {/* <thead>
                            <tr width = "100%">
                            <th>CODE</th>
                            <th>NAMA OUTLET</th>
                            <th>NO.REQ</th>
                            <th>QTY</th> 
                            <th>TGL ORDER</th> 
                            <th>REORDER</th> 
                            <th>LVL</th> 
                            <th>Keterangan</th> 
                            </tr>

                        </thead>
                        <tbody>
                            
                        </tbody> */}

                    <thead>
                        <tr width="100%">
                            <th></th>
                            <th>CODE</th>
                            <th>NAMA OUTLET</th>
                            <th>NO REQ</th>
                            <th>QTY</th>
                            <th>TGL ORDER</th>
                            <th>REORDER</th>
                            <th>LVL</th>
                            <th>Keterangan</th>


                        </tr>
                    </thead>
                    <tbody>
                        {this.state.resultRO.map((ro,index) =>
                            <tr>
                                <td>
                                    <Input 
                                        disabled = {this.state.flagButtonDisabled}
                                        checked={this.state.checkedRO[index]}
                                        value={detail}
                                        onClick={event =>
                                            this.handleCheckboxClickRO(event, detail, index)
                                        }
                                        type = "checkbox">
                                    </Input>
                                </td>
                                <td>{ro.orderlcl_outlet}</td>
                                <td>nama outlet</td>
                                <td>{ro.orderlcl_num}</td>
                                <td>{ro.orderlcl_qty}</td>
                                <td>{ro.orderlcl_tglorder}</td>
                                <td>{ro.orderlcl_tglreord}</td>
                                <td>lvl</td>
                                <td>{ro.orderlcl_keterangan}</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
                <Row >
                    <ButtonGroup size="sm" className={"ml-3"}>
                        <Button disabled={this.state.flagButtonDisabled} onClick ={()=>this.deleteOutlet()} variant="secondary">Delete Outlet</Button>
                        <Button disabled={this.state.flagButtonDisabled} onClick ={()=>this.removeOutlet()} variant="secondary">Remove Outlet</Button>
                    </ButtonGroup>
                </Row>

                
            </Page>
            
            
        );
     
    }
}
export default Purchase_Order_Detail