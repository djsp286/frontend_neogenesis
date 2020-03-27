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

class Diagnosa extends React.Component {

    constructor(props) {
        super(props);
        //edited by teddy 08/10/2019
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
            searchType:"",
            keyword:"",
            lastPage: 0,
            lastPage2: 0,
            statusDisableSearch : true,
            notFound:"none",
            result2:[],
            solusi_id:"",
            solusi_name:"",
            modal_nested_parent: false,
            modal_delete: false,
            modal_edit: false,
            modal_nested_edit: false,
            modal_nested: false,
            modal_solusi: false,
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
        this.getListSolusibyPaging(1, 5);
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
        //console.log("hahahaha"+this.state.packingPerPage)
        //console.log("jajajajaj"+event.target.value)

        // this.getListbyPaging(1, event.target.value);
        this.handleData(1, event.target.value);

        // this.setState({ [event.target.name]: event.target.value });
    }

    //edited by Teddy 04-10-2019 14:41
    handleData(currPage, currLimit){
        var url;
        if(this.state.keyword!="" && this.state.flagEnterSearch){
            if(this.state.searchType==="gc_id" || this.state.searchType==="mc_id"){
                // edited by agnes 9 okt 2019
                if(!isNaN(this.state.keyword)){
                    this.searchByCode(currPage, currLimit, this.state.searchType); // agnes 9 okt 2019
                }else{
                    alert("Kode harus berupa angka")
                }
            }else if(this.state.searchType==="gc_nama" || this.state.searchType==="mc_nama"){
                //update by agnes 9 okt 2019
                this.searchByName(currPage, currLimit, this.state.searchType);   
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
        .then(data=>{ this.setState({result:data["masterDiagnosaList"], 
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
            if(this.state.searchType==="gc_id" || this.state.searchType==="mc_id"){
                //edited by agnes 9 okt 2019
                if(!isNaN(this.state.keyword)){
                    this.searchByCode(1, this.state.packingPerPage, this.state.searchType);
                }else{
                    alert("Kode harus berupa angka")
                }
            }
            else if(this.state.searchType==="gc_nama" || this.state.searchType==="mc_nama"){
                //updated by agnes 9 okt 2019
                this.searchByName(1, this.state.packingPerPage, this.state.searchType);   
            }
        }
    }

    // edit by claudina 4 okt 2019
    insertMasterDiagnosa = (param, id) => () => {
        if(this.statusPanjangNamaDiagnosa(param, id)){ // agnes 09-10-19
            var payload={
                gdiag_nama :param.trim(),
                gdiag_slid: id,
                gdiag_aktifyn: 'Y',
                gdiag_updateid: "CONVERT",
                inputSearch : this.state.keyword,
                limit : this.state.packingPerPage,
                tipeSearch : this.state.searchType
            }
            fetch(myURL.url_tambah_diagnosa,{
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
                    this.state.solusi_id = "";
                    this.state.temporary = "";
                    this.state.modal_nested = false;
                    this.state.modal_nested_parent = false;
                    this.setState({
                        currentPage:this.state.lastPage
                    });
                    this.handleData(this.state.lastPage, this.state.packingPerPage);
                    this.showNotification("Data Diagnosa bernama "+param+" berhasil disimpan");
                    
                }else if(data["status"] === 'Invalid'){
                    // this.state.modal_nested = false;
                    // this.toggle('nested');
                    alert("Data "+param+" sudah ada");
                }else{
                    alert("Gagal Menyimpan Data")
                }
            });
        }else{
            alert("(Nama diagnosa tidak boleh kosong atau Panjang nama diagnosa harus kurang dari 100) dan MC Id harus diisi");
        }
    }
    
    // edit by claudina 4 okt 2019
    deletediagnosa = (diagnosa_id, userid) => () => {
        var payload={
            gdiag_id:  diagnosa_id,
            gdiag_updateid: userid,
            inputSearch : this.state.keyword,
            limit: this.state.packingPerPage,
            tipeSearch: this.state.searchType
        }
        fetch(myURL.url_hapus_diagnosa,{
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
                this.showNotification("Data Diagnosa : "+this.state.name_delete+" berhasil dihapus");
            }else  if(data["status"]==="Invalid"){
                alert("Data tidak dapat dihapus. Data "+this.state.name_delete+" masih aktif digunakan")
            }
            else{
                alert("Gagal Menyimpan Data")
            }
        }); 
    }

    //edited by Teddy 04-10-2019 14:41
    //edited by Teddy 08-10-2019 14:41
    editdiagnosa = (diag_nama_lama, diagnosa_id, diagnosa_nama,sl_id) => () => {
        var url = myURL.url_edit_diagnosa;
        //console.log(url);
        //console.log("search type: "+this.state.searchType);
        if(sl_id === "") {
            var solusi_id_temp = this.state.mc_id;
        }else {
            var solusi_id_temp = sl_id;
        }
        if(diagnosa_nama === "")
            var diag_nama_temp = diag_nama_lama;
        else
            var diag_nama_temp = diagnosa_nama;
        if(this.statusValidEditDiagnosa(diagnosa_nama, solusi_id_temp)){ // edited agnes 9 okt 2019
            var payload={  
                gdiag_id: diagnosa_id,
                gdiag_slid: solusi_id_temp,
                gdiag_nama: diag_nama_temp,
                gdiag_updateid:"190182P",
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
                //console.log(data["status"]);
                if(data["status"]==="Success"){
                    this.setState({
                        lastPage : data["lastPage"]
                    });
                    //console.log("data last page edit"+this.state.lastPage);
                    this.state.inputtedName = "";
                    this.state.solusi_id = "";
                    this.state.temporary = "";
                    this.state.modal_edit = false;
                    this.state.modal_nested_edit = false;
                    if(this.state.currentPage >= this.state.lastPage){
                        this.setState({
                            currentPage:this.state.lastPage
                        });
                        this.handleData(this.state.lastPage, this.state.packingPerPage);
                    }else{
                        this.handleData(this.state.currentPage, this.state.packingPerPage);
                    }
                    this.showNotification("Data Diagnosa bernama "+this.state.gc_nama+" berhasil diubah");
                }else if(data["status"]==="Invalid"){
                    alert("Nama Diagnosa "+ diag_nama_temp + " sudah digunakan");
                }else {
                    alert("Gagal Menyimpan Data");
                }
            }); 
        }else{
            alert("Nama diagnosa tidak boleh kosong atau Panjang nama diagnosa harus kurang dari 100");
        }
    }

    // //edited by Teddy 04-10-2019 14:41
    searchByName(currPage, currLimit, typeSearch){
        // edited by agnes 9-10-2019
        var url;
        if(typeSearch==="gc_nama"){
            url = myURL.url_cari_namadiagnosa
        }else{
            url= myURL.url_cari_namasolusi_mc
        } 
        // if(typeSearch === "gc_nama") {
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
                if(data["masterDiagnosaList"].length == 0) {
                    this.setState({
                        notFound: "block"
                    });
                }else {
                    this.setState({
                        notFound: "none"
                    });
                }
                this.setState({
                result:data["masterDiagnosaList"], 
                lastPage: data["lastPage"], 
                isLoading: false}); 
            });
        // }else if(typeSearch === "mc_nama") {
        //     var url = myURL.url_cari_namasolusi_mc;
        //     var payload={  
        //         "name" : this.state.keyword,
        //         "limit": currLimit,
        //         "offset": (currPage - 1) * currLimit
        //     }
        //     fetch(url, {
        //         method: 'POST',
        //         body: JSON.stringify(payload),
        //         headers: {
        //             "Content-type": "application/json; charset=UTF-8"
        //         }
        //     })
        //     .then(response => response.json())
        //     .then(data=>{ this.setState({result:data["masterDiagnosaList"], 
        //         lastPage: data["lastPage"], 
        //         isLoading: false}); 
        //     } );
        // }
    }

    //edited by Teddy 04-10-2019 14:41
    searchByCode(currPage, currLimit, typeSearch){
        //edited by agnes 9-10-2019
        var url ;
        if(typeSearch==="gc_id"){
            url = myURL.url_cari_kodediagnosa
        }else{
            url= myURL.url_cari_kodesolusi_mc
        }
        // if(typeSearch === "gc_id") {
            // this.setState({
            //     // lastPage:1,
            //     currPage:1
            // });
            const kword = this.state.keyword;
            //console.log("search code.."+url);
            //console.log("search code.."+this.state.keyword)
            var payload={  
                "search_id" : this.state.keyword,
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
                if(data["masterDiagnosaList"].length == 0){
                    this.setState({
                        notFound: "block"
                    }); 
                }else{
                    this.setState({
                        notFound: "none"
                    }); 
                }
                this.setState({
                result:data["masterDiagnosaList"], 
                lastPage: data["lastPage"], 
                isLoading: false}); 
            });
            //console.log("search by code last:"+this.state.lastPage); 
            // fetch(url1)
            // .then(response => response.json())
            // .then(data => this.setState({ result: data, isLoading: false }));
        // }else if(typeSearch === "mc_id") {
        //     this.setState({
        //         lastPage:1
        //     });
        //     const kword = this.state.keyword;
        //     var url = myURL.url_cari_kodesolusi_mc+"/"+kword
        //     fetch(url)
        //     .then(response => response.json())
        //     .then(data => this.setState({ result: data, isLoading: false }));
        // }    
        //console.log("search code last"+this.state.lastPage)

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

        if(this.state.searchType==="gc_id" || this.state.searchType==="mc_id"){
            if(!isNaN(this.state.keyword)){
                //edited by agnes 9 okt 2019
                this.searchByCode(1, this.state.packingPerPage, this.state.searchType);
            }else{
                alert("Kode harus berupa angka")
            }
        }
        else if(this.state.searchType==="gc_nama" || this.state.searchType==="mc_nama"){
            //update by agnes 9 okt 2019
            this.searchByName(1, this.state.packingPerPage, this.state.searchType);  
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
        else if(evt.target.value==="mc_id") 
        {
            this.setState({searchType:"mc_id", statusDisableSearch: false}) 
        }
        else if(evt.target.value==="mc_nama")
        {
            this.setState({searchType:"mc_nama", statusDisableSearch: false}) 
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
    editModalWithItemID(gc_id, gc_nama, mc_id, mc_nama, userid){
        this.setState({
            modal_edit: true,
            gc_id: gc_id,
            gc_nama : gc_nama,
            mc_id: mc_id,
            mc_nama : mc_nama,
            inputtedName: gc_nama,
            solusi_id: mc_id,
            activeUserId : userid
        })
    }

    openModalWithItemID(code,user_id, name){
        this.setState({
            modal_delete: true,
            activeCode: code,
            activeUserId : user_id,
            name_delete : name
        })
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
        inputtedID:"",
        solusi_id:"",
        solusi_name:"",
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

        if(modalType==="solusi" && !this.state.modal_solusi){
            this.setState({
                currentPage2:1, 
                keyword2: ""
            });
            this.getListSolusibyPaging(1, 5);
        }

        if(modalType === "nested_parent" && !this.state.modal_nested_parent) {
            this.state.solusi_id = "";
        }
    };

    stateCurrentPage(){
        this.setState({currentPage:1});
    }

    //solusi
    // all edited by teddy 08/10/2019
    getListSolusibyPaging(currPage, currLimit){
        var urlA = myURL.url_tampil_solusi
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
            this.setState({result2:data["masterSolusiList"], 
            lastPage2: data["lastPage"], 
            isLoading: false,
            notFound2:"none"
        }); 
        } );
    }

    pilihSolusi(id, nama){
        this.state.solusi_id = id;
        this.state.temporary = id;
        this.state.solusi_name = nama;

        this.setState({
            modal_solusi :!this.state.modal_solusi,
            keyword2: ""
        });

    }

