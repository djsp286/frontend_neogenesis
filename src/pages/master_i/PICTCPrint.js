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

class PICTCPrint extends React.Component {

    constructor(props) {
        super(props);
        //edited by teddy 08/10/2019
        this.state = {
            result: [],
            inputtedName: "",
            currentPage: 1,
            currentPage2: 1,
            currentPage3: 1,
            currentPage4: 1,
            currentPage5: 1, 
            packingPerPage: 5,
            packingPerPage2: 5,
            packingPerPage3: 5,
            packingPerPage4: 5,
            packingPerPage5: 5,
            totalData: 0,
            flag: 0,
            firstRun: 0,
            searchType:"",
            keyword:"",
            keyword2: "",
            keyword3: "",
            keyword4: "",
            keyword5: "",
            keyword_supplier_id: "",
            keyword_supplier_name: "",
            keyword_pic_id: "",
            keyword_pic_name: "",
            keyword_tc_print_id: "",
            lastPage: 0,
            lastPage2: 0,
            lastPage3: 0,
            lastPage4: 0,
            lastPage5: 0,
            statusDisableSearch : true,
            notFound:"none",
            notFound2: "none",
            notFound3: "none",
            notFound4: "none",
            notFound5: "none",
            result2:[],
            result3: [],
            result4: [],
            result_temporary: [],
            result_duplicate: [],
            supplier_id:"",
            supplier_name:"",
            supplier_id_add:"",
            supplier_name_add:"",
            pic_id: "",
            pic_name: "",
            pic_id_add: "",
            pic_name_add: "",
            pic_id_edit: "",
            pic_name_edit: "",
            ktp_id: "",
            ktp_name: "",
            supplierType: "",
            picType: "",
            ktpType: "",
            supplierType: "",
            modal_nested_parent: false,
            modal_delete: false,
            modal_edit: false,
            modal_nested_edit: false,
            modal_nested: false,
            modal_supplier: false,
            modal_pic: false,
            modal_ktp:false,
            modal_ktp_add:false
        };

        //edited by teddy 09/10/2019
        this.clear = this.clear.bind(this);
        this.canceledit = this.canceledit.bind(this);
        this.canceladd = this.canceladd.bind(this);
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        this.toggle('nested_parent')
        this.getListbyPaging(this.state.currentPage, this.state.packingPerPage);
        this.getListSupplierbyPaging(1, 5);
        this.getListKTPbyPaging(1,5);
        this.getListPICbyPaging(1,5);
        this.getListKTPSupplierbyPaging(1,5);
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

    //set Current Limit
    handleSelect(event) {
        this.setState({
            currentPage: 1,
            result: [],
            //result_temporary: push(object) 
            packingPerPage: event.target.value
        });
        // this.getListbyPaging(1, event.target.value);
        this.handleData(1, event.target.value);
        // this.setState({ [event.target.name]: event.target.value });
    }

    //edited by Teddy 04-10-2019 14:41
    handleData(currPage, currLimit){
        if((this.state.supplier_id!="" || this.state.pic_id!=""|| this.state.ktp_id!="") && this.state.flagEnterSearch){
            this.searchAll(currPage, currLimit);
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
        var urlA = myURL.url_tampil_pictcprint

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
            this.setState({result:data["masterResponse"], 
            lastPage: data["lastPage"], 
            isLoading: false,
            notFound: "none"});
            //console.log(data["lastPage"]); 
        } );
        
        this.toggle('nested_parent')
    }

    enterPressed(event) {
        var code = event.keyCode || event.which;
        if(code === 13) {
            event.preventDefault();
            //console.log("a Hit");
            this.setState({
                currentPage: 1,
                flagEnterSearch: true
            });
            this.searchAll(1, this.state.packingPerPage);
        }
    }
    
    // edited by Teddy 04-10-2019 14:41
    enterSearchPressed(event) {
        var code = event.keyCode || event.which;
        this.setState({flagEnterSearch : false})
        if(code === 13) {
            event.preventDefault();
            this.setState({currentPage:1, flagEnterSearch : true});
            this.sendSearchParam();
        }
    }

    // edit by claudina 4 okt 2019
    insertMasterPICTCPrint = (pic_code, sup_code, tc_print_id_array) => () => {
        if(pic_code == "" || tc_print_id_array.length == 0 || sup_code ==  ""){ // agnes 09-10-19
            alert("PIC atau Supplier atau TC Print tidak boleh kosong");
        }else{
            var temp = 0;
            var temparray = [];
            tc_print_id_array.forEach(element => {
                var payload={
                    pic_code: pic_code,
                    sup_code: sup_code,
                    tc_print_id: element.tc_print_id,
                    update_id: "190182P",
                    inputSupCode : this.state.supplier_id,
                    inputPICID : this.state.pic_id,
                    inputTCPID : this.state.ktp_id,
                    limit : this.state.packingPerPage
                }
                fetch(myURL.url_tambah_pictcprint,{
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
                        temp = temp+1;
                        if(temp == tc_print_id_array.length) {
                            this.state.supplier_id_add = "";
                            this.state.supplier_name_add = "";
                            this.state.pic_id_add = "";
                            this.state.pic_name_add = "";
                            var emptyarray = [];
                            this.setState({result_temporary: emptyarray});
                            this.state.modal_nested = false;
                            this.state.modal_nested_parent = false;
                            this.showNotification("Semua Data PIC TC Print berhasil disimpan");
                        }else {
                            this.showNotification("Data PIC TC Print: "+element.tc_print_id+" berhasil disimpan");
                        }
                        this.setState({
                            currentPage:this.state.lastPage
                        });
                        this.handleData(this.state.lastPage, this.state.packingPerPage);
                        //console.log(data["status"]);
                    }else{
                        if(data["status"]==="Invalid") {
                            this.showNotification("Data PIC TC Print: " + element.tc_print_id + " sudah ada PIC");
                        }else {
                            this.showNotification("Data PIC TC Print: " + element.tc_print_id + " gagal disimpan");
                            temparray.push(element);
                        }
                        this.setState({
                            result_temporary: temparray
                        });
                    }
                });
            });
        }
    }
    
    // edit by claudina 4 okt 2019
    deletepictcprint = (mp_id, userid) => () => {
        //console.log(mp_id);
        // console.log(this.state.supplier_id);
        // console.log(this.state.pic_id);
        // console.log(this.state.ktp_id);
        var payload={
            mp_id: mp_id,
            update_id: "190182P",
            inputSupCode : this.state.supplier_id,
            inputPICID : this.state.pic_id,
            inputTCPID : this.state.ktp_id,
            limit: this.state.packingPerPage
        }
        fetch(myURL.url_hapus_pictcprint,{
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
                if(this.state.currentPage >= this.state.lastPage){
                    this.setState({
                        currentPage:this.state.lastPage
                    });
                    this.handleData(this.state.lastPage, this.state.packingPerPage);
                }else{
                    this.handleData(this.state.currentPage, this.state.packingPerPage);
                }
                this.showNotification("ID Bridging: "+mp_id+" berhasil dihapus");
            }
            // else  if(data["status"]==="Invalid"){
            //     alert("Data tidak dapat dihapus, karena masih aktif digunakan")
            // }
            else{
                alert("Gagal Menyimpan Data")
            }
        }); 
    }

    editpictcprint = (mp_id, supplier_id, ktp_sgc_id, pic_id, userId) => () => {
        var url = myURL.url_edit_pictcprint;
        if(mp_id == "" || supplier_id == "" || ktp_sgc_id == "" || pic_id == ""){ // edited agnes 9 okt 2019
            alert("Semua data harus terisi");
        }else{
            // console.log(this.state.supplier_id);
            // console.log(this.state.pic_id);
            // console.log(this.state.ktp_id);

            var payload={  
                tcp_code: ktp_sgc_id,
                mp_id: mp_id,
                pic_code: pic_id,
                supp_code: supplier_id,
                update_id: "190182P",
                inputSupCode : this.state.supplier_id,
                inputPICID : this.state.pic_id,
                inputTCPID : this.state.ktp_id,
                limit: this.state.packingPerPage
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
                //console.log(data["status"]);
                if(data["status"]==="Success"){
                    this.state.modal_edit = false;
                    this.state.modal_nested_edit = false;
                    this.setState({
                        lastPage : data["lastPage"]
                    });
                    if(this.state.currentPage >= this.state.lastPage){
                        this.setState({
                            currentPage:this.state.lastPage
                        });
                        this.handleData(this.state.lastPage, this.state.packingPerPage);
                    }else{
                        this.handleData(this.state.currentPage, this.state.packingPerPage);
                    }
                    this.showNotification("ID "+mp_id+" berhasil diubah");
                }else{
                    alert("Gagal Menyimpan Data")
                }
            }); 
        }
    }

    //edited by Teddy 04-10-2019 14:41
    searchAll(currPage, currLimit){
        //edited by agnes 9-10-2019
        var url = myURL.url_cari_pictcprint;

        var payload={  
            "inputSupCode": this.state.supplier_id,
            "inputSupName": this.state.supplier_name,
            "inputPICID": this.state.pic_id,
            "inputPICName": this.state.pic_name,
            "inputTCPID": this.state.ktp_id,
            "limit": currLimit,
            "offset": (currPage - 1) * currLimit
        }
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

    updateSearchValueSupplier(evt){
        this.setState({
            keyword_supplier_id: evt.target.value
        });

        if((this.state.supplier_id == "" && this.state.supplier_name == "") &&
           (this.state.pic_id == "" && this.state.pic_name == "") &&
           (this.state.ktp_id == "" && this.state.ktp_name == "")) {
            this.getListbyPaging(1, this.state.packingPerPage);
        }
    }

    updateSearchValueSupplier2(evt){
        this.setState({
            keyword_supplier_name: evt.target.value
        });

        if((this.state.supplier_id == "" && this.state.supplier_name == "") &&
           (this.state.pic_id == "" && this.state.pic_name == "") &&
           (this.state.ktp_id == "" && this.state.ktp_name == "")) {
            this.getListbyPaging(1, this.state.packingPerPage);
        }
    }

    updateSearchValuePIC(evt){
        this.setState({
            keyword_pic_id: evt.target.value
        });

        if((this.state.supplier_id == "" && this.state.supplier_name == "") &&
           (this.state.pic_id == "" && this.state.pic_name == "") &&
           (this.state.ktp_id == "" && this.state.ktp_name == "")) {
            this.getListbyPaging(1, this.state.packingPerPage);
        }
    }

    updateSearchValuePIC2(evt){
        this.setState({
            keyword_pic_name: evt.target.value
        });

        if((this.state.supplier_id == "" && this.state.supplier_name == "") &&
           (this.state.pic_id == "" && this.state.pic_name == "") &&
           (this.state.ktp_id == "" && this.state.ktp_name == "")) {
            this.getListbyPaging(1, this.state.packingPerPage);
        }
    }

    updateSearchValueTCPrint(evt){
        //console.log("AAA: " + evt.target.value);

        this.setState({
            keyword_tc_print_id: evt.target.value
        });

        if((this.state.supplier_id == "" && this.state.supplier_name == "") &&
           (this.state.pic_id == "" && this.state.pic_name == "") &&
           (this.state.ktp_id == "" && this.state.ktp_name == "")) {
            this.getListbyPaging(1, this.state.packingPerPage);
        }
    }

    //edited by Teddy 04-10-2019 14:41
    sendSearchParam = param => () =>{
        var url;
        this.setState({currentPage: 1, flagEnterSearch:true});
        this.searchAll(1, this.state.packingPerPage);
    }

    deleteModalWithItemID(brd_id, pro_code, pro_des, pic_id, pic_name, supp_id, supp_nama, sgc_id, sgc_name, userid){
        this.setState({
            modal_delete: true,
            mp_id: brd_id,
            temporary_pro_code: pro_code,
            temporary_pro_des: pro_des,
            pic_id_edit: pic_id,
            pic_name_edit: pic_name,
            temporary_tc_print_id: sgc_id,
            temporary_tc_print_name: sgc_name,
            temporary_supplier_id: supp_id,
            temporary_supplier_name: supp_nama,
            activeUserId : userid
        })
    }

    // //edited by Teddy 04-10-2019 14:41
    editModalWithItemID(mp_id, pro_code, pro_des, tc_print_id, tc_print_name, supplier_id, supplier_name, pic_id, pic_nama, userid){
        this.setState({
            modal_edit: true,
            pic_id_edit: pic_id,
            pic_name_edit: pic_nama,
            pic_id_lama: pic_id,
            pic_nama_lama: pic_nama,
            mp_id: mp_id,
            temporary_pro_code: pro_code,
            temporary_pro_des: pro_des,
            temporary_tc_print_id: tc_print_id,
            temporary_tc_print_name: tc_print_name,
            temporary_supplier_id: supplier_id,
            temporary_supplier_name: supplier_name,
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
        backdrop: true,
        statusDisableSearch : true,
        flagEnterSearch :false,
        flagEnterSearch2 :false,
        flagEnterSearch3 :false,
        inputtedID:""
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

        if(modalType==="supplier" && this.state.modal_supplier){
            this.setState({
                currentPage2:1,
                keyword2: "",
            });
            this.getListSupplierbyPaging(1, 5);
        }

        if(modalType === "ktp" && this.state.modal_ktp) {
            this.setState({
                currentPage3:1,
                keyword3: ""
            });
            this.getListKTPbyPaging(1, 5);
        }

        
        if(modalType === "ktp_add" && (this.state.modal_ktp_add || !this.state.modal_ktp_add)) {
            this.setState({
                currentPage5:1,
                keyword5: ""
            });
            this.getListKTPSupplierbyPaging(1, 5);
        }

        if(modalType === "pic" && this.state.modal_pic) {
            this.setState({
                currentPage4:1,
                keyword4: "",
            });
            this.getListPICbyPaging(1,5);
        }

        if(modalType === "nested_parent" && (!this.state.modal_nested_parent || this.state.modal_nested_parent)) {
            var temp = [];
            this.setState({
                supplier_id_add: "",
                supplier_name_add: "",
                pic_id_add: "",
                pic_name_add: "",
                result_temporary: temp,
                keyword5: "",
                currentPage5: 1
            });
            this.getListKTPSupplierbyPaging(1, 5);
        }

        // if(modalType === "nested_parent" && this.state.modal_nested_parent) {
        //     var temp = [];
        //     this.setState({
        //         keyword5: "",
        //         currentPage5: 1
        //     });
        // }

    };

    stateCurrentPage(){
        this.setState({currentPage:1});
    }

    //supplier
    // all edited by teddy 08/10/2019
    getListSupplierbyPaging(currPage, currLimit){
        var urlA = myURL.url_tampil_supplier
        var payload = {
            Length: currLimit,
            Start: currPage
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
            //console.log(data["Data"].length);
            this.setState({
                result2:data["Data"],  
                isLoading: false,
                notFound2:"none"
            }); 
        });

        var urlB = myURL.url_hitung_supplier;
        var payload = {
            Limit: currLimit
        };
        fetch(urlB,{
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
                lastPage2:data["Data"]
            });
        });
    }

    pilihSupplier(supplier_id, supplier_name){
        if(this.state.supplierType == 'add') {
            this.state.supplier_id_add = supplier_id;
            this.state.supplier_name_add = supplier_name;
            this.getListKTPSupplierbyPaging(1,5);
        }else {
            this.state.supplier_id = supplier_id;
            this.state.supplier_name = supplier_name;
        }
        
        this.setState({
            modal_supplier :!this.state.modal_supplier,
            currentPage2: 1,
            keyword2: ""
        });
        this.getListSupplierbyPaging(1,5);
        
    }

    searchSupplier(currPage, currLimit){
        var urlA = myURL.url_cari_supplier
        //console.log(this.state.keyword2 + " " + currPage + " " + currLimit);
        var payload = {
            Input: this.state.keyword2,
            Page: currPage,
            Offset: currLimit
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

            if(data["Data"] == null){
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
                result2:data["Data"], 
                lastPage2: data["LastPage"], 
                isLoading: false
            }); 
        });
    }

    enterPressed2(event) {
        var code = event.keyCode || event.which;
        if(code === 13) {
            event.preventDefault();
            //console.log("a Hit");
            this.getListSupplierbyPaging(this.state.currentPage2, this.state.packingPerPage2);
        }
        //console.log(this.state.currentPage2 + " " + this.state.packingPerPage2);
    }

    updateSearchValue2(evt){
        this.setState({
            keyword2: evt.target.value
        });

        // if(this.state.keyword2 === ""){
        //     this.getListSupplierbyPaging(1, this.state.packingPerPage2);
        // }
    }


    enterSearchPressed2(event) {
        var code = event.keyCode || event.which;
        this.setState({flagEnterSearch2 : false})
        if(code === 13) {
            event.preventDefault();
            this.setState({currentPage2: 1, flagEnterSearch2 : true});
            //console.log(this.state.currentPage2);
            if(this.state.keyword2 == "") {
                this.getListSupplierbyPaging(1,5);
            }else {
                this.searchSupplier(1, 5);
            }
        }
    }

    sendSearchParam2 = param => () =>{
        this.setState({currentPage2: 1, flagEnterSearch2:true});
        this.searchSupplier(this.state.currentPage2, 5);
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
            this.searchSupplier(currPage, currLimit);
        }else{
            this.getListSupplierbyPaging(currPage, currLimit);
        }
    }

    // tc print (kategori print)
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

    pilihKategoriPrint(ktp_id, ktp_name){
        this.state.ktp_id = ktp_id;
        this.state.ktp_name = ktp_name;
        this.setState({
            modal_ktp :!this.state.modal_ktp,
            keyword3: "",
            currentPage3: 1
        });
        this.getListKTPbyPaging(1,5);
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

    // pic
    getListPICbyPaging(currPage, currLimit){
        var urlA = myURL.url_tampil_karyawan
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
                result4:data["masterList"], 
                lastPage4: data["lastPage"], 
                isLoading: false,
                notFound4:"none"
            }); 
        });
    }

    pilihPIC(pic_id, pic_name){
        if(this.state.picType == "add") {
            this.state.pic_id_add = pic_id;
            this.state.pic_name_add = pic_name;
        }else if(this.state.picType == "search"){
            this.state.pic_id = pic_id;
            this.state.pic_name = pic_name;
        }else if(this.state.picType == "edit") {
            this.state.pic_id_edit = pic_id;
            this.state.pic_name_edit = pic_name;
        }
    
        this.setState({
            modal_pic :!this.state.modal_pic,
            keyword4: "",
            currentPage4: 1
        });
        this.getListPICbyPaging(1,5);
    }

    searchPIC(currPage, currLimit){
        var urlA = myURL.url_cari_karyawan
        var payload = {
            inputSearch: this.state.keyword4,
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

            if(data["masterList"].length == 0){
                this.setState({
                    notFound4: "block"
                }); 
            }else{
                this.setState({
                    notFound4: "none"
                }); 
            }

            //console.log(data) 
            this.setState({
                result4: data["masterList"], 
                lastPage4: data["lastPage"], 
                isLoading: false
            }); 
        });
    }

    enterPressed4(event) {
        var code = event.keyCode || event.which;
        if(code === 13) {
            event.preventDefault();
            //console.log("a Hit");
            this.getListPICbyPaging(this.state.currentPage4, this.state.packingPerPage4);
        }
        //console.log(this.state.currentPage4 + " " + this.state.packingPerPage4);
    }

    updateSearchValue4(evt){
        this.setState({
            keyword4: evt.target.value
        });

        // if(this.state.keyword4 === ""){
        //     this.getListPICbyPaging(1, this.state.packingPerPage4);
        // }
    }

    enterSearchPressed4(event) {
        var code = event.keyCode || event.which;
        this.setState({flagEnterSearch4 : false})
        if(code === 13) {
            event.preventDefault();
            this.setState({currentPage4: 1, flagEnterSearch4 : true});
            this.searchPIC(1, 5);
        }
    }

    sendSearchParam4 = param => () =>{
        this.setState({currentPage4: 1, flagEnterSearch4:true});
        this.searchPIC(this.state.currentPage4, 5);
    }

    handleSelect4(event) {
        this.setState({
            currentPage4: 1,
            result4: [],
            packingPerPage4: event.target.value
        });
        this.handleData4(1, event.target.value);
    }

    handleFirst4(event) {
        this.setState({
            currentPage4: 1
        });
        this.handleData4(1, 5);
    }

    handleLast4(event) {
        this.setState({
            currentPage4: this.state.lastPage4
        });
        this.handleData4(this.state.lastPage4, 5);
    }

    handleWrite4(event, flag) {
        if((this.state.currentPage4 + flag) > 0 || this.state.currentPage4 == 0){
            if((Number(event.target.value) + flag) <= this.state.lastPage4){
                this.setState({
                    currentPage4: Number(event.target.value) + flag
                });
            }
        }

        // //console.log("value event: "+ Number(event.target.value)+" "+(Number(event.target.value) + flag));

        if((this.state.currentPage4 + flag) != 0 && (Number(event.target.value) + flag) <= this.state.lastPage4){
            this.handleData4((this.state.currentPage4 + flag), this.state.packingPerPage4);
        }
        // //console.log("value event: "+ (this.state.currentPage+flag)+" "+this.state.packingPerPage);
    }

    handleData4(currPage, currLimit){
        //console.log("lastpage"+this.state.lastPage4);
        if(this.state.keyword4!="" && this.state.flagEnterSearch4){
            this.searchPIC(currPage, currLimit);
        }else{
            this.getListPICbyPaging(currPage, currLimit);
        }
    }

    // tc print sesuai supplier (kategori print)
    getListKTPSupplierbyPaging(currPage, currLimit){
        // //console.log("Supplier ID: "+this.state.supplier_id_add);
        //console.log("Keyword: "+this.state.keyword5);

        var urlA = myURL.url_tampil_kpsupplier
        var payload = {
            sup_code: this.state.supplier_id_add,
            inputSearch: this.state.keyword5,
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
            //console.log(data["masterKategoriPrintList"].length);
            if(data["masterKategoriPrintList"].length == 0){
                this.setState({
                    notFound5: "block"
                }); 
            }else {
                this.setState({
                    notFound5: "none"
                }); 
            }
            this.setState({
                result_duplicate:data["masterKategoriPrintList"], 
                lastPage5: data["lastPage"], 
                isLoading: false
            }); 
        });
    }

    // searchKTP(currPage, currLimit){
    //     var urlA = myURL.url_cari_idnamakategoriprint
    //     var payload = {
    //         inputSearch: this.state.keyword3,
    //         limit: currLimit,
    //         offset: (currPage - 1) * currLimit
    //     };
    //     fetch(urlA,{
    //         method: 'POST',
    //         body: JSON.stringify(payload),
    //         json: true,
    //         headers:{
    //             "Content-type":"application/json; charset=UTF-8"
    //         }
    //     })
    //     .then(response => response.json())
    //     .then(data=>{

    //         if(data["masterKategoriPrintList"].length == 0){
    //             this.setState({
    //                 notFound3: "block"
    //             }); 
    //         }else{
    //             this.setState({
    //                 notFound3: "none"
    //             }); 
    //         }

    //         //console.log(data) 
    //         this.setState({
    //             result3: data["masterKategoriPrintList"], 
    //             lastPage3: data["lastPage"], 
    //             isLoading: false
    //         }); 
    //     });
    // }

    enterPressed5(event) {
        var code = event.keyCode || event.which;
        if(code === 13) {
            event.preventDefault();
            //console.log("a Hit");
            this.getListKTPSupplierbyPaging(this.state.currentPage5, this.state.packingPerPage5);
        }
        //console.log(this.state.currentPage5 + " " + this.state.packingPerPage5);
    }

    updateSearchValue5(evt){
        this.setState({
            keyword5: evt.target.value
        });

        // if(this.state.keyword5 === ""){
        //     this.getListKTPSupplierbyPaging(1, this.state.packingPerPage3);
        // }
    }


    enterSearchPressed5(event) {
        var code = event.keyCode || event.which;
        this.setState({flagEnterSearch5 : false})
        if(code === 13) {
            event.preventDefault();
            this.setState({currentPage5: 1, flagEnterSearch5 : true});
            this.getListKTPSupplierbyPaging(1, 5);
        }
    }

    sendSearchParam5 = param => () =>{
        this.setState({currentPage5: 1, flagEnterSearch5:true});
        this.getListKTPSupplierbyPaging(this.state.currentPage5, 5);
    }

    handleSelect5(event) {
        this.setState({
            currentPage5: 1,
            result5: [],
            packingPerPage5: event.target.value
        });
        this.handleData5(1, event.target.value);
    }

    handleFirst5(event) {
        this.setState({
            currentPage5: 1
        });
        this.handleData5(1, 5);
    }

    handleLast5(event) {
        this.setState({
            currentPage5: this.state.lastPage5
        });
        this.handleData5(this.state.lastPage5, 5);
    }

    handleWrite5(event, flag) {
        if((this.state.currentPage5 + flag) > 0 || this.state.currentPage5 == 0){
            if((Number(event.target.value) + flag) <= this.state.lastPage5){
                this.setState({
                    currentPage5: Number(event.target.value) + flag
                });
            }
        }

        // //console.log("value event: "+ Number(event.target.value)+" "+(Number(event.target.value) + flag));

        if((this.state.currentPage5 + flag) != 0 && (Number(event.target.value) + flag) <= this.state.lastPage5){
            this.handleData5((this.state.currentPage5 + flag), this.state.packingPerPage5);
        }
        // //console.log("value event: "+ (this.state.currentPage+flag)+" "+this.state.packingPerPage);
    }

    handleData5(currPage, currLimit){
        //console.log("lastpage"+this.state.lastPage5);
        // if(this.state.keyword5!="" && this.state.flagEnterSearch5){
        //     this.searchKTP(currPage, currLimit);
        // }else{
        //     this.getListKTPbyPaging(currPage, currLimit);
        // }
        this.getListKTPSupplierbyPaging(currPage, currLimit);
    }

    //added by teddy 09/10/2019
    canceladd() {
        this.state.modal_nested_parent = false;
        var emptyarray = [];
        this.setState({
            supplier_id_add : "",
            supplier_name_add:"",
            pic_id_add:"",
            pic_name_add: "",
            result_temporary: emptyarray,
            keyword2: "",
            keyword4: "",
            keyword5: "",
            currentPage2:1,
            currentPage4:1,
            currentPage5:1
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

    addToTemp(ktp_id, ktp_name) {
        var temporary_add = this.state.result_temporary;
        var find = false;
        temporary_add.forEach(element => {
            if(element.tc_print_id == ktp_id) {
                find = true;
            }
        });

        if(find == false) {
            var objectAdd = {
                tc_print_id: ktp_id,
                tc_print_name: ktp_name 
            };
            temporary_add.push(objectAdd);
            this.setState({
                result_temporary: temporary_add,
                modal_ktp_add :!this.state.modal_ktp_add,
                keyword5: "",
                currentPage5: 1
            });
            this.getListKTPSupplierbyPaging(1,5);
        }else {
            alert("TC Print ID: " + ktp_id + " sudah dipilih")
        }
    }

    removeTemporary(ktp_id) {
        var temporary_add = this.state.result_temporary;
        for(let i = 0; i<temporary_add.length; i++) {
            if(temporary_add[i].tc_print_id == ktp_id) {
                temporary_add.splice(i, 1);
                this.setState({
                    result_temporary: temporary_add
                });
                return;
            }
        }
    }

    render() {
        const { result, currentPage, packingPerPage} = this.state;

        const currentResult = this.state.result;

        const renderPICTCPrint = currentResult && currentResult.map((pictcprint) => {
            return <tr>
                <th scope="row" className="align-middle">{pictcprint.mp_id}</th>
                <td className="align-middle">{pictcprint.pro_kode}</td>
                <th scope="row" className="align-middle">{pictcprint.pro_nama}</th>
                <td className="align-middle">
                    {/* <Table> 
                        <td  width="190px" style={{borderStyle: "none"}}>
                            <tr>SP ID</tr>
                            <tr>SP Nama</tr>
                            <tr>TC Print ID</tr>
                            <tr>TC Print Nama</tr>
                            <tr>PIC ID</tr>
                            <tr>PIC Nama</tr>
                        </td>
                        <td style={{borderStyle: "none"}}>
                            <tr>{pictcprint.sup_kode}</tr>
                            <tr>{pictcprint.sup_nama}</tr>
                            <tr>{pictcprint.tcprint_id}</tr>
                            <tr>{pictcprint.tcprint_nama}</tr>
                            <tr>{pictcprint.pic_id}</tr>
                            <tr>{pictcprint.pic_nama}</tr>
                        </td>
                    </Table> */}
                    <Table> 
                        <td style={{borderStyle: "none", padding: "0"}} width="50%">
                            <tr>SP ID</tr>
                        </td>
                        <td style={{borderStyle: "none", padding: "0"}}>
                            <tr>{pictcprint.sup_kode}</tr>
                        </td>
                    </Table>

                    <Table> 
                        <td style={{borderStyle: "none", padding: "0"}} width="50%">
                            <tr>SP Nama</tr>
                        </td>
                        <td style={{borderStyle: "none", padding: "0"}}>
                            <tr>{pictcprint.sup_nama}</tr>
                        </td>
                    </Table> 

                    <Table> 
                        <td style={{borderStyle: "none", padding: "0"}} width="50%">
                            <tr>TC Print ID</tr>
                        </td>
                        <td style={{borderStyle: "none", padding: "0"}}>
                            <tr>{pictcprint.tcprint_id}</tr>
                        </td>
                    </Table> 

                    <Table> 
                        <td style={{borderStyle: "none", padding: "0"}} width="50%">
                            <tr>TC Print Nama</tr>
                        </td>
                        <td style={{borderStyle: "none", padding: "0"}}>
                            <tr>{pictcprint.tcprint_nama}</tr>
                        </td>
                    </Table> 

                    <Table> 
                        <td style={{borderStyle: "none", padding: "0"}} width="50%">
                            <tr>PIC ID</tr>
                        </td>
                        <td style={{borderStyle: "none", padding: "0"}}>
                            <tr>{pictcprint.pic_id}</tr>
                        </td>
                    </Table> 

                    <Table> 
                        <td style={{borderStyle: "none", padding: "0"}} width="50%">
                            <tr>PIC Nama</tr>
                        </td>
                        <td style={{borderStyle: "none", padding: "0"}}>
                            <tr>{pictcprint.pic_nama}</tr>
                        </td>
                    </Table>  
                </td>
                <td className="align-middle">
                    <Button color="secondary" size="sm" style={{marginTop:'7px',marginRight:'5px', background: "orange", border:"none"}}onClick={()=>this.editModalWithItemID(pictcprint.mp_id, pictcprint.pro_kode, pictcprint.pro_nama, pictcprint.tcprint_id, pictcprint.tcprint_nama, pictcprint.sup_kode, pictcprint.sup_nama, pictcprint.pic_id, pictcprint.pic_nama)}><MdEdit/></Button> 
                    <Button color="secondary" size="sm" style={{marginTop:'7px', background: "red", border:"none"}}onClick={()=>this.deleteModalWithItemID(pictcprint.mp_id, pictcprint.pro_kode, pictcprint.pro_nama, pictcprint.pic_id, pictcprint.pic_nama, pictcprint.sup_kode, pictcprint.sup_nama, pictcprint.tcprint_id, pictcprint.tcprint_nama)}><MdDelete/></Button> 
                </td>
            </tr>
        });

        const currentResult2 = this.state.result2;

        const renderSupplier = currentResult2 && currentResult2.map((supplier) => {
            return <tr>
                <th scope="row">{supplier.Sup_Code}</th>
                <td>{supplier.Sup_Name}</td>
                <td>
                    <Button color="secondary" size="sm" style={{marginTop:'7px',marginRight:'5px', background: "orange", border:"none"}}onClick={()=>this.pilihSupplier(supplier.Sup_Code, supplier.Sup_Name)}>OK</Button> 
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

        const currentResult4 = this.state.result4;
        const renderPIC = currentResult4 && currentResult4.map((pic) => {
            return <tr>
                <th scope="row">{pic.kry_nip}</th>
                <td>{pic.kry_nama}</td>
                <td>
                    <Button color="secondary" size="sm" style={{marginTop:'7px',marginRight:'5px', background: "orange", border:"none"}}onClick={()=>this.pilihPIC(pic.kry_nip, pic.kry_nama)}>OK</Button> 
                </td>
                <td></td>
            </tr>
        });

        const currentResultDuplicate = this.state.result_duplicate;
        const renderDuplicate = currentResultDuplicate && currentResultDuplicate.map((ktp) => {
            return <tr>
                <th scope="row">{ktp.kp_id}</th>
                <td>{ktp.kp_nama}</td>
                <td>
                    <Button color="secondary" size="sm" style={{marginTop:'7px',marginRight:'5px', background: "orange", border:"none"}}onClick={()=>this.addToTemp(ktp.kp_id, ktp.kp_nama)}>OK</Button> 
                </td>
                <td></td>
            </tr>
        });

        const currentResultTemporary = this.state.result_temporary;
        const renderTemporary = currentResultTemporary && currentResultTemporary.map((ktp) => {
            return <tr>
                <th scope="row">{ktp.tc_print_id}</th>
                <td>{ktp.tc_print_name}</td>
                <td>
                    <Button color="secondary" size="sm" style={{marginTop:'7px',marginRight:'5px', background: "#f02c0a", border:"none"}}onClick={()=>this.removeTemporary(ktp.tc_print_id)}>Hapus</Button> 
                </td>
                <td></td>
            </tr>
        });

        return (
            <Page
                title="PIC TC Print"
                breadcrumbs={[{ name: 'PICTCPrint', active: true }]}
                className="PICTCPrint">
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
                                <Table>
                                    <tr>
                                        <td style={{borderStyle: "none", padding: "0px", width: "10%"}} class="align-middle">
                                            <Label style={{borderStyle: 'none', marginBottom: "0px"}}>Supplier</Label>
                                        </td>
                                        <td style={{borderStyle: "none", width: "15%"}}>
                                            <Input
                                                type = "supplier_id"
                                                name = "supplier_id"
                                                placeholder="Supplier ID"
                                                value = {this.state.supplier_id}
                                                onKeyPress={(e) => this.enterPressed(e)}
                                            />
                                        </td>
                                        <td style={{borderStyle: "none", width: "30%"}}>
                                            <Input
                                                type = "supplier_name"
                                                name = "supplier_name"
                                                placeholder="Supplier Nama"
                                                value = {this.state.supplier_name}
                                                onKeyPress={(e) => this.enterPressed(e)}
                                            />
                                        </td>
                                        <td style={{borderStyle: "none", width: "4%"}}>
                                            <Button size="sm" style={{marginTop:'4px', border:"none", alignItems: "center", background: "#f02c0a", width: "30px"}} onClick={() => {this.setState({supplier_id: "", supplier_name: ""});}}>x</Button>
                                        </td>
                                        <td style={{borderStyle: "none", width: "5%", paddingLeft: "0px"}}>
                                            <Button size="sm" style={{marginTop:'4px', background:"#f57c00", border:"none"}}onClick={(event) => {this.setState({modal_supplier: true, supplierType: 'search'});}}> . . . </Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{borderStyle: "none", padding: "0px", width: "10%"}} class="align-middle">
                                            <Label style={{borderStyle: 'none', marginBottom: "0px"}}>PIC</Label>
                                        </td>
                                        <td style={{borderStyle: "none", width: "15%"}}>
                                            <Input
                                                type = "pic_id"
                                                name = "pic_id"
                                                placeholder="PIC ID"
                                                value = {this.state.pic_id}
                                                onKeyPress={(e) => this.enterPressed(e)}
                                            />
                                        </td>
                                        <td style={{borderStyle: "none", width: "30%"}}>
                                            <Input
                                                type = "pic_name"
                                                name = "pic_name"
                                                placeholder="PIC Nama"
                                                value = {this.state.pic_name}
                                                onKeyPress={(e) => this.enterPressed(e)}
                                            />
                                        </td>
                                        <td style={{borderStyle: "none", width: "4%"}}>
                                            <Button size="sm" style={{border:"none", alignItems: "center", marginTop: "4px", background: "#f02c0a", width: "30px"}} onClick={() => {this.setState({pic_id: "", pic_name: ""}); }}>x</Button>
                                        </td>
                                        <td style={{borderStyle: "none", width: "5%", paddingLeft: "0px"}}>
                                            <Button size="sm" style={{marginTop:'4px',background:"#f57c00", border:"none"}}onClick={(event) => {this.setState({modal_pic: true, picType: 'search'});}}> . . . </Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{borderStyle: "none", padding: "0px", width: "10%"}}  class="align-middle">
                                            <Label style={{borderStyle: 'none', marginBottom: "0px"}}>TC Print</Label>
                                        </td>
                                        <td style={{borderStyle: "none", width: "15%"}}>
                                            <Input
                                                type = "ktp_id"
                                                name = "ktp_id"
                                                placeholder="TC ID"
                                                value = {this.state.ktp_id}
                                                onKeyPress={(e) => this.enterPressed(e)}
                                            />
                                        </td>
                                        <td style={{borderStyle: "none", width: "30%"}}>
                                            <Input
                                                type = "ktp_name"
                                                name = "ktp_name"
                                                placeholder="TC Nama"
                                                value = {this.state.ktp_name}
                                                onKeyPress={(e) => this.enterPressed(e)}
                                            />
                                        </td>
                                        <td style={{borderStyle: "none", width: "4%"}}>
                                            <Button size="sm" style={{border:"none", alignItems: "center", marginTop: "4px", background: "#f02c0a", width: "30px"}} onClick={() => {this.setState({ktp_id: "", ktp_name: ""});}}>x</Button>
                                        </td>
                                        <td style={{borderStyle: "none", width: "5%", paddingLeft: "0px"}}>
                                            <Button size="sm" style={{marginTop:'4px',background:"#f57c00", border:"none"}}onClick={this.toggle('ktp')}> . . . </Button>
                                        </td>
                                    </tr>
                                </Table>
                            <Modal
                                isOpen={this.state.modal_nested_parent}
                                toggle={this.toggle('nested_parent')}
                                className={this.props.className}>
                                <ModalHeader style={{background: "#38ada7", color: "white"}} toggle={this.toggle('nested_parent')}>
                                    Tambah PIC TC Print
                                </ModalHeader>
                                <ModalBody>
                                    <Table style={{marginBottom: "0px"}}>
                                        <tr>
                                            <Label style={{borderStyle: 'none', marginBottom: "0px"}}>Supplier</Label>
                                        </tr>
                                        <tr>
                                            <td style={{borderStyle: "none", padding: "0px", width: "20%"}} class="align-middle">
                                                <Input type="supplierid" value={this.state.supplier_id_add} onChange={evt => this.updateInputValue_id_mc(evt)} name="supplierid" placeholder="Supplier ID" />
                                            </td>
                                            <td style={{borderStyle: "none", width: "50%"}}>
                                                <Input type="suppliername" value={this.state.supplier_name_add} onChange={evt => this.updateInputValue_id_mc(evt)} name="suppliername" placeholder="Supplier Nama" />
                                            </td>
                                            <td style={{borderStyle: "none", width: "10%"}}>
                                                <Button size="sm" style={{marginTop:'4px',background:"#f57c00", border:"none"}}onClick={(event) => {this.setState({modal_supplier: true, supplierType: 'add'});}}> . . . </Button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <Label style={{borderStyle: 'none', marginBottom: "0px"}}>PIC</Label>
                                        </tr>
                                        <tr>
                                            <td style={{borderStyle: "none", padding: "0px", width: "20%"}}  class="align-middle">
                                                <Input type="PICID" value={this.state.pic_id_add} onChange={evt => this.updateInputValue_id_mc(evt)} name="PICID" placeholder="PIC ID" />
                                            </td>
                                            <td style={{borderStyle: "none", width: "50%"}}>
                                                <Input type="PICName" value={this.state.pic_name_add} onChange={evt => this.updateInputValue_id_mc(evt)} name="PICName" placeholder="PIC Nama" />
                                            </td>
                                            <td style={{borderStyle: "none", width: "10%"}}>
                                                <Button size="sm" style={{marginTop:'4px',background:"#f57c00", border:"none"}}onClick={(event) => {this.setState({modal_pic: true, picType: 'add'});}}> . . . </Button>
                                            </td>
                                        </tr>
                                        {/* <tr>
                                            <td style={{borderStyle: "none", width: "10%"}}>
                                                <Label style={{borderStyle: 'none', marginBottom: "0px"}}>TC</Label>
                                            </td>
                                            <td style={{borderStyle: "none", width: "10%"}}>
                                                <Button size="sm" style={{background:"#f57c00", border:"none"}}onClick={this.toggle('ktp_add')}> . . . </Button>
                                            </td>
                                            <td style={{borderStyle: "none", width: "10%"}}>
                                                <Label style={{
                                                    marginTop:'2%', 
                                                    marginRight: '2%', 
                                                    float: "right",
                                                    fontSize: "10px",
                                                    fontStyle: "italic"}}>bisa pilih banyak data</Label> 
                                            </td>
                                        </tr> */}
                                    </Table>
                                    
                                    <div style={{borderStyle: "none", marginTop: "10px"}}>
                                        <Table>
                                            <tr>
                                                <td style={{borderStyle: "none", width: "10%"}}>
                                                    <Label style={{borderStyle: 'none', marginBottom: "0px"}}>TC</Label>
                                                </td>
                                                <td style={{borderStyle: "none", width: "10%"}}>
                                                    <Button size="sm" style={{background:"#f57c00", border:"none"}}onClick={this.toggle('ktp_add')}> . . . </Button>
                                                </td>
                                                <td style={{borderStyle: "none", width: "40%"}}>
                                                    <Label style={{
                                                        marginTop:'2%', 
                                                        marginRight: '2%', 
                                                        float: "left",
                                                        fontSize: "14px",
                                                        fontStyle: "italic"}}>(bisa pilih banyak data)</Label> 
                                                </td>
                                            </tr>
                                        </Table>
                                    </div>

                                    <Table responsive>
                                        <thead>
                                            <tr>
                                                <th>TC ID</th>
                                                <th>TC Nama</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {renderTemporary}
                                        </tbody>
                                        </Table>
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
                                            <strong>Supplier ID: {this.state.supplier_id_add}</strong>
                                            <br/>
                                            <strong>Supplier Nama: {this.state.supplier_name_add}</strong>
                                            <br/>
                                            <strong>PIC ID: {this.state.pic_id_add}</strong>
                                            <br/>
                                            <strong>PIC Nama: {this.state.pic_name_add}</strong>
                                            <br/>
                                            Apakah Anda yakin ingin menyimpan data ini?
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button 
                                                color="primary" 
                                                onClick={this.insertMasterPICTCPrint(this.state.pic_id_add, this.state.supplier_id_add, this.state.result_temporary)}>
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
                                    Edit PIC
                                </ModalHeader>
                                <ModalBody>
                                    <strong>ID: {this.state.mp_id}</strong>
                                    <br/>
                                    <strong>Pro Code: {this.state.temporary_pro_code}</strong>
                                    <br/>
                                    <strong>Pro Des: {this.state.temporary_pro_des}</strong>
                                    <br/>
                                    <strong>Supplier ID: {this.state.temporary_supplier_id}</strong>
                                    <br/>
                                    <strong>Supplier Nama: {this.state.temporary_supplier_name}</strong>
                                    <br/>
                                    <strong>TC Print ID: {this.state.temporary_tc_print_id}</strong>
                                    <br/>
                                    <strong>TC Print Nama: {this.state.temporary_tc_print_name}</strong>
                                    <br/>
                                    <strong>PIC ID Lama: {this.state.pic_id_lama}</strong>
                                    <br/>
                                    <strong>PIC Nama Lama: {this.state.pic_nama_lama}</strong>
                                    <br/>
                                    <Label>PIC Baru</Label>
                                    <Row>
                                        <Col>
                                            <Input type="idpic" value={this.state.pic_id_edit} onChange={evt => this.updateInputValue_id_mc(evt)} name="idpic" placeholder="PIC ID Baru" />
                                        </Col>
                                        <Col>
                                            <Button size="sm" style={{marginTop:'4px',background:"#f57c00", border:"none"}}onClick={(event) => {this.setState({modal_pic: true, picType: 'edit'});}}> . . . </Button>
                                        </Col>
                                    </Row>
                                    <strong>PIC Nama Baru: {this.state.pic_name_edit}</strong>
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
                                            <strong>PIC ID Lama: {this.state.pic_id_lama}</strong>
                                            <br/>
                                            <strong>PIC Nama Lama: {this.state.pic_nama_lama}</strong>
                                            <br/>
                                            <strong>PIC ID Baru: {this.state.pic_id_edit}</strong>
                                            <br/>
                                            <strong>PIC Nama Baru: {this.state.pic_name_edit}</strong>
                                            <br/>
                                            Apakah Anda yakin ingin mengubah data ini?
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button color="primary" onClick={this.editpictcprint(this.state.mp_id, this.state.temporary_supplier_id, this.state.temporary_tc_print_id, this.state.pic_id_edit)}>
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
                                    Hapus PIC TC Print
                                </ModalHeader>
                                <ModalBody>
                                    <strong>ID: {this.state.mp_id}</strong>
                                    <br/>
                                    <strong>Pro Code: {this.state.temporary_pro_code}</strong>
                                    <br/>
                                    <strong>Pro Description: {this.state.temporary_pro_code}</strong>
                                    <br/>
                                    <strong>Supplier ID: {this.state.temporary_supplier_id}</strong>
                                    <br/>
                                    <strong>Supplier Nama: {this.state.temporary_supplier_name}</strong>
                                    <br/>
                                    <strong>PIC ID: {this.state.pic_id_edit}</strong>
                                    <br/>
                                    <strong>PIC Nama: {this.state.pic_name_edit}</strong>
                                    <br/>
                                    <strong>TC Print ID: {this.state.temporary_tc_print_id}</strong>
                                    <br/>
                                    <strong>TC Print Nama: {this.state.temporary_tc_print_name}</strong>
                                    <br/>
                                    Apakah Anda yakin ingin menghapus data ini?
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="primary" onClick={this.deletepictcprint(this.state.mp_id)}>
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

                            {/* get supplier */}
                            <Modal
                                isOpen={this.state.modal_supplier} 
                                toggle={this.toggle('supplier')}
                                className={this.props.className}
                                visible={this.state.supplier}
                                onRequestClose={()=>{this.state.modal_supplier=false}}>
                                <ModalHeader style={{background: "#38ada7", color: "white"}} toggle={this.toggle('supplier')}>
                                    Lihat Supplier
                                </ModalHeader>
                                <ModalBody>
                                <CardHeader className="d-flex justify-content-between">
                                    <Input
                                        type="search"
                                        className="cr-search-form__input"
                                        placeholder="Cari kode atau nama supplier"
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
                                                    <th>Supplier Code</th>
                                                    <th>Supplier Nama</th>
                                                    <th>Pilih</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {renderSupplier}
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
                                        onClick={this.toggle('supplier')}>
                                        Batal
                                    </Button>
                                </ModalFooter>
                            </Modal>
                            {/* get supplier */}

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
                                        placeholder="Cari kode atau nama TC Print"
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
                                                    <th>TC Print ID</th>
                                                    <th>TC Print Nama</th>
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

                            {/* get kategori print untuk add*/}
                            <Modal
                                isOpen={this.state.modal_ktp_add} 
                                toggle={this.toggle('ktp_add')}
                                className={this.props.className}
                                visible={this.state.tc_add}
                                onRequestClose={()=>{this.state.modal_ktp_add=false}}>
                                <ModalHeader style={{background: "#38ada7", color: "white"}} toggle={this.toggle('ktp_add')}>
                                    Lihat Kategori Print
                                </ModalHeader>
                                <ModalBody>
                                <CardHeader className="d-flex justify-content-between">
                                    <Input
                                        type="search"
                                        className="cr-search-form__input"
                                        placeholder="Cari kode atau nama TC Print"
                                        value = {this.state.keyword5}
                                        style={{marginRight:"0.2vw"}}
                                        onChange={evt => this.updateSearchValue5(evt)}
                                        onKeyPress={(e) => this.enterSearchPressed5(e)}
                                    />
                                    <Button size="sm" style={{background: '#4db6ac', borderStyle: 'none', justifyContent:'center',alignItems:'center', marginRight: "0.2vw", width:"4em"}} onClick={this.sendSearchParam5()}><MdSearch/></Button>
                                    </CardHeader>
                                    <CardBody>
                                        <Table responsive>
                                            <thead>
                                                <tr>
                                                    <th>TC Print ID</th>
                                                    <th>TC Print Nama</th>
                                                    <th>Pilih</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {renderDuplicate}
                                            </tbody>
                                        </Table>
                                        <p className = "text-center" style={{display: this.state.notFound5}}>Data Tidak Ditemukan</p> 
                                    </CardBody>

                                    {/* Set Pages */}
                                    
                                        <Col md="6" sm="12" xs="12">
                                            <InputGroup>
                                                <InputGroupAddon addonType="prepend" >Data per Page</InputGroupAddon>
                                                <select 
                                                    name="packingPerPage"
                                                    style={{height: '38px'}}
                                                    value={this.state.value}
                                                    onChange={(e) => this.handleSelect5(e)}>
                                                        <option value="5">5</option>
                                                </select>
                                            </InputGroup>
                                        </Col>

                                        <Col md="6" sm="12" xs="12">
                                            <ButtonGroup >
                                                <Button style={{background: '#f57c00', borderStyle: 'none', 
                                                        justifyContent:'center',marginRight: '0.2vw',alignItems:'center'}}  
                                                        value = {this.state.currentPage5}
                                                        onClick={(e) => this.handleFirst5(e)}>First</Button>
                                                <Button style={{background: '#f57c00', borderStyle: 'none', 
                                                        justifyContent:'center',marginRight: '0.2vw',alignItems:'center'}}
                                                        value = {this.state.currentPage5}
                                                        onClick={(e) => this.handleWrite5(e, -1)}
                                                        disabled={!this.state.currentPage5}>Prev</Button>
                                                <form >
                                                <input 
                                                        type="text"
                                                        placeholder="Page" 
                                                        value = {this.state.currentPage5}
                                                        onFocus= {this.clear}
                                                        onKeyPress={(e) => this.enterPressed5(e)}
                                                        onChange={(e) => this.handleWrite5(e, 0)}
                                                        style={{height: '38px', width:'75px',textAlign: 'center',marginRight: '0.2vw'}}/>
                                                </form>
                                                <Button style={{background: '#f57c00', borderStyle: 'none', 
                                                        justifyContent:'center',marginRight: '0.2vw',alignItems:'center'}}
                                                        value = {this.state.currentPage5}
                                                        onClick={(e) => this.handleWrite5(e, 1)}>Next</Button>
                                                <Button style={{background: '#f57c00', borderStyle: 'none', 
                                                        justifyContent:'center',marginRight: '0.2vw',alignItems:'center'}} 
                                                        value = {this.state.currentPage5}
                                                        onClick={(e) => this.handleLast5(e)}>Last</Button>
                                            </ButtonGroup>
                                        </Col>
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="secondary"
                                        onClick={this.toggle('ktp_add')}>
                                        Batal
                                    </Button>
                                </ModalFooter>
                            </Modal>
                            {/* get kategori print supplier*/}

                            {/* get PIC */}
                            <Modal
                                isOpen={this.state.modal_pic} 
                                toggle={this.toggle('pic')}
                                className={this.props.className}
                                visible={this.state.pic}
                                onRequestClose={()=>{this.state.modal_pic=false}}>
                                <ModalHeader style={{background: "#38ada7", color: "white"}} toggle={this.toggle('pic')}>
                                    Lihat PIC
                                </ModalHeader>
                                <ModalBody>
                                <CardHeader className="d-flex justify-content-between">
                                    <Input
                                        type="search"
                                        className="cr-search-form__input"
                                        placeholder="Cari kode atau nama PIC"
                                        value = {this.state.keyword4}
                                        style={{marginRight:"0.2vw"}}
                                        onChange={evt => this.updateSearchValue4(evt)}
                                        onKeyPress={(e) => this.enterSearchPressed4(e)}
                                    />
                                    <Button size="sm" style={{background: '#4db6ac', borderStyle: 'none', justifyContent:'center',alignItems:'center', marginRight: "0.2vw", width:"4em"}} onClick={this.sendSearchParam4()}><MdSearch/></Button>
                                    </CardHeader>
                                    <CardBody>
                                        <Table responsive>
                                            <thead>
                                                <tr>
                                                    <th>PIC ID</th>
                                                    <th>PIC Nama</th>
                                                    <th>Pilih</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {renderPIC}
                                            </tbody>
                                        </Table>
                                        <p className = "text-center" style={{display: this.state.notFound4}}>Data Tidak Ditemukan</p> 
                                    </CardBody>

                                    {/* Set Pages */}
                                    
                                        <Col md="6" sm="12" xs="12">
                                            <InputGroup>
                                                <InputGroupAddon addonType="prepend" >Data per Page</InputGroupAddon>
                                                <select 
                                                    name="packingPerPage"
                                                    style={{height: '38px'}}
                                                    value={this.state.value}
                                                    onChange={(e) => this.handleSelect4(e)}>
                                                        <option value="5">5</option>
                                                </select>
                                            </InputGroup>
                                        </Col>

                                        <Col md="6" sm="12" xs="12">
                                            <ButtonGroup >
                                                <Button style={{background: '#f57c00', borderStyle: 'none', 
                                                        justifyContent:'center',marginRight: '0.2vw',alignItems:'center'}}  
                                                        value = {this.state.currentPage4}
                                                        onClick={(e) => this.handleFirst4(e)}>First</Button>
                                                <Button style={{background: '#f57c00', borderStyle: 'none', 
                                                        justifyContent:'center',marginRight: '0.2vw',alignItems:'center'}}
                                                        value = {this.state.currentPage4}
                                                        onClick={(e) => this.handleWrite4(e, -1)}
                                                        disabled={!this.state.currentPage4}>Prev</Button>
                                                <form >
                                                <input 
                                                        type="text"
                                                        placeholder="Page" 
                                                        value = {this.state.currentPage4}
                                                        onFocus= {this.clear}
                                                        onKeyPress={(e) => this.enterPressed4(e)}
                                                        onChange={(e) => this.handleWrite4(e, 0)}
                                                        style={{height: '38px', width:'75px',textAlign: 'center',marginRight: '0.2vw'}}/>
                                                </form>
                                                <Button style={{background: '#f57c00', borderStyle: 'none', 
                                                        justifyContent:'center',marginRight: '0.2vw',alignItems:'center'}}
                                                        value = {this.state.currentPage4}
                                                        onClick={(e) => this.handleWrite4(e, 1)}>Next</Button>
                                                <Button style={{background: '#f57c00', borderStyle: 'none', 
                                                        justifyContent:'center',marginRight: '0.2vw',alignItems:'center'}} 
                                                        value = {this.state.currentPage4}
                                                        onClick={(e) => this.handleLast4(e)}>Last</Button>
                                            </ButtonGroup>
                                        </Col>
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="secondary"
                                        onClick={this.toggle('pic')}>
                                        Batal
                                    </Button>
                                </ModalFooter>
                            </Modal>
                            {/* get PIC */}
                            
                            </CardHeader>

                            <div>
                                <Button size="sm" style={{
                                    width: "100px",
                                    marginTop:'2%', 
                                    marginRight: '2%', 
                                    background:"#f57c00", 
                                    border:"none",
                                    float: "right"}}
                                onClick={this.toggle('nested_parent')}>Tambah</Button>
                                <Button size="sm" style={{
                                    background: '#4db6ac', 
                                    borderStyle: 'none', 
                                    justifyContent:'center',
                                    alignItems:'center', 
                                    marginRight: "2%",
                                    marginTop: "2%",
                                    width:"100px",
                                    float:"right"}} onClick={this.sendSearchParam()}>Cari<MdSearch style={{marginLeft: "4px", marginBottom: "1px"}}/></Button>
                                    {/* comment */}
                            </div>
                            <CardBody>
                                <Table responsive>
                                    <thead>

                                        <tr>
                                            <th>ID</th>
                                            <th>Pro Code</th>
                                            <th>Pro Des</th>
                                            <th>Detail</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                       {renderPICTCPrint}
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
export default PICTCPrint;