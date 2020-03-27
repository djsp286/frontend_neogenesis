import Page from 'components/Page';
import SearchInput from 'components/SearchInput';
import React from 'react';
import {
    Button, 
    // Badge,
     Card, 
    CardBody, CardHeader, 
    Col, Row, Table, Modal,
    ModalBody, ModalFooter,
    // DropdownItem,
    // DropdownMenu,
    // DropdownToggle, UncontrolledButtonDropdown,
     ModalHeader, Input, Label,InputGroup, InputGroupAddon, ButtonGroup
} from 'reactstrap';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import { MdDelete, MdSearch,MdLoyalty,MdEdit} from 'react-icons/md';
import { getThemeColors } from 'utils/colors';

import * as myURL from '../urlLink'
const colors = getThemeColors();

class BridgingSick extends React.Component {

    constructor(props) {
        super(props);
        //edited by teddy 08/10/2019
        this.state = {
            result: [],
            inputtedName: "",
            currentPage: 1,
            currentPage2: 1,
            currentPage3: 1, 
            packingPerPage: 5,
            packingPerPage2: 5,
            packingPerPage3: 5,
            totalData: 0,
            flag: 0,
            firstRun: 0,
            searchType:"",
            keyword:"",
            lastPage: 0,
            lastPage2: 0,
            lastPage3: 0,
            statusDisableSearch : true,
            notFound:"none",
            notFound2: "none",
            notFound3: "none",
            result2:[],
            result3: [],
            pro_code:"",
            pro_des:"",
            pro_condition:"",
            ktp_id: "",
            ktp_nama: "",
            modal_nested_parent: false,
            modal_delete: false,
            modal_edit: false,
            modal_nested_edit: false,
            modal_nested: false,
            modal_product: false,
            modal_ktp:false,
            temporary: ""
        };

        //edited by teddy 09/10/2019
        this.clear = this.clear.bind(this);
        this.canceledit = this.canceledit.bind(this);
        this.canceladd = this.canceladd.bind(this);
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        // fetch(myURL.url_tampil_diagnosa)
        //     .then(response => response.json())
        //     .then(data => this.setState({ result: data, isLoading: false }));
        this.toggle('nested_parent')
        this.getListbyPaging(this.state.currentPage, this.state.packingPerPage);
        this.getListProductbyPaging(1, 5);
        this.getListKTPbyPaging(1,5);
    }

    showNotification= (currMessage)=>{
        setTimeout(() => {
            if (!this.notificationSystem) {
              return;
            }
            this.notificationSystem.addNotification({
              title: <MdLoyalty />,
              message:
                currMessage,
              level: 'info',
            });
          }, 100);
    }

    statusPanjangNamaDiagnosa = (input, solusi_id) =>{
        if(input.length <=100){ // edited agnes 9 okt
            if(input.trim().length<=0 || solusi_id.length<=0)
                return false;
            else
                return true;
        }else{
            return false;
        }
    }

    //added by agnes 09-10-2019
    statusValidEditDiagnosa = (input, solusi_id) =>{
        if(input.length <=100){ // edited agnes 9 okt
            if(input.trim().length<=0){
                if(solusi_id.length<=0)
                    return false;
                else
                    return true;
            }  
            else{
                return true;
            }
        }else{
            return false;
        }
    }
    //set Current Limit
    handleSelect(event) {
        this.setState({
            currentPage: 1,
            result: [],
            packingPerPage: event.target.value
        });
        // this.getListbyPaging(1, event.target.value);
        this.handleData(1, event.target.value);
        // this.setState({ [event.target.name]: event.target.value });
    }

    //edited by Teddy 04-10-2019 14:41
    handleData(currPage, currLimit){
        var url;
        if(this.state.keyword!="" && this.state.flagEnterSearch){
            if(this.state.searchType === "brd_id" || 
               this.state.searchType=== "gc_id" || 
               this.state.searchType=== "sl_id" ||
               this.state.searchType === "kp_id"){
                // edited by agnes 9 okt 2019
                if(!isNaN(this.state.keyword)){
                    this.searchByCode(currPage, currLimit, this.state.searchType); // agnes 9 okt 2019
                }else{
                    alert("Kode harus berupa angka")
                }
            }else if(this.state.searchType==="gc_nama" || 
                     this.state.searchType==="sl_nama" ||
                     this.state.searchType==="kp_nama"){
                //update by agnes 9 okt 2019
                this.searchByName(currPage, currLimit, this.state.searchType);   
            }
            else {
                if(this.state.searchType==="pro_code") {
                    this.searchByCode(currPage, currLimit, this.state.searchType);
                }else if(this.state.searchType==="pro_des") {
                    this.searchByName(currPage, currLimit, this.state.searchType);
                }
            }
        }else{
            this.getListbyPaging(currPage, currLimit);
        }
    }

    //set Current Page
    handleWrite(event, flag) {
        if((this.state.currentPage + flag) > 0 || this.state.currentPage == 0){
            if((Number(event.target.value) + flag) <= this.state.lastPage){
                this.setState({
                    currentPage: Number(event.target.value) + flag
                });
            }
        }

        // //console.log("value event: "+ Number(event.target.value)+" "+(Number(event.target.value) + flag));

        if((this.state.currentPage + flag) != 0 && (Number(event.target.value) + flag) <= this.state.lastPage){
            this.handleData((this.state.currentPage + flag), this.state.packingPerPage);
        }
        // //console.log("value event: "+ (this.state.currentPage+flag)+" "+this.state.packingPerPage);
    }

    handleFirst(event) {
        this.setState({
            currentPage: 1
        });
        // this.getListbyPaging(1, this.state.packingPerPage);
        this.handleData(1, this.state.packingPerPage);
    }

    handleLast(event) {
        this.setState({
            currentPage: this.state.lastPage
        });
        // this.getListbyPaging(this.state.lastPage, this.state.packingPerPage);
        this.handleData(this.state.lastPage, this.state.packingPerPage);
    }

    clear(){
        this.setState({
            currentPage: 0
        });
    }

    getListbyPaging(currPage, currLimit){
        var urlA = myURL.url_tampil_bridging

        var payload = {
            limit: currLimit,
            offset: (currPage - 1) * currLimit
        };
        fetch(urlA,{
            method: 'POST',
            body: JSON.stringify(payload),
            json: true,
            headers:{
                "Content-type":"application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .then(data=>{ //console.log(data["masterResponse"].length);
            this.setState({result:data["masterResponse"], 
            lastPage: data["lastPage"], 
            isLoading: false,
            notFound: "none"}); 
        } );
        
        this.toggle('nested_parent')
    }

    enterPressed(event) {
        var code = event.keyCode || event.which;
        if(code === 13) {
            event.preventDefault();
            //console.log("a Hit");
            this.getListbyPaging(this.state.currentPage, this.state.packingPerPage);
        }
    }
    
    // edited by Teddy 04-10-2019 14:41
    enterSearchPressed(event) {
        var code = event.keyCode || event.which;
        this.setState({flagEnterSearch : false})
        if(code === 13) {
            event.preventDefault();
            this.setState({currentPage:1, flagEnterSearch : true});
            var url;
            if(this.state.searchType === "brd_id" || 
               this.state.searchType=== "gc_id" || 
               this.state.searchType=== "sl_id" ||
               this.state.searchType === "kp_id"){
                //edited by agnes 9 okt 2019
                if(!isNaN(this.state.keyword)){
                    this.searchByCode(1, this.state.packingPerPage, this.state.searchType);
                }else{
                    alert("Kode harus berupa angka")
                }
            }
            else if(this.state.searchType==="gc_nama" || 
                    this.state.searchType==="sl_nama" ||
                    this.state.searchType==="kp_nama"){
                //updated by agnes 9 okt 2019
                this.searchByName(1, this.state.packingPerPage, this.state.searchType);   
            }
            else {
                if(this.state.searchType==="pro_code") {
                    this.searchByCode(1, this.state.packingPerPage, this.state.searchType);
                }else if(this.state.searchType==="pro_des") {
                    this.searchByName(1, this.state.packingPerPage, this.state.searchType);
                }
            }
        }
    }

    // edit by claudina 4 okt 2019
    insertMasterBridgingSick = (pro_code, ktp_id) => () => {
        if(pro_code == "" || ktp_id == ""){ // agnes 09-10-19
            alert("Product ID (Procode) atau Kateogri Print tidak boleh kosong");
        }else{
            var payload={
                procode: pro_code,
                // sls_mc_id : sl_id,
                // gdiag_gc_id: gc_id,
                ktp_sgc_id: ktp_id,
                update_id: "190182P",
                inputSearch : this.state.keyword,
                limit : this.state.packingPerPage,
                tipeSearch : this.state.searchType
            }
            fetch(myURL.url_tambah_bridging,{
                method: "POST",
                body: JSON.stringify(payload),
                json: true,
                headers:{
                    "Content-type":"application/json; charset=UTF-8"
                }
            }).then(response => response.json())
            .then(data=>{ 
                if(data["status"]==="Success"){
                    this.setState({
                        lastPage : data["lastPage"]
                    });
                    this.state.pro_code = "";
                    this.state.pro_des = "";
                    this.state.pro_condition = "";
                    this.state.ktp_id = "";
                    this.state.ktp_nama = "";
                    this.state.modal_nested = false;
                    this.state.modal_nested_parent = false;
                    this.setState({
                        currentPage:this.state.lastPage
                    });
                    this.handleData(this.state.lastPage, this.state.packingPerPage);
                    this.showNotification("Data Bridging berhasil disimpan");
                    
                }
                // else if(data["status"] === 'Invalid'){
                //     // this.state.modal_nested = false;
                //     // this.toggle('nested');
                //     alert("Data "+param+" sudah ada");
                // }
                else{
                    alert("Gagal Menyimpan Data")
                }
            });
        }
    }
    
    // edit by claudina 4 okt 2019
    deletebridging = (brd_id, userid) => () => {
        //console.log(brd_id);
        var payload={
            brd_id:  brd_id,
            brd_update_id: userid,
            inputSearch : this.state.keyword,
            limit: this.state.packingPerPage,
            tipeSearch: this.state.searchType
        }
        fetch(myURL.url_hapus_bridging,{
            method: 'POST',
            body: JSON.stringify(payload),
            json: true,
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then(response => response.json())
        .then(data=>{ 
            if(data["status"]==="Success"){
                this.setState({
                    lastPage : data["lastPage"]
                });
                this.state.modal_delete = false;
                this.state.pro_code = "";
                this.state.pro_des = "";
                this.state.pro_condition = "";
                this.state.ktp_id = "";
                this.state.ktp_nama = "";
                if(this.state.currentPage >= this.state.lastPage){
                    this.setState({
                        currentPage:this.state.lastPage
                    });
                    this.handleData(this.state.lastPage, this.state.packingPerPage);
                }else{
                    this.handleData(this.state.currentPage, this.state.packingPerPage);
                }
                this.showNotification("ID Bridging: "+brd_id+" berhasil dihapus");
            }
            // else  if(data["status"]==="Invalid"){
            //     alert("Data tidak dapat dihapus, karena masih aktif digunakan")
            // }
            else{
                alert("Gagal Menyimpan Data")
            }
        }); 
    }

    //edited by Teddy 04-10-2019 14:41
    //edited by Teddy 08-10-2019 14:41
    editbridging = (brd_id, pro_code, ktp_sgc_id) => () => {
        var url = myURL.url_edit_bridging;
        if(pro_code == "" || ktp_sgc_id == ""){ // edited agnes 9 okt 2019
            alert("Product ID (Pro code) atau Kategori Print ID tidak boleh kosong");
        }else{
            //console.log(brd_id + " " + pro_code + " " + ktp_sgc_id);
            var payload={  
                brd_id: brd_id,
                procode: pro_code,
                ktp_sgc_id: ktp_sgc_id,
                update_id:"190182P",
                inputSearch: this.state.keyword,
                limit: this.state.packingPerPage,
                tipeSearch: this.state.searchType
            }
            fetch(url, {
                method: 'POST',
                body: JSON.stringify(payload),
                json: true,
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            }).then(response => response.json())
            .then(data=>{ 
                //console.log("data"+data);
                if(data["status"]==="Success"){
                    this.setState({
                        lastPage : data["lastPage"]
                    });
                    //console.log("data last page edit"+this.state.lastPage);
                    this.state.modal_edit = false;
                    this.state.modal_nested_edit = false;
                    this.state.pro_code = "";
                    this.state.pro_des = "";
                    this.state.pro_condition = "";
                    this.state.ktp_id = "";
                    this.state.ktp_nama = "";
                    if(this.state.currentPage >= this.state.lastPage){
                        this.setState({
                            currentPage:this.state.lastPage
                        });
                        this.handleData(this.state.lastPage, this.state.packingPerPage);
                    }else{
                        this.handleData(this.state.currentPage, this.state.packingPerPage);
                    }
                    this.showNotification("Bridging ID "+brd_id+" berhasil diubah");
                }else{
                    alert("Gagal Menyimpan Data")
                }
            }); 
        }
    }

    // //edited by Teddy 04-10-2019 14:41
    searchByName(currPage, currLimit, typeSearch){
        // edited by agnes 9-10-2019
        var url;
        if(typeSearch==="gc_nama"){
            url = myURL.url_cari_bridging_gcnama
        }else if(typeSearch==="sl_nama"){
            url= myURL.url_cari_bridging_mcnama
        }else if(typeSearch==="kp_nama") {
            url= myURL.url_cari_bridging_sgcnama
        }else if(typeSearch==="pro_des") {
            url= myURL.url_cari_bridging_prodes
        }
        //console.log(url);
        //console.log("search name.."+this.state.keyword)
        var payload={  
            "inputSearch" : this.state.keyword,
            "limit": currLimit,
            "offset": (currPage - 1) * currLimit
        }
        //console.log(payload);

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .then(data=>{ 
            if(data["masterResponse"].length == 0) {
                this.setState({
                    notFound: "block"
                });
            }else {
                this.setState({
                    notFound: "none"
                });
            }
            this.setState({
            result:data["masterResponse"], 
            lastPage: data["lastPage"], 
            isLoading: false}); 
        });
    }

    //edited by Teddy 04-10-2019 14:41
    searchByCode(currPage, currLimit, typeSearch){
        //edited by agnes 9-10-2019
        var url ;
        if(typeSearch==="gc_id"){
            url = myURL.url_cari_bridging_gcid
        }else if(typeSearch==="sl_id"){
            url= myURL.url_cari_bridging_mcid
        }else if(typeSearch==="kp_id") {
            url= myURL.url_cari_bridging_sgcid
        }else if(typeSearch==="brd_id") {
            url= myURL.url_cari_bridging_brdid
        }else if(typeSearch==="pro_code"){
            url= myURL.url_cari_bridging_procode
        }

        //console.log("search code.."+url);
        //console.log("search code.."+this.state.keyword)
        var payload={  
            "inputSearch" : this.state.keyword,
            "limit": currLimit,
            "offset": (currPage - 1) * currLimit
        }
        //console.log("search code.."+payload);
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .then(data=>{ 
            if(data["masterResponse"].length == 0){
                this.setState({
                    notFound: "block"
                }); 
            }else{
                this.setState({
                    notFound: "none"
                }); 
            }
            this.setState({
            result:data["masterResponse"], 
            lastPage: data["lastPage"], 
            isLoading: false}); 
        });
        //console.log("search by code last:"+this.state.lastPage); 
        //console.log("search code last"+this.state.lastPage);
    }

    updateInputValue(evt) {
        this.setState({
            inputtedName: evt.target.value
        });
    }

    updateInputValue_id_mc(evt) {
        this.setState({
            inputtedID: evt.target.value
        });
    }

    updateSearchValue(evt){
        this.setState({
            keyword: evt.target.value
        });

        if(evt.target.value === ""){
            this.setState({
                statusDisableSearch: true,
                selectedOption: 'ShowAll'
            });
            this.getListbyPaging(1, this.state.packingPerPage);
        }
    }

    //edited by Teddy 04-10-2019 14:41
    sendSearchParam = param => () =>{
        var url;
        this.setState({currentPage: 1, flagEnterSearch:true});

        if(this.state.searchType === "brd_id" || 
           this.state.searchType=== "gc_id" || 
           this.state.searchType=== "sl_id" ||
           this.state.searchType === "kp_id"){
            if(!isNaN(this.state.keyword)){
                //edited by agnes 9 okt 2019
                this.searchByCode(1, this.state.packingPerPage, this.state.searchType);
            }else{
                alert("Kode harus berupa angka")
            }
        }
        else if(this.state.searchType==="gc_nama" || 
                this.state.searchType==="sl_nama" ||
                this.state.searchType==="kp_nama"){
            //update by agnes 9 okt 2019
            this.searchByName(1, this.state.packingPerPage, this.state.searchType);  
        }
        else {
            if(this.state.searchType==="pro_code") {
                this.searchByCode(1, this.state.packingPerPage, this.state.searchType);
            }else if(this.state.searchType==="pro_des") {
                this.searchByName(1, this.state.packingPerPage, this.state.searchType);
            }
        }
    }

    //edited by Teddy 04-10-2019 14:41
    updateSelectionValue(evt){
        var url;
        this.setState({
            currentPage: 1,
            selectedOption: evt.target.value
        });
        if(evt.target.value==="brd_id")
        { 
            this.setState({searchType:"brd_id", statusDisableSearch:false})   
        }
        else if(evt.target.value==="pro_code")
        {
            this.setState({searchType:"pro_code", statusDisableSearch: false}) 
        }
        else if(evt.target.value==="pro_des")
        {
            this.setState({searchType:"pro_des", statusDisableSearch: false}) 
        }
        else if(evt.target.value==="gc_id")
        {
            this.setState({searchType:"gc_id", statusDisableSearch: false}) 
        }
        else if(evt.target.value==="gc_nama")
        {
            this.setState({searchType:"gc_nama", statusDisableSearch: false}) 
        }
        else if(evt.target.value==="kp_id")
        {
            this.setState({searchType:"kp_id", statusDisableSearch: false}) 
        }
        else if(evt.target.value==="kp_nama")
        {
            this.setState({searchType:"kp_nama", statusDisableSearch: false}) 
        }
        else if(evt.target.value==="sl_id") 
        {
            this.setState({searchType:"sl_id", statusDisableSearch: false}) 
        }
        else if(evt.target.value==="sl_nama")
        {
            this.setState({searchType:"sl_nama", statusDisableSearch: false}) 
        }
        else if(evt.target.value==="Show_All"){
            this.setState({
                statusDisableSearch:true,
                keyword:""
            })
            this.getListbyPaging(1, this.state.packingPerPage);
        }
    }

    deleteModalWithItemID(brd_id, pro_code, pro_des, pro_condition, sgc_id, sgc_name, userid){
        this.setState({
            modal_delete: true,
            brd_id: brd_id,
            pro_code: pro_code,
            pro_des: pro_des,
            pro_condition: pro_condition,
            ktp_id: sgc_id,
            ktp_nama: sgc_name,
            activeUserId : userid
        })
    }

    // //edited by Teddy 04-10-2019 14:41
    editModalWithItemID(brd_id, pro_code, pro_des, pro_condition, sgc_id, sgc_name, userid){
        this.setState({
            modal_edit: true,
            brd_id: brd_id,
            pro_code: pro_code,
            pro_des: pro_des,
            pro_condition: pro_condition,
            ktp_id: sgc_id,
            ktp_nama: sgc_name,
            activeUserId : userid
        });
    }

    stateDropDown(status){
        this.setState({
            dropdown_value:status
        })
    }

    //edited by teddy 08/10/2019
    state = {
        modal: false,
        modal_backdrop: false,
        modal_nested_parent: false,
        modal_delete: false,
        modal_edit: false,
        modal_nested_edit: false,
        modal_nested: false,
        modal_solusi: false,
        backdrop: true,
        statusDisableSearch : true,
        selectedOption: 'ShowAll',
        flagEnterSearch :false,
        flagEnterSearch2 :false,
        flagEnterSearch3 :false,
        inputtedID:"",
        notFound2:"none"
    };

    //edited by teddy 09/10/2019
    toggle = modalType => () => {
        if (!modalType) {
            return this.setState({
                modal: !this.state.modal,
            });
        }
        
        this.setState({
            [`modal_${modalType}`]: !this.state[`modal_${modalType}`]
            
        });

        if(modalType==="product" && !this.state.modal_product){
            this.setState({
                currentPage2:1,
                keyword2: ""
            });
            this.getListProductbyPaging(1, 5);
        }

        if(modalType === "ktp" && !this.state.modal_ktp) {
            this.setState({
                currentPage3:1,
                keyword3: ""
            });
            this.getListKTPbyPaging(1, 5);
        }

        if(modalType === "nested_parent" && !this.state.modal_nested_parent) {
            this.setState({
                pro_code: "",
                inputtedName:"",
                pro_des:"",
                pro_condition: "",
                ktp_id: "",
                ktp_nama: "",
            });
        }
    };

    stateCurrentPage(){
        this.setState({currentPage:1});
    }

    //product
    // all edited by teddy 08/10/2019
    getListProductbyPaging(currPage, currLimit){
        var urlA = myURL.url_tampil_produk
        urlA = urlA+"?page="+currPage+"&length="+currLimit;
        fetch(urlA)
        .then(response => response.json())
        .then(data=>{
            this.setState({result2:data["data"], 
            lastPage2: data["metadata"]["maxpage"], 
            isLoading: false,
            notFound2:"none"
            }); 
        });
    }

    pilihProduct(pro_code, pro_des, pro_condition){
        this.state.pro_code = pro_code;
        this.state.pro_des = pro_des;
        this.state.pro_condition = pro_condition;

        this.setState({
            modal_product :!this.state.modal_product,
            keyword2: ""
        });

    }

    searchProduct(currPage, currLimit){
        var urlA = myURL.url_tampil_produk
        urlA = urlA+"?findby=codename&page="+currPage+"&length="+currLimit;
        var payload = {
            keyword: this.state.keyword2
        };
        fetch(urlA,{
            method: 'POST',
            body: JSON.stringify(payload),
            json: true,
            headers:{
                "Content-type":"application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .then(data=>{

            if(data["data"] == null){
                this.setState({
                    notFound2: "block"
                }); 
            }else{
                this.setState({
                    notFound2: "none"
                }); 
            }

            //console.log(data) 
            this.setState({
                result2:data["data"], 
                lastPage2: data["metadata"]["maxpage"], 
                isLoading: false
            }); 
        });
    }

    enterPressed2(event) {
        var code = event.keyCode || event.which;
        if(code === 13) {
            event.preventDefault();
            //console.log("a Hit");
            this.getListProductbyPaging(this.state.currentPage2, this.state.packingPerPage2);
        }
        //console.log(this.state.currentPage2 + " " + this.state.packingPerPage2);
    }

    updateSearchValue2(evt){
        this.setState({
            keyword2: evt.target.value
        });

        // if(this.state.keyword2 === ""){
        //     this.getListProductbyPaging(1, this.state.packingPerPage2);
        // }
        // var code = evt.keyCode || evt.which;
        // if(code === 13) {
        //     evt.preventDefault();
        //     this.sendSearchParam();
        // }
    }


    enterSearchPressed2(event) {
        var code = event.keyCode || event.which;
        // //console.log("search key"+code)
        // //console.log("search key name"+this.state.keyword)
        this.setState({flagEnterSearch2 : false})
        if(code === 13) {
            event.preventDefault();
            this.setState({currentPage2: 1, flagEnterSearch2 : true});
            // //console.log("search key page"+this.state.currentPage)
            // if(!isNaN(this.state.keyword2)){
            //     this.searchByCodeSolusi();
            // }else{
            //     alert("Kode harus berupa angka")
            // }
            //console.log(this.state.currentPage2);
            this.searchProduct(1, 5);
        }
    }

    sendSearchParam2 = param => () =>{
        this.setState({currentPage2: 1, flagEnterSearch2:true});
        // if(!isNaN(this.state.keyword2)){
        //     this.searchByCodeSolusi();
        // }else{
        //     alert("Kode harus berupa angka")
        // }
        this.searchProduct(this.state.currentPage2, 5);
    }

    handleSelect2(event) {
        this.setState({
            currentPage2: 1,
            result2: [],
            packingPerPage2: event.target.value
        });

        // this.getListbyPaging(1, event.target.value);
        this.handleData2(1, event.target.value);

        // this.setState({ [event.target.name]: event.target.value });
    }

    handleFirst2(event) {
        this.setState({
            currentPage2: 1
        });
        // this.getListbyPaging(1, this.state.packingPerPage);
        this.handleData2(1, 5);
    }

    handleLast2(event) {
        this.setState({
            currentPage2: this.state.lastPage2
        });
        // this.getListbyPaging(this.state.lastPage, this.state.packingPerPage);
        this.handleData2(this.state.lastPage2, 5);
    }

    handleWrite2(event, flag) {
        if((this.state.currentPage2 + flag) > 0 || this.state.currentPage2 == 0){
            if((Number(event.target.value) + flag) <= this.state.lastPage2){
                this.setState({
                    currentPage2: Number(event.target.value) + flag
                });
            }
        }

        // //console.log("value event: "+ Number(event.target.value)+" "+(Number(event.target.value) + flag));

        if((this.state.currentPage2 + flag) != 0 && (Number(event.target.value) + flag) <= this.state.lastPage2){
            this.handleData2((this.state.currentPage2 + flag), this.state.packingPerPage2);
        }
        // //console.log("value event: "+ (this.state.currentPage+flag)+" "+this.state.packingPerPage);
    }

    handleData2(currPage, currLimit){
        //console.log("lastpage"+this.state.lastPage2);
        if(this.state.keyword2!="" && this.state.flagEnterSearch2){
            // if(!isNaN(this.state.keyword2)){
            //     this.searchByCodeSolusi();
            // }else{
            //     alert("Kode harus berupa angka")
            // }
           
            this.searchProduct(currPage, currLimit);
        }else{
            this.getListProductbyPaging(currPage, currLimit);
        }
    }

    //tc
    // all edited by teddy 08/10/2019
    getListKTPbyPaging(currPage, currLimit){
        var urlA = myURL.url_tampil_kp
        var payload = {
            limit: currLimit,
            offset: (currPage - 1) * currLimit
        };
        fetch(urlA,{
            method: 'POST',
            body: JSON.stringify(payload),
            json: true,
            headers:{
                "Content-type":"application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .then(data=>{
            this.setState({
                result3:data["masterKategoriPrintList"], 
                lastPage3: data["lastPage"], 
                isLoading: false,
                notFound3:"none"
            }); 
        });
    }

    pilihKategoriPrint(ktp_id, ktp_nama){
        this.state.ktp_id = ktp_id;
        this.state.ktp_nama = ktp_nama;
        this.setState({
            modal_ktp :!this.state.modal_ktp,
            keyword3: ""
        });
    }

    searchKTP(currPage, currLimit){
        var urlA = myURL.url_cari_idnamakategoriprint
        var payload = {
            inputSearch: this.state.keyword3,
            limit: currLimit,
            offset: (currPage - 1) * currLimit
        };
        fetch(urlA,{
            method: 'POST',
            body: JSON.stringify(payload),
            json: true,
            headers:{
                "Content-type":"application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .then(data=>{

            if(data["masterKategoriPrintList"].length == 0){
                this.setState({
                    notFound3: "block"
                }); 
            }else{
                this.setState({
                    notFound3: "none"
                }); 
            }

            //console.log(data) 
            this.setState({
                result3: data["masterKategoriPrintList"], 
                lastPage3: data["lastPage"], 
                isLoading: false
            }); 
        });
    }

    enterPressed3(event) {
        var code = event.keyCode || event.which;
        if(code === 13) {
            event.preventDefault();
            //console.log("a Hit");
            this.getListKTPbyPaging(this.state.currentPage3, this.state.packingPerPage3);
        }
        //console.log(this.state.currentPage3 + " " + this.state.packingPerPage3);
    }

    updateSearchValue3(evt){
        this.setState({
            keyword3: evt.target.value
        });

        // if(this.state.keyword3 === ""){
        //     this.getListKTPbyPaging(1, this.state.packingPerPage3);
        // }
    }


    enterSearchPressed3(event) {
        var code = event.keyCode || event.which;
        this.setState({flagEnterSearch3 : false})
        if(code === 13) {
            event.preventDefault();
            this.setState({currentPage3: 1, flagEnterSearch3 : true});
            this.searchKTP(1, 5);
        }
    }

    sendSearchParam3 = param => () =>{
        this.setState({currentPage3: 1, flagEnterSearch3:true});
        this.searchKTP(this.state.currentPage3, 5);
    }

    handleSelect3(event) {
        this.setState({
            currentPage3: 1,
            result3: [],
            packingPerPage3: event.target.value
        });
        this.handleData3(1, event.target.value);
    }

    handleFirst3(event) {
        this.setState({
            currentPage3: 1
        });
        this.handleData3(1, 5);
    }

    handleLast3(event) {
        this.setState({
            currentPage3: this.state.lastPage3
        });
        this.handleData3(this.state.lastPage3, 5);
    }

    handleWrite3(event, flag) {
        if((this.state.currentPage3 + flag) > 0 || this.state.currentPage3 == 0){
            if((Number(event.target.value) + flag) <= this.state.lastPage3){
                this.setState({
                    currentPage3: Number(event.target.value) + flag
                });
            }
        }

        // //console.log("value event: "+ Number(event.target.value)+" "+(Number(event.target.value) + flag));

        if((this.state.currentPage3 + flag) != 0 && (Number(event.target.value) + flag) <= this.state.lastPage3){
            this.handleData3((this.state.currentPage3 + flag), this.state.packingPerPage3);
        }
        // //console.log("value event: "+ (this.state.currentPage+flag)+" "+this.state.packingPerPage);
    }

    handleData3(currPage, currLimit){
        //console.log("lastpage"+this.state.lastPage3);
        if(this.state.keyword3!="" && this.state.flagEnterSearch3){
            this.searchKTP(currPage, currLimit);
        }else{
            this.getListKTPbyPaging(currPage, currLimit);
        }
    }

    //added by teddy 09/10/2019
    canceladd() {
        this.state.modal_nested_parent = false;
        this.setState({
            pro_code: "",
            inputtedName:"",
            pro_des:"",
            pro_condition: "",
            ktp_id: "",
            ktp_nama: "",
            currentPage2:1,
            currentPage3:1
        });
    }

    //added by teddy 09/10/2019
    canceledit(){
        this.state.modal_edit = false;
        this.setState({
            pro_code: "",
            pro_des:"",
            pro_condition: "",
            ktp_id: "",
            ktp_nama: "",
            currentPage2:1,
            currentPage3:1
        });
    }

    render() {
        const { result, currentPage, packingPerPage} = this.state;

        const currentResult = this.state.result;

        const renderBridging = currentResult && currentResult.map((bridging) => {
            return <tr>
                <th scope="row" className="align-middle">{bridging.brd_id}</th>
                <td className="align-middle">{bridging.pro_code}</td>
                <th scope="row" className="align-middle">{bridging.pro_des}</th>
                <td className="align-middle">
                    <Table> 
                        <td style={{borderStyle: "none", padding: "0"}} width="50%">
                            <tr>SGC (TC Print) ID</tr>
                        </td>
                        <td style={{borderStyle: "none", padding: "0"}}>
                            <tr>{bridging.ktprint_sgc_id}</tr>
                        </td>
                    </Table>

                    <Table> 
                        <td style={{borderStyle: "none", padding: "0"}} width="50%">
                            <tr>SGC (TC Print) Nama</tr>
                        </td>
                        <td style={{borderStyle: "none", padding: "0"}}>
                            <tr>{bridging.ktprint_sgc_name}</tr>
                        </td>
                    </Table> 

                    <Table> 
                        <td style={{borderStyle: "none", padding: "0"}} width="50%">
                            <tr>GC ID</tr>
                        </td>
                        <td style={{borderStyle: "none", padding: "0"}}>
                            <tr>{bridging.gdiag_gc_id}</tr>
                        </td>
                    </Table> 

                    <Table> 
                        <td style={{borderStyle: "none", padding: "0"}} width="50%">
                            <tr>GC Nama</tr>
                        </td>
                        <td style={{borderStyle: "none", padding: "0"}}>
                            <tr>{bridging.gdiag_gc_name}</tr>
                        </td>
                    </Table> 

                    <Table> 
                        <td style={{borderStyle: "none", padding: "0"}} width="50%">
                            <tr>MC ID</tr>
                        </td>
                        <td style={{borderStyle: "none", padding: "0"}}>
                            <tr>{bridging.solusi_mc_id}</tr>
                        </td>
                    </Table> 

                    <Table> 
                        <td style={{borderStyle: "none", padding: "0"}} width="50%">
                            <tr>MC Nama</tr>
                        </td>
                        <td style={{borderStyle: "none", padding: "0"}}>
                            <tr>{bridging.solusi_mc_name}</tr>
                        </td>
                    </Table>
                </td>
                <td className="align-middle">
                    <Button color="secondary" size="sm" style={{marginTop:'7px',marginRight:'5px', background: "orange", border:"none"}}onClick={()=>this.editModalWithItemID(bridging.brd_id, bridging.pro_code, bridging.pro_des, bridging.pro_con, bridging.ktprint_sgc_id, bridging.ktprint_sgc_name)}><MdEdit/></Button> 
                    <Button color="secondary" size="sm" style={{marginTop:'7px', background: "red", border:"none"}}onClick={()=>this.deleteModalWithItemID(bridging.brd_id, bridging.pro_code, bridging.pro_des, bridging.pro_con, bridging.ktprint_sgc_id, bridging.ktprint_sgc_name)}><MdDelete/></Button> 
                </td>
                <td></td>
            </tr>
        });

        const currentResult2 = this.state.result2;

        const renderProduct = currentResult2 && currentResult2.map((product) => {
            return <tr>
                <th scope="row">{product.pro_code}</th>
                <td>{product.pro_name}</td>
                <td>{product.pro_ctrlcode}</td>
                <td>
                    <Button color="secondary" size="sm" style={{marginTop:'7px',marginRight:'5px', background: "orange", border:"none"}}onClick={()=>this.pilihProduct(product.pro_code, product.pro_name, product.pro_activeyn)}>OK</Button> 
                </td>
                <td></td>
            </tr>
        });

        const currentResult3 = this.state.result3;
        const renderTC = currentResult3 && currentResult3.map((ktp) => {
            return <tr>
                <th scope="row">{ktp.kp_id}</th>
                <td>{ktp.kp_nama}</td>
                <td>
                    <Button color="secondary" size="sm" style={{marginTop:'7px',marginRight:'5px', background: "orange", border:"none"}}onClick={()=>this.pilihKategoriPrint(ktp.kp_id, ktp.kp_nama)}>OK</Button> 
                </td>
                <td></td>
            </tr>
        });

        return (
            <Page
                title="Bridging Sick"
                breadcrumbs={[{ name: 'BridgingSick', active: true }]}
                className="BridgingSick">
                <Row>
                    <Col>
                        <Card className="mb-3">
                            <NotificationSystem
                                dismissible={false}
                                ref={notificationSystem =>
                                    (this.notificationSystem = notificationSystem)
                                }
                                style={NOTIFICATION_SYSTEM_STYLE}
                            />
                            <CardHeader className="d-flex justify-content-between">
                            <form name ="form1" style={{paddingTop:"10", marginRight:"0.2vw"}}>
                                <select value={this.state.selectedOption} name="filtermenu" class="dropdown-toggle btn btn-primary" style={{background: '#4db6ac', borderStyle: 'none'}} onChange={evt => this.updateSelectionValue(evt)} >
                                <option value="Show_All">Pilih</option>
                                <option value="brd_id">BRD ID</option>
                                <option value="pro_code">Pro Code</option>
                                <option value="pro_des">Pro Des</option>
                                {/* <option value="tc_id">TC ID</option>
                                <option value="tc_nama">TC Nama</option> */}
                                <option value="gc_id">GC ID</option>
                                <option value="gc_nama">GC Nama</option>
                                <option value="sl_id">MC ID</option>
                                <option value="sl_nama">MC Nama</option>
                                <option value="kp_id">SGC ID</option>
                                <option value="kp_nama">SGC Nama</option>
                                </select>
                            </form>

                            <Input
                                type="search"
                                className="cr-search-form__input"
                                placeholder="Search..."
                                value = {this.state.keyword}
                                style={{marginRight:"0.2vw"}}
                                disabled={this.state.statusDisableSearch}
                                onChange={evt => this.updateSearchValue(evt)}
                                onKeyPress={(e) => this.enterSearchPressed(e)}
                            />
                            <Button size="sm" style={{background: '#4db6ac', borderStyle: 'none', justifyContent:'center',alignItems:'center', marginRight: "0.2vw", width:"4em"}} onClick={this.sendSearchParam()}
                                disabled={this.state.statusDisableSearch}><MdSearch/>
                            </Button>
                            <Button size="sm" style={{marginTop:'1px',background:"#f57c00", border:"none"}}onClick={this.toggle('nested_parent')}>Tambah</Button>
                            <Modal
                                isOpen={this.state.modal_nested_parent}
                                toggle={this.toggle('nested_parent')}
                                className={this.props.className}>
                                <ModalHeader style={{background: "#38ada7", color: "white"}} toggle={this.toggle('nested_parent')}>
                                    Tambah Bridging Sick
                                </ModalHeader>
                                <ModalBody>
                                    <Label>Product Code</Label>
                                    <Row>
                                        <Col>
                                            <Input type="procode" value={this.state.pro_code} onChange={evt => this.updateInputValue_id_mc(evt)} name="procode" placeholder="Product Code" />
                                        </Col>
                                        <Col>
                                            <Button size="sm" style={{marginTop:'4px',background:"#f57c00", border:"none"}}onClick={this.toggle('product')}> . . . </Button>
                                        </Col>
                                    </Row>
                                    <strong>Product Description: {this.state.pro_des}</strong>
                                    <br/>
                                    <strong>Product Condition: {this.state.pro_condition}</strong>
                                    <br/>
                                    <Label>Kategori Print ID</Label>
                                    <Row>
                                        <Col>
                                            <Input type="idktp" value={this.state.ktp_id} onChange={evt => this.updateInputValue_id_mc(evt)} name="idktp" placeholder="Kategori Print ID" />
                                        </Col>
                                        <Col>
                                            <Button size="sm" style={{marginTop:'4px',background:"#f57c00", border:"none"}}onClick={this.toggle('ktp')}> . . . </Button>
                                        </Col>
                                    </Row>
                                    <strong>Kategori Print Nama: {this.state.ktp_nama}</strong>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="primary" onClick={ this.toggle('nested')}>
                                        Simpan
                                </Button>
                                    <Modal
                                        isOpen={this.state.modal_nested}
                                        toggle={this.toggle('nested')}>
                                        <ModalHeader style={{background: "#38ada7", color: "white"}}>Konfirmasi Penyimpanan</ModalHeader>
                                        <ModalBody>
                                            <strong>Pro Code: {this.state.pro_code}</strong>
                                            <br/>
                                            <strong>Pro Des: {this.state.pro_des}</strong>
                                            <br/>
                                            <strong>Kategori Print ID: {this.state.ktp_id}</strong>
                                            <br/>
                                            <strong>Kategori Print Nama: {this.state.ktp_nama}</strong>
                                            <br/>
                                            Apakah Anda yakin ingin menyimpan data ini?
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button 
                                                color="primary" 
                                                onClick={this.insertMasterBridgingSick(this.state.pro_code, this.state.ktp_id)}>
                                                Ya
                                            </Button>{' '}
                                            <Button
                                                color="secondary"
                                                onClick={this.toggle('nested')}>
                                                Tidak
                                            </Button>
                                        </ModalFooter>
                                    </Modal>
                                    {' '}
                                <Button color="secondary" onClick={this.canceladd}>
                                    Batal
                                </Button>
                                </ModalFooter>
                            </Modal>

                            {/* EDIT */}
                            {/* edited by Teddy 09-10-2019 14:41 */}
                            <Modal
                                isOpen={this.state.modal_edit}
                                toggle={this.toggle('edit')}
                                className={this.props.className}>
                                    
                                <ModalHeader style={{background: "#38ada7", color: "white"}} toggle={this.toggle('edit')}>
                                    Edit Bridging Sick
                                </ModalHeader>
                                <ModalBody>
                                    <strong>Bridging ID: {this.state.brd_id}</strong>
                                    <br/>
                                    <Label>Product Code</Label>
                                    <Row>
                                        <Col>
                                            <Input type="procode" value={this.state.pro_code} onChange={evt => this.updateInputValue_id_mc(evt)} name="procode" placeholder="Product Code" />
                                        </Col>
                                        <Col>
                                            <Button size="sm" style={{marginTop:'4px',background:"#f57c00", border:"none"}}onClick={this.toggle('product')}> . . . </Button>
                                        </Col>
                                    </Row>
                                    <strong>Product Description: {this.state.pro_des}</strong>
                                    <br/>
                                    <strong>Product Condition: {this.state.pro_condition}</strong>
                                    <br/>
                                    <Label>Kategori Print ID</Label>
                                    <Row>
                                        <Col>
                                            <Input type="idktp" value={this.state.ktp_id} onChange={evt => this.updateInputValue_id_mc(evt)} name="idktp" placeholder="Kategori Print ID" />
                                        </Col>
                                        <Col>
                                            <Button size="sm" style={{marginTop:'4px',background:"#f57c00", border:"none"}}onClick={this.toggle('ktp')}> . . . </Button>
                                        </Col>
                                    </Row>
                                    <strong>Kategori Print Nama: {this.state.ktp_nama}</strong>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="primary" onClick={this.toggle('nested_edit')}>
                                        Simpan
                                </Button>
                                    <Modal
                                        isOpen={this.state.modal_nested_edit}
                                        toggle={this.toggle('nested_edit')}>
                                        <ModalHeader style={{background: "#38ada7", color: "white"}}>Konfirmasi Penyimpanan</ModalHeader>
                                        <ModalBody>
                                            <strong>Bridging ID: {this.state.brd_id}</strong>
                                            <br/>
                                            <strong>Pro Code: {this.state.pro_code}</strong>
                                            <br/>
                                            <strong>SGC ID: {this.state.ktp_id}</strong>
                                            <br/>
                                            Apakah Anda yakin ingin mengubah data ini?
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button color="primary" onClick={this.editbridging(this.state.brd_id, this.state.pro_code, this.state.ktp_id)}>
                                                Ya
                                        </Button>{' '}
                                            <Button
                                                color="secondary"
                                                onClick={this.toggle('nested_edit')}>
                                                Tidak
                                        </Button>
                                        </ModalFooter>
                                    </Modal>
                                    {' '}
                                    <Button color="secondary" onClick={this.canceledit}>
                                        Batal
                                </Button>
                                </ModalFooter>
                            </Modal>
                            {/* EDIT */}

                            {/* delete */}
                            <Modal
                                isOpen={this.state.modal_delete}
                                toggle={this.toggle('delete')}
                                className={this.props.className}>
                                <ModalHeader style={{background: "#38ada7", color: "white"}} toggle={this.toggle('delete')}>
                                    Hapus Diagnosa
                                </ModalHeader>
                                <ModalBody>
                                    <strong>Bridging ID: {this.state.brd_id}</strong>
                                    <br/>
                                    <strong>Pro Code: {this.state.pro_code}</strong>
                                    <br/>
                                    <strong>Pro Description: {this.state.pro_des}</strong>
                                    <br/>
                                    <strong>Pro Condition: {this.state.pro_condition}</strong>
                                    <br/>
                                    <strong>Kategori Print ID: {this.state.ktp_id}</strong>
                                    <br/>
                                    <strong>Kategori Print Nama: {this.state.ktp_nama}</strong>
                                    <br/>
                                    Apakah Anda yakin ingin menghapus data ini?
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="primary" onClick={this.deletebridging(this.state.brd_id, this.state.activeUserId)}>
                                        Ya
                                    </Button>{' '}
                                    <Button
                                        color="secondary"
                                        onClick={this.toggle('delete')}>
                                        Tidak
                                    </Button>
                                </ModalFooter>
                            </Modal>
                            {/* delete */}

                            {/* get product */}
                            <Modal
                                isOpen={this.state.modal_product} 
                                toggle={this.toggle('product')}
                                className={this.props.className}
                                visible={this.state.product}
                                onRequestClose={()=>{this.state.modal_product=false}}>
                                <ModalHeader style={{background: "#38ada7", color: "white"}} toggle={this.toggle('product')}>
                                    Lihat Product
                                </ModalHeader>
                                <ModalBody>
                                <CardHeader className="d-flex justify-content-between">
                                    <Input
                                        type="search"
                                        className="cr-search-form__input"
                                        placeholder="Cari kode atau nama atau kondisi produk"
                                        value = {this.state.keyword2}
                                        style={{marginRight:"0.2vw"}}
                                        onChange={evt => this.updateSearchValue2(evt)}
                                        onKeyPress={(e) => this.enterSearchPressed2(e)}
                                    />
                                    <Button size="sm" style={{background: '#4db6ac', borderStyle: 'none', justifyContent:'center',alignItems:'center', marginRight: "0.2vw", width:"4em"}} onClick={this.sendSearchParam2()}><MdSearch/></Button>
                                    </CardHeader>
                                    <CardBody>
                                        <Table responsive>
                                            <thead>
                                                <tr>
                                                    <th>Pro Code</th>
                                                    <th>Pro Des</th>
                                                    <th>Pro Condition</th>
                                                    <th>Pilih</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {renderProduct}
                                            </tbody>
                                        </Table>
                                        <p className = "text-center" style={{display: this.state.notFound2}}>Data Tidak Ditemukan</p> 
                                    </CardBody>

                                    {/* Set Pages */}
                                    
                                        <Col md="6" sm="12" xs="12">
                                            <InputGroup>
                                                <InputGroupAddon addonType="prepend" >Data per Page</InputGroupAddon>
                                                <select 
                                                    name="packingPerPage"
                                                    style={{height: '38px'}}
                                                    value={this.state.value}
                                                    onChange={(e) => this.handleSelect2(e)}>
                                                        <option value="5">5</option>
                                                </select>
                                            </InputGroup>
                                        </Col>

                                        <Col md="6" sm="12" xs="12">
                                            <ButtonGroup >
                                                <Button style={{background: '#f57c00', borderStyle: 'none', 
                                                        justifyContent:'center',marginRight: '0.2vw',alignItems:'center'}}  
                                                        value = {this.state.currentPage2}
                                                        onClick={(e) => this.handleFirst2(e)}>First</Button>
                                                <Button style={{background: '#f57c00', borderStyle: 'none', 
                                                        justifyContent:'center',marginRight: '0.2vw',alignItems:'center'}}
                                                        value = {this.state.currentPage2}
                                                        onClick={(e) => this.handleWrite2(e, -1)}
                                                        disabled={!this.state.currentPage2}>Prev</Button>
                                                <form >
                                                <input 
                                                        type="text"
                                                        placeholder="Page" 
                                                        value = {this.state.currentPage2}
                                                        onFocus= {this.clear}
                                                        onKeyPress={(e) => this.enterPressed2(e)}
                                                        onChange={(e) => this.handleWrite2(e, 0)}
                                                        style={{height: '38px', width:'75px',textAlign: 'center',marginRight: '0.2vw'}}/>
                                                </form>
                                                <Button style={{background: '#f57c00', borderStyle: 'none', 
                                                        justifyContent:'center',marginRight: '0.2vw',alignItems:'center'}}
                                                        value = {this.state.currentPage2}
                                                        onClick={(e) => this.handleWrite2(e, 1)}>Next</Button>
                                                <Button style={{background: '#f57c00', borderStyle: 'none', 
                                                        justifyContent:'center',marginRight: '0.2vw',alignItems:'center'}} 
                                                        value = {this.state.currentPage2}
                                                        onClick={(e) => this.handleLast2(e)}>Last</Button>
                                            </ButtonGroup>
                                        </Col>
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="secondary"
                                        onClick={this.toggle('product')}>
                                        Batal
                                    </Button>
                                </ModalFooter>
                            </Modal>
                            {/* get product */}

                            {/* get kategori print */}
                            <Modal
                                isOpen={this.state.modal_ktp} 
                                toggle={this.toggle('ktp')}
                                className={this.props.className}
                                visible={this.state.tc}
                                onRequestClose={()=>{this.state.modal_ktp=false}}>
                                <ModalHeader style={{background: "#38ada7", color: "white"}} toggle={this.toggle('ktp')}>
                                    Lihat Kategori Print
                                </ModalHeader>
                                <ModalBody>
                                <CardHeader className="d-flex justify-content-between">
                                    <Input
                                        type="search"
                                        className="cr-search-form__input"
                                        placeholder="Cari kode atau nama kategori print"
                                        value = {this.state.keyword3}
                                        style={{marginRight:"0.2vw"}}
                                        onChange={evt => this.updateSearchValue3(evt)}
                                        onKeyPress={(e) => this.enterSearchPressed3(e)}
                                    />
                                    <Button size="sm" style={{background: '#4db6ac', borderStyle: 'none', justifyContent:'center',alignItems:'center', marginRight: "0.2vw", width:"4em"}} onClick={this.sendSearchParam3()}><MdSearch/></Button>
                                    </CardHeader>
                                    <CardBody>
                                        <Table responsive>
                                            <thead>
                                                <tr>
                                                    <th>Kategori Print ID</th>
                                                    <th>Kategori Print Nama</th>
                                                    <th>Pilih</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {renderTC}
                                            </tbody>
                                        </Table>
                                        <p className = "text-center" style={{display: this.state.notFound3}}>Data Tidak Ditemukan</p> 
                                    </CardBody>

                                    {/* Set Pages */}
                                    
                                        <Col md="6" sm="12" xs="12">
                                            <InputGroup>
                                                <InputGroupAddon addonType="prepend" >Data per Page</InputGroupAddon>
                                                <select 
                                                    name="packingPerPage"
                                                    style={{height: '38px'}}
                                                    value={this.state.value}
                                                    onChange={(e) => this.handleSelect3(e)}>
                                                        <option value="5">5</option>
                                                </select>
                                            </InputGroup>
                                        </Col>

                                        <Col md="6" sm="12" xs="12">
                                            <ButtonGroup >
                                                <Button style={{background: '#f57c00', borderStyle: 'none', 
                                                        justifyContent:'center',marginRight: '0.2vw',alignItems:'center'}}  
                                                        value = {this.state.currentPage3}
                                                        onClick={(e) => this.handleFirst3(e)}>First</Button>
                                                <Button style={{background: '#f57c00', borderStyle: 'none', 
                                                        justifyContent:'center',marginRight: '0.2vw',alignItems:'center'}}
                                                        value = {this.state.currentPage3}
                                                        onClick={(e) => this.handleWrite3(e, -1)}
                                                        disabled={!this.state.currentPage3}>Prev</Button>
                                                <form >
                                                <input 
                                                        type="text"
                                                        placeholder="Page" 
                                                        value = {this.state.currentPage3}
                                                        onFocus= {this.clear}
                                                        onKeyPress={(e) => this.enterPressed3(e)}
                                                        onChange={(e) => this.handleWrite3(e, 0)}
                                                        style={{height: '38px', width:'75px',textAlign: 'center',marginRight: '0.2vw'}}/>
                                                </form>
                                                <Button style={{background: '#f57c00', borderStyle: 'none', 
                                                        justifyContent:'center',marginRight: '0.2vw',alignItems:'center'}}
                                                        value = {this.state.currentPage3}
                                                        onClick={(e) => this.handleWrite3(e, 1)}>Next</Button>
                                                <Button style={{background: '#f57c00', borderStyle: 'none', 
                                                        justifyContent:'center',marginRight: '0.2vw',alignItems:'center'}} 
                                                        value = {this.state.currentPage3}
                                                        onClick={(e) => this.handleLast3(e)}>Last</Button>
                                            </ButtonGroup>
                                        </Col>
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="secondary"
                                        onClick={this.toggle('ktp')}>
                                        Batal
                                    </Button>
                                </ModalFooter>
                            </Modal>
                            {/* get kategori print */}

                            </CardHeader>
                            <CardBody>
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            <th>BRD ID</th>
                                            <th>Pro Code</th>
                                            <th>Pro Des</th>
                                            <th>Detail</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                       {renderBridging}
                                    </tbody>
                                </Table>

                                <p className = "text-center" style={{display: this.state.notFound}}>Data Tidak Ditemukan</p> 
                            </CardBody>

                             {/* Set Pages */}
                            <Row>
                                <Col md="6" sm="12" xs="12">
                                    <InputGroup>
                                        <InputGroupAddon addonType="prepend" >Data per Page</InputGroupAddon>
                                        <select 
                                            name="packingPerPage"
                                            style={{height: '38px'}}
                                            value={this.state.value}
                                            onChange={(e) => this.handleSelect(e)}>
                                                <option value="5">5</option>
                                                <option value="10">10</option>
                                                <option value="20">20</option>
                                            </select>
                                     </InputGroup>
                                </Col>

                                <Col md="6" sm="12" xs="12">
                                    <ButtonGroup >
                                        <Button style={{background: '#f57c00', borderStyle: 'none', 
                                                justifyContent:'center',marginRight: '0.2vw',alignItems:'center'}}  
                                                value = {this.state.currentPage}
                                                onClick={(e) => this.handleFirst(e)}>First</Button>
                                        <Button style={{background: '#f57c00', borderStyle: 'none', 
                                                justifyContent:'center',marginRight: '0.2vw',alignItems:'center'}}
                                                value = {this.state.currentPage}
                                                onClick={(e) => this.handleWrite(e, -1)}
                                                disabled={!this.state.currentPage}>Prev</Button>
                                        <form >
                                            <input 
                                                type="text"
                                                placeholder="Page" 
                                                value = {this.state.currentPage}
                                                onFocus= {this.clear}
                                                onKeyPress={(e) => this.enterPressed(e)}
                                                onChange={(e) => this.handleWrite(e, 0)}
                                                style={{height: '38px', width:'75px',textAlign: 'center',marginRight: '0.2vw'}}/>
                                        </form>
                                        <Button style={{background: '#f57c00', borderStyle: 'none', 
                                                justifyContent:'center',marginRight: '0.2vw',alignItems:'center'}}
                                                value = {this.state.currentPage}
                                                onClick={(e) => this.handleWrite(e, 1)}>Next</Button>
​
                                        <Button style={{background: '#f57c00', borderStyle: 'none', 
                                                justifyContent:'center',marginRight: '0.2vw',alignItems:'center'}} 
                                                value = {this.state.currentPage}
                                                onClick={(e) => this.handleLast(e)}>Last</Button>
                                    </ButtonGroup>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </Page>
        );
    }
}
export default BridgingSick;