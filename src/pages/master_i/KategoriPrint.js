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

class KategoriPrint extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            result: [],
            inputtedName: "",
            currentPage: 1,
            currentPage2: 1,
            packingPerPage: 5,
            packingPerPage2: 5,
            totalData: 0,
            flag: 0,
            firstRun: 0,
            searchType:"Show All",
            keyword:"",
            lastPage: 0,
            lastPage2: 0,
            statusDisableSearch : true,
            result2:[],
            notFound:"none",
            diagnosa_id:"",
            diagnosa_name:"",
            modal_nested_parent: false,
            modal_delete: false,
            modal_edit: false,
            modal_nested_edit: false,
            modal_nested: false,
            modal_diagnosa: false,
            temporary: ""
        };

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
        this.getListDiagnosabyPaging(1, 5);
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

    statusPanjangNamaPrint = (input) =>{
        if(input.length <=150){
            if(input.trim().length<=0)
                return false;
            else
                return true;
        }else{
            return false;
        }
    }

    statusValidEditPrint = (input, diagnosa_id) =>{
        var id = diagnosa_id+"";
        if(input.length <=150){ // edited agnes 9 okt
            if(input.trim().length<=0){
                if(id.length<=0)
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
            if(this.state.searchType==="gc_id" || this.state.searchType==="kp_id"){
                //added by agnes 7 okt 2019
                if(this.state.searchType==="gc_id"){
                    url = myURL.url_cari_gcid
                }else{
                    url= myURL.url_cari_sgcid
                }
                if(!isNaN(this.state.keyword)){
                    this.searchByCode(currPage, currLimit, this.state.searchType);
                }else{
                    alert("Kode harus berupa angka")
                }
            }else if(this.state.searchType==="gc_nama" || this.state.searchType==="kp_nama"){
                //added by agnes 7 okt 2019
                if(this.state.searchType==="gc_nama"){
                    url = myURL.url_cari_gcid
                }else{
                    url= myURL.url_cari_sgcnama
                }
                this.searchByName(currPage, currLimit, this.state.searchType, url);   
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
        .then(data=>{ this.setState({result:data["masterKategoriPrintList"], 
            lastPage: data["lastPage"], 
            isLoading: false,  notFound:"none"}); 
        } 
        );

        //console.log("huhuhu"+this.state.result)
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
            if(this.state.searchType==="gc_id" || this.state.searchType==="kp_id"){
                //added by agnes 7 okt 2019
                if(this.state.searchType==="gc_id"){
                    url = myURL. url_cari_gcid
                }else{
                    url= myURL.url_cari_sgcid
                }
                if(!isNaN(this.state.keyword)){
                    this.searchByCode(1, this.state.packingPerPage, this.state.searchType);
                }else{
                    alert("Kode harus berupa angka")
                }
            }
            else if(this.state.searchType==="gc_nama" || this.state.searchType==="kp_nama"){
                //added by agnes 7 okt 2019
                if(this.state.searchType==="gc_nama"){
                    url = myURL.url_cari_gcnama
                }else{
                    url= myURL.url_cari_sgcnama
                }
                this.searchByName(1, this.state.packingPerPage, this.state.searchType, url);   
            }
        }
    }

    // edit by claudina 4 okt 2019
    insertMasterKategoriPrint = param => () => {
        if(this.statusPanjangNamaPrint(param)){
            var payload={
                kp_nama: param.trim(), 
                kp_gdiagid: this.state.diagnosa_id,
                kp_aktifyn:'Y' ,
                kp_updateid:"CONVERT" ,
                inputSearch : this.state.keyword,
                limit : this.state.packingPerPage,
                tipeSearch : this.state.searchType
            }
            fetch(myURL.url_tambah_kp,{
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
                    this.state.inputtedName = "";
                    this.state.diagnosa_id = "";
                    this.state.modal_nested = false;
                    this.state.modal_nested_parent = false;
                    this.setState({
                        currentPage:this.state.lastPage
                    });
                    this.handleData(this.state.lastPage, this.state.packingPerPage);
                    this.showNotification("Data Kategori Print bernama "+param+" berhasil disimpan");
                }else if(data["status"] === 'Invalid'){
                    // this.state.modal_nested = false;
                    // this.toggle('nested');
                    alert("Data "+param+" sudah ada");
                }else{
                    alert("Gagal Menyimpan Data")
                }
            }); 
        }else{
            alert("Nama Kategori Print tidak boleh kosong atau Panjang nama Kategori Print harus kurang dari 150");
        }
    }
    
    // edit by claudina 4 okt 2019
    deletePrint = (kategoriprint_id, userid) => () => {
        var payload={
            kp_id: kategoriprint_id,
            kp_updateid: userid,
            inputSearch : this.state.keyword,
            limit: this.state.packingPerPage,
            tipeSearch: this.state.searchType
        }
        fetch(myURL.url_hapus_kp,{
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
                this.showNotification("Data Kategori Print : "+this.state.name_delete+" berhasil dihapus");
                this.state.inputtedName = "";
                this.state.diagnosa_id = "";
            }else  if(data["status"]==="Invalid"){
                alert("Data tidak dapat dihapus. Kategori Print : "+this.state.name_delete+" masih aktif digunakan")
            }
            else{
                alert("Gagal Menyimpan Data")
            }
        }); 
    }

    // //edited by Teddy 04-10-2019 14:41
    editPrint = (kategoriprint_id, kategoriprint_name,gdiag_id, kp_nama_lama) => () => {
        var url = myURL.url_edit_kp;
        //console.log(url);
        //console.log(kp_nama_lama)
        if(gdiag_id === "") {
            var diagnosa_id_temp = this.state.gc_id;
        }else {
            var diagnosa_id_temp = gdiag_id;
        }
        if(this.statusValidEditPrint(kategoriprint_name,diagnosa_id_temp)){
            var payload={  
                kp_id: kategoriprint_id,
                kp_nama:kategoriprint_name,
                kp_updateid:"CONVERT",
                kp_bridgegrpdiag: diagnosa_id_temp,
                inputSearch: this.state.keyword,
                limit: this.state.packingPerPage,
                tipeSearch: "aa"
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
                    this.state.inputtedName = "";
                    this.state.diagnosa_id = "";
                    if(this.state.currentPage >= this.state.lastPage){
                        this.setState({
                            currentPage:this.state.lastPage
                        });
                        this.handleData(this.state.lastPage, this.state.packingPerPage);
                    }else{
                        this.handleData(this.state.currentPage, this.state.packingPerPage);
                    }
                    this.showNotification("Data Kategori Print bernama "+ kp_nama_lama+ " berhasil diubah");
                }else if(data["status"]==="Failed") {
                    alert("Gagal Menyimpan Data")
                }   
                else{
                    alert("Nama KP "+ kategoriprint_name + " sudah digunakan");
                }
            });
        }else{
            alert("Nama kategori print tidak boleh kosong atau Panjang nama diagnosa harus kurang dari 150");
        }
    }

    

    // //edited by Teddy 04-10-2019 14:41
    searchByName(currPage, currLimit, typeSearch,url){
        if(typeSearch === "gc_nama") {
            var url = myURL.url_cari_gcnama;
            //console.log(url);
            //console.log("search name.."+this.state.keyword)
            var payload={  
                "name" : this.state.keyword,
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
                if(data["masterKategoriPrintList"].length == 0){
                    this.setState({
                        notFound: "block"
                    }); 
                }else{
                    this.setState({
                        notFound: "none"
                    }); 
                }

                this.setState({result:data["masterKategoriPrintList"], 
                lastPage: data["lastPage"], 
                isLoading: false}); 
            });
        }else if(typeSearch === "kp_nama") {
            var url = myURL.url_cari_sgcnama;
            var payload={  
                "name" : this.state.keyword,
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
                if(data["masterKategoriPrintList"].length == 0){
                    this.setState({
                        notFound: "block"
                    }); 
                }else{
                    this.setState({
                        notFound: "none"
                    }); 
                }
                this.setState({result:data["masterKategoriPrintList"], 
                lastPage: data["lastPage"], 
                isLoading: false}); 
            } );
        }
    }

    //edited by Teddy 04-10-2019 14:41
    searchByCode(currPage, currLimit, typeSearch){
        // if(typeSearch === "gc_id") {
        //     this.setState({
        //         lastPage:1
        //     });
        //     const kword = this.state.keyword;
        //     var url = myURL.url_cari_gcid+"/"+kword
        //     fetch(url)
        //     .then(response => response.json())
        //     .then(data => this.setState({ result: data, isLoading: false }));
        // }else if(typeSearch === "kp_id") {
        //     this.setState({
        //         lastPage:1
        //     });
        //     const kword = this.state.keyword;
        //     var url = myURL.url_cari_sgcid+"/"+kword
        //     fetch(url)
        //     .then(response => response.json())
        //     .then(data => this.setState({ result: data, isLoading: false }));
        // }    

        var url ;
        if(typeSearch==="gc_id"){
            url = myURL.url_cari_gcid;
        }else{
            url= myURL.url_cari_sgcid
        }
        this.setState({
            // lastPage:1,
            currPage:1
        });
        var payload={  
            "search_id" : this.state.keyword,
            "limit": currLimit,
            "offset": (currPage - 1) * currLimit
        }
        //console.log("search code.."+payload + " "+ this.state.keyword);
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .then(data=>{ 
            if(data["masterKategoriPrintList"].length == 0){
                this.setState({
                    notFound: "block"
                }); 
            }else{
                this.setState({
                    notFound: "none"
                }); 
            }
            this.setState({result:data["masterKategoriPrintList"], 
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

        if(this.state.searchType==="gc_id" || this.state.searchType==="kp_id"){
            if(!isNaN(this.state.keyword)){
                //added by claudina 07-10-2019
                if(this.state.searchType==="gc_id"){
                    url = myURL. url_cari_gcid
                }else{
                    url= myURL.url_cari_sgcid
                }
                this.searchByCode(1, this.state.packingPerPage, this.state.searchType);
            }else{
                alert("Kode harus berupa angka")
            }
        }
        else if(this.state.searchType==="gc_nama" || this.state.searchType==="kp_nama"){
            //added by claudina 07-10-2019
       
            if(this.state.searchType==="gc_nama"){
                url = myURL.url_cari_gcnama
            }else{
                url= myURL.url_cari_sgcnama
            }
            this.searchByName(1, this.state.packingPerPage, this.state.searchType,url); 
        }
    }

    //edited by Teddy 04-10-2019 14:41
    updateSelectionValue(evt){
        var url;
        this.setState({
            currentPage: 1,
            selectedOption: evt.target.value
        });
        if(evt.target.value==="gc_id")
        { 
            this.setState({searchType:"gc_id", statusDisableSearch:false})   
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
        else if(evt.target.value==="Show_All"){
            this.setState({
                statusDisableSearch:true,
                keyword:""
            })
            this.getListbyPaging(1, this.state.packingPerPage);
        }
    }

    deleteModalWithItemID(code, name, user_id){
        this.setState({
            modal_delete: true,
            activeCode: code,
            activeUserId : user_id,
            name_delete : name
        })
    }

    // //edited by Teddy 04-10-2019 14:41
    editModalWithItemID(kp_id, kp_nama, gc_id, gc_nama, userid){
        this.setState({
            modal_edit: true,
            gc_id: gc_id,
            gc_nama : gc_nama,
            kp_id: kp_id,
            kp_nama : kp_nama,
            inputtedName: kp_nama,
            diagnosa_id: gc_id,
            activeUserId : userid
        })
    }

    stateDropDown(status){
        this.setState({
            dropdown_value:status
        })
    }

    state = {
        modal: false,
        modal_backdrop: false,
        modal_nested_parent: false,
        modal_delete: false,
        modal_edit: false,
        modal_nested_edit: false,
        modal_nested: false,
        modal_diagnosa: true,
        backdrop: true,
        statusDisableSearch : true,
        notFound2:"none",
        flagEnterSearch2 :false,
        selectedOption: 'ShowAll',
        flagEnterSearch :false,
        inputtedID:"",
        diagnosa_id:"",
        diagnosa_name:""
    };

    toggle = modalType => () => {
        if (!modalType) {
            return this.setState({
                modal: !this.state.modal,
            });
        }

        this.setState({
            [`modal_${modalType}`]: !this.state[`modal_${modalType}`]
        });

        if(modalType==="diagnosa" && !this.state.modal_diagnosa){
            this.setState({
                currentPage2:1,
                keyword2: ""
            });
            this.getListDiagnosabyPaging(1, 5);
        }
        
        if(modalType === "nested_parent" && !this.state.modal_nested_parent) {
            this.state.diagnosa_id = "";
        }
    };

    stateCurrentPage(){
        this.setState({currentPage:1});
    }

    //diagnosa
    getListDiagnosabyPaging(currPage, currLimit){
        var urlA = myURL.url_tampil_diagnosa
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
            //console.log(data) 
            this.setState({result2:data["masterDiagnosaList"], 
            lastPage2: data["lastPage"], 
            isLoading: false,notFound2:"none"}); 
        } );
    }

    pilihDiagnosa(id, nama){
        this.state.diagnosa_id = id;
        this.state.diagnosa_name = nama;
        this.state.temporary = id;

        this.setState({
            modal_diagnosa :!this.state.modal_diagnosa,
            keyword2: ""
        });

    }

    searchByCodeDiagnosa(currPage,currLimit){
        var urlA = myURL.url_cari_gcidnamadiagnosa
        var payload = {
            input: this.state.keyword2,
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
            if(data["masterDiagnosaList"].length == 0){
                this.setState({
                    notFound2: "block"
                }); 
            }else{
                this.setState({
                    notFound2: "none"
                }); 
            }

            //console.log(data) 
            this.setState({result2:data["masterDiagnosaList"], 
            lastPage2: data["lastPage"], 
            isLoading: false}); 
        } );
   
    }

    updateSearchValue2(evt){
        this.setState({
            keyword2: evt.target.value
        });

        // if(this.state.keyword2 === ""){
        //     this.getListDiagnosabyPaging(1, this.state.packingPerPage2);
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
            this.setState({currentPage2:1, flagEnterSearch2 : true});
            // // //console.log("search key page"+this.state.currentPage)
            //     if(!isNaN(this.state.keyword)){
            //         this.searchByCode();
            //     }else{
            //         alert("Kode harus berupa angka")
            //     }
            this.searchByCodeDiagnosa(1,5);
        }
    }

    enterPressed2(event) {
        var code = event.keyCode || event.which;
        if(code === 13) {
            event.preventDefault();
            //console.log("a Hit");
            this.getListDiagnosabyPaging(this.state.currentPage2, this.state.packingPerPage2);
        }
        //console.log(this.state.currentPage2 + " " + this.state.packingPerPage2);
    }

    sendSearchParam2 = param => () =>{
        this.setState({currentPage2: 1, flagEnterSearch2:true});
        // if(!isNaN(this.state.keyword)){
        //     this.searchByCode();
        // }else{
        //     alert("Kode harus berupa angka")
        // }
         this.searchByCodeDiagnosa(this.state.currentPage2, 5);
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
            // if(!isNaN(this.state.keyword)){
            //     this.searchByCodeDiagnosa();
            // }else{
            //     alert("Kode harus berupa angka")
            // }
            this.searchByCodeDiagnosa(currPage,currLimit);
        }else{
            this.getListDiagnosabyPaging(currPage, currLimit);
        }
    }

    //added by teddy 09/10/2019
    canceladd() {
        this.state.modal_nested_parent = false;
        this.setState({
            diagnosa_id: "",
            inputtedName:"",
            temporary:"",
            currentPage2:1
        });
    }

    //added by teddy 09/10/2019
    canceledit(){
        this.state.modal_edit = false;
        this.setState({
            diagnosa_id: "",
            inputtedName:"",
            temporary:"",
            currentPage2:1
        });
    }

    render() {
        const { result, currentPage, packingPerPage} = this.state;

        const currentResult = this.state.result;

        const renderPrint = currentResult && currentResult.map((print) => {
            return <tr>
                <th scope="row">{print.kp_id}</th>
                <td>{print.kp_nama}</td>
                <th scope="row">{print.masterDiagnosa.gdiag_id}</th>
                <td>{print.masterDiagnosa.gdiag_nama}</td>
                <td>
                    <Button color="secondary" size="sm" style={{marginTop:'7px',marginRight:'5px', background: "orange", border:"none"}}onClick={()=>this.editModalWithItemID(print.kp_id,print.kp_nama, print.masterDiagnosa.gdiag_id, print.masterDiagnosa.gdiag_nama)}><MdEdit/></Button> 
                    <Button color="secondary" size="sm" style={{marginTop:'7px', background: "red", border:"none"}}onClick={()=>this.deleteModalWithItemID(print.kp_id, print.kp_nama)}><MdDelete/></Button> 
                </td>
                <td></td>
            </tr>
        });

        const currentResult2 = this.state.result2;

        const renderDiagnosa = currentResult2 && currentResult2.map((print) => {
            return <tr>
                <th scope="row">{print.gdiag_id}</th>
                <td>{print.gdiag_nama}</td>
                <td>
                    <Button color="secondary" size="sm" style={{marginTop:'7px',marginRight:'5px', background: "orange", border:"none"}}onClick={()=>this.pilihDiagnosa(print.gdiag_id, print.gdiag_nama)}>OK</Button> 
                </td>
                <td></td>
            </tr>
        });

        return (
            <Page
                title="Kategori Print"
                breadcrumbs={[{ name: 'KategoriPrint', active: true }]}
                className="KategoriPrint">
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
                            {/* edited by Teddy 04-10-2019 14:41 */}
                            <form name ="form1" style={{paddingTop:"10", marginRight:"0.2vw"}}>
                                <select value={this.state.selectedOption} name="filtermenu" class="dropdown-toggle btn btn-primary" style={{background: '#4db6ac', borderStyle: 'none'}} onChange={evt => this.updateSelectionValue(evt)} >
                                <option value="Show_All">Pilih</option>
                                <option value="kp_id">SGC ID</option>
                                <option value="kp_nama">SGC Nama</option>
                                <option value="gc_id">GC ID</option>
                                <option value="gc_nama">GC Nama</option>
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
                                    Tambah Kategori Print
                                </ModalHeader>
                                <ModalBody>
                                    <Label>SGC Print Nama</Label>
                                    {/* value={this.state.inputtedName} */}
                                    <Input type="sgcprint" onChange={evt => this.updateInputValue(evt)} name="sgcprint" placeholder="SGC Print" />
                                    <Label>GC ID </Label>
                                    {/* value={this.state.inputtedName} */}
                                    <Row>
                                        <Col>
                                            <Input type="gcid" value={this.state.diagnosa_id} onChange={evt => this.updateInputValue(evt)} name="gcid" placeholder="GC ID" />
                                        </Col>
                                        <Col>
                                            <Button size="sm" style={{marginTop:'1px',background:"#f57c00", border:"none"}}onClick={this.toggle('diagnosa')}> . . . </Button>
                                        </Col>
                                    </Row>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="primary" onClick={this.toggle('nested')}>
                                        Simpan
                                </Button>
                                    <Modal
                                        isOpen={this.state.modal_nested}
                                        toggle={this.toggle('nested')}>
                                        <ModalHeader style={{background: "#38ada7", color: "white"}}>Konfirmasi Penyimpanan</ModalHeader>
                                        <ModalBody>
                                            <strong>SGC Print Nama: {this.state.inputtedName}</strong>
                                            <br/>
                                            <strong>GC ID: {this.state.diagnosa_id}</strong>
                                            <br/>
                                            Apakah Anda yakin ingin menyimpan data ini?
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button 
                                                color="primary" 
                                                onClick={this.insertMasterKategoriPrint(this.state.inputtedName)}>
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
                            {/* edited by Teddy 04-10-2019 14:41 */}
                            <Modal
                                isOpen={this.state.modal_edit}
                                toggle={this.toggle('edit')}
                                className={this.props.className}>
                                <ModalHeader style={{background: "#38ada7", color: "white"}} toggle={this.toggle('edit')}>
                                    Edit Kategori Print
                                </ModalHeader>
                                <ModalBody>
                                    <strong>SGC Print ID: {this.state.kp_id}</strong>
                                    <br/>
                                    <strong>SGC Print Nama: {this.state.kp_nama}</strong>
                                    <br/>
                                    <strong>GC ID: {this.state.gc_id}</strong>
                                    <br/>
                                    <strong>GC Nama: {this.state.gc_nama}</strong>
                                    <br/>
                                    <Label>SGC Print Nama Baru </Label>
                                    <Input type="sgcprintbaru" value={this.state.inputtedName} onChange={evt => this.updateInputValue(evt)} name="sgcprintbaru" placeholder="SGC Print Nama Baru" />
                                    <Label>GC ID </Label>
                                    {/* value={this.state.inputtedName} */}
                                    <Row>
                                        <Col>
                                            <Input type="iddiagnosa" value={this.state.diagnosa_id} onChange={evt => this.updateInputValue_id_mc(evt)} name="iddiagnosa" placeholder="GC ID" />
                                        </Col>
                                        <Col>
                                            <Button size="sm" style={{marginTop:'1px',background:"#f57c00", border:"none"}}onClick={this.toggle('diagnosa')}> . . . </Button>
                                        </Col>
                                    </Row>
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
                                            <strong>SGC ID: {this.state.kp_id}</strong>
                                            <br/>
                                            <strong>SGC Print Nama Lama: {this.state.kp_nama}</strong>
                                            <br/>
                                            <strong>SGC Print Nama Baru: {this.state.inputtedName}</strong>
                                            <br/>
                                            <strong>GC ID Baru: {this.state.diagnosa_id}</strong>
                                            <br/>
                                            Apakah Anda yakin ingin mengubah data ini?
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button color="primary" onClick={this.editPrint(this.state.kp_id, this.state.inputtedName, this.state.diagnosa_id, this.state.kp_nama)}>
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
                                    Hapus Kategori Print
                                </ModalHeader>
                                <ModalBody>
                                    <strong>SGC Print ID: {this.state.activeCode}</strong>
                                    <br/>
                                    <strong>SGC Print Nama: {this.state.name_delete}</strong>
                                    <br/>
                                    Apakah Anda yakin ingin menghapus data ini?
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="primary" onClick={this.deletePrint(this.state.activeCode, this.state.activeUserId)}>
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

                            {/* get diagnosa */}
                            <Modal
                                isOpen={this.state.modal_diagnosa} 
                                toggle={this.toggle('diagnosa')}
                                className={this.props.className}
                                visible={this.state.modal_diagnosa}
                                onRequestClose={()=>{this.state.modal_diagnosa=false}}>
                                <ModalHeader style={{background: "#38ada7", color: "white"}} toggle={this.toggle('diagnosa')}>
                                    Lihat Diagnosa (GC)
                                </ModalHeader>
                                <ModalBody>
                                <CardHeader className="d-flex justify-content-between">
                                    <Input
                                        type="search"
                                        className="cr-search-form__input"
                                        placeholder="Cari kode atau nama diagnosa"
                                        value = {this.state.keyword2}
                                        style={{marginRight:"0.2vw"}}
                                        onChange={evt => this.updateSearchValue2(evt)}
                                        onKeyPress={(e) => this.enterSearchPressed2(e)}
                                    />
                                    <Button size="sm" style={{background: '#4db6ac', borderStyle: 'none', justifyContent:'center',alignItems:'center', marginRight: "0.2vw", width:"4em"}} onClick={this.sendSearchParam2()}
                                   ><MdSearch/></Button>
                                    </CardHeader>
                                    <CardBody>
                                        <Table responsive>
                                            <thead>
                                                <tr>
                                                    <th>Kode Diagnosa</th>
                                                    <th>Nama Diagnosa</th>
                                                    <th>Pilih</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {renderDiagnosa}
                                            </tbody>
                                        </Table>
                                        <p className = "text-center" style={{display: this.state.notFound2}}>Data Tidak Ditemukan</p> 
                                    </CardBody>

                                    {/* Set Pages */}
                                    <Row>
                                        <Col md="6" sm="12" xs="12">
                                            <InputGroup>
                                                <InputGroupAddon addonType="prepend" >Data per Page</InputGroupAddon>
                                                <select 
                                                    name="packingPerPage"
                                                    style={{height: '38px'}}
                                                    value={this.state.value2}
                                                    onChange={(e) => this.handleSelect2(e)}>
                                                        <option value="5">5</option>
                                                </select>
                                            </InputGroup>
                                        </Col>
                                    </Row>
<Row>
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
                                    </Row>

                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="secondary"
                                        onClick={this.toggle('diagnosa')}>
                                        Batal
                                    </Button>
                                </ModalFooter>
                            </Modal>
                            {/* get diagnosa */}

                            </CardHeader>
                            <CardBody>
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            <th>SGC Print ID</th>
                                            <th>SGC Print Nama</th>
                                            <th>GC ID</th>
                                            <th>GC Nama</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                       {renderPrint}
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
export default KategoriPrint;