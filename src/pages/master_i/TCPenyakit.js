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
import { MdDelete, MdSearch,MdLoyalty, MdEdit} from 'react-icons/md';
import { getThemeColors } from 'utils/colors';

import * as myURL from '../urlLink'
const colors = getThemeColors();

class TCPenyakit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            result: [],
            inputtedName: "",
            currentPage: 1,
            packingPerPage: 5,
            totalData: 0,
            flag: 0,
            firstRun: 0,
            searchType:"",
            keyword:"",
            lastPage: 0,
            statusDisableSearch : true,
            notFound: "none"
        };

        this.clear = this.clear.bind(this);
        this.canceledit = this.canceledit.bind(this);
        this.canceladd = this.canceladd.bind(this);
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        // fetch(myURL.url_tampil_kemasan)
        //     .then(response => response.json())
        //     .then(data => this.setState({ result: data, isLoading: false }));
        this.toggle('nested_parent')
        this.getListbyPaging(this.state.currentPage, this.state.packingPerPage);
        console.log("curr page:"+this.state.currentPage)
    }

    showNotification= (currMessage)=>{
        console.log("ini notif");
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

    statusPanjangTC = (input) =>{
        if(input.length <=25){
            if(input.trim().length<=0)
                return false;
            else
                return true;
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

    handleData(currPage, currLimit){
        console.log("lastpage"+this.state.lastPage);
        if(this.state.keyword!="" && this.state.flagEnterSearch){
            if(this.state.searchType==="tc_id"){
                if(!isNaN(this.state.keyword)){
                    this.searchByCode(currPage, currLimit);
                }else{
                    alert("Kode harus berupa angka")
                }
            }else if(this.state.searchType==="tc_nama"){
                this.searchByName(currPage, currLimit);   
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

        // console.log("value event: "+ Number(event.target.value)+" "+(Number(event.target.value) + flag));

        if((this.state.currentPage + flag) != 0 && (Number(event.target.value) + flag) <= this.state.lastPage){
            this.handleData((this.state.currentPage + flag), this.state.packingPerPage);
        }
        // console.log("value event: "+ (this.state.currentPage+flag)+" "+this.state.packingPerPage);
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

    //edited by teddy 14/10/2019
    getListbyPaging(currPage, currLimit){
        var urlA = myURL.url_tampil_tc

        var payload = {
            limit: currLimit,
            offset: (currPage - 1) * currLimit
        };

        console.log("Offset: " + (currPage - 1) * currLimit);

        fetch(urlA,{
            method: 'POST',
            body: JSON.stringify(payload),
            json: true,
            headers:{
                "Content-type":"application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .then(data=>{ this.setState({result:data["masterTCPenyakitList"], 
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
            console.log("a Hit");
            this.getListbyPaging(this.state.currentPage, this.state.packingPerPage);
        }
    }
    
    enterSearchPressed(event) {
        var code = event.keyCode || event.which;
        // console.log("search key"+code)
        // console.log("search key name"+this.state.keyword)
        this.setState({flagEnterSearch : false})
        if(code === 13) {
            event.preventDefault();
            this.setState({currentPage:1, flagEnterSearch : true});
            // console.log("search key page"+this.state.currentPage)
            if(this.state.searchType==="tc_id"){
                if(!isNaN(this.state.keyword)){
                    this.searchByCode(1, this.state.packingPerPage);
                }else{
                    alert("Kode harus berupa angka")
                }
            }
            else if(this.state.searchType==="tc_nama"){
                this.searchByName(1, this.state.packingPerPage);   
            }
        }
    }

    insertMasterTC = param => () => {
        if(this.statusPanjangTC(param)){
            var url = myURL.url_tambah_tc;
            var payload={

                tc_nama: param.trim(),
                tc_updateid: '190182P',
                limit: this.state.packingPerPage,
                inputSearch : this.state.keyword

            }
            fetch(url,{
                method: "POST",
                body: JSON.stringify(payload),
                json: true,
                headers:{
                    "Content-type":"application/json; charset=UTF-8"
                }
            }).then(response => response.json())
            .then(data=>{ 
                // console.log("data"+data);
                if(data["status"]==="Success"){
                    this.setState({
                        lastPage : data["lastPage"]
                    });
                    // console.log("data last page"+this.state.lastPage);
                    this.state.inputtedName = "";
                    this.state.modal_nested = false;
                    this.state.modal_nested_parent = false;
                    this.setState({
                        currentPage:this.state.lastPage
                    });
                    this.handleData(this.state.lastPage, this.state.packingPerPage);
                    this.showNotification("Data Kemasan bernama "+param+" berhasil disimpan");
                    // if(this.state.currentPage >= this.state.lastPage){
                    //     this.setState({
                    //         currentPage:this.state.lastPage
                    //     });
                    //     this.handleData(this.state.lastPage, this.state.packingPerPage);
                    // }else{
                    //     this.handleData(this.state.currentPage, this.state.packingPerPage);
                    // }
                }else if(data["status"] === 'Invalid'){
                    // this.state.modal_nested = false;
                    // this.toggle('nested');
                    alert("Data "+param+" sudah ada");
                }else{
                    alert("Gagal Menyimpan Data")
                }
            }); 
            // .then((text)=>{
            //     if(text === 'Success'){
            //         this.state.modal_nested = false;
            //         this.state.modal_nested_parent = false;
            //         this.componentDidMount();
            //     }else if(text === 'Invalid'){
            //         // this.state.modal_nested = false;
            //         // this.toggle('nested');
            //         alert("Data "+param+" sudah ada");
            //     }else{
            //         alert("Gagal Menyimpan Data")
            //     }
            // });
        }else{
            alert("Nama TC tidak boleh kosong atau Panjang TC harus kurang dari 25");
        }
    }

    deletetc = (tc_id, userid, tc_nama_lama) => () => {//edited by teddy 10/10/2019
        console.log(tc_id+ " "+ this.state.packingPerPage + " "+ userid + " "+ this.state.keyword)

        var url = myURL.url_hapus_tc;
        console.log(url);
        var payload={  
            tc_id : tc_id,
            tc_updateid : "190192P",
            limit: this.state.packingPerPage,
            inputSearch : this.state.keyword
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
            console.log("data"+data);
            if(data["status"]==="Success"){
                this.setState({
                    lastPage : data["lastPage"]
                });
                console.log("data last page delete"+this.state.lastPage);
                this.state.modal_delete = false;
                if(this.state.currentPage >= this.state.lastPage){
                    this.setState({
                        currentPage:this.state.lastPage
                    });
                    this.handleData(this.state.lastPage, this.state.packingPerPage);
                }else{
                    this.handleData(this.state.currentPage, this.state.packingPerPage);
                }
                this.showNotification("Data TC : "+tc_nama_lama+" berhasil dihapus");
            }else if(data["status"]==="Invalid") {
                alert("Data Solusi "+tc_nama_lama+" masih aktif digunakan");
            }else{
                alert("Gagal Menyimpan Data")
            }
        }); 
        
        // .then(response => {
        //     // if (response.ok) {
        //     //     this.state.modal_nested = false;
        //     //     this.state.modal_nested_parent = false;
        //     //     this.componentDidMount();
        //     // }
        //     return response.text()
        // }).then((text)=>{
        //     if(text === 'Success'){
        //         this.state.modal_delete = false;
        //         this.handleData(this.state.currentPage, this.state.packingPerPage);
        //     }else{
        //         alert("Gagal Menyimpan Data")
        //     }
        // });
    }

    edittc = (tc_id, tc_nama, tc_nama_lama) => () => { //added by teddy 10/10/2019
        // console.log(code+" "+userid)
        if(!this.statusPanjangTC(tc_nama)) {
            alert("Nama TC harus terisi dan tidak boleh lebih dari 25 karakter")
        }else {
            var url = myURL.url_edit_tc;
            console.log(url);
            var payload={  
                tc_id : tc_id,
                tc_nama : tc_nama,
                tc_updateid : "190182P",
                input: this.state.keyword,
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
                console.log("data"+data);
                if(data["status"]==="Success"){
                    this.setState({
                        lastPage : data["lastPage"]
                    });
                    console.log("data last page edit"+this.state.lastPage);
                    this.state.modal_edit = false;
                    this.state.modal_nested_edit = false;
                    this.state.inputtedName = "";
                    if(this.state.currentPage >= this.state.lastPage){
                        this.setState({
                            currentPage:this.state.lastPage
                        });
                        this.handleData(this.state.lastPage, this.state.packingPerPage);
                    }else{
                        this.handleData(this.state.currentPage, this.state.packingPerPage);
                    }
                    this.showNotification("Data TC bernama "+tc_nama_lama+" berhasil diubah");
                }else{
                    alert("Gagal Menyimpan Data")
                }
            }); 
            
            // .then(response => {
            //     // if (response.ok) {
            //     //     this.state.modal_nested = false;
            //     //     this.state.modal_nested_parent = false;
            //     //     this.componentDidMount();
            //     // }
            //     return response.text()
            // }).then((text)=>{
            //     if(text === 'Success'){
            //         this.state.modal_delete = false;
            //         this.handleData(this.state.currentPage, this.state.packingPerPage);
            //     }else{
            //         alert("Gagal Menyimpan Data")
            //     }
            // });
        }
    }

    //edited by teddy 14/10/2019
    searchByName(currPage, currLimit){
        var url = myURL.url_cari_tcnama;
        console.log(url);
        console.log("search name.."+this.state.keyword)
        var payload={  
            "search_nama" : this.state.keyword,
            "limit": currLimit,
            "offset": (currPage - 1) * currLimit
        }
        console.log(payload);

        fetch(url,{
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .then(data=>{ 
            if(data["masterTCPenyakitList"].length == 0){
                this.setState({
                    notFound: "block"
                }); 
            }else{
                this.setState({
                    notFound: "none"
                }); 
            }
            this.setState({result:data["masterTCPenyakitList"], 
                lastPage: data["lastPage"], 
                isLoading: false}); 
        console.log("Last Page: " + this.state.lastPage)} );
        console.log(this.state.result)
    }

    //edited by teddy 14/10/2019
    searchByCode(currPage, currLimit){
        // this.setState({
        //     lastPage:1
        // });
        // const kword = this.state.keyword;
        // console.log(kword)

        // var url = myURL.url_cari_tcid+"/"+kword
        // fetch(url)
        // .then(response => response.json())
        // .then(data => this.setState({ result: data, isLoading: false }));

        var url = myURL.url_cari_tcid;
        console.log(url);
        console.log("search name.."+this.state.keyword)
        var payload={  
            "search_id" : this.state.keyword,
            "limit": currLimit,
            "offset": (currPage - 1) * currLimit
        }
        console.log(payload);

        fetch(url,{
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .then(data=> {
            if(data["masterTCPenyakitList"].length == 0){
                this.setState({
                    notFound: "block"
                }); 
            }else{
                this.setState({
                    notFound: "none"
                }); 
            }
            this.setState({
                result:data["masterTCPenyakitList"], 
                lastPage: data["lastPage"], 
                isLoading: false}); 
            
        console.log("Last Page: " + this.state.lastPage)} );
        console.log(this.state.result)
    }

    updateInputValue(evt) {
        this.setState({
            inputtedName: evt.target.value
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
            // this.handleFirst(evt);
            this.getListbyPaging(1, this.state.packingPerPage);
        }
        // var code = evt.keyCode || evt.which;
        // if(code === 13) {
        //     evt.preventDefault();
        //     this.sendSearchParam();
        // }
    }

    sendSearchParam = param => () =>{
        this.setState({currentPage: 1, flagEnterSearch:true});

        if(this.state.searchType==="tc_id"){
            if(!isNaN(this.state.keyword)){
                this.searchByCode(1, this.state.packingPerPage);
            }else{
                alert("Kode harus berupa angka")
            }
        }
        else if(this.state.searchType==="tc_nama"){
            this.searchByName(1, this.state.packingPerPage);   
        }
    }

    updateSelectionValue(evt){
        //alert(evt.target.value);
        var url;
        this.setState({
            currentPage: 1,
            selectedOption: evt.target.value
        });
        console.log("curr pageeee"+this.state.currentPage)
        if(evt.target.value==="tc_id")
        { 
            this.setState({searchType:"tc_id", statusDisableSearch:false})   
        }
        else if(evt.target.value==="tc_nama")
        {
            this.setState({searchType:"tc_nama", statusDisableSearch: false}) 
        }
        else if(evt.target.value==="Show_All"){
            this.setState({
                statusDisableSearch:true,
                keyword:""
            })
            this.getListbyPaging(1, this.state.packingPerPage);
        }
    }

    editModalWithItemID(tc_id, tc_nama, user_id){ //edited by teddy 10/10/2019
        this.setState({
            modal_edit: true,
            tc_id: tc_id,
            tc_nama: tc_nama,
            activeUserId : user_id,
            inputtedName : tc_nama
        })
    }

    deleteModalWithItemID(tc_id, tc_nama, user_id){ //edited by teddy 10/10/2019
        this.setState({
            modal_delete: true,
            tc_id: tc_id,
            tc_nama: tc_nama,
            activeUserId : user_id
        })
    }

    stateDropDown(status){
        this.setState({
            dropdown_value:status
        })
        console.log(this.state.dropdown_value)
    }

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
        selectedOption: 'ShowAll',
        flagEnterSearch :false
    };

    toggle = modalType => () => {
        if (!modalType) {
            return this.setState({
                modal: !this.state.modal,
            });
        }

        this.setState({
            [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
        });

        if(modalType === "nested_parent" && !this.state.modal_nested_parent) {
            this.state.inputtedName = "";
        }
    };

    stateCurrentPage(){
        this.setState({currentPage:1});
    }

    canceladd() {
        this.state.modal_nested_parent = false;
        this.setState({
            inputtedName: "",
        });
    }

    canceledit() {
        this.state.modal_edit = false;
        this.setState({
            inputtedName: ""
        });
    }

    render() {

        // var style;
        // if(this.state.viewport.width>900){

        //     style = {width: '45%', margin:'2.5%'};

        // }else{

        //     style = {width: '100%', margin:'0%'};

        // }
        const { result, currentPage, packingPerPage} = this.state;

        const currentResult = this.state.result;

        const renderPacking = currentResult && currentResult.map((packaging) => {
            return <tr>
                <th scope="row">{packaging.tc_id}</th>
                <td>{packaging.tc_nama}</td>
                <td>
                    {/*edited by teddy 10/10/2019*/}
                    <Button color="secondary" size="sm" style={{marginTop:'7px',marginRight:'5px', background: "orange", border:"none"}}onClick={()=>this.editModalWithItemID(packaging.tc_id, packaging.tc_nama, packaging.pack_userid)}><MdEdit/></Button>
                    {/*edited by teddy 10/10/2019*/}
                    <Button color="secondary" size="sm" style={{marginTop:'7px', background: "red", border:"none"}}onClick={()=>this.deleteModalWithItemID(packaging.tc_id, packaging.tc_nama, packaging.pack_userid)}><MdDelete/></Button> 
                </td>
                <td></td>
            </tr>
        });

        console.log(result)

        return (
            <Page
                title="TC Penyakit"
                breadcrumbs={[{ name: 'TCPenyakit', active: true }]}
                className="TCPenyakit">
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
                                <option value="Show_All">Semua</option>
                                <option value="tc_id">Kode</option>
                                <option value="tc_nama">Nama</option>
                                </select>
                            </form>
                            {/* <script>

                            function GetSelectedValue(){
                                var e = document.getElementById("jumpmenu");
                                var result = e.options[e.selectedIndex].value;
                                document.getElementById("result").innerHTML = result;
                            }
                            </script> */}
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
                                {/* function jumpto(x){
                                <script>
                                if (document.form1.jumpmenu.value != "null") {
                                    document.location.href = x
                                    }
                                }
                                </script> */}
                                <Button size="sm" style={{background: '#4db6ac', borderStyle: 'none', justifyContent:'center',alignItems:'center', marginRight: "0.2vw", width:"4em"}} onClick={this.sendSearchParam()}
                                disabled={this.state.statusDisableSearch}><MdSearch/></Button>
                            
                            {/* <UncontrolledButtonDropdown >
                            <DropdownToggle caret>
                                Find By
                             </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem>Kode Kemasan</DropdownItem>
                                <DropdownItem>Nama Kemasan</DropdownItem>
                            </DropdownMenu>
                            </UncontrolledButtonDropdown>  

                            <SearchInput /> */}

                            {/* <Button size="sm" onClick={this.toggle('nested_parent')}>Search</Button> */}
                            <Button size="sm" style={{marginTop:'1px',background:"#f57c00", border:"none"}}onClick={this.toggle('nested_parent')}>Tambah</Button>
                            <Modal
                                isOpen={this.state.modal_nested_parent}
                                toggle={this.toggle('nested_parent')}
                                className={this.props.className}>
                                <ModalHeader toggle={this.toggle('nested_parent')}>
                                    Tambah TC
                                </ModalHeader>
                                <ModalBody>
        
                                    <Label>Nama TC </Label>
                                    {/* value={this.state.inputtedName} */}
                                    <Input type="namatc" onChange={evt => this.updateInputValue(evt)} name="namatc" placeholder="Nama TC" />
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="primary" onClick={this.toggle('nested')}>
                                        Simpan
                                </Button>
                                    <Modal
                                        isOpen={this.state.modal_nested}
                                        toggle={this.toggle('nested')}>
                                        <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
                                        <ModalBody>
                                            <strong>Nama TC: {this.state.inputtedName}</strong>
                                            <br/>
                                            Apakah Anda yakin ingin menyimpan data ini?
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button 
                                                color="primary" 
                                                onClick={this.insertMasterTC(this.state.inputtedName)}>
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
                                {/*edited by teddy 10/10/2019*/}
                                <Modal
                                    isOpen={this.state.modal_edit}
                                    toggle={this.toggle('edit')}
                                    className={this.props.className}>
                                    <ModalHeader toggle={this.toggle('edit')}>
                                        Edit TC Penyakit
                                </ModalHeader>
                                    <ModalBody>
                                        <strong>TC ID: {this.state.tc_id}</strong>
                                        <br/>
                                        <strong>Nama TC: {this.state.tc_nama}</strong>
                                        <br/>
                                        <Label>Nama TC Baru </Label>
                                        <Input type="namatc" value = {this.state.inputtedName} onChange={evt => this.updateInputValue(evt)} name="namatc" placeholder="Nama TC Penyakit Baru" />
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="primary" onClick={this.toggle('nested_edit')}>
                                            Simpan
                                    </Button>
                                        <Modal
                                            isOpen={this.state.modal_nested_edit}
                                            toggle={this.toggle('nested_edit')}>
                                            <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
                                            <ModalBody>
                                                <strong>TC ID: {this.state.tc_id}</strong>
                                                <br/>
                                                <strong>Nama TC Lama: {this.state.tc_nama}</strong>
                                                <br/>
                                                <strong>Nama TC Baru: {this.state.inputtedName}</strong>
                                                <br/>
                                                Apakah Anda yakin ingin menyimpan data ini?
                                            </ModalBody>
                                            <ModalFooter>
                                                <Button color="primary" onClick={this.edittc(this.state.tc_id ,this.state.inputtedName, this.state.tc_nama)}>
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
                                {/*edited by teddy 10/10/2019*/}
                                <Modal
                                    isOpen={this.state.modal_delete}
                                    toggle={this.toggle('delete')}
                                    className={this.props.className}>
                                    <ModalHeader toggle={this.toggle('delete')}>
                                        Hapus TC
                                    </ModalHeader>
                                    <ModalBody>
                                        <strong>Kode TC: {this.state.tc_id}</strong>
                                        <br/>
                                        <strong>Nama TC: {this.state.tc_nama}</strong>
                                        <br/>
                                        Apakah Anda yakin ingin menghapus data ini?
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="primary" onClick={this.deletetc(this.state.tc_id, this.state.activeUserId, this.state.tc_nama)}>
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

                            </CardHeader>
                            <CardBody>
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            <th>Kode TC</th>
                                            <th>Nama TC</th>
                                            <th>Action</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                       {renderPacking}
                                    </tbody>
                                </Table>
                                <p className = "text-center" style={{display: this.state.notFound}}>Data Tidak Ditemukan</p> {/* added by teddy 14/10/2019 */}
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
​
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
export default TCPenyakit;