    searchByCodeSolusi(currPage, currLimit){
        // this.setState({
        //     lastPage:1
        // });
        // const kword = this.state.keyword2;
        // //console.log(kword)

        // var url = myURL.url_cari_kodesolusi+"/"+kword
        // fetch(url)
        // .then(response => response.json())
        // .then(data => this.setState({ result2: data, isLoading: false }));

        var urlA = myURL.url_cari_kodenamasolusi
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

            if(data["masterSolusiList"].length == 0){
                this.setState({
                    notFound2: "block"
                }); 
            }else{
                this.setState({
                    notFound2: "none"
                }); 
            }

            //console.log(data) 
            this.setState({result2:data["masterSolusiList"], 
            lastPage2: data["lastPage"], 
            isLoading: false
           
        }); 
        } );


    }

    enterPressed2(event) {
        var code = event.keyCode || event.which;
        if(code === 13) {
            event.preventDefault();
            //console.log("a Hit");
            this.getListSolusibyPaging(this.state.currentPage2, this.state.packingPerPage2);
        }
        //console.log(this.state.currentPage2 + " " + this.state.packingPerPage2);
    }

    updateSearchValue2(evt){
        this.setState({
            keyword2: evt.target.value
        });

        // if(this.state.keyword2 === ""){
        //     this.getListSolusibyPaging(1, this.state.packingPerPage2);
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
            this.searchByCodeSolusi(1, 5);
        }
    }

    sendSearchParam2 = param => () =>{
        this.setState({currentPage2: 1, flagEnterSearch2:true});
        // if(!isNaN(this.state.keyword2)){
        //     this.searchByCodeSolusi();
        // }else{
        //     alert("Kode harus berupa angka")
        // }
        this.searchByCodeSolusi(this.state.currentPage2, 5);
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
           
            this.searchByCodeSolusi(currPage, currLimit);
        }else{
            this.getListSolusibyPaging(currPage, currLimit);
        }
    }

    //added by teddy 09/10/2019
    canceladd() {
        this.state.modal_nested_parent = false;
        this.setState({
            solusi_id: "",
            inputtedName:"",
            temporary:"",
            currentPage2:1
        });
    }

    //added by teddy 09/10/2019
    canceledit(){
        this.state.modal_edit = false;
        this.setState({
            solusi_id: "",
            inputtedName:"",
            temporary:"",
            currentPage2:1
        });
    }

    render() {
        const { result, currentPage, packingPerPage} = this.state;

        const currentResult = this.state.result;

        const renderDiagnosa = currentResult && currentResult.map((diagnosa) => {
            return <tr>
                <th scope="row">{diagnosa.gdiag_id}</th>
                <td>{diagnosa.gdiag_nama}</td>
                <th scope="row">{diagnosa.masterSolusi.sl_id}</th>
                <td>{diagnosa.masterSolusi.sl_nama}</td>
                <td>
                    <Button color="secondary" size="sm" style={{marginTop:'7px',marginRight:'5px', background: "orange", border:"none"}}onClick={()=>this.editModalWithItemID(diagnosa.gdiag_id,diagnosa.gdiag_nama, diagnosa.masterSolusi.sl_id, diagnosa.masterSolusi.sl_nama)}><MdEdit/></Button> 
                    <Button color="secondary" size="sm" style={{marginTop:'7px', background: "red", border:"none"}}onClick={()=>this.deleteModalWithItemID(diagnosa.gdiag_id, diagnosa.gdiag_nama)}><MdDelete/></Button> 
                </td>
                <td></td>
            </tr>
        });

        const currentResult2 = this.state.result2;

        const renderPacking = currentResult2 && currentResult2.map((packaging) => {
            return <tr>
                <th scope="row">{packaging.sl_id}</th>
                <td>{packaging.sl_nama}</td>
                <td>
                    <Button color="secondary" size="sm" style={{marginTop:'7px',marginRight:'5px', background: "orange", border:"none"}}onClick={()=>this.pilihSolusi(packaging.sl_id, packaging.sl_nama)}>OK</Button> 
                </td>
                <td></td>
            </tr>
        });

        return (
            <Page
                title="Diagnosa"
                breadcrumbs={[{ name: 'Diagnosa', active: true }]}
                className="Diagnosa">
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
                            {/* edited by Teddy 09-10-2019 14:41 */}
                            <form name ="form1" style={{paddingTop:"10", marginRight:"0.2vw"}}>
                                <select value={this.state.selectedOption} name="filtermenu" class="dropdown-toggle btn btn-primary" style={{background: '#4db6ac', borderStyle: 'none'}} onChange={evt => this.updateSelectionValue(evt)} >
                                <option value="Show_All">Pilih</option>
                                <option value="gc_id">GC ID</option>
                                <option value="gc_nama">GC Nama</option>
                                <option value="mc_id">MC ID</option>
                                <option value="mc_nama">MC Nama</option>
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
                                    Tambah Diagnosa
                                </ModalHeader>
                                <ModalBody>
                                    <Label>Nama Diagnosa (GC Nama)</Label>
                                    {/* value={this.state.inputtedName} */}
                                    <Input type="namadiagnosa" onChange={evt => this.updateInputValue(evt)} name="namadiagnosa" placeholder="Nama Diagnosa (GC Nama)" />
                                    <br></br>
                                    <Label>ID Solusi (MC ID) </Label>
                                    {/* value={this.state.inputtedName} */}
                                    {/* edited by agnes 09-10-2019 */}
                                    <Row>
                                        <Col>
                                            <Input type="idsolusi" value={this.state.solusi_id} onChange={evt => this.updateInputValue_id_mc(evt)} name="idsolusi" placeholder="ID Solusi (MC ID)" />
                                        </Col>
                                        <Col>
                                            <Button size="sm" style={{marginTop:'4px',background:"#f57c00", border:"none"}}onClick={this.toggle('solusi')}> . . . </Button>
                                        </Col>
                                    </Row>
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
                                            <strong>Nama Diagnosa: {this.state.inputtedName}</strong>
                                            <br/>
                                            <strong>MC ID: {this.state.temporary}</strong>
                                            <br/>
                                            Apakah Anda yakin ingin menyimpan data ini?
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button 
                                                color="primary" 
                                                onClick={this.insertMasterDiagnosa(this.state.inputtedName, this.state.temporary)}>
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
                                    Edit Diagnosa
                                </ModalHeader>
                                <ModalBody>
                                    <strong>GC ID: {this.state.gc_id}</strong>
                                    <br/>
                                    <strong>GC Nama: {this.state.gc_nama}</strong>
                                    <br/>
                                    <strong>MC ID: {this.state.mc_id}</strong>
                                    <br/>
                                    <strong>MC Nama: {this.state.mc_nama}</strong>
                                    <br/>
                                    <Label>Nama Diagnosa (GC Nama) Baru</Label>
                                    <Input type="namadiagnosabaru" value = {this.state.inputtedName} onChange={evt => this.updateInputValue(evt)} name="namadiagnosabaru" placeholder="Nama Diagnosa (GC Nama)" />
                                    <br/>
                                    <Label>ID Solusi (MC ID) Baru</Label>
                                    {/* value={this.state.inputtedName} */}
                                    {/* edited by agnes 9-10-2019 */}
                                    <Row>
                                        <Col>
                                            <Input type="idsolusi" value={this.state.solusi_id} onChange={evt => this.updateInputValue_id_mc(evt)} name="idsolusi" placeholder="ID Solusi (MC ID)" />                                
                                        </Col>
                                        <Col>
                                            <Button size="sm" style={{marginTop:'4px',background:"#f57c00", border:"none"}}onClick={this.toggle('solusi')}> . . . </Button>
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
                                            <strong>GC ID: {this.state.gc_id}</strong>
                                            <br/>
                                            <strong>GC Nama Lama: {this.state.gc_nama}</strong>
                                            <br/>
                                            <strong>GC Nama Baru: {this.state.inputtedName}</strong>
                                            <br/>
                                            <strong>MC ID Baru: {this.state.solusi_id}</strong>
                                            <br/>
                                            Apakah Anda yakin ingin mengubah data ini?
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button color="primary" onClick={this.editdiagnosa(this.state.gc_nama, this.state.gc_id, this.state.inputtedName, this.state.solusi_id)}>
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
                                    <strong>Kode Diagnosa (GC ID)  : {this.state.activeCode}</strong>
                                    <br/>
                                    <strong>Nama Diagnosa (GC Nama): {this.state.name_delete}</strong>
                                    <br/>
                                    Apakah Anda yakin ingin menghapus data ini?
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="primary" onClick={this.deletediagnosa(this.state.activeCode, this.state.activeUserId)}>
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

                            {/* get solusi */}
                            <Modal
                                isOpen={this.state.modal_solusi} 
                                toggle={this.toggle('solusi')}
                                className={this.props.className}
                                visible={this.state.modal_solusi}
                                onRequestClose={()=>{this.state.modal_solusi=false}}>
                                <ModalHeader style={{background: "#38ada7", color: "white"}} toggle={this.toggle('solusi')}>
                                    Lihat Solusi (MC)
                                </ModalHeader>
                                <ModalBody>
                                <CardHeader className="d-flex justify-content-between">
                                    <Input
                                        type="search"
                                        className="cr-search-form__input"
                                        placeholder="Cari kode atau nama solusi"
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
                                                    <th>Kode Solusi</th>
                                                    <th>Nama Solusi</th>
                                                    <th>Pilih</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {renderPacking}
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
                                        onClick={this.toggle('solusi')}>
                                        Batal
                                    </Button>
                                </ModalFooter>
                            </Modal>
                            {/* get solusi */}

                            </CardHeader>
                            <CardBody>
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            <th>GC ID</th>
                                            <th>GC Nama</th>
                                            <th>MC ID</th>
                                            <th>MC Nama</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                       {renderDiagnosa}
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
export default Diagnosa